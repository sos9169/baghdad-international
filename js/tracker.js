(() => {
  "use strict";

  if (window.__BIG_TRACKER_ACTIVE__) return;
  window.__BIG_TRACKER_ACTIVE__ = true;

  function getApiUrl() {
    if (window.location.pathname.startsWith("/admin")) {
      return "/api/public";
    }
    return window.location.hostname.endsWith(".vercel.app") || window.location.port !== ""
      ? "/api/public"
      : "api.php";
  }

  const primaryApiUrl = getApiUrl();

  function getDeviceType() {
    const ua = navigator.userAgent || "";
    if (/tablet|ipad|playbook|silk/i.test(ua)) return "تابلت 📱";
    if (/mobile|iphone|android|touch/i.test(ua)) return "هاتف جوال 📱";
    return "كمبيوتر 💻";
  }

  function post(action, payload) {
    const data = Object.assign({}, payload || {}, {
      device: getDeviceType(),
      page: location.pathname + location.search,
      createdAt: new Date().toISOString()
    });

    // Save locally for resilient fallback
    try {
      const localEvents = JSON.parse(localStorage.getItem("big_live_events") || "[]");
      localEvents.unshift(data);
      localStorage.setItem("big_live_events", JSON.stringify(localEvents.slice(0, 100)));
    } catch (e) {}

    const jsonBody = JSON.stringify(data);
    
    // Try primary API endpoint
    return fetch(`${primaryApiUrl}?action=${encodeURIComponent(action)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonBody,
      keepalive: true
    }).catch(() => {
      // Fallback to alternative endpoint if primary fails
      const fallbackUrl = primaryApiUrl === "/api/public" ? "api.php" : "/api/public";
      return fetch(`${fallbackUrl}?action=${encodeURIComponent(action)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonBody,
        keepalive: true
      }).catch(() => null);
    });
  }

  function normalizeWhatsApp(number) {
    return String(number || "").replace(/\D+/g, "");
  }

  function setLink(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach((link) => {
      link.href = value;
    });
  }

  function applySettings(settings) {
    if (!settings) return;
    const whatsapp = normalizeWhatsApp(settings.whatsapp);
    const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}` : "";

    setLink("a.facebook", settings.facebook);
    setLink("a.instagram", settings.instagram);
    setLink(".site-header a.whatsapp, .footer-socials a.whatsapp, .floating-whatsapp, #modalWaBtn", whatsappUrl);
    setLink("#contactPhoneEgypt", settings.whatsapp_egypt);
    setLink("#contactPhoneIraq", settings.whatsapp_iraq);
    setLink("#contactPhoneTurkey", settings.whatsapp_turkey);
    setLink('a[href*="google.com/maps"]', settings.maps);
  }

  // Fetch site settings
  fetch(`${primaryApiUrl}?action=settings`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => applySettings(data && data.settings))
    .catch(() => {});

  // Track initial live page visit
  post("track", { type: "visit" });

  // Listen for clicks on links (WhatsApp, phone, tags)
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a, button, .destination-card, .service-card");
    if (!link) return;

    if (
      link.classList.contains("whatsapp") ||
      link.classList.contains("floating-whatsapp") ||
      (link.href && link.href.includes("wa.me"))
    ) {
      post("track", { type: "whatsapp" });
    } else if (link.href && link.href.startsWith("tel:")) {
      post("track", { type: "phone" });
    } else if (link.classList.contains("destination-card") || link.classList.contains("service-card")) {
      post("track", { type: "tag_click" });
    }
  }, true);
})();
