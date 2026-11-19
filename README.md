# Scalev Static Landing Page Starter (`lp-generator`)

Starter repository untuk membuat, mengelola, dan mem-build **Static Landing Page berkonversi tinggi khusus platform Scalev** menggunakan **Tailwind CSS** dan dukungan **AI Agent Skills**.

Hasil build otomatis menggabungkan CSS ke dalam tag `<style id="compiled-tailwind">` di `index.html`, sehingga **kamu cukup Copy-Paste 1 file `index.html` langsung ke Scalev Custom HTML**!

---

## ✨ Fitur Utama

- **1-Click Copy-Paste Ready untuk Scalev:** Setiap kali menjalankan `npm run build <nama-halaman>`, seluruh CSS Tailwind + custom animasi dari `style.css` dikompilasi ke `output.css` dan **otomatis digabungkan ke dalam `<style id="compiled-tailwind">` di `index.html`**.
- **Modular Multi-Page Architecture:** Setiap landing page terisolasi rapi di dalam `/src/pages/<nama-halaman>/` (`index.html`, `style.css`, `output.css`).
- **Sample Landing Page Lengkap:** Dilengkapi template siap pakai (`sample-landing-page`) dengan tema modern, komponen interaktif (Video Hero, Infinite Marquee, Interactive Checklist, 6 Pillars, Comparison Table, Testimonial Auto-Slider, Bundle Slider, Pricing Valuation Stack, Risk Reversal Guarantee, FAQ Accordion, Sticky Mobile CTA, Live Sales Notification, & Urgency Modal).
- **Scalev Dual-Channel Tracking:**
  - Terintegrasi dengan `window.Scalev.analytics.track('facebook', ...)` + backup langsung `fbq('track', 'AddToCart', ...)`.
  - Proteksi *race-condition* dengan delay navigasi `800ms` agar beacon pixel terkirim utuh sebelum redirect.
- **UTM & Click-ID Auto-Passthrough:** Otomatis meneruskan `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, `ttclid`, `kwclid`, `sclid`, dan `discount_code` ke URL checkout Scalev.
- **Remote & Local Promo Engine:** Mendukung pengaturan harga coret, ekstra diskon persen, kode kupon, dan popup flash sale dari objek `PROMO_CONFIG` maupun file remote (`public/config/promo.json`).
- **AI Agent Ready (`.agent/` & `AGENTS.md`):** Sudah dilengkapi *skills* (`copywriting`, `copywriting-psychologist`, `hormozi-hooks`, `hormozi-offer`, `landing-page-copy`, `ui-ux-pro-max`) dan *rules* khusus Scalev.

---

## 📁 Struktur Direktori

```text
lp-generator/
├── .agent/
│   ├── rules/
│   │   └── scalev-page-rules.md    # Aturan wajib AI Agent untuk halaman Scalev
│   └── skills/                     # Kumpulan skill AI (Copywriting, Hormozi Offer, UI/UX, dll.)
├── public/
│   └── config/
│       ├── promo.json              # File konfigurasi promo remote (opsional)
│       └── promo.js                # Script loader promo lintas domain (bebas CORS)
├── scripts/
│   └── tailwind.js                 # CLI builder, auto-inliner, watcher, & generator halaman
├── src/
│   └── pages/
│       └── sample-landing-page/    # Contoh halaman landing page siap kustomisasi
│           ├── index.html          # Markup utama + <style id="compiled-tailwind"> (Siap Copy-Paste)
│           ├── style.css           # Source CSS lokal (@tailwind + custom animations)
│           └── output.css          # Hasil compile Tailwind CSS (otomatis di-inline ke index.html)
├── AGENTS.md                       # Pedoman utama AI Agent & template CSP Scalev
├── input.css                       # Fallback global Tailwind CSS
├── package.json                    # Daftar script & dependencies
└── tailwind.config.js              # Konfigurasi tema, font, dan warna Tailwind
```

---

## 🚀 Quick Start (Instalasi & Menjalankan Project)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Local Development Server:**
   ```bash
   npm run dev
   ```
   Buka browser di alamat yang ditampilkan oleh `live-server` (biasanya `http://127.0.0.1:8080`), lalu pilih halaman `sample-landing-page`.

---

## 🛠️ Perintah CLI (NPM Scripts)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run create <nama-halaman>` | Membuat folder landing page baru di `src/pages/<nama-halaman>/` dari template `sample-landing-page` sekaligus mem-build dan meng-inline CSS ke `index.html`. |
| `npm run watch <nama-halaman>` | Menjalankan Tailwind CSS dalam mode *watch* dan otomatis memperbarui `<style id="compiled-tailwind">` di `index.html`. |
| `npm run build <nama-halaman>` | Meng-compile `style.css` ke `output.css` (ter-minify) **dan langsung menggabungkannya ke `<style>` di `index.html`**. |
| `npm run build:all` | Meng-compile ulang & meng-inline CSS untuk **seluruh** halaman di dalam `src/pages/`. |
| `npm run dev` | Menjalankan local preview server dengan auto-reload (`live-server`). |

### Contoh Workflow Membuat Landing Page Baru:

```bash
# 1. Buat halaman baru dengan format kebab-case
npm run create kelas-bisnis-digital

# 2. Jalankan watcher CSS sambil mengedit HTML/CSS
npm run watch kelas-bisnis-digital

# 3. Setelah selesai edit, jalankan build production (otomatis di-inline ke index.html)
npm run build kelas-bisnis-digital
```

---

## ⚙️ Kustomisasi Produk, Harga & Tracking Scalev

Buka file `src/pages/<nama-halaman>/index.html` dan gulir ke bagian bawah (`<script>`). Kamu cukup menyesuaikan konfigurasi berikut:

### 1. Konfigurasi Harga & Promo (`PROMO_CONFIG`)
```javascript
var PROMO_CONFIG = {
  remoteUrl: '', // Isi dengan URL promo.json jika ingin dikontrol terpusat via Worker/CDN
  badge: "🔥 PROMO SPESIAL HARI INI 🔥",
  salePriceText: "149.000",
  discountCode: "DISKON10",
  checkoutUrl: "https://tokoanda.scalev.id/checkout-produk",

  extraPromo: {
    show: true,
    title: "TAMBAHAN DISKON SPESIAL HARI INI",
    percent: "10%"
  },

  urgencyModal: {
    show: false, // Ubah ke true untuk memunculkan popup flash sale setelah 3 detik
    eyebrow: "PROMO SPESIAL FLASH SALE",
    title: "Diskon tambahan ini hanya berlaku hari ini.",
    body: "Lewatkan hari ini = harga kembali normal.",
    cta: "KLAIM HARGA PROMO SEKARANG",
    footnote: "Berakhir malam ini pukul 23:59 WIB"
  }
};

// Harga normal sebelum diskon (untuk kalkulasi persentase diskon otomatis)
var PROMO_NORMAL_PRICE = 750000;
```

### 2. Konfigurasi Meta Pixel & Scalev Analytics (`LP_CONFIG`)
```javascript
var LP_CONFIG = {
  checkoutUrl: PROMO_CONFIG.checkoutUrl,
  productName: 'Nama Produk Anda',
  variantId: 'id-varian-produk',
  discountCode: PROMO_CONFIG.discountCode,
  value: 149000,
  currency: 'IDR',
  navigationDelay: 800 // Jeda 800ms agar event AddToCart terkirim utuh sebelum pindah halaman
};
```

---

## 🎨 Kustomisasi Tema, Font & Warna

1. **Mengubah Palet Warna & Font Default:**
   Edit file `tailwind.config.js` pada bagian `theme.extend.colors` dan `theme.extend.fontFamily`.
2. **Menambah Animasi / Custom Class Per Halaman:**
   Edit file `src/pages/<nama-halaman>/style.css`.
3. **Compile & Inline Ulang CSS:**
   Jalankan `npm run build <nama-halaman>` setiap kali selesai mengubah class Tailwind di `index.html` atau rule di `style.css`.

---

## 📦 Panduan Copy-Paste ke Scalev

1. Jalankan perintah build untuk memastikan CSS terbaru sudah tergabung di dalam `index.html`:
   ```bash
   npm run build <nama-halaman>
   ```
2. Buka file `src/pages/<nama-halaman>/index.html`, pilih semua (`Ctrl+A` / `Cmd+A`), lalu **Copy-Paste langsung** ke kolom Custom HTML di Scalev.
3. Jika halaman menggunakan resource eksternal (Google Fonts, Unsplash, YouTube Embed, Meta Pixel), gunakan konfigurasi **Content Security Policy (CSP)** yang tersedia di bagian akhir dokumen [AGENTS.md](./AGENTS.md).

---

## 🤖 Menggunakan AI Agent di Repo Ini

Repositori ini telah dikonfigurasi dengan aturan kerja AI di [AGENTS.md](./AGENTS.md) dan `.agent/`:
- Mintalah AI Agent untuk merancang penawaran menggunakan skill **`hormozi-offer`**.
- Mintalah AI Agent menulis ulang headline/copy menggunakan skill **`hormozi-hooks`**, **`copywriting`**, atau **`landing-page-copy`**.
- Mintalah AI Agent merombak tampilan UI menggunakan skill **`ui-ux-pro-max`**.
- AI Agent akan otomatis meng-compile `style.css` dan menggabungkan `output.css` ke dalam `<style id="compiled-tailwind">` di `index.html` setiap selesai melakukan perubahan.
