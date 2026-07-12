// Downloads all marinastarke.com assets (portfolio thumbnails, logo, favicons, Instagram images) into public/.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const portfolioItems = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'docs/research/marinastarke.com/portfolio_items.json'), 'utf8')
);
const igImages = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'docs/research/marinastarke.com/ig_images.json'), 'utf8')
);

const jobs = [];

// Logo
jobs.push({ url: 'http://www.marinastarke.com/wp-content/uploads/2018/05/logo18x1.png', dest: 'public/images/logo/logo@1x.png' });
jobs.push({ url: 'http://www.marinastarke.com/wp-content/uploads/2018/05/logo18x2.png', dest: 'public/images/logo/logo@2x.png' });

// Favicons
jobs.push({ url: 'https://www.marinastarke.com/wp-content/uploads/cropped-marinastarke_logo_4k-20190404_square_white-1-32x32.png', dest: 'public/seo/favicon-32x32.png' });
jobs.push({ url: 'https://www.marinastarke.com/wp-content/uploads/cropped-marinastarke_logo_4k-20190404_square_white-1-192x192.png', dest: 'public/seo/favicon-192x192.png' });
jobs.push({ url: 'https://www.marinastarke.com/wp-content/uploads/cropped-marinastarke_logo_4k-20190404_square_white-1-180x180.png', dest: 'public/seo/apple-touch-icon.png' });

// Instagram avatar
jobs.push({ url: 'https://www.marinastarke.com/wp-content/uploads/sb-instagram-feed-images/marinastarke.color.webp', dest: 'public/images/instagram/avatar.webp' });

// Portfolio thumbnails
for (const item of portfolioItems) {
  if (!item.img) continue;
  const ext = path.extname(new URL(item.img).pathname) || '.jpg';
  jobs.push({ url: item.img, dest: `public/images/portfolio/${item.id}${ext}` });
}

// Instagram post images
igImages.forEach((url, i) => {
  const ext = '.jpg';
  jobs.push({ url, dest: `public/images/instagram/post-${i + 1}${ext}` });
});

async function downloadOne(job) {
  const destPath = path.join(ROOT, job.dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  if (fs.existsSync(destPath)) return { ...job, status: 'skipped' };
  try {
    const res = await fetch(job.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return { ...job, status: `failed (${res.status})` };
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buf);
    return { ...job, status: 'ok', bytes: buf.length };
  } catch (e) {
    return { ...job, status: `error: ${e.message}` };
  }
}

async function run() {
  const BATCH = 4;
  const results = [];
  for (let i = 0; i < jobs.length; i += BATCH) {
    const batch = jobs.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(downloadOne));
    results.push(...batchResults);
    console.log(`[${Math.min(i + BATCH, jobs.length)}/${jobs.length}]`);
  }
  const failed = results.filter(r => r.status.startsWith('failed') || r.status.startsWith('error'));
  const ok = results.filter(r => r.status === 'ok');
  const skipped = results.filter(r => r.status === 'skipped');
  console.log(`\nDone. ok=${ok.length} skipped=${skipped.length} failed=${failed.length}`);
  if (failed.length) {
    console.log('\nFailed:');
    failed.forEach(f => console.log(`  ${f.dest} <- ${f.url} (${f.status})`));
  }
}

run();
