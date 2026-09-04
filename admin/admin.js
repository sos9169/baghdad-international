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
  const destForm = $("#destForm");
  const destList = $("#destList");
  const subForm = $("#subForm");
  const subList = $("#subList");
  const ordersBody = $("#ordersBody");
  const activityBody = $("#activityBody");

  const editModalOverlay = $("#editModalOverlay");
  const closeModalBtn = $("#closeModalBtn");
  const modalEditForm = $("#modalEditForm");
  const modalFormGrid = $("#modalFormGrid");
  const modalTitle = $("#modalTitle");
  const modalStatus = $("#modalStatus");

  let adminToken = localStorage.getItem("big_admin_token") || "";
  let currentState = {
    slides: [],
    services: [],
    destinations: [],
    subsidiaries: [],
    settings: {},
    orders: [],
    metrics: {}
  };

  let currentEditItem = null;

  function fileToDataUrl(file) {
    return new Promise((resolve) => {
      if (!file || !file.size) { resolve(""); return; }
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }

  function setStatus(id, message, isError, isSuccess) {
    const el = $(id);
    if (!el) return;
    el.textContent = message || "";
    el.className = isError ? "error" : (isSuccess ? "success" : "");
  }

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

    // Try Vercel endpoint first, then PHP endpoint fallback
    const primaryUrl = `/api/admin?action=${encodeURIComponent(action)}`;
    const phpUrl = window.location.pathname.startsWith("/admin")
      ? `api.php?action=${encodeURIComponent(action)}`
      : `admin/api.php?action=${encodeURIComponent(action)}`;

    let response = await fetch(primaryUrl, options).catch(() => null);
    if (!response || response.status === 404) {
      response = await fetch(phpUrl, options).catch(() => null);
    }

    if (!response) {
      throw new Error("خطأ في الاتصال بالسيرفر — تعذر الوصول لخدمة الإدارة");
    }

    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("خطأ في استجابة السيرفر — يرجى إعادة المحاولة");
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
    if (settingsForm.facebook) settingsForm.facebook.value = settings.facebook || "";
    if (settingsForm.instagram) settingsForm.instagram.value = settings.instagram || "";
    if (settingsForm.whatsapp) settingsForm.whatsapp.value = settings.whatsapp || "";
    if (settingsForm.maps) settingsForm.maps.value = settings.maps || "";
    if (settingsForm.phone_egypt) settingsForm.phone_egypt.value = settings.phone_egypt || "+201505502339";
    if (settingsForm.phone_iraq) settingsForm.phone_iraq.value = settings.phone_iraq || "+9647742881766";
    if (settingsForm.phone_turkey) settingsForm.phone_turkey.value = settings.phone_turkey || "+905011263577";
  }

  function getMergedEvents(serverEvents) {
    let events = Array.isArray(serverEvents) ? serverEvents.slice() : [];
    try {
      const localEvents = JSON.parse(localStorage.getItem("big_live_events") || "[]");
      if (Array.isArray(localEvents) && localEvents.length > 0) {
        // Merge without duplicates based on createdAt & type
        const existingKeys = new Set(events.map((e) => (e.createdAt || "") + "_" + (e.type || "")));
        for (const lev of localEvents) {
          const key = (lev.createdAt || "") + "_" + (lev.type || "");
          if (!existingKeys.has(key)) {
            events.push(lev);
            existingKeys.add(key);
          }
        }
      }
    } catch (e) {}
    events.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return events;
  }

  function fillMetrics(metrics, orders) {
    if (!metrics) metrics = {};
    const events = getMergedEvents(metrics.events);
    const visits = Math.max(metrics.visits || 0, events.filter((e) => e.type === "visit").length);
    const whatsapp = Math.max(metrics.whatsappClicks || 0, events.filter((e) => e.type === "whatsapp").length);
    const interactions = Math.max(metrics.interactions || 0, events.length);
    const formSubmits = Array.isArray(orders) ? orders.length : (metrics.formSubmits || 0);

    $("#visitsCount").textContent = visits;
    $("#interactionsCount").textContent = interactions;
    $("#whatsappCount").textContent = whatsapp;
    $("#ordersCount").textContent = formSubmits;
  }

  function fillActivityLog(serverEvents) {
    if (!activityBody) return;
    const events = getMergedEvents(serverEvents);

    if (!Array.isArray(events) || events.length === 0) {
      activityBody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--muted)">لا توجد زيارات أو تفاعلات حية مسجلة حتى الآن.</td></tr>';
      return;
    }

    activityBody.innerHTML = events.slice(0, 50).map((ev) => {
      let badge = '<span style="color:#58a6ff;font-weight:600;"><i class="fa-solid fa-eye"></i> زيارة موقع جديدة</span>';
      if (ev.type === "whatsapp") badge = '<span style="color:#25d366;font-weight:700;"><i class="fa-brands fa-whatsapp"></i> ضغطة واتساب حية</span>';
      else if (ev.type === "phone") badge = '<span style="color:#e4c47d;font-weight:600;"><i class="fa-solid fa-phone"></i> اتصال هاتفي</span>';
      else if (ev.type === "tag_click") badge = '<span style="color:#e4c47d;font-weight:600;"><i class="fa-solid fa-bullseye"></i> تفاعل مع دولة/خدمة</span>';
      else if (ev.type === "form_submit") badge = '<span style="color:#38ef7d;font-weight:700;"><i class="fa-solid fa-paper-plane"></i> إرسال طلب جديد</span>';

      return `
        <tr>
          <td dir="ltr" style="font-size:12px;font-family:monospace;">${formatDate(ev.createdAt)}</td>
          <td>${badge}</td>
          <td dir="ltr" style="font-size:12px;color:var(--gold-light);font-family:monospace;">${escapeHtml(ev.page || '/')}</td>
          <td>${escapeHtml(ev.device || 'كمبيوتر/جوال 📱')}</td>
        </tr>
      `;
    }).join("");
  }

  function resolveMediaUrl(src) {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/") || src.startsWith("data:")) {
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
            <div class="card-actions">
              <button class="edit-btn" data-edit-slide="${escapeAttr(slide.id || "")}">✏️ تصحيح / تعديل</button>
              <button class="danger-btn" data-delete-slide="${escapeAttr(slide.id || "")}">حذف</button>
            </div>
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
        <div class="card-actions">
          <button class="edit-btn" data-edit-service="${escapeAttr(srv.id || "")}">✏️ تصحيح / تعديل</button>
          <button class="danger-btn" data-delete-service="${escapeAttr(srv.id || "")}">حذف الخدمة</button>
        </div>
      </div>
    `).join("");
  }

  function fillDestinations(destinations) {
    if (!destList) return;
    if (!Array.isArray(destinations) || destinations.length === 0) {
      destList.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">لا توجد دول أو وجهات معروضة حالياً.</p>';
      return;
    }

    destList.innerHTML = destinations.map((dest) => `
      <div class="service-card-admin">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <img src="${escapeAttr(resolveMediaUrl(dest.flag))}" alt="" width="28" height="20" style="border-radius:3px;object-fit:cover">
            <span style="font-size:12px;color:var(--gold);font-weight:700">${escapeHtml(dest.badge_ar || 'وجهة مفعّلة')}</span>
          </div>
          <h4>${escapeHtml(dest.name_ar || dest.name_en || '')}</h4>
          <p>${escapeHtml(dest.desc_ar || dest.desc_en || '-')}</p>
        </div>
        <div class="card-actions">
          <button class="edit-btn" data-edit-dest="${escapeAttr(dest.id || "")}">✏️ تصحيح / تعديل</button>
          <button class="danger-btn" data-delete-dest="${escapeAttr(dest.id || "")}">حذف الدولة</button>
        </div>
      </div>
    `).join("");
  }

  function fillSubsidiaries(subsidiaries) {
    if (!subList) return;
    if (!Array.isArray(subsidiaries) || subsidiaries.length === 0) {
      subList.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">لا توجد مؤسسات أو شركات مضافة حالياً.</p>';
      return;
    }

    subList.innerHTML = subsidiaries.map((sub) => {
      const logoSrc = resolveMediaUrl(sub.logo);
      const logoHtml = logoSrc
        ? `<img src="${escapeAttr(logoSrc)}" alt="" width="32" height="32" style="border-radius:50%;object-fit:cover;border:1px solid var(--gold)">`
        : '';

      return `
        <div class="service-card-admin">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              ${logoHtml}
              <span style="font-size:11px;color:var(--gold);font-weight:700">${escapeHtml(sub.tag_ar || sub.tag_en || 'مؤسسة إقليمية')}</span>
            </div>
            <h4>${escapeHtml(sub.title_ar || sub.title_en || '')}</h4>
            <p>${escapeHtml(sub.desc_ar || sub.desc_en || '-')}</p>
          </div>
          <div class="card-actions">
            <button class="edit-btn" data-edit-sub="${escapeAttr(sub.id || "")}">✏️ تصحيح / تعديل</button>
            <button class="danger-btn" data-delete-sub="${escapeAttr(sub.id || "")}">حذف المؤسسة</button>
          </div>
        </div>
      `;
    }).join("");
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
      if (data.currentPassword) {
        const curPassEl = $("#currentPasswordVal");
        if (curPassEl) curPassEl.textContent = data.currentPassword;
      }

      currentState = {
        slides: data.slides || [],
        services: data.services || [],
        destinations: data.destinations || [],
        subsidiaries: data.subsidiaries || [],
        settings: data.settings || {},
        orders: data.orders || [],
        metrics: data.metrics || {}
      };

      fillSettings(data.settings);
      fillMetrics(data.metrics || {}, data.orders || []);
      fillActivityLog(data.metrics?.events || []);
      fillOrders(data.orders || []);
      fillSlides(data.slides || []);
      fillServices(data.services || []);
      fillDestinations(data.destinations || []);
      fillSubsidiaries(data.subsidiaries || []);
    } catch (err) {
      showDashboard(false);
    }
  }

  // --- Modal Editing Functions ---
  function openEditModal(type, id) {
    currentEditItem = { type, id };
    modalStatus.textContent = "";

    if (type === "dest") {
      const dest = currentState.destinations.find((d) => d.id === id);
      if (!dest) return;
      modalTitle.textContent = `تعديل دولة: ${dest.name_ar}`;
      const tagString = Array.isArray(dest.tags) ? dest.tags.map((t) => t.val_ar || t).join(", ") : "";

      modalFormGrid.innerHTML = `
        <label>
          <span>اسم الدولة بالعربية *</span>
          <input type="text" name="name_ar" value="${escapeAttr(dest.name_ar || '')}" required>
        </label>
        <label>
          <span>اسم الدولة بالإنجليزي</span>
          <input type="text" name="name_en" value="${escapeAttr(dest.name_en || '')}">
        </label>
        <label>
          <span>شارة / نوع المقر</span>
          <input type="text" name="badge_ar" value="${escapeAttr(dest.badge_ar || '')}">
        </label>
        <label>
          <span>تغيير صورة العلم من المعرض 📷</span>
          <input type="file" name="flag_file" accept="image/*">
        </label>
        <label class="full-width">
          <span>أو رابط مباشر لصورة العلم (Flag URL)</span>
          <input type="url" name="flag" value="${escapeAttr(dest.flag || '')}">
        </label>
        <label class="full-width">
          <span>الخدمات المتاحة بهذه الدولة (مفصولة بفواصل)</span>
          <input type="text" name="tags" value="${escapeAttr(tagString)}">
        </label>
        <label class="full-width">
          <span>الوصف التفصيلي بالعربية</span>
          <textarea name="desc_ar" rows="3">${escapeHtml(dest.desc_ar || '')}</textarea>
        </label>
      `;
    } else if (type === "sub") {
      const sub = currentState.subsidiaries.find((s) => s.id === id);
      if (!sub) return;
      modalTitle.textContent = `تعديل مؤسسة: ${sub.title_ar}`;

      modalFormGrid.innerHTML = `
        <label>
          <span>اسم المؤسسة / الشركة بالعربية *</span>
          <input type="text" name="title_ar" value="${escapeAttr(sub.title_ar || '')}" required>
        </label>
        <label>
          <span>اسم المؤسسة بالإنجليزي</span>
          <input type="text" name="title_en" value="${escapeAttr(sub.title_en || '')}">
        </label>
        <label>
          <span>الفرع / الدولة التابعة</span>
          <input type="text" name="tag_ar" value="${escapeAttr(sub.tag_ar || '')}">
        </label>
        <label>
          <span>تغيير اللوجو/الشعار من المعرض 📷</span>
          <input type="file" name="logo_file" accept="image/*">
        </label>
        <label class="full-width">
          <span>أو رابط مباشر للشعار (Logo URL)</span>
          <input type="text" name="logo" value="${escapeAttr(sub.logo || '')}">
        </label>
        <label class="full-width">
          <span>رابط صفحة الفيسبوك الرسمية</span>
          <input type="url" name="fb" value="${escapeAttr(sub.fb || '')}">
        </label>
        <label class="full-width">
          <span>الوصف التوضيحي بالعربية</span>
          <textarea name="desc_ar" rows="3">${escapeHtml(sub.desc_ar || '')}</textarea>
        </label>
      `;
    } else if (type === "service") {
      const srv = currentState.services.find((s) => s.id === id);
      if (!srv) return;
      modalTitle.textContent = `تعديل خدمة: ${srv.title_ar}`;

      modalFormGrid.innerHTML = `
        <label>
          <span>اسم الخدمة بالعربية *</span>
          <input type="text" name="title_ar" value="${escapeAttr(srv.title_ar || '')}" required>
        </label>
        <label>
          <span>اسم الخدمة بالإنجليزي</span>
          <input type="text" name="title_en" value="${escapeAttr(srv.title_en || '')}">
        </label>
        <label class="full-width">
          <span>رمز / أيقونة الخدمة</span>
          <input type="text" name="icon" value="${escapeAttr(srv.icon || '✦')}">
        </label>
        <label class="full-width">
          <span>الوصف بالعربية</span>
          <textarea name="text_ar" rows="3">${escapeHtml(srv.text_ar || '')}</textarea>
        </label>
        <label class="full-width">
          <span>الوصف بالإنجليزي</span>
          <textarea name="text_en" rows="3">${escapeHtml(srv.text_en || '')}</textarea>
        </label>
      `;
    } else if (type === "slide") {
      const slide = currentState.slides.find((s) => s.id === id);
      if (!slide) return;
      modalTitle.textContent = `تعديل موضوع المعرض: ${slide.title_ar}`;

      modalFormGrid.innerHTML = `
        <label>
          <span>العنوان بالعربية *</span>
          <input type="text" name="title_ar" value="${escapeAttr(slide.title_ar || '')}" required>
        </label>
        <label>
          <span>العنوان بالإنجليزي</span>
          <input type="text" name="title_en" value="${escapeAttr(slide.title_en || '')}">
        </label>
        <label class="full-width">
          <span>تغيير الميديا (صورة أو فيديو) من المعرض 📷</span>
          <input type="file" name="media_file" accept="image/*,video/mp4,video/webm">
        </label>
        <label class="full-width">
          <span>أو رابط مباشر للميديا (Media URL)</span>
          <input type="url" name="media_url" value="${escapeAttr(slide.src || '')}">
        </label>
        <label class="full-width">
          <span>الوصف بالعربية</span>
          <textarea name="text_ar" rows="3">${escapeHtml(slide.text_ar || '')}</textarea>
        </label>
      `;
    }

    editModalOverlay.classList.remove("hidden");
    setupAutoTranslation(modalFormGrid);
  }

  function closeEditModal() {
    editModalOverlay.classList.add("hidden");
    currentEditItem = null;
  }

  closeModalBtn.addEventListener("click", closeEditModal);

  modalEditForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentEditItem) return;

    setStatus("#modalStatus", "جار رفع الصورة وحفظ التعديلات...");

    const formData = new FormData(modalEditForm);
    const payload = { id: currentEditItem.id };
    for (let [key, val] of formData.entries()) {
      if (!(val instanceof File)) {
        payload[key] = val;
      }
    }

    const logoFile = modalEditForm.querySelector('input[name="logo_file"]');
    if (logoFile && logoFile.files && logoFile.files[0]) {
      const uploadedDataUrl = await fileToDataUrl(logoFile.files[0]);
      if (uploadedDataUrl) payload.logo = uploadedDataUrl;
    }

    const flagFile = modalEditForm.querySelector('input[name="flag_file"]');
    if (flagFile && flagFile.files && flagFile.files[0]) {
      const uploadedDataUrl = await fileToDataUrl(flagFile.files[0]);
      if (uploadedDataUrl) payload.flag = uploadedDataUrl;
    }

    const mediaFile = modalEditForm.querySelector('input[name="media_file"]');
    if (mediaFile && mediaFile.files && mediaFile.files[0]) {
      const uploadedDataUrl = await fileToDataUrl(mediaFile.files[0]);
      if (uploadedDataUrl) payload.media_url = uploadedDataUrl;
    }

    let actionName = "";
    if (currentEditItem.type === "dest") actionName = "edit-destination";
    else if (currentEditItem.type === "sub") actionName = "edit-subsidiary";
    else if (currentEditItem.type === "service") actionName = "edit-service";
    else if (currentEditItem.type === "slide") actionName = "edit-slide";

    try {
      const data = await request(actionName, payload);
      setStatus("#modalStatus", "تمت حفظ والتعديلات بنجاح!", false, true);

      if (data.destinations) { currentState.destinations = data.destinations; fillDestinations(data.destinations); }
      if (data.subsidiaries) { currentState.subsidiaries = data.subsidiaries; fillSubsidiaries(data.subsidiaries); }
      if (data.services) { currentState.services = data.services; fillServices(data.services); }
      if (data.slides) { currentState.slides = data.slides; fillSlides(data.slides); }

      setTimeout(() => {
        closeEditModal();
      }, 700);
    } catch (err) {
      setStatus("#modalStatus", err.message, true);
    }
  });

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

  const resetBtn = $("#resetMetricsBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      if (!confirm("هل أنت تأكد من رغبتك في تصفير وإعادة ضبط عداد الإحصائيات وسجل الزيارات؟")) return;
      try {
        localStorage.removeItem("big_live_events");
        const res = await request("reset-metrics", {});
        currentState.metrics = res.metrics || {};
        fillMetrics(currentState.metrics, currentState.orders);
        fillActivityLog([]);
        alert("تم تصفير وإعادة ضبط عداد الإحصائيات وسجل الزيارات الحية بنجاح!");
      } catch (err) {
        localStorage.removeItem("big_live_events");
        currentState.metrics = { visits: 0, interactions: 0, whatsappClicks: 0, formSubmits: 0, events: [] };
        fillMetrics(currentState.metrics, currentState.orders);
        fillActivityLog([]);
        alert("تم تصفير السجل الحي المحلي بنجاح!");
      }
    });
  }

  const refreshActBtn = $("#refreshActivityBtn");
  if (refreshActBtn) {
    refreshActBtn.addEventListener("click", async () => {
      await loadState();
    });
  }

  const simulateBtn = $("#simulateVisitBtn");
  if (simulateBtn) {
    simulateBtn.addEventListener("click", async () => {
      const types = [
        { type: "visit", label: "زيارة موقع جديدة" },
        { type: "whatsapp", label: "ضغطة واتساب حية" },
        { type: "tag_click", label: "تفاعل مع دولة/خدمة" }
      ];
      const pages = ["/index.html", "/#services", "/#destinations", "/#contact"];
      const devices = ["هاتف جوال 📱", "كمبيوتر 💻", "تابلت 📱"];

      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];

      const newSimulatedEvent = {
        type: randomType.type,
        page: randomPage,
        device: randomDevice,
        createdAt: new Date().toISOString()
      };

      try {
        const localEvents = JSON.parse(localStorage.getItem("big_live_events") || "[]");
        localEvents.unshift(newSimulatedEvent);
        localStorage.setItem("big_live_events", JSON.stringify(localEvents.slice(0, 100)));
      } catch (e) {}

      // Try sending to public track API
      fetch("/api/public?action=track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSimulatedEvent)
      }).catch(() => {
        fetch("api.php?action=track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSimulatedEvent)
        }).catch(() => null);
      });

      await loadState();
    });
  }

  // Auto-refresh activity log every 8 seconds if dashboard is active
  setInterval(() => {
    if (dashboardView && !dashboardView.classList.contains("hidden")) {
      loadState().catch(() => {});
    }
  }, 8000);

  if (slideForm) {
    slideForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("#slideStatus", "جار رفع الوسائط ونشر الموضوع...");

      const title_ar = slideForm.title_ar.value;
      const title_en = slideForm.title_en.value;
      const text_ar = slideForm.text_ar.value;
      const text_en = slideForm.text_en.value;
      const type = slideForm.type.value;
      let media_url = slideForm.media_url ? slideForm.media_url.value.trim() : "";

      const fileInput = slideForm.querySelector('input[name="media_file"]');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const uploadedDataUrl = await fileToDataUrl(fileInput.files[0]);
        if (uploadedDataUrl) media_url = uploadedDataUrl;
      }

      try {
        const data = await request("add-slide", { title_ar, title_en, text_ar, text_en, type, media_url });
        slideForm.reset();
        setStatus("#slideStatus", "تم نشر الموضوع بنجاح!", false, true);
        currentState.slides = data.slides;
        fillSlides(data.slides);
      } catch (error) {
        setStatus("#slideStatus", error.message, true);
      }
    });
  }

  if (slidesList) {
    slidesList.addEventListener("click", async (event) => {
      const editBtn = event.target.closest("button[data-edit-slide]");
      if (editBtn) {
        openEditModal("slide", editBtn.dataset.editSlide);
        return;
      }
      const deleteBtn = event.target.closest("button[data-delete-slide]");
      if (!deleteBtn) return;
      const slideId = deleteBtn.dataset.deleteSlide;
      if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الموضوع؟")) return;

      try {
        const data = await request("delete-slide", { id: slideId });
        currentState.slides = data.slides;
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
        currentState.services = data.services;
        fillServices(data.services);
      } catch (error) {
        setStatus("#serviceStatus", error.message, true);
      }
    });
  }

  if (servicesList) {
    servicesList.addEventListener("click", async (event) => {
      const editBtn = event.target.closest("button[data-edit-service]");
      if (editBtn) {
        openEditModal("service", editBtn.dataset.editService);
        return;
      }
      const deleteBtn = event.target.closest("button[data-delete-service]");
      if (!deleteBtn) return;
      const serviceId = deleteBtn.dataset.deleteService;
      if (!confirm("هل أنت تأكد من رغبتك في حذف هذه الخدمة؟")) return;

      try {
        const data = await request("delete-service", { id: serviceId });
        currentState.services = data.services;
        fillServices(data.services);
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (destForm) {
    destForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("#destStatus", "جار اختيار العلم وإضافة الدولة...");
      const name_ar = destForm.name_ar.value;
      const name_en = destForm.name_en.value;
      const badge_ar = destForm.badge_ar.value;
      let flag = destForm.flag ? destForm.flag.value.trim() : "";
      const tags = destForm.tags.value;
      const desc_ar = destForm.desc_ar.value;

      const fileInput = destForm.querySelector('input[name="flag_file"]');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const uploadedDataUrl = await fileToDataUrl(fileInput.files[0]);
        if (uploadedDataUrl) flag = uploadedDataUrl;
      }

      try {
        const data = await request("add-destination", { name_ar, name_en, badge_ar, flag, tags, desc_ar });
        destForm.reset();
        setStatus("#destStatus", "تمت إضافة الدولة بنجاح!", false, true);
        currentState.destinations = data.destinations;
        fillDestinations(data.destinations);
      } catch (error) {
        setStatus("#destStatus", error.message, true);
      }
    });
  }

  if (destList) {
    destList.addEventListener("click", async (event) => {
      const editBtn = event.target.closest("button[data-edit-dest]");
      if (editBtn) {
        openEditModal("dest", editBtn.dataset.editDest);
        return;
      }
      const deleteBtn = event.target.closest("button[data-delete-dest]");
      if (!deleteBtn) return;
      const destId = deleteBtn.dataset.deleteDest;
      if (!confirm("هل أنت تأكد من رغبتك في حذف هذه الدولة/الوجهة؟")) return;

      try {
        const data = await request("delete-destination", { id: destId });
        currentState.destinations = data.destinations;
        fillDestinations(data.destinations);
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (subForm) {
    subForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("#subStatus", "جار رفع الشعار وإضافة المؤسسة...");
      const title_ar = subForm.title_ar.value;
      const title_en = subForm.title_en.value;
      const tag_ar = subForm.tag_ar.value;
      let logo = subForm.logo ? subForm.logo.value.trim() : "";
      const fb = subForm.fb ? subForm.fb.value : "";
      const desc_ar = subForm.desc_ar ? subForm.desc_ar.value : "";

      const fileInput = subForm.querySelector('input[name="logo_file"]');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const uploadedDataUrl = await fileToDataUrl(fileInput.files[0]);
        if (uploadedDataUrl) logo = uploadedDataUrl;
      }

      try {
        const data = await request("add-subsidiary", { title_ar, title_en, tag_ar, logo, fb, desc_ar });
        subForm.reset();
        setStatus("#subStatus", "تمت إضافة المؤسسة والشعار بنجاح!", false, true);
        currentState.subsidiaries = data.subsidiaries;
        fillSubsidiaries(data.subsidiaries);
      } catch (error) {
        setStatus("#subStatus", error.message, true);
      }
    });
  }

  if (subList) {
    subList.addEventListener("click", async (event) => {
      const editBtn = event.target.closest("button[data-edit-sub]");
      if (editBtn) {
        openEditModal("sub", editBtn.dataset.editSub);
        return;
      }
      const deleteBtn = event.target.closest("button[data-delete-sub]");
      if (!deleteBtn) return;
      const subId = deleteBtn.dataset.deleteSub;
      if (!confirm("هل أنت تأكد من رغبتك في حذف هذه المؤسسة/الشركة؟")) return;

      try {
        const data = await request("delete-subsidiary", { id: subId });
        currentState.subsidiaries = data.subsidiaries;
        fillSubsidiaries(data.subsidiaries);
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
        facebook: settingsForm.facebook ? settingsForm.facebook.value : "",
        instagram: settingsForm.instagram ? settingsForm.instagram.value : "",
        whatsapp: settingsForm.whatsapp ? settingsForm.whatsapp.value : "",
        maps: settingsForm.maps ? settingsForm.maps.value : "",
        phone_egypt: settingsForm.phone_egypt ? settingsForm.phone_egypt.value : "",
        phone_iraq: settingsForm.phone_iraq ? settingsForm.phone_iraq.value : "",
        phone_turkey: settingsForm.phone_turkey ? settingsForm.phone_turkey.value : ""
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
    const newPassword = passwordForm.password.value.trim();
    try {
      const res = await request("password", { password: newPassword });
      passwordForm.reset();
      const updatedPass = res.currentPassword || newPassword;
      adminToken = updatedPass;
      localStorage.setItem("big_admin_token", updatedPass);
      const curPassEl = $("#currentPasswordVal");
      if (curPassEl) curPassEl.textContent = updatedPass;
      setStatus("#passwordStatus", "تم تغيير الرقم السري بنجاح إلى: " + updatedPass, false, true);
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

  // --- Instant Auto-Translate System (Arabic -> English) ---
  const translationCache = {};
  async function autoTranslate(text) {
    if (!text || !text.trim()) return "";
    const clean = text.trim();
    if (translationCache[clean]) return translationCache[clean];

    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=ar|en`);
      const json = await res.json();
      if (json && json.responseData && json.responseData.translatedText) {
        const result = json.responseData.translatedText.trim();
        if (!result.toUpperCase().includes("MYMEMORY WARNING")) {
          translationCache[clean] = result;
          return result;
        }
      }
    } catch (e) {}
    return clean;
  }

  function setupAutoTranslation(container) {
    if (!container) return;
    const arElements = container.querySelectorAll('input[name$="_ar"], textarea[name$="_ar"]');
    arElements.forEach((arEl) => {
      const fieldName = arEl.name.replace("_ar", "_en");
      const enEl = container.querySelector(`[name="${fieldName}"]`);
      if (!enEl) return;

      let timer = null;
      arEl.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          const val = arEl.value.trim();
          if (val && (!enEl.value.trim() || !enEl.dataset.userEdited)) {
            enEl.placeholder = "جار الترجمة تلقائياً ✨...";
            const translated = await autoTranslate(val);
            if (translated && (!enEl.value.trim() || !enEl.dataset.userEdited)) {
              enEl.value = translated;
            }
          }
        }, 450);
      });

      enEl.addEventListener("input", () => {
        if (enEl.value.trim() !== "") {
          enEl.dataset.userEdited = "true";
        } else {
          delete enEl.dataset.userEdited;
        }
      });
    });
  }

  // Activate auto-translation on all admin forms
  setupAutoTranslation(slideForm);
  setupAutoTranslation(serviceForm);
  setupAutoTranslation(destForm);
  setupAutoTranslation(subForm);

  loadState();
})();
