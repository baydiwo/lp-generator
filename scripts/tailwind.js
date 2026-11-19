const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const PAGES_DIR = path.join(__dirname, '../src/pages');
const ROOT_INPUT_CSS = path.join(__dirname, '../input.css');
const TEMPLATE_PAGE = 'sample-landing-page';

// Helper to get all page directories
function getAvailablePages() {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// Helper to resolve input CSS file for a page
function resolveInputCss(pageName) {
  const pageDir = path.join(PAGES_DIR, pageName);
  const localStyle = path.join(pageDir, 'style.css');
  const localInput = path.join(pageDir, 'input.css');

  if (fs.existsSync(localStyle)) return localStyle;
  if (fs.existsSync(localInput)) return localInput;
  if (fs.existsSync(ROOT_INPUT_CSS)) return ROOT_INPUT_CSS;

  // Fallback: create default minimal style.css
  const defaultCss = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
  fs.writeFileSync(localStyle, defaultCss, 'utf-8');
  return localStyle;
}

/**
 * Inlines compiled output.css directly into index.html inside <style id="compiled-tailwind">...</style>
 * so users can directly copy-paste index.html into Scalev Custom HTML Page.
 */
function inlineCssIntoHtml(pageName) {
  const pageDir = path.join(PAGES_DIR, pageName);
  const outputCssPath = path.join(pageDir, 'output.css');
  const htmlPath = path.join(pageDir, 'index.html');

  if (!fs.existsSync(outputCssPath) || !fs.existsSync(htmlPath)) return;

  const cssContent = fs.readFileSync(outputCssPath, 'utf-8').trim();
  let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  const styleBlock = `<style id="compiled-tailwind">\n${cssContent}\n  </style>`;

  const styleIdRegex = /<style\s+id=["']compiled-tailwind["'][^>]*>[\s\S]*?<\/style>/i;
  const linkOutputRegex = /<link\s+[^>]*href=["']\.\/output\.css["'][^>]*\/?>/i;

  if (styleIdRegex.test(htmlContent)) {
    // Remove any leftover <link href="./output.css"> if both exist
    htmlContent = htmlContent.replace(linkOutputRegex, '');
    htmlContent = htmlContent.replace(styleIdRegex, () => styleBlock);
  } else if (linkOutputRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(linkOutputRegex, () => styleBlock);
  } else if (/<\/head>/i.test(htmlContent)) {
    htmlContent = htmlContent.replace(/<\/head>/i, () => `  ${styleBlock}\n</head>`);
  }

  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log(`✨ [${pageName}] output.css berhasil digabungkan ke dalam <style id="compiled-tailwind"> di index.html!`);
}

function buildPage(pageName) {
  const inputCss = resolveInputCss(pageName);
  const outputCss = path.join(PAGES_DIR, pageName, 'output.css');
  const contentGlob = path.join(PAGES_DIR, pageName, '**/*.html');

  console.log(`📦 [${pageName}] Building output.css...`);
  execSync(
    `npx tailwindcss -i "${inputCss}" -o "${outputCss}" --content "${contentGlob}" --minify`,
    { stdio: 'inherit', cwd: path.join(__dirname, '..') }
  );
  inlineCssIntoHtml(pageName);
}

const action = process.argv[2] || 'build';
const targetPage = process.argv[3];
const availablePages = getAvailablePages();

// Action: create a new landing page folder from template
if (action === 'create') {
  if (!targetPage) {
    console.error('❌ Error: Nama halaman baru wajib diisi (format kebab-case).');
    console.log('Contoh: npm run create produk-baru-promo');
    process.exit(1);
  }
  const newPageDir = path.join(PAGES_DIR, targetPage);
  if (fs.existsSync(newPageDir)) {
    console.error(`❌ Error: Folder halaman "${targetPage}" sudah ada di src/pages/${targetPage}`);
    process.exit(1);
  }
  const sourceTemplateDir = path.join(PAGES_DIR, TEMPLATE_PAGE);
  fs.mkdirSync(newPageDir, { recursive: true });

  if (fs.existsSync(sourceTemplateDir)) {
    ['index.html', 'style.css'].forEach((file) => {
      const srcFile = path.join(sourceTemplateDir, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(newPageDir, file));
      }
    });
    console.log(`✅ Halaman "${targetPage}" berhasil dibuat dari template "${TEMPLATE_PAGE}"!`);
  } else {
    resolveInputCss(targetPage);
    fs.writeFileSync(
      path.join(newPageDir, 'index.html'),
      '<!doctype html>\n<html lang="id">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>New Landing Page</title>\n  <style id="compiled-tailwind"></style>\n</head>\n<body>\n  <h1>Hello Landing Page</h1>\n</body>\n</html>\n',
      'utf-8'
    );
    console.log(`✅ Halaman "${targetPage}" berhasil dibuat!`);
  }

  // Build initial output.css and inline into index.html
  buildPage(targetPage);
  console.log(`🎉 Siap diedit & copy-paste di: src/pages/${targetPage}/index.html`);
  process.exit(0);
}

if (action === 'build-all' || (action === 'build' && !targetPage)) {
  console.log(`🚀 Building CSS for all pages (${availablePages.length} found)...`);
  availablePages.forEach((page) => {
    try {
      buildPage(page);
      console.log(`✅ [${page}] Done!\n`);
    } catch (err) {
      console.error(`❌ [${page}] Build failed:`, err.message);
    }
  });
  console.log(`🎉 All pages built & inlined successfully!`);
  process.exit(0);
}

if (!targetPage) {
  console.error(`❌ Error: Page name required for "${action}".`);
  console.log(`\nAvailable pages:\n${availablePages.map((p) => ` - ${p}`).join('\n')}`);
  console.log(`\nUsage examples:`);
  console.log(`  npm run build ${availablePages[0] || 'sample-landing-page'}`);
  console.log(`  npm run watch ${availablePages[0] || 'sample-landing-page'}`);
  console.log(`  npm run build:all`);
  process.exit(1);
}

if (!availablePages.includes(targetPage)) {
  console.error(`❌ Error: Page "${targetPage}" not found in src/pages/`);
  console.log(`\nAvailable pages:\n${availablePages.map((p) => ` - ${p}`).join('\n')}`);
  process.exit(1);
}

const inputCss = resolveInputCss(targetPage);
const outputCss = path.join(PAGES_DIR, targetPage, 'output.css');
const contentGlob = path.join(PAGES_DIR, targetPage, '**/*.html');

if (action === 'watch') {
  console.log(`👀 Watching page "${targetPage}" for changes...`);
  console.log(`Input:   ${inputCss}`);
  console.log(`Output:  ${outputCss} (auto-inlined to index.html)\n`);

  // Initial build + inline before starting watcher
  try {
    buildPage(targetPage);
  } catch (e) {
    console.warn('Initial build warning:', e.message);
  }

  const child = spawn(
    'npx',
    ['tailwindcss', '-i', inputCss, '-o', outputCss, '--content', contentGlob, '--minify', '--watch'],
    { stdio: 'inherit', cwd: path.join(__dirname, '..') }
  );

  let debounceTimer = null;
  fs.watchFile(outputCss, { interval: 500 }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        try {
          inlineCssIntoHtml(targetPage);
        } catch (err) {
          console.error(`❌ Failed to inline CSS:`, err.message);
        }
      }, 150);
    }
  });

  child.on('close', (code) => {
    fs.unwatchFile(outputCss);
    process.exit(code);
  });
} else {
  buildPage(targetPage);
}
