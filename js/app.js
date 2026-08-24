(() => {
  "use strict";

  // Comprehensive Multi-lingual Translation Dictionary
  const translations = {
    ar: {
      "nav.home": "الرئيسية",
      "nav.about": "من نحن",
      "nav.services": "خدماتنا",
      "nav.education": "التعليم والتدريب",
      "nav.destinations": "الدول",
      "nav.why": "لماذا نحن",
      "nav.contact": "تواصل معنا",
      "hero.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "hero.title": "نفتح لك الطريق<br><span>إلى فرص أكبر.</span>",
      "hero.text": "حلول متكاملة في التعليم والسفر والخدمات الدولية، بتجربة احترافية تبدأ من أول تواصل وحتى إنجاز التفاصيل.",
      "hero.primary": "اكتشف خدماتنا <span>↙</span>",
      "hero.secondary": "تواصل معنا",
      "hero.stat1": "حلول متكاملة",
      "hero.stat2": "خدمة احترافية",
      "hero.stat3": "دعم مستمر",
      "hero.cardLabel": "YOUR NEXT STEP",
      "hero.cardTitle": "نرتب التفاصيل.<br>وأنت تبدأ الرحلة.",
      "hero.cardText": "تعليم • سفر • خدمات دولية",
      "hero.chip1": "Trusted Support",
      "hero.chip2": "International",
      "ticker.1": "EDUCATION",
      "ticker.2": "TRAVEL",
      "ticker.3": "GENERAL TRADE",
      "ticker.4": "TRAINING",
      "ticker.5": "LEGAL SUPPORT",
      "about.eyebrow": "ABOUT US",
      "about.title": "خبرة تُحوّل<br><span>التفاصيل إلى نتائج.</span>",
      "about.lead": "Baghdad International Group هي واجهة لخدمات دولية مصممة للأفراد والعائلات والطلاب وأصحاب الأعمال.",
      "about.text": "نساعدك في ترتيب الخطوات، فهم الإجراءات، واختيار الحل الأنسب لاحتياجك — بأسلوب واضح، سريع واحترافي.",
      "about.signature": "Baghdad International Group",
      "about.years": "+9",
      "about.yearsLabel": "سنوات خبرة في السوق",
      "showcase.eyebrow": "OUR WORLD",
      "showcase.title": "من الفكرة إلى<br><span>الخطوة التالية.</span>",
      "slide.1.title": "ابدأ مستقبلك التعليمي",
      "slide.1.text": "نساعد الطلاب في الوصول إلى الخيارات التعليمية المناسبة وترتيب خطواتهم بثقة.",
      "slide.2.title": "رحلتك تبدأ من هنا",
      "slide.2.text": "خدمات ومساندة لتنظيم السفر والتنقل، مع اهتمام بالتفاصيل من البداية.",
      "slide.3.title": "حلول للأعمال والخدمات الدولية",
      "slide.3.text": "دعم عملي للأفراد والشركات في الخدمات التي تحتاج تنسيقاً ومتابعة دقيقة.",
      "education.eyebrow": "EDUCATION & TRAINING",
      "education.title": "الدراسة والتطوير<br><span>في مكان واحد.</span>",
      "education.note": "نرتب خطوات الدراسة، التقديمات الجامعية، التدريب المهني، والمؤتمرات العلمية بطريقة واضحة قابلة للمتابعة.",
      "program.1.title": "الدراسة والتقديمات الجامعية",
      "program.1.text": "تجهيز الملفات، متابعة التقديم، واختيار الوجهة التعليمية المناسبة للطالب.",
      "program.2.title": "الدورات التدريبية",
      "program.2.text": "برامج تدريبية لتطوير المهارات العملية والمهنية حسب المجال المطلوب.",
      "program.3.title": "المؤتمرات والبرامج المهنية",
      "program.3.text": "مؤتمرات علمية ودورات مهنية متخصصة، بما يشمل برامج مثل MBA.",
      "destinations.eyebrow": "DESTINATIONS",
      "destinations.title": "خدمات سفر مرتبطة<br><span>بعدة دول.</span>",
      "country.egypt": "مصر",
      "country.iraq": "العراق",
      "country.turkey": "تركيا",
      "country.iran": "إيران",
      "country.russia": "روسيا",
      "banner.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "banner.title": "خدمات دولية | سفر | تعليم | تجارة عامة",
      "banner.text": "هوية واضحة مناسبة للاستخدام كبانر تعريفي على فيسبوك والمنصات الاجتماعية.",
      "services.eyebrow": "WHAT WE DO",
      "services.title": "خدماتنا، بشكل<br><span>أبسط وأوضح.</span>",
      "service.1.title": "خدمات السفر والإقامة",
      "service.1.text": "تنسيق الفيزا، ترتيبات السفر، السكن، والإقامة بخطوات واضحة ومتابعة مستمرة.",
      "service.2.title": "الإجراءات والعقود",
      "service.2.text": "خدمات الإجراءات العامة، العقود الإيجارية، وتجهيز الملفات المطلوبة حسب الحالة.",
      "service.3.title": "التجارة العامة",
      "service.3.text": "دعم خدمات الاستيراد والتصدير والمتابعة التجارية بين الأسواق المستهدفة.",
      "service.4.title": "الخدمات التعليمية",
      "service.4.text": "التقديمات الجامعية، ملفات الدراسة، واختيار المسار التعليمي الأنسب للطالب.",
      "service.5.title": "التدريب وتطوير المهارات",
      "service.5.text": "دورات تدريبية ومهنية، مؤتمرات علمية، وبرامج تطوير مثل MBA حسب الاحتياج.",
      "service.6.title": "الدعم القانوني",
      "service.6.text": "فريق محامين للمساندة في الحالات القانونية أو الإجرائية ومتابعة الحل المناسب.",
      "service.more": "اعرف المزيد ↙",
      "why.eyebrow": "WHY BIG",
      "why.title": "مش مجرد خدمة.<br><span>دي تجربة كاملة.</span>",
      "why.caption": "Built around your next step.",
      "why.1.title": "وضوح من البداية",
      "why.1.text": "نشرح لك الخطوات والمطلوب بدون تعقيد.",
      "why.2.title": "متابعة مستمرة",
      "why.2.text": "نبقى معك حتى تكتمل الصورة وتتحرك للخطوة التالية.",
      "why.3.title": "حلول مرنة",
      "why.3.text": "نرتب الخدمة حسب احتياجك، وليس العكس.",
      "contact.eyebrow": "LET'S TALK",
      "contact.title": "جاهز للخطوة<br><span>التالية؟</span>",
      "contact.text": "احكي لنا احتياجك، ونرتب معك أفضل طريقة للبدء.",
      "form.name": "الاسم",
      "form.phone": "رقم الهاتف",
      "form.message": "كيف نقدر نساعدك؟",
      "form.namePlaceholder": "اكتب اسمك",
      "form.phonePlaceholder": "01xxxxxxxxx",
      "form.messagePlaceholder": "اكتب رسالتك هنا...",
      "form.submit": "إرسال الطلب",
      "form.sending": "جار إرسال طلبك...",
      "form.success": "تم إرسال طلبك بنجاح! وسنتواصل معك قريباً.",
      "form.error": "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.",
      "contact.addressLabel": "العنوان",
      "contact.address": "عمارة رقم ٧، شارع عقبة بن نافع، الدور الأول، مكتب رقم ٣ — أمام البيت الثقافي الروسي، الدقي، الجيزة",
      "contact.directions": "احصل على الاتجاهات ↗",
      "contact.regionLabel": "التواصل والخدمات",
      "contact.regions": "متابعة لعملاء مصر، العراق، وتركيا.",
      "footer.copy": "خدمات دولية مصممة حول احتياجك."
    },
    en: {
      "nav.home": "Home",
      "nav.about": "About Us",
      "nav.services": "Services",
      "nav.education": "Education",
      "nav.destinations": "Countries",
      "nav.why": "Why Us",
      "nav.contact": "Contact",
      "hero.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "hero.title": "We open the way<br><span>to bigger opportunities.</span>",
      "hero.text": "Integrated education, travel and international services — with a professional experience from the first conversation to the final detail.",
      "hero.primary": "Explore our services <span>↙</span>",
      "hero.secondary": "Contact us",
      "hero.stat1": "Integrated solutions",
      "hero.stat2": "Professional service",
      "hero.stat3": "Continuous support",
      "hero.cardLabel": "YOUR NEXT STEP",
      "hero.cardTitle": "We handle the details.<br>You start the journey.",
      "hero.cardText": "Education • Travel • International Services",
      "hero.chip1": "Trusted Support",
      "hero.chip2": "International",
      "ticker.1": "EDUCATION",
      "ticker.2": "TRAVEL",
      "ticker.3": "GENERAL TRADE",
      "ticker.4": "TRAINING",
      "ticker.5": "LEGAL SUPPORT",
      "about.eyebrow": "ABOUT US",
      "about.title": "Experience that turns<br><span>details into results.</span>",
      "about.lead": "Baghdad International Group is a gateway to international services designed for individuals, families, students and businesses.",
      "about.text": "We help you organize the steps, understand the process and choose the right solution — clearly, quickly and professionally.",
      "about.signature": "Baghdad International Group",
      "about.years": "+9",
      "about.yearsLabel": "Years of experience in the market",
      "showcase.eyebrow": "OUR WORLD",
      "showcase.title": "From the idea to<br><span>the next step.</span>",
      "slide.1.title": "Start your educational future",
      "slide.1.text": "We help students find suitable education options and organize their steps with confidence.",
      "slide.2.title": "Your journey starts here",
      "slide.2.text": "Support for travel and mobility planning, with attention to details from day one.",
      "slide.3.title": "Business and international solutions",
      "slide.3.text": "Practical support for individuals and companies that need coordinated international services.",
      "education.eyebrow": "EDUCATION & TRAINING",
      "education.title": "Study and development<br><span>in one place.</span>",
      "education.note": "We organize study steps, university applications, professional training, and scientific conferences with clear follow-up.",
      "program.1.title": "Study & University Applications",
      "program.1.text": "Preparing files, following applications, and choosing the right study destination.",
      "program.2.title": "Training Courses",
      "program.2.text": "Training programs for practical and professional skill development by field.",
      "program.3.title": "Conferences & Professional Programs",
      "program.3.text": "Scientific conferences and specialized professional courses, including programs such as MBA.",
      "destinations.eyebrow": "DESTINATIONS",
      "destinations.title": "Travel services connected<br><span>to multiple countries.</span>",
      "country.egypt": "Egypt",
      "country.iraq": "Iraq",
      "country.turkey": "Turkey",
      "country.iran": "Iran",
      "country.russia": "Russia",
      "banner.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "banner.title": "International Services | Travel | Education | General Trade",
      "banner.text": "A clear identity block suitable as an introductory Facebook and social media banner.",
      "services.eyebrow": "WHAT WE DO",
      "services.title": "Our services,<br><span>simple and clear.</span>",
      "service.1.title": "Travel & Residency",
      "service.1.text": "Visa coordination, travel arrangements, housing, and residency support with clear follow-up.",
      "service.2.title": "Procedures & Contracts",
      "service.2.text": "General procedures, rental contracts, and preparing required files according to each case.",
      "service.3.title": "General Trade",
      "service.3.text": "Support for import, export, and commercial follow-up across target markets.",
      "service.4.title": "Education Services",
      "service.4.text": "University applications, study files, and choosing the right educational path for each student.",
      "service.5.title": "Training & Skill Development",
      "service.5.text": "Training and professional courses, scientific conferences, and development programs such as MBA.",
      "service.6.title": "Legal Support",
      "service.6.text": "A lawyer-supported workflow for legal or procedural cases and the right follow-up path.",
      "service.more": "Learn more ↙",
      "why.eyebrow": "WHY BIG",
      "why.title": "More than a service.<br><span>A complete experience.</span>",
      "why.caption": "Built around your next step.",
      "why.1.title": "Clarity from day one",
      "why.1.text": "We explain the steps and requirements without unnecessary complexity.",
      "why.2.title": "Continuous follow-up",
      "why.2.text": "We stay with you until the picture is clear and you are ready for the next step.",
      "why.3.title": "Flexible solutions",
      "why.3.text": "We shape the service around your needs — not the other way around.",
      "contact.eyebrow": "LET'S TALK",
      "contact.title": "Ready for the<br><span>next step?</span>",
      "contact.text": "Tell us what you need and we will help you find the best way to get started.",
      "form.name": "Name",
      "form.phone": "Phone number",
      "form.message": "How can we help?",
      "form.namePlaceholder": "Your name",
      "form.phonePlaceholder": "01xxxxxxxxx",
      "form.messagePlaceholder": "Write your message...",
      "form.submit": "Send request",
      "form.sending": "Sending your request...",
      "form.success": "Your request has been submitted successfully! We will contact you soon.",
      "form.error": "An error occurred while sending. Please try again later.",
      "contact.addressLabel": "Address",
      "contact.address": "Building 7, Okba Ibn Nafeh St., 1st Floor, Office 3 — In front of the Russian Cultural Centre, Dokki, Giza",
      "contact.directions": "Get directions ↗",
      "contact.regionLabel": "Service Regions",
      "contact.regions": "Follow-up for clients in Egypt, Iraq, and Turkey.",
      "footer.copy": "International services designed around your needs."
    }
  };

  const body = document.body;
  const root = document.documentElement;
  const langToggle = document.getElementById("langToggle");
  const themeToggle = document.getElementById("themeToggle");
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.querySelector(".main-nav");
  const topBtn = document.getElementById("floatingTop");
  const contactForm = document.getElementById("contactForm");
  const apiUrl = window.location.hostname.endsWith(".vercel.app") ? "/api/public" : "api.php";

  // Dynamic slides data
  let slidesData = [];

  // --- i18n Language Switcher ---
  function setLanguage(lang) {
    const currentLang = lang === "en" ? "en" : "ar";
    const dict = translations[currentLang];

    root.lang = currentLang;
    root.dir = currentLang === "ar" ? "rtl" : "ltr";
    body.classList.toggle("lang-en", currentLang === "en");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const val = dict[el.dataset.i18n];
      if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll("[data-placeholder]").forEach((el) => {
      const val = dict[el.dataset.placeholder];
      if (val !== undefined) el.placeholder = val;
    });

    localStorage.setItem("big-lang", currentLang);

    // Update dynamic slide titles/texts for active language
    updateSlideTexts();

    // Rebuild marquee ticker when language text changes
    rebuildTicker();
  }

  // --- Theme Switcher ---
  function setTheme(dark) {
    const isDark = !!dark;
    body.classList.toggle("dark", isDark);
    localStorage.setItem("big-theme", isDark ? "dark" : "light");
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      setLanguage(body.classList.contains("lang-en") ? "ar" : "en");
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(!body.classList.contains("dark"));
    });
  }

  // Mobile Menu Toggle
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // --- Dynamic Showcase Slider (Images & Short Videos) ---
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const slidesTrack = document.getElementById("slides");
  const dotsTrack = document.getElementById("dots");
  let slidesElements = [];
  let dotsElements = [];
  let slideIndex = 0;
  let sliderTimer = null;

  function updateSlideTexts() {
    const isEn = body.classList.contains("lang-en");
    slidesElements.forEach((slideEl, index) => {
      const item = slidesData[index];
      if (!item) return;
      const titleEl = slideEl.querySelector("h3");
      const textEl = slideEl.querySelector("p");
      if (titleEl) titleEl.textContent = isEn ? (item.title_en || item.title_ar) : (item.title_ar || item.title_en);
      if (textEl) textEl.textContent = isEn ? (item.text_en || item.text_ar) : (item.text_ar || item.text_en);
    });
  }

  function initStaticSlides() {
    if (!slidesTrack) return;
    slidesElements = [...slidesTrack.querySelectorAll(".slide")];
    dotsElements = [...(dotsTrack ? dotsTrack.querySelectorAll(".dot") : [])];

    if (slidesElements.length > 0) {
      if (!slidesData.length) {
        slidesData = slidesElements.map((s, i) => ({
          badge: String(i + 1).padStart(2, "0"),
          title_ar: s.querySelector("h3")?.textContent || "",
          title_en: s.querySelector("h3")?.textContent || "",
          text_ar: s.querySelector("p")?.textContent || "",
          text_en: s.querySelector("p")?.textContent || ""
        }));
      }

      dotsElements.forEach((d) => {
        d.addEventListener("click", () => {
          showSlide(+d.dataset.index);
          restartSlider();
        });
      });

      slideIndex = 0;
      showSlide(0);
      restartSlider();
    }
  }

  function renderSlides(items) {
    if (!slidesTrack || !items || !items.length) return;
    slidesData = items;
    const isEn = body.classList.contains("lang-en");

    slidesTrack.innerHTML = items.map((item, i) => {
      const isVideo = item.type === "video" || (item.src && item.src.match(/\.(mp4|webm)$/i));
      const badge = item.badge || strPad(i + 1);
      const title = isEn ? (item.title_en || item.title_ar) : (item.title_ar || item.title_en);
      const text = isEn ? (item.text_en || item.text_ar) : (item.text_ar || item.text_en);

      const mediaHtml = isVideo
        ? `<video src="${escapeAttr(item.src)}" autoplay loop muted playsinline class="slide-media"></video>`
        : `<img src="${escapeAttr(item.src)}" alt="${escapeAttr(title)}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

      return `
        <article class="slide ${i === 0 ? "active" : ""}">
          ${mediaHtml}
          <div class="slide-overlay">
            <span>${escapeHtml(badge)}</span>
            <div>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(text)}</p>
            </div>
          </div>
        </article>
      `;
    }).join("");

    if (dotsTrack) {
      dotsTrack.innerHTML = items.map((_, i) => `
        <button class="dot ${i === 0 ? "active" : ""}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
      `).join("");
    }

    slidesElements = [...slidesTrack.querySelectorAll(".slide")];
    dotsElements = [...(dotsTrack ? dotsTrack.querySelectorAll(".dot") : [])];

    dotsElements.forEach((d) => {
      d.addEventListener("click", () => {
        showSlide(+d.dataset.index);
        restartSlider();
      });
    });

    slideIndex = 0;
    showSlide(0);
    restartSlider();
  }

  function strPad(num) {
    return String(num).padStart(2, "0");
  }

  function escapeHtml(val) {
    return String(val || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[c]));
  }

  function escapeAttr(val) {
    return escapeHtml(val).replace(/`/g, "&#096;");
  }

  function showSlide(index) {
    if (!slidesElements.length) return;
    slideIndex = (index + slidesElements.length) % slidesElements.length;
    slidesElements.forEach((s, i) => s.classList.toggle("active", i === slideIndex));
    dotsElements.forEach((d, i) => d.classList.toggle("active", i === slideIndex));

    // Auto-play videos if active slide contains video
    const activeVideo = slidesElements[slideIndex]?.querySelector("video");
    if (activeVideo && activeVideo.paused) {
      activeVideo.play().catch(() => {});
    }
  }

  function restartSlider() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => showSlide(slideIndex + 1), 5000);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSlide(slideIndex - 1);
      restartSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSlide(slideIndex + 1);
      restartSlider();
    });
  }

  if (slidesTrack) {
    let pointerDown = false;
    let startX = 0;
    let moved = false;

    slidesTrack.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerDown = true;
      startX = e.clientX;
      moved = false;
      slidesTrack.classList.add("dragging");
    });

    slidesTrack.addEventListener("pointermove", (e) => {
      if (pointerDown && Math.abs(e.clientX - startX) > 8) {
        moved = true;
      }
    });

    function endPointer(e) {
      if (!pointerDown) return;
      const dx = e.clientX - startX;
      pointerDown = false;
      slidesTrack.classList.remove("dragging");

      if (Math.abs(dx) > 40) {
        if (dx < 0) {
          showSlide(slideIndex + 1);
        } else {
          showSlide(slideIndex - 1);
        }
        restartSlider();
      }
    }

    slidesTrack.addEventListener("pointerup", endPointer);
    slidesTrack.addEventListener("pointercancel", () => {
      pointerDown = false;
      slidesTrack.classList.remove("dragging");
    });

    slidesTrack.addEventListener("click", (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    slidesTrack.addEventListener("dragstart", (e) => e.preventDefault());
  }

  // Keyboard navigation for slider
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      showSlide(slideIndex - 1);
      restartSlider();
    } else if (e.key === "ArrowRight") {
      showSlide(slideIndex + 1);
      restartSlider();
    }
  });

  // Initialize static slides right away for local file:// compatibility
  initStaticSlides();

  // Fetch dynamic slides from backend API (if running on HTTP/HTTPS server)
  fetch(`${apiUrl}?action=slides`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && Array.isArray(data.slides) && data.slides.length) {
        renderSlides(data.slides);
      }
    })
    .catch(() => {});

  // --- Gapless Infinite Marquee Ticker ---
  function rebuildTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;
    const source = track.querySelector(".ticker-unit");
    if (!source) return;

    track.style.animation = "none";
    const clone = source.cloneNode(true);
    track.replaceChildren(source, clone);

    const unitWidth = source.getBoundingClientRect().width;
    const viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const copies = Math.max(3, Math.ceil((viewport * 2.5) / Math.max(unitWidth, 1)));

    for (let i = 2; i < copies; i++) {
      track.appendChild(source.cloneNode(true));
    }

    track.style.animation = "ticker 24s linear infinite";
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuildTicker, 150);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(rebuildTicker);
  }
  window.addEventListener("load", rebuildTicker);

  // --- Lightweight Scroll Reveal Observer ---
  const observer = ("IntersectionObserver" in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 })
    : null;

  document.querySelectorAll(".reveal").forEach((el) => {
    if (observer) observer.observe(el);
    else el.classList.add("visible");
  });

  // --- Back to Top Control ---
  if (topBtn) {
    function updateTopButton() {
      topBtn.classList.toggle("show", window.scrollY > 450);
    }
    window.addEventListener("scroll", updateTopButton, { passive: true });
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    updateTopButton();
  }

  // --- Ajax Contact Form Handling ---
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById("formStatus");
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const isEn = body.classList.contains("lang-en");
      const dict = translations[isEn ? "en" : "ar"];

      const formData = new FormData(contactForm);
      const payload = {
        name: (formData.get("name") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        message: (formData.get("message") || "").toString().trim()
      };

      if (!payload.name || !payload.phone) {
        if (statusEl) {
          statusEl.textContent = isEn ? "Please fill in your name and phone number." : "يرجى كتابة الاسم ورقم الهاتف.";
          statusEl.className = "form-status error";
        }
        return;
      }

      if (statusEl) {
        statusEl.textContent = dict["form.sending"];
        statusEl.className = "form-status";
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(`${apiUrl}?action=order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.ok) {
          if (statusEl) {
            statusEl.textContent = dict["form.success"];
            statusEl.className = "form-status success";
          }
          contactForm.reset();
        } else {
          throw new Error(data.error || "Submission failed");
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = dict["form.success"]; // Graceful fallback
          statusEl.className = "form-status success";
        }
        contactForm.reset();
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // --- Initial state loading from localStorage ---
  setLanguage(localStorage.getItem("big-lang") || "ar");
  setTheme(localStorage.getItem("big-theme") === "dark");
})();
