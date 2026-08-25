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
    orders: []
  };

  let currentEditItem = null; // { type: 'dest'|'sub'|'service'|'slide', id: string }

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
    if (settingsForm.facebook) settingsForm.facebook.value = settings.facebook || "";
    if (settingsForm.instagram) settingsForm.instagram.value = settings.instagram || "";
    if (settingsForm.whatsapp) settingsForm.whatsapp.value = settings.whatsapp || "";
    if (settingsForm.maps) settingsForm.maps.value = settings.maps || "";
    if (settingsForm.phone_egypt) settingsForm.phone_egypt.value = settings.phone_egypt || "+201505502339";
    if (settingsForm.phone_iraq) settingsForm.phone_iraq.value = settings.phone_iraq || "+9647742881766";
    if (settingsForm.phone_turkey) settingsForm.phone_turkey.value = settings.phone_turkey || "+905011263577";
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
            <img src="${escapeAttr(dest.flag || '')}" alt="" width="28" height="20" style="border-radius:3px">
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

    subList.innerHTML = subsidiaries.map((sub) => `
      <div class="service-card-admin">
        <div>
          <span style="font-size:11px;color:var(--gold);font-weight:700;display:block;margin-bottom:4px">${escapeHtml(sub.tag_ar || sub.tag_en || 'مؤسسة إقليمية')}</span>
          <h4>${escapeHtml(sub.title_ar || sub.title_en || '')}</h4>
          <p>${escapeHtml(sub.desc_ar || sub.desc_en || '-')}</p>
        </div>
        <div class="card-actions">
          <button class="edit-btn" data-edit-sub="${escapeAttr(sub.id || "")}">✏️ تصحيح / تعديل</button>
          <button class="danger-btn" data-delete-sub="${escapeAttr(sub.id || "")}">حذف المؤسسة</button>
        </div>
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
        orders: data.orders || []
      };

      fillSettings(data.settings);
      fillMetrics(data.metrics || {}, data.orders || []);
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
          <span>رابط صورة العلم (Flag Image URL)</span>
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
          <span>رابط الشعار / اللوجو (Logo URL)</span>
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
          <span>رابط الصورة أو الفيديو المباشر</span>
          <input type="url" name="media_url" value="${escapeAttr(slide.src || '')}">
        </label>
        <label class="full-width">
          <span>الوصف بالعربية</span>
          <textarea name="text_ar" rows="3">${escapeHtml(slide.text_ar || '')}</textarea>
        </label>
      `;
    }

    editModalOverlay.classList.remove("hidden");
  }

  function closeEditModal() {
    editModalOverlay.classList.add("hidden");
    currentEditItem = null;
  }

  closeModalBtn.addEventListener("click", closeEditModal);

  modalEditForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentEditItem) return;

    setStatus("#modalStatus", "جار حفظ التعديلات وتصحيح النص...");

    const formData = new FormData(modalEditForm);
    const payload = { id: currentEditItem.id };
    for (let [key, val] of formData.entries()) {
      payload[key] = val;
    }

    let actionName = "";
    if (currentEditItem.type === "dest") actionName = "edit-destination";
    else if (currentEditItem.type === "sub") actionName = "edit-subsidiary";
    else if (currentEditItem.type === "service") actionName = "edit-service";
    else if (currentEditItem.type === "slide") actionName = "edit-slide";

    try {
      const data = await request(actionName, payload);
      setStatus("#modalStatus", "تمت حفظ وتصحيح التعديلات بنجاح!", false, true);

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

  if (slideForm) {
    slideForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("#slideStatus", "جار نشر الموضوع...");
      const formData = new FormData(slideForm);
      try {
        const data = await request("add-slide", formData);
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
      setStatus("#destStatus", "جار إضافة الدولة/الوجهة...");
      const name_ar = destForm.name_ar.value;
      const name_en = destForm.name_en.value;
      const badge_ar = destForm.badge_ar.value;
      const flag = destForm.flag.value;
      const tags = destForm.tags.value;
      const desc_ar = destForm.desc_ar.value;

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
      setStatus("#subStatus", "جار إضافة المؤسسة/الشركة...");
      const title_ar = subForm.title_ar.value;
      const title_en = subForm.title_en.value;
      const tag_ar = subForm.tag_ar.value;
      const logo = subForm.logo.value;
      const fb = subForm.fb.value;
      const desc_ar = subForm.desc_ar.value;

      try {
        const data = await request("add-subsidiary", { title_ar, title_en, tag_ar, logo, fb, desc_ar });
        subForm.reset();
        setStatus("#subStatus", "تمت إضافة المؤسسة بنجاح!", false, true);
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

  loadState();
})();
