# Scalev Landing Page Development Rules

Dokumen ini adalah aturan kerja wajib untuk pengembangan Landing Page Scalev di repositori ini.

## 1. File & Folder Structure
- Seluruh halaman landing page harus berada di dalam `/src/pages/<nama-halaman>/`.
- Setiap folder halaman wajib berisi 3 file:
  - `index.html` (Markup utama, `<style id="compiled-tailwind">` inline, script inline, dan tracking — siap langsung di-copy-paste ke Scalev)
  - `style.css` (Source CSS dengan direktif Tailwind + custom CSS)
  - `output.css` (Hasil build Tailwind yang ter-minify dan otomatis di-inline ke `index.html`)

## 2. Styling & CSS Build Workflow
- Selalu gunakan utility class **Tailwind CSS** untuk layout dan styling.
- Jika ada custom style/animasi, tulis di `src/pages/<nama-halaman>/style.css`.
- **Wajib menjalankan build setelah update style:**
  ```bash
  npm run build <nama-folder-halaman>
  ```
  *Contoh:* `npm run build sample-landing-page`
- Hasil build otomatis menghasilkan `output.css` dan **menggabungkan (inline) isinya ke dalam `<style id="compiled-tailwind">...</style>` di `index.html`** agar user bisa langsung copy-paste seluruh `index.html` ke Scalev.

## 3. Format Dokumen & Struktur File
- Setiap halaman tersusun rapi:
  - `index.html`: Struktur HTML, font link, `<style id="compiled-tailwind">` berisi hasil build CSS, serta script tracking/analytics.
  - `style.css`: Source CSS & animasi (tempat mengedit custom CSS).
  - `output.css`: Hasil build ter-minify yang otomatis di-inject ke dalam `index.html`.

## 4. Tracking, UTM & Navigasi
- Gunakan dual-channel tracking: `Scalev.analytics.track('facebook', ...)` + backup `fbq('track', 'AddToCart', ...)`.
- Mencegah race condition dengan `e.preventDefault()` dan jeda navigasi `setTimeout(..., 800)`.
- Teruskan seluruh parameter UTM, parameter `discount_code`, dan click-ID (`*clid`).
- Jika `utm_term` kosong dari URL masuk, otomatis ambil dari segmen path URL terakhir (`window.location.pathname`), dengan fallback ke `sample-landing-page`.

## 5. Defensive Coding
- Selalu gunakan `try-catch` dan conditional check untuk `window.Scalev` dan `window.fbq`.
- Jangan biarkan error tracking memblokir navigasi user ke halaman checkout (Promise harus *fire-and-forget*).
- Sediakan fallback statis di HTML agar halaman langsung tampil rapi sebelum script selesai dieksekusi.
