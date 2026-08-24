(() => {
  "use strict";

  // Comprehensive Multi-lingual Translation Dictionary
  const translations = {
    ar: {
      "nav.home": "الرئيسية",
      "nav.about": "من نحن",
      "nav.subsidiaries": "مؤسسات المجموعة",
      "nav.services": "خدماتنا",
      "nav.education": "التعليم والتدريب",
      "nav.destinations": "الدول",
      "nav.why": "لماذا نحن",
      "nav.contact": "تواصل معنا",
      "hero.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "hero.title": "نفتح لك الطريق<br><span>إلى فرص أكبر</span>",
      "hero.text": "حلول متكاملة في التعليم والسفر والخدمات الدولية، بتجربة احترافية تبدأ من أول تواصل وحتى إنجاز التفاصيل.",
      "hero.primary": "اكتشف خدماتنا <span>↙</span>",
      "hero.secondary": "تواصل معنا",
      "hero.stat1": "حلول متكاملة",
      "hero.stat2": "خدمة احترافية",
      "hero.stat3": "دعم مستمر",
      "hero.cardLabel": "YOUR NEXT STEP",
      "hero.cardTitle": "نرتب التفاصيل<br>وأنت تبدأ الرحلة",
      "hero.cardText": "تعليم • سفر • خدمات دولية",
      "hero.chip1": "Trusted Support",
      "hero.chip2": "International",
      "ticker.1": "EDUCATION",
      "ticker.2": "TRAVEL",
      "ticker.3": "GENERAL TRADE",
      "ticker.4": "TRAINING",
      "ticker.5": "LEGAL SUPPORT",
      "ticker.6": "AI & SOFTWARE",
      "trust.1.title": "شراكات دولية",
      "trust.1.text": "جامعات ومؤسسات معتمدة",
      "trust.2.title": "إسناد إجرائي قانوني",
      "trust.2.text": "فريق محامين ومتابعة مرخصة",
      "trust.3.title": "تراخيص رسمية",
      "trust.3.text": "سجل تجاري ومقر موثق",
      "trust.4.title": "<bdi dir=\"ltr\">+9</bdi> سنوات خبرة",
      "trust.4.text": "في سوق الخدمات الدولية",
      "subsidiaries.eyebrow": "BIG GROUP SUBSIDIARIES",
      "subsidiaries.title": "مؤسسات وشركات<br><span>المجموعة التابعة</span>",
      "subsidiaries.note": "تضم Baghdad International Group منظومة متكاملة من الشركات والمؤسسات التعليمية والتجارية لتقديم أفضل دعم لعملائنا.",
      "about.eyebrow": "ABOUT US",
      "about.title": "خبرة تُحوّل<br><span>التفاصيل إلى نتائج</span>",
      "about.lead": "Baghdad International Group هي واجهة لخدمات دولية مصممة للأفراد والعائلات والطلاب وأصحاب الأعمال.",
      "about.text": "نساعدك في ترتيب الخطوات، فهم الإجراءات، واختيار الحل الأنسب لاحتياجك — بأسلوب واضح، سريع واحترافي، مع فريق دعم كامل بين المقر الرئيسي ببغداد ومصر وفريق محامين متخصص للحماية القانونية.",
      "about.signature": "Baghdad International Group",
      "about.years": "<bdi dir=\"ltr\">+9</bdi>",
      "about.yearsLabel": "سنوات خبرة في السوق",
      "showcase.eyebrow": "OUR WORLD",
      "showcase.title": "من الفكرة إلى<br><span>الخطوة التالية</span>",
      "slide.1.title": "ابدأ مستقبلك التعليمي",
      "slide.1.text": "نساعد الطلاب في الوصول إلى الخيارات التعليمية المناسبة وترتيب خطواتهم بثقة.",
      "slide.2.title": "رحلتك تبدأ من هنا",
      "slide.2.text": "خدمات ومساندة لتنظيم السفر والتنقل، مع اهتمام بالتفاصيل من البداية.",
      "slide.3.title": "حلول للأعمال والخدمات الدولية",
      "slide.3.text": "دعم عملي للأفراد والشركات في الخدمات التي تحتاج تنسيقاً ومتابعة دقيقة.",
      "education.eyebrow": "EDUCATION & TRAINING",
      "education.title": "الدراسة والتطوير<br><span>في مكان واحد</span>",
      "education.note": "ننسق خدمات الدراسة والتعليم المدرسي (ابتدائي، إعدادي، وثانوي)، والقبولات الجامعية، والدورات التدريبية المتقدمة في كافة المجالات.",
      "program.1.title": "الدراسة والقبولات الجامعية",
      "program.1.text": "التعليم المدرسي تشمل الدراسة من (ابتدائي، إعدادي، وثانوي)، والقبولات الجامعية بمختلف التخصصات.",
      "program.2.title": "الدورات والبرامج التدريبية",
      "program.2.text": "برامج تدريبية متخصصة ومتقدمة لتطوير المهارات العملية والمهنية في كافة المجالات والقطاعات.",
      "program.3.title": "مؤتمرات ودورات مهنية MBA",
      "program.3.text": "مؤتمرات علمية ودورات مهنية متخصصة، بما يشمل برامج إدارة الأعمال MBA.",
      "stats.clients": "عميل وطالب مخدوم",
      "stats.partners": "جامعة وشريك دولي",
      "stats.success": "نسبة إنجاز المعاملات",
      "stats.years": "سنوات خبرة متواصلة",
      "destinations.eyebrow": "DESTINATIONS & COVERAGE",
      "destinations.title": "شبكة خدماتنا الدولية<br><span>عبر أهم الوجهات</span>",
      "destinations.note": "نربط عملائنا بأحدث الفرص التعليمية، خيارات السفر والإقامة، والتسهيلات التجارية في الدول المستهدفة.",
      "dest.hq": "المقر الرئيسي",
      "dest.hub": "مقر القاهرة",
      "dest.active": "متابعة مباشرة",
      "dest.available": "خدمات منسقة",
      "dest.egypt.name": "جمهورية مصر العربية",
      "dest.egypt.code": "Egypt • Regional Hub",
      "dest.egypt.desc": "مقرنا بالقاهرة والدقي — تقديمات جامعية، عقود وسكن، وإسناد إجرائي كامل للمقيمين والوافدين.",
      "dest.iraq.name": "جمهورية العراق",
      "dest.iraq.code": "Iraq • Primary HQ",
      "dest.iraq.desc": "المقر الرئيسي في بغداد (زيونة - شارع الربيعي - بداية كوين) — المتابعة والخدمات المباشرة للطلاب والتجار.",
      "dest.turkey.name": "تركيا",
      "dest.turkey.code": "Turkey • Yalova Branch",
      "dest.turkey.desc": "فرع تركيا (Rüstem Paşa, Şahin Sk. No:13, Yalova) — قبولات جامعية في إسطنبول ويالوفا، وتنسيق تجاري وسياحي.",
      "dest.iran.name": "إيران",
      "dest.iran.code": "Iran • Academic & Medical",
      "dest.iran.desc": "برامج مقاعد جامعية متخصصة، دورات تدريبية، ومتابعة المسارات التعليمية الطبية والهندسية.",
      "dest.russia.name": "روسيا الاتحادية",
      "dest.russia.code": "Russia • Medical Universities",
      "dest.russia.desc": "تنسيق القبولات الجامعية في التخصصات الطبية والهندسية، سنة تحضيرية، ومتابعة ملفات السفر.",
      "dest.tag.uni": "جامعات دولية",
      "dest.tag.residency": "إقامة وسكن",
      "dest.tag.business": "خدمات رجال أعمال",
      "dest.tag.edu": "متابعة طلابية",
      "dest.tag.trade": "تجارة عامة",
      "dest.tag.travel": "تأشيرات رحلات",
      "dest.tag.import": "استيراد وتصدير",
      "dest.tag.tours": "سفر ومعارض",
      "dest.tag.medical": "طب وهندسة",
      "dest.tag.scholar": "منح ومقاعد",
      "dest.tag.prep": "سنة تحضيرية",
      "dest.tag.med": "جامعات حكومية",
      "banner.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "banner.title": "خدمات دولية | سفر | تعليم | تجارة عامة",
      "services.eyebrow": "WHAT WE DO",
      "services.title": "خدماتنا، بشكل<br><span>أبسط وأوضح</span>",
      "service.ai.title": "الذكاء الاصطناعي والبرمجيات",
      "service.ai.text": "تطوير البرمجيات الحديثة، الحلول التقنية الذكية، وتوفير الاستشارات البرمجية للأعمال.",
      "service.4.title": "الخدمات التعليمية والمدرسية",
      "service.4.text": "القبولات الجامعية والتعليم المدرسي تشمل مراحل (ابتدائي، إعدادي، وثانوي).",
      "service.5.title": "التدريب والتطوير في كافة المجالات",
      "service.5.text": "برامج تدريبية ورعايات في كافة التخصصات (طبية، هندسية، إدارية، تقنية) ومؤتمرات MBA.",
      "service.more": "اعرف المزيد ↙",
      "why.eyebrow": "WHY BIG",
      "why.title": "مش مجرد خدمة<br><span>دي تجربة كاملة</span>",
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
      "contact.addressLabel1": "المقر الرئيسي (بغداد - العراق) ⭐",
      "contact.address1": "بغداد — زيونة — شارع الربيعي — بداية كوين",
      "contact.addressLabel2": "مقر القاهرة (مصر)",
      "contact.address2": "عمارة رقم ٧، شارع عقبة بن نافع، الدور الأول، مكتب رقم ٣ — أمام البيت الثقافي الروسي، الدقي، الجيزة",
      "contact.addressLabel3": "فرع تركيا (يالوفا)",
      "contact.address3": "Rüstem Paşa, Şahin Sk. No:13, 77200 Yalova Merkez/Yalova, تركيا",
      "contact.directions": "احصل على الاتجاهات ↗"
    },
    en: {
      "nav.home": "Home",
      "nav.about": "About Us",
      "nav.subsidiaries": "Subsidiaries",
      "nav.services": "Services",
      "nav.education": "Education",
      "nav.destinations": "Countries",
      "nav.why": "Why Us",
      "nav.contact": "Contact",
      "hero.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "hero.title": "We open the way<br><span>to bigger opportunities</span>",
      "hero.text": "Integrated education, travel and international services — with a professional experience from the first conversation to the final detail.",
      "hero.primary": "Explore our services <span>↙</span>",
      "hero.secondary": "Contact us",
      "hero.stat1": "Integrated solutions",
      "hero.stat2": "Professional service",
      "hero.stat3": "Continuous support",
      "hero.cardLabel": "YOUR NEXT STEP",
      "hero.cardTitle": "We handle the details<br>You start the journey",
      "hero.cardText": "Education • Travel • International Services",
      "hero.chip1": "Trusted Support",
      "hero.chip2": "International",
      "ticker.1": "EDUCATION",
      "ticker.2": "TRAVEL",
      "ticker.3": "GENERAL TRADE",
      "ticker.4": "TRAINING",
      "ticker.5": "LEGAL SUPPORT",
      "ticker.6": "AI & SOFTWARE",
      "trust.1.title": "Global Partnerships",
      "trust.1.text": "Accredited Universities",
      "trust.2.title": "Legal Procedure Support",
      "trust.2.text": "Licensed Legal Team",
      "trust.3.title": "Official Licensing",
      "trust.3.text": "Commercial Register & HQ",
      "trust.4.title": "<bdi dir=\"ltr\">+9</bdi> Years Experience",
      "trust.4.text": "In International Services",
      "subsidiaries.eyebrow": "BIG GROUP SUBSIDIARIES",
      "subsidiaries.title": "Group Companies &<br><span>Institutions</span>",
      "subsidiaries.note": "Baghdad International Group encompasses an integrated ecosystem of educational and commercial subsidiaries to support our clients.",
      "about.eyebrow": "ABOUT US",
      "about.title": "Experience that turns<br><span>details into results</span>",
      "about.lead": "Baghdad International Group is a gateway to international services designed for individuals, families, students and businesses.",
      "about.text": "We help you organize the steps, understand the process and choose the right solution — clearly, quickly and professionally with dedicated support teams between Baghdad HQ & Cairo.",
      "about.signature": "Baghdad International Group",
      "about.years": "<bdi dir=\"ltr\">+9</bdi>",
      "about.yearsLabel": "Years of experience in the market",
      "showcase.eyebrow": "OUR WORLD",
      "showcase.title": "From the idea to<br><span>the next step</span>",
      "slide.1.title": "Start your educational future",
      "slide.1.text": "We help students find suitable education options and organize their steps with confidence.",
      "slide.2.title": "Your journey starts here",
      "slide.2.text": "Support for travel and mobility planning, with attention to details from day one.",
      "slide.3.title": "Business and international solutions",
      "slide.3.text": "Practical support for individuals and companies that need coordinated international services.",
      "education.eyebrow": "EDUCATION & TRAINING",
      "education.title": "Study & Development<br><span>in one place</span>",
      "education.note": "We coordinate study services, school education (Primary, Preparatory & Secondary), university admissions, and advanced training courses across all fields.",
      "program.1.title": "Study & University Admissions",
      "program.1.text": "School education covers Primary, Preparatory & Secondary stages, plus University admissions.",
      "program.2.title": "Training Courses & Programs",
      "program.2.text": "Specialized and advanced training programs to develop practical and professional skills across all fields.",
      "program.3.title": "Conferences & MBA Programs",
      "program.3.text": "Scientific conferences and specialized professional courses, including MBA programs.",
      "stats.clients": "Served Clients & Students",
      "stats.partners": "Universities & Global Partners",
      "stats.success": "Transaction Success Rate",
      "stats.years": "Years of Continuous Experience",
      "destinations.eyebrow": "DESTINATIONS & COVERAGE",
      "destinations.title": "Our international network<br><span>across key destinations</span>",
      "destinations.note": "We connect our clients with educational opportunities, travel and residency options, and trade facilities across target destinations.",
      "dest.hq": "Main Headquarters",
      "dest.hub": "Cairo Hub",
      "dest.active": "Direct Follow-up",
      "dest.available": "Coordinated Services",
      "dest.egypt.name": "Arab Republic of Egypt",
      "dest.egypt.code": "Egypt • Regional Hub",
      "dest.egypt.desc": "Our office in Cairo & Dokki — University admissions, contracts & housing, and full legal support for residents.",
      "dest.iraq.name": "Republic of Iraq",
      "dest.iraq.code": "Iraq • Primary HQ",
      "dest.iraq.desc": "Main HQ in Baghdad (Zeyouna - Al Rubaie St - Beginning of Queen) — Direct services for students and traders.",
      "dest.turkey.name": "Turkey",
      "dest.turkey.code": "Turkey • Yalova Branch",
      "dest.turkey.desc": "Turkey Branch (Rüstem Paşa, Şahin Sk. No:13, Yalova) — University admissions in Istanbul & Yalova, commercial coordination and travel.",
      "dest.iran.name": "Iran",
      "dest.iran.code": "Iran • Academic & Medical",
      "dest.iran.desc": "Specialized academic placements, professional training programs, and medical/engineering path follow-ups.",
      "dest.russia.name": "Russian Federation",
      "dest.russia.code": "Russia • Medical Universities",
      "dest.russia.desc": "Coordinating university admissions in medical and engineering fields, preparatory year, and travel processing.",
      "dest.tag.uni": "International Universities",
      "dest.tag.residency": "Housing & Residency",
      "dest.tag.business": "Business Services",
      "dest.tag.edu": "Student Support",
      "dest.tag.trade": "General Trade",
      "dest.tag.travel": "Travel Visas",
      "dest.tag.import": "Import & Export",
      "dest.tag.tours": "Travel & Exhibitions",
      "dest.tag.medical": "Medicine & Engineering",
      "dest.tag.scholar": "Scholarships",
      "dest.tag.prep": "Preparatory Year",
      "dest.tag.med": "State Universities",
      "banner.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "banner.title": "International Services | Travel | Education | General Trade",
      "services.eyebrow": "WHAT WE DO",
      "services.title": "Our services,<br><span>simple and clear</span>",
      "service.ai.title": "AI & Software Development",
      "service.ai.text": "Modern software development, smart AI solutions, and technology consulting for business.",
      "service.4.title": "Education & Schooling Services",
      "service.4.text": "University admissions and school education covering Primary, Preparatory & Secondary stages.",
      "service.5.title": "Training Across All Fields",
      "service.5.text": "Specialized training programs across all disciplines (Medical, Engineering, Business, Tech) and MBA conferences.",
      "service.more": "Learn more ↙",
      "why.eyebrow": "WHY BIG",
      "why.title": "More than a service<br><span>A complete experience</span>",
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
      "contact.addressLabel1": "Main HQ (Baghdad - Iraq) ⭐",
      "contact.address1": "Baghdad — Zeyouna — Al Rubaie St — Beginning of Queen",
      "contact.addressLabel2": "Cairo Office (Egypt)",
      "contact.address2": "Building 7, Okba Ibn Nafeh St., 1st Floor, Office 3 — In front of the Russian Cultural Centre, Dokki, Giza",
      "contact.addressLabel3": "Turkey Branch (Yalova)",
      "contact.address3": "Rüstem Paşa, Şahin Sk. No:13, 77200 Yalova Merkez/Yalova, Turkey",
      "contact.directions": "Get directions ↗"
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

  let slidesData = [];
  let servicesData = [];

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

    updateSlideTexts();
    if (servicesData.length) renderServices(servicesData);
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

  // --- INTERACTIVE COUNTER ANIMATION FOR STATISTICS ---
  const counters = document.querySelectorAll(".counter-num");
  let animatedStats = false;

  function runCounters() {
    if (animatedStats) return;
    animatedStats = true;
    counters.forEach((counter) => {
      const target = +counter.dataset.target || 0;
      const suffix = counter.dataset.suffix || "";
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        counter.textContent = `${count}${suffix}`;
      }, 35);
    });
  }

  const statsSection = document.querySelector(".stats-counter-section");
  if (statsSection && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounters();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  } else {
    runCounters();
  }

  // --- Interactive Destinations Country Cards & Map Node Sync ---
  const destCards = document.querySelectorAll(".destination-card");
  const mapNodes = document.querySelectorAll(".map-node");
  const routeLines = document.querySelectorAll(".route-line");

  function activateCountry(countryId) {
    destCards.forEach((c) => c.classList.toggle("active", c.dataset.country === countryId));
    mapNodes.forEach((n) => n.classList.toggle("active", n.dataset.node === countryId));
    
    routeLines.forEach((line) => {
      if (countryId === "iraq") {
        line.classList.add("active");
      } else {
        line.classList.toggle("active", line.id === `route-${countryId}`);
      }
    });
  }

  destCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".dest-tag-btn")) return;
      activateCountry(card.dataset.country);
    });
  });

  mapNodes.forEach((node) => {
    node.addEventListener("click", () => {
      activateCountry(node.dataset.node);
    });
  });

  // --- SERVICE QUICK REQUEST MODAL LOGIC WITH EDITABLE SELECTORS ---
  const serviceModal = document.getElementById("serviceModal");
  const closeServiceModalBtn = document.getElementById("closeServiceModal");
  const serviceModalForm = document.getElementById("serviceModalForm");
  const modalServiceName = document.getElementById("modalServiceName");
  const modalServiceSelect = document.getElementById("modalServiceSelect");
  const modalCountrySelect = document.getElementById("modalCountrySelect");
  const modalWaBtn = document.getElementById("modalWaBtn");
  const modalStatus = document.getElementById("modalStatus");

  function getCountryWaNumber(countryVal) {
    if (countryVal.includes("عراق") || countryVal.includes("Iraq")) return "9647742881766";
    if (countryVal.includes("تركيا") || countryVal.includes("Turkey")) return "905011263577";
    return "201505502339";
  }

  function updateModalHeaderAndWa() {
    const sVal = modalServiceSelect ? modalServiceSelect.value : "";
    const cVal = modalCountrySelect ? modalCountrySelect.value : "";

    if (modalServiceName) modalServiceName.textContent = sVal;

    const waNum = getCountryWaNumber(cVal);
    const waText = encodeURIComponent(`مرحباً Baghdad International Group، أرغب في الاستفسار والتقديم على خدمة (${sVal}) الخاصة بدولة (${cVal}).`);
    if (modalWaBtn) modalWaBtn.href = `https://wa.me/${waNum}?text=${waText}`;
  }

  if (modalServiceSelect) modalServiceSelect.addEventListener("change", updateModalHeaderAndWa);
  if (modalCountrySelect) modalCountrySelect.addEventListener("change", updateModalHeaderAndWa);

  function openModalForTag(serviceVal, countryVal) {
    const isEn = body.classList.contains("lang-en");

    if (modalServiceSelect && serviceVal) {
      let matchFound = false;
      for (let i = 0; i < modalServiceSelect.options.length; i++) {
        if (modalServiceSelect.options[i].value === serviceVal || modalServiceSelect.options[i].text.includes(serviceVal)) {
          modalServiceSelect.selectedIndex = i;
          matchFound = true;
          break;
        }
      }
      if (!matchFound) modalServiceSelect.value = serviceVal;
    }

    if (modalCountrySelect && countryVal) {
      let cMatchFound = false;
      for (let i = 0; i < modalCountrySelect.options.length; i++) {
        if (modalCountrySelect.options[i].value === countryVal || modalCountrySelect.options[i].text.includes(countryVal)) {
          modalCountrySelect.selectedIndex = i;
          cMatchFound = true;
          break;
        }
      }
      if (!cMatchFound) modalCountrySelect.value = countryVal;
    }

    updateModalHeaderAndWa();

    if (modalStatus) {
      modalStatus.textContent = "";
      modalStatus.className = "form-status";
    }

    if (serviceModal) serviceModal.classList.remove("hidden");
  }

  document.querySelectorAll(".dest-tag-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const serviceVal = btn.dataset.serviceVal || btn.textContent.replace("↗", "").trim();
      const countryVal = btn.dataset.countryVal || "";
      openModalForTag(serviceVal, countryVal);
    });
  });

  if (closeServiceModalBtn) {
    closeServiceModalBtn.addEventListener("click", () => {
      if (serviceModal) serviceModal.classList.add("hidden");
    });
  }

  if (serviceModal) {
    serviceModal.addEventListener("click", (e) => {
      if (e.target === serviceModal) {
        serviceModal.classList.add("hidden");
      }
    });
  }

  if (serviceModalForm) {
    serviceModalForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isEn = body.classList.contains("lang-en");
      const dict = translations[isEn ? "en" : "ar"];
      const submitBtn = serviceModalForm.querySelector('button[type="submit"]');

      const formData = new FormData(serviceModalForm);
      const name = (formData.get("name") || "").toString().trim();
      const phone = (formData.get("phone") || "").toString().trim();
      const service = (formData.get("service_name") || "").toString().trim();
      const country = (formData.get("country_name") || "").toString().trim();
      const nationality = (formData.get("nationality") || "").toString().trim();
      const details = (formData.get("details") || "").toString().trim();
      const timeline = (formData.get("timeline") || "").toString().trim();
      const notes = (formData.get("notes") || "").toString().trim();

      if (!name || !phone) {
        if (modalStatus) {
          modalStatus.textContent = isEn ? "Please fill in your name and phone." : "يرجى كتابة الاسم ورقم الهاتف.";
          modalStatus.className = "form-status error";
        }
        return;
      }

      if (modalStatus) {
        modalStatus.textContent = dict["form.sending"];
        modalStatus.className = "form-status";
      }
      if (submitBtn) submitBtn.disabled = true;

      const messageCombined = `[طلب خدمة خاصة: ${service} - ${country}]\nالجنسية/الإقامة: ${nationality || "غير محدد"}\nالتفاصيل المطلوبة: ${details || "-"}\nالموعد المتوقع: ${timeline}\nالملاحظات: ${notes || "-"}`;

      try {
        const response = await fetch(`${apiUrl}?action=order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, message: messageCombined })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.ok) {
          if (modalStatus) {
            modalStatus.textContent = isEn ? "Service request sent successfully! We will contact you shortly." : "تم إرسال طلب الخدمة بنجاح! وسنتواصل معك قريباً.";
            modalStatus.className = "form-status success";
          }
          serviceModalForm.reset();
          setTimeout(() => {
            if (serviceModal) serviceModal.classList.add("hidden");
          }, 2500);
        } else {
          throw new Error(data.error || "Submission failed");
        }
      } catch (err) {
        if (modalStatus) {
          modalStatus.textContent = isEn ? "Service request sent successfully! We will contact you shortly." : "تم إرسال طلب الخدمة بنجاح! وسنتواصل معك قريباً.";
          modalStatus.className = "form-status success";
        }
        serviceModalForm.reset();
        setTimeout(() => {
          if (serviceModal) serviceModal.classList.add("hidden");
        }, 2500);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
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

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (serviceModal) serviceModal.classList.add("hidden");
    }
    if (e.key === "ArrowLeft") {
      showSlide(slideIndex - 1);
      restartSlider();
    } else if (e.key === "ArrowRight") {
      showSlide(slideIndex + 1);
      restartSlider();
    }
  });

  initStaticSlides();

  // Fetch dynamic slides
  fetch(`${apiUrl}?action=slides`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && Array.isArray(data.slides) && data.slides.length) {
        renderSlides(data.slides);
      }
    })
    .catch(() => {});

  // Dynamic Services Rendering
  function renderServices(services) {
    const serviceGrid = document.querySelector(".service-grid");
    if (!serviceGrid || !Array.isArray(services) || !services.length) return;
    servicesData = services;
    const isEn = body.classList.contains("lang-en");
    const moreText = isEn ? "Learn more ↙" : "اعرف المزيد ↙";

    serviceGrid.innerHTML = services.map((srv) => {
      const title = isEn ? (srv.title_en || srv.title_ar) : (srv.title_ar || srv.title_en);
      const text = isEn ? (srv.text_en || srv.text_ar) : (srv.text_ar || srv.text_en);
      const icon = srv.icon || "✦";

      return `
        <article class="service-card reveal visible">
          <div class="service-icon">${escapeHtml(icon)}</div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(text)}</p>
          <a href="#contact">${moreText}</a>
        </article>
      `;
    }).join("");
  }

  fetch(`${apiUrl}?action=services`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && Array.isArray(data.services) && data.services.length) {
        renderServices(data.services);
      }
    })
    .catch(() => {});

  // Track page visit & clicks
  fetch(`${apiUrl}?action=track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "visit", page: window.location.pathname })
  }).catch(() => {});

  const waBtn = document.querySelector(".floating-whatsapp");
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      fetch(`${apiUrl}?action=track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "whatsapp", page: window.location.pathname })
      }).catch(() => {});
    });
  }

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
          statusEl.textContent = dict["form.success"];
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
