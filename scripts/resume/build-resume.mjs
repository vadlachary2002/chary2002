// Builds the resume PDF from profile data: bundle the renderer, write HTML, print it with headless Chrome.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'resume-out');
const BUNDLE_PATH = join(OUTPUT_DIR, '.renderResumeHtml.mjs');
const HTML_PATH = join(OUTPUT_DIR, 'Nagaraju_Vadla_Resume.html');
const PDF_PATH = join(OUTPUT_DIR, 'Nagaraju_Vadla_Resume.pdf');
const CHROME_PATH = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

mkdirSync(OUTPUT_DIR, { recursive: true });

await build({
  entryPoints: [join(PROJECT_ROOT, 'scripts/resume/renderResumeHtml.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: BUNDLE_PATH,
  define: { 'import.meta.env.BASE_URL': '"/"' },
  logLevel: 'warning',
});

const { renderResumeHtml } = await import(pathToFileURL(BUNDLE_PATH).href);
writeFileSync(HTML_PATH, renderResumeHtml());
rmSync(BUNDLE_PATH);

execFileSync(CHROME_PATH, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${PDF_PATH}`,
  pathToFileURL(HTML_PATH).href,
], { stdio: 'ignore' });

console.log(`Resume written to ${PDF_PATH}`);
