(() => {
  "use strict";

  const apiUrl = window.location.hostname.endsWith(".vercel.app") ? "/api/public" : "api.php";

  function post(action, payload) {
    return fetch(`${apiUrl}?action=${encodeURIComponent(action)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
      keepalive: true
    }).catch(() => null);
  }

  function normalizeWhatsApp(number) {
    return String(number || "").replace(/\D+/g, "");
  }

  function applySettings(settings) {
    if (!settings) return;
    const whatsapp = normalizeWhatsApp(settings.whatsapp);
    const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}` : "";

    document.querySelectorAll("a.facebook").forEach((link) => {
      if (settings.facebook) link.href = settings.facebook;
    });
    document.querySelectorAll("a.instagram").forEach((link) => {
      if (settings.instagram) link.href = settings.instagram;
    });
    document.querySelectorAll("a.whatsapp, .floating-whatsapp").forEach((link) => {
      if (whatsappUrl) link.href = whatsappUrl;
    });
    document.querySelectorAll('a[href*="google.com/maps"]').forEach((link) => {
      if (settings.maps) link.href = settings.maps;
    });
  }

  fetch(`${apiUrl}?action=settings`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => applySettings(data && data.settings))
    .catch(() => {});

  post("track", { type: "visit", page: location.pathname });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (
      link.classList.contains("whatsapp") ||
      link.classList.contains("floating-whatsapp") ||
      (link.href && link.href.includes("wa.me"))
    ) {
      post("track", { type: "whatsapp", page: location.pathname });
    }
  }, true);
})();
