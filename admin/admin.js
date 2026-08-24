(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const loginView = $("#loginView");
  const dashboardView = $("#dashboardView");
  const loginForm = $("#loginForm");
  const settingsForm = $("#settingsForm");
  const passwordForm = $("#passwordForm");
  const slideForm = $("#slideForm");
  const slidesList = $("#slidesList");
  const serviceForm = $("#serviceForm");
  const servicesList = $("#servicesList");
  const ordersBody = $("#ordersBody");

  let adminToken = localStorage.getItem("big_admin_token") || "";

  function setStatus(id, message, isError, isSuccess) {
    const el = $(id);
    if (!el) return;
    el.textContent = message || "";
    el.className = isError ? "error" : (isSuccess ? "success" : "");
  }

  // Detect file:// protocol local static viewing
  if (window.location.protocol === "file:") {
    const notice = document.createElement("p");
    notice.style.cssText = "color:#e4c47d;font-size:12px;margin-top:12px;line-height:1.6;background:rgba(197,154,74,0.1);padding:10px;border-radius:8px;border:1px solid rgba(197,154,74,0.3);text-align:center;";
    notice.textContent = "تنبيه: تفتح الصفحة حالياً كملف محلي (file://). لتشغيل واختبار تسجيل الدخول، يرجى تشغيل الموقع عبر السيرفر أو الرفع على Vercel.";
    if (loginForm) loginForm.appendChild(notice);
  }

  async function request(action, payload) {
    if (window.location.protocol === "file:") {
      throw new Error("لا يمكن الاتصال بالسيرفر محلياً عبر file://. يرجى تشغيل الموقع عبر السيرفر أو Vercel.");
    }

    const isFormData = payload instanceof FormData;
    let bodyData = payload;
    if (!isFormData && payload !== undefined) {
      const obj = (typeof payload === "object" && payload !== null) ? payload : {};
      bodyData = JSON.stringify({ action, ...obj });
    }

    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    if (adminToken) {
      headers["x-admin-token"] = adminToken;
    }

    const options = payload === undefined ? { headers: { "x-admin-token": adminToken }, cache: "no-store" } : {
      method: "POST",
      headers,
      body: bodyData
    };

    // Directly target /api/admin serverless function on Vercel
    const response = await fetch(`/api/admin?action=${encodeURIComponent(action)}`, options);
    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("خطأ في الاتصال بالسيرفر — يرجى إعادة المحاولة");
    }

    if (!response.ok || !data.ok) {
      const err = new Error(data.error || "كلمة السر غير صحيحة");
      err.status = response.status;
      throw err;
    }

    if (data.token) {
      adminToken = data.token;
      localStorage.setItem("big_admin_token", data.token);
    }
    return data;
  }

  function showDashboard(show) {
    loginView.classList.toggle("hidden", show);
    dashboardView.classList.toggle("hidden", !show);
  }

  function fillSettings(settings) {
    if (!settings) return;
    settingsForm.facebook.value = settings.facebook || "";
    settingsForm.instagram.value = settings.instagram || "";
    settingsForm.whatsapp.value = settings.whatsapp || "";
    settingsForm.maps.value = settings.maps || "";
  }

  function fillMetrics(metrics, orders) {
    $("#visitsCount").textContent = metrics.visits || 0;
    $("#interactionsCount").textContent = metrics.interactions || 0;
    $("#whatsappCount").textContent = metrics.whatsappClicks || 0;
    $("#ordersCount").textContent = Array.isArray(orders) ? orders.length : (metrics.formSubmits || 0);
  }

  function resolveMediaUrl(src) {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
      return src;
    }
    return `/${src}`;
  }

  function fillSlides(slides) {
    if (!slidesList) return;
    if (!Array.isArray(slides) || slides.length === 0) {
      slidesList.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">لا توجد مواضيع في المعرض حالياً.</p>';
      return;
    }

    slidesList.innerHTML = slides.map((slide) => {
      const isVideo = slide.type === "video" || (slide.src && slide.src.match(/\.(mp4|webm)$/i));
      const mediaSrc = resolveMediaUrl(slide.src);
      const mediaHtml = isVideo
        ? `<video src="${escapeAttr(mediaSrc)}" autoplay loop muted playsinline></video>`
        : `<img src="${escapeAttr(mediaSrc)}" alt="${escapeAttr(slide.title_ar || "")}">`;
      
      return `
        <div class="slide-card-admin">
          <div class="media-box">
            ${mediaHtml}
            <span class="type-badge">${isVideo ? "🎬 فيديو قصير" : "🖼️ صورة"}</span>
          </div>
          <div class="card-info">
            <div>
              <h4>${escapeHtml(slide.title_ar || slide.title_en || "")}</h4>
              <p>${escapeHtml(slide.text_ar || slide.text_en || "-")}</p>
            </div>
            <button class="danger-btn" data-delete-slide="${escapeAttr(slide.id || "")}">حذف الموضوع</button>
          </div>
        </div>
      `;
    }).join("");
  }

  function fillServices(services) {
    if (!servicesList) return;
    if (!Array.isArray(services) || services.length === 0) {
      servicesList.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">لا توجد خدمات معروضة حالياً.</p>';
      return;
    }

    servicesList.innerHTML = services.map((srv) => `
      <div class="service-card-admin">
        <div>
          <div class="icon-badge">${escapeHtml(srv.icon || "✦")}</div>
          <h4>${escapeHtml(srv.title_ar || srv.title_en || "")}</h4>
          <p>${escapeHtml(srv.text_ar || srv.text_en || "-")}</p>
        </div>
        <button class="danger-btn" data-delete-service="${escapeAttr(srv.id || "")}">حذف الخدمة</button>
      </div>
    `).join("");
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ar-EG");
  }

  function fillOrders(orders) {
    if (!Array.isArray(orders) || orders.length === 0) {
      ordersBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--muted)">لا توجد طلبات حتى الآن.</td></tr>';
      return;
    }

    ordersBody.innerHTML = orders.map((order) => `
      <tr>
        <td>${formatDate(order.createdAt)}</td>
        <td><strong>${escapeHtml(order.name || "")}</strong></td>
        <td><a href="tel:${escapeAttr(order.phone || "")}" dir="ltr">${escapeHtml(order.phone || "")}</a></td>
        <td class="message">${escapeHtml(order.message || "-")}</td>
        <td>
          <select data-order-id="${escapeAttr(order.id || "")}">
            <option value="new"${order.status === "new" ? " selected" : ""}>جديد</option>
            <option value="reviewed"${order.status === "reviewed" ? " selected" : ""}>تمت المراجعة</option>
            <option value="done"${order.status === "done" ? " selected" : ""}>منتهي</option>
          </select>
        </td>
      </tr>
    `).join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  async function loadState() {
    try {
      const data = await request("state");
      showDashboard(true);
      fillSettings(data.settings);
      fillMetrics(data.metrics || {}, data.orders || []);
      fillOrders(data.orders || []);
      fillSlides(data.slides || []);
      fillServices(data.services || []);
    } catch (err) {
      showDashboard(false);
    }
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("#loginStatus", "جار تسجيل الدخول...");
    const typedPassword = loginForm.password.value.trim();
    try {
      const res = await request("login", { password: typedPassword });
      adminToken = res.token || typedPassword;
      localStorage.setItem("big_admin_token", adminToken);
      loginForm.reset();
      setStatus("#loginStatus", "");
      await loadState();
    } catch (error) {
      setStatus("#loginStatus", error.message, true);
    }
  });

  $("#logoutBtn").addEventListener("click", async () => {
    adminToken = "";
    localStorage.removeItem("big_admin_token");
    await request("logout", {}).catch(() => {});
    showDashboard(false);
  });

  if (slideForm) {
    slideForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("#slideStatus", "جار نشر الموضوع...");
      const formData = new FormData(slideForm);
      try {
        const data = await request("add-slide", formData);
        slideForm.reset();
        setStatus("#slideStatus", "تم نشر الموضوع بنجاح!", false, true);
        fillSlides(data.slides);
      } catch (error) {
        setStatus("#slideStatus", error.message, true);
      }
    });
  }

  if (slidesList) {
    slidesList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button[data-delete-slide]");
      if (!btn) return;
      const slideId = btn.dataset.deleteSlide;
      if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الموضوع؟")) return;

      try {
        const data = await request("delete-slide", { id: slideId });
        fillSlides(data.slides);
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (serviceForm) {
    serviceForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("#serviceStatus", "جار إضافة الخدمة...");
      const title_ar = serviceForm.title_ar.value;
      const title_en = serviceForm.title_en.value;
      const text_ar = serviceForm.text_ar.value;
      const text_en = serviceForm.text_en.value;
      const icon = serviceForm.icon.value;

      try {
        const data = await request("add-service", { title_ar, title_en, text_ar, text_en, icon });
        serviceForm.reset();
        setStatus("#serviceStatus", "تمت إضافة الخدمة بنجاح!", false, true);
        fillServices(data.services);
      } catch (error) {
        setStatus("#serviceStatus", error.message, true);
      }
    });
  }

  if (servicesList) {
    servicesList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button[data-delete-service]");
      if (!btn) return;
      const serviceId = btn.dataset.deleteService;
      if (!confirm("هل أنت تأكد من رغبتك في حذف هذه الخدمة؟")) return;

      try {
        const data = await request("delete-service", { id: serviceId });
        fillServices(data.services);
      } catch (error) {
        alert(error.message);
      }
    });
  }

  settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("#settingsStatus", "جار الحفظ...");
    try {
      const data = await request("settings", {
        facebook: settingsForm.facebook.value,
        instagram: settingsForm.instagram.value,
        whatsapp: settingsForm.whatsapp.value,
        maps: settingsForm.maps.value
      });
      fillSettings(data.settings);
      setStatus("#settingsStatus", "تم حفظ التعديلات بنجاح.", false, true);
    } catch (error) {
      setStatus("#settingsStatus", error.message, true);
    }
  });

  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("#passwordStatus", "جار تغيير الرقم...");
    try {
      await request("password", { password: passwordForm.password.value });
      passwordForm.reset();
      setStatus("#passwordStatus", "تم تغيير الرقم السري بنجاح.", false, true);
    } catch (error) {
      setStatus("#passwordStatus", error.message, true);
    }
  });

  ordersBody.addEventListener("change", async (event) => {
    const select = event.target.closest("select[data-order-id]");
    if (!select) return;
    await request("order-status", { id: select.dataset.orderId, status: select.value })
      .catch((error) => alert(error.message));
  });

  loadState();
})();
