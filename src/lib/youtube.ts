import { list, put } from "@vercel/blob";

// Never referenced from any public/client code path — only read or written
// here via authenticated @vercel/blob server calls, so it's not discoverable
// even though the blob store itself uses "public" access.
const TOKEN_PATHNAME = "secrets/youtube-token.json";

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const YOUTUBE_UPLOAD_SCOPE = "https://www.googleapis.com/auth/youtube.upload";

interface StoredTokens {
  refreshToken: string;
}

function requireClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET environment variables are not set"
    );
  }
  return { clientId, clientSecret };
}

export function getGoogleAuthUrl(redirectUri: string, state: string): string {
  const { clientId } = requireClientCredentials();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: YOUTUBE_UPLOAD_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

async function saveRefreshToken(refreshToken: string): Promise<void> {
  const payload: StoredTokens = { refreshToken };
  await put(TOKEN_PATHNAME, JSON.stringify(payload), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

async function findTokenBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: TOKEN_PATHNAME, limit: 1 });
  return blobs.find((blob) => blob.pathname === TOKEN_PATHNAME)?.url ?? null;
}

async function getStoredRefreshToken(): Promise<string | null> {
  const url = await findTokenBlobUrl();
  if (!url) return null;

  const response = await fetch(`${url}?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as StoredTokens;
  return data.refreshToken ?? null;
}

export async function isYouTubeConnected(): Promise<boolean> {
  return (await getStoredRefreshToken()) !== null;
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<void> {
  const { clientId, clientSecret } = requireClientCredentials();

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange code for tokens (${response.status})`);
  }

  const data = await response.json();
  if (!data.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Revoke prior access at https://myaccount.google.com/permissions and try connecting again."
    );
  }

  await saveRefreshToken(data.refresh_token);
}

async function getAccessToken(): Promise<string> {
  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error("YouTube is not connected yet. Connect it in Site Settings first.");
  }

  const { clientId, clientSecret } = requireClientCredentials();

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to refresh YouTube access token (${response.status}). The connection may have expired — reconnect in Site Settings.`
    );
  }

  const data = await response.json();
  return data.access_token as string;
}

interface CreateUploadSessionParams {
  title: string;
  privacyStatus: "unlisted" | "public" | "private";
  fileSizeBytes: number;
  mimeType: string;
}

export async function createResumableUploadSession({
  title,
  privacyStatus,
  fileSizeBytes,
  mimeType,
}: CreateUploadSessionParams): Promise<string> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mimeType,
        "X-Upload-Content-Length": String(fileSizeBytes),
      },
      body: JSON.stringify({
        snippet: { title },
        // selfDeclaredMadeForKids is required — videos uploaded via the API
        // without it are left in a state where YouTube blocks embedding
        // (Error 153) until a "made for kids" audience is set manually in
        // YouTube Studio. Setting it here avoids that entirely.
        status: { privacyStatus, selfDeclaredMadeForKids: false },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to start YouTube upload session (${response.status}): ${await response.text()}`
    );
  }

  const uploadUrl = response.headers.get("Location");
  if (!uploadUrl) {
    throw new Error("YouTube did not return a resumable upload URL");
  }

  return uploadUrl;
}
