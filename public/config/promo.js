(function () {
  var data = {
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
      show: false,
      eyebrow: "PROMO SPESIAL FLASH SALE",
      title: "Diskon tambahan ini hanya berlaku hari ini.",
      body: "Lewatkan hari ini = harga kembali normal. Ambil akses paket lengkap sekarang dan mulai terapkan sistemnya hari ini juga.",
      cta: "KLAIM HARGA PROMO SEKARANG",
      footnote: "Berakhir malam ini pukul 23:59 WIB"
    }
  };
  window.__LP_REMOTE_PROMO__ = data;
  if (typeof window.__applyPromoRemote === "function") {
    window.__applyPromoRemote(data);
  }
})();
