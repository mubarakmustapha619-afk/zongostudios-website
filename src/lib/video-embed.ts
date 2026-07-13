export function getYouTubeEmbedUrl(url: string): string | null {
  let videoId: string | null = null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1).split("/")[0] || null;
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "").split("/")[0] || null;
      }
    }
  } catch {
    return null;
  }

  if (!videoId) return null;

  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function getVimeoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const videoId = parsed.pathname.split("/").filter(Boolean)[0];
    if (!videoId || !/^\d+$/.test(videoId)) return null;
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  } catch {
    return null;
  }
}

export function getVideoEmbedUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url) ?? getVimeoEmbedUrl(url);
}
