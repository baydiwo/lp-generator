# Scalev Static Landing Page - Agent Guidelines & Rules

Dokumen ini adalah pedoman baku dan aturan wajib bagi seluruh AI Agent yang bekerja pada repositori ini.

---

## 1. Arsitektur & Struktur Direktori

Seluruh landing page dikelompokkan secara modular di dalam direktori `/src/pages/`.

Setiap halaman **wajib** memiliki 3 file utama di dalam foldernya:

```text
src/pages/<nama-halaman>/
├── index.html   # Markup utama, <style id="compiled-tailwind"> inline, tracking logic, & script (Siap Copy-Paste ke Scalev)
├── style.css    # Source CSS lokal (@tailwind directives + custom styles)
└── output.css   # Hasil compile Tailwind CSS (otomatis di-inline ke dalam <style id="compiled-tailwind"> di index.html)
```

**Aturan Penamaan Folder:**
- Gunakan format *kebab-case* (contoh: `sample-landing-page`, `produk-digital-v1`).

---

## 2. Workflow Styling & Build CSS

1. **Aturan Perubahan Style:**
   - Seluruh custom CSS, keyframe animations, dan utility tambahan **harus ditulis di dalam `style.css`** pada folder halaman terkait.
   - Selalu gunakan utility class **Tailwind CSS** pada `index.html`.
2. **Wajib Menjalankan Build Setelah Perubahan Style:**
   - Setiap kali Agent selesai menambahkan/mengubah class Tailwind di `index.html` atau CSS rules di `style.css`, Agent **wajib** menjalankan command build spesifik halaman:
     ```bash
     npm run build <nama-folder-halaman>
     ```
     *Contoh:*
     ```bash
     npm run build sample-landing-page
     ```
3. **Auto-Inline `output.css` ke `<style id="compiled-tailwind">` di `index.html`:**
   - Perintah `npm run build <nama-folder-halaman>` otomatis meng-compile `style.css` ke `output.css` **dan langsung menggabungkan (inline) seluruh isi `output.css` ke dalam tag `<style id="compiled-tailwind">...</style>` di `index.html`**.
   - Dengan demikian, file `index.html` menjadi **100% standalone** sehingga user bisa langsung **Copy-Paste seluruh isi `index.html` ke editor Custom HTML Scalev** tanpa perlu hosting file CSS terpisah.

---

## 3. Format Dokumen & Struktur Halaman

Setiap file `index.html` di dalam `/src/pages/<nama-halaman>/` harus memiliki struktur standar:

```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
  <title>Judul Landing Page</title>
  
  <!-- Preconnect & Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">
  
  <!-- Compiled Tailwind & Custom CSS (Otomatis di-inject dari output.css saat npm run build) -->
  <style id="compiled-tailwind">
    /* Minified Tailwind + Custom CSS */
  </style>
</head>
<body>
  <!-- Konten HTML Halaman -->

  <script>
    // JavaScript Logic, Tracking, & Scalev Runtime di sini
  </script>
</body>
</html>
```

---

## 4. Standar Kualitas Desain (UI/UX & Copywriting)

- **Design Aesthetics:** Gunakan visual bernilai tinggi (vibrant colors, glassmorphism/card borders, micro-animations, typography harmonis dari Google Fonts).
- **GPU-Accelerated Animations:** Gunakan animasi halus (2.5s – 4.5s) menggunakan `transform`, `opacity`, `box-shadow`, dan `border-color` tanpa memicu layout shift (CLS < 0.1).
- **Responsive & Mobile-First:** Pastikan layout rapi di mobile viewport 375px hingga desktop 1440px tanpa horizontal scroll.
- **Strict Copywriting:** Dilarang mengarang testimoni, klaim palsu, atau data fiktif di luar brief yang disepakati.

---

## 5. Standar Tracking & Navigasi Checkout

1. **Dual-Channel Event Tracking:**
   - Gunakan `window.Scalev.analytics.track('facebook', ...)` dengan format event resmi Scalev.
   - Tambahkan direct client backup `fbq('track', 'AddToCart', ...)` untuk memastikan event tidak terdeteksi otomatis sebagai generic button click / `SubscribedButton`.
2. **Cegah Race Condition & Navigation Delay:**
   - Wajib gunakan `e.preventDefault()` dan `e.stopPropagation()` pada tombol CTA checkout.
   - Pasang delay minimal `800ms` sebelum `window.location.href = destinationUrl` agar beacon pixel terkirim utuh.
3. **UTM & Click-ID Passthrough:**
   - Fungsi `buildUrlWithUtm()` wajib meneruskan parameter iklan: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, `ttclid`, `kwclid`, `sclid`, `discount_code`.
   - **Identifikasi Landing Page Otomatis:** Jika `utm_term` kosong dari traffic masuk, isi otomatis dengan nama slug URL landing page yang diekstrak dari `window.location.pathname` (contoh: `window.location.pathname.split('/').filter(Boolean).pop()`), dengan fallback ke `sample-landing-page`.

---

## 6. Defensive JavaScript & Fallback Scalev

- Selalu bungkus akses `window.Scalev` dan `fbq` dalam `try-catch` dan conditional checks.
- Render fallback konten statis di HTML agar first viewport tetap informatif dan bermakna saat menunggu proses inisialisasi script.
- Tracking Promise harus bersifat *fire-and-forget* (tidak boleh memblokir redirect atau interaksi user jika library analytics gagal dimuat atau terblokir ad-blocker).

---

## 7. CSP Policy Template (Content Security Policy)

Jika menggunakan resource dari domain eksternal (font, gambar CDN, script tracking, video player), sertakan deklarasi CSP berikut:

```json
{
  "connect_src": [
    "https://*.scalev.id",
    "https://*.scalev.com",
    "https://connect.facebook.net",
    "https://www.facebook.com"
  ],
  "img_src": [
    "https://*.scalev.id",
    "https://*.scalev.com",
    "https://images.unsplash.com",
    "https://*.facebook.com",
    "https://*.fbcdn.net",
    "data:",
    "blob:"
  ],
  "media_src": [
    "https://*.scalev.id",
    "https://*.scalev.com"
  ],
  "font_src": [
    "https://fonts.gstatic.com"
  ],
  "script_src": [
    "https://connect.facebook.net",
    "https://*.scalev.id",
    "https://*.scalev.com",
    "'unsafe-inline'"
  ],
  "style_src": [
    "https://fonts.googleapis.com",
    "'unsafe-inline'"
  ],
  "frame_src": [
    "https://www.youtube.com",
    "https://player.vimeo.com"
  ],
  "worker_src": [
    "blob:"
  ],
  "manifest_src": []
}
```
