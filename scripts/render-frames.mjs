#!/usr/bin/env node
// Prerenders the Eclipse studio (scripts/studio.html) into scroll-scrub frame
// sequences under public/frames/<seq>/. These are placeholder CG frames with
// the same layout/naming the site expects from Higgsfield footage — swap them
// later with scripts/extract-frames.sh without touching site code.
//
// Usage:
//   node scripts/render-frames.mjs                 # render all sequences
//   node scripts/render-frames.mjs --test out.png  # single preview frame
//   node scripts/render-frames.mjs --seq orbit     # one sequence

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'public', 'frames');

const SEQUENCES = {
  orbit: { count: 120 },
  macro: { count: 90 },
  exploded: { count: 110 },
};

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json',
};

function findChromium() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
  ].filter(Boolean);
  for (const base of ['/opt/pw-browsers']) {
    if (existsSync(base)) {
      for (const dir of ['chromium-1194', 'chromium']) {
        for (const bin of ['chrome-linux/chrome', 'chrome-linux/headless_shell']) {
          candidates.push(join(base, dir, bin));
        }
      }
    }
  }
  for (const c of candidates) if (c && existsSync(c)) return c;
  return undefined; // fall back to playwright's own resolution
}

async function serve() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      const path = join(ROOT, decodeURIComponent(url.pathname));
      if (!path.startsWith(ROOT)) throw new Error('forbidden');
      const data = await readFile(path);
      res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('nope');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return server;
}

async function main() {
  const args = process.argv.slice(2);
  const testOut = args.includes('--test') ? args[args.indexOf('--test') + 1] : null;
  const onlySeq = args.includes('--seq') ? args[args.indexOf('--seq') + 1] : null;
  const testFrame = args.includes('--frame') ? Number(args[args.indexOf('--frame') + 1]) : 0;

  const server = await serve();
  const port = server.address().port;

  const browser = await chromium.launch({
    executablePath: findChromium(),
    args: [
      '--enable-unsafe-swiftshader',
      '--use-angle=swiftshader',
      '--disable-gpu-sandbox',
      '--no-sandbox',
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  page.on('pageerror', (e) => console.error('[studio pageerror]', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.error('[studio console]', m.text());
  });

  await page.goto(`http://127.0.0.1:${port}/scripts/studio.html`);
  await page.evaluate(() => window.__ready);
  console.log('studio ready');

  async function capture(seq, i, n) {
    const dataUrl = await page.evaluate(
      ([s, a, b]) => { window.__setFrame(s, a, b); return window.__shot('image/jpeg', 0.93); },
      [seq, i, n]
    );
    return Buffer.from(dataUrl.split(',')[1], 'base64');
  }

  if (testOut) {
    const seq = onlySeq || 'still';
    const n = SEQUENCES[seq] ? SEQUENCES[seq].count : 1;
    const buf = await capture(seq, testFrame, n);
    await writeFile(testOut, buf);
    console.log('test frame written:', testOut);
  } else {
    const manifest = {};
    for (const [seq, cfg] of Object.entries(SEQUENCES)) {
      if (onlySeq && seq !== onlySeq) continue;
      const dir = join(OUT, seq);
      await mkdir(dir, { recursive: true });
      const t0 = Date.now();
      for (let i = 0; i < cfg.count; i++) {
        const buf = await capture(seq, i, cfg.count);
        await sharp(buf).webp({ quality: 76 }).toFile(join(dir, `${String(i).padStart(4, '0')}.webp`));
        if (i % 20 === 0) console.log(`${seq} ${i}/${cfg.count}`);
      }
      manifest[seq] = { count: cfg.count, path: `/frames/${seq}`, ext: 'webp', pad: 4 };
      console.log(`${seq} done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
    if (!onlySeq) {
      await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
    }
    console.log('all sequences rendered');
  }

  await browser.close();
  server.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
