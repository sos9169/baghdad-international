(() => {
  "use strict";

  const apiUrl = window.location.hostname.endsWith(".vercel.app") ? "/api/public" : "api.php";

  const body = document.body;
  const nav = document.getElementById("mainNav") || document.querySelector(".main-nav");
  const menuBtn = document.getElementById("menuBtn");
  const themeToggle = document.getElementById("themeToggle");
  const langToggle = document.getElementById("langToggle");
  const topBtn = document.getElementById("floatingTop");
  const contactForm = document.getElementById("contactForm");

  // Dynamic state stores
  let slidesData = [];
  let servicesData = [];
  let destinationsData = [];
  let subsidiariesData = [];

  const translations = {
    ar: {
      "nav.home": "الرئيسية",
      "nav.about": "عن المجموعة",
      "nav.subsidiaries": "شركات المجموعة",
      "nav.services": "خدماتنا",
      "nav.education": "التعليم والتدريب",
      "nav.destinations": "الدول والوجهات",
      "nav.why": "لماذا بغداد الدولية",
      "nav.contact": "تواصل معنا",
      "hero.eyebrow": "مجموعة بغداد الدولية | BAGHDAD INTERNATIONAL GROUP",
      "hero.title": "نفتح لك الأفق<br><span>نحو فرص أوسع</span>",
      "hero.text": "خدمات متكاملة في التعليم، السفر، والخدمات الدولية — بخبرة واحترافية تضمن لك الراحة والمتابعة الدقيقة من أول استشارة حتى إتمام خطواتك.",
      "hero.primary": "استكشف خدماتنا <span>↙</span>",
      "hero.secondary": "تواصل معنا مباشرة",
      "hero.stat1": "حلول خيارات متكاملة",
      "hero.stat2": "خدمة واحترافية دقيقة",
      "hero.stat3": "متابعة مستمرة ومتواصلة",
      "hero.cardLabel": "خطوتك القادمة تبدأ هنا",
      "hero.cardTitle": "نرتّب التفاصيل<br>لتنطلق بثقة",
      "hero.cardText": "تعليم • سفر • خدمات دولية",
      "hero.chip1": "متابعة موثوقة",
      "hero.chip2": "تغطية دولية",
      "ticker.1": "خدمات التعليم",
      "ticker.2": "السفر والتنقل",
      "ticker.3": "التجارة العامة",
      "ticker.4": "التدريب والتطوير",
      "ticker.5": "الإسناد الإجرائي",
      "ticker.6": "الذكاء الاصطناعي والبرمجيات",
      "trust.1.title": "شراكات دولية",
      "trust.1.text": "جامعات ومؤسسات معتمدة",
      "trust.2.title": "دعم وإسناد إجرائي",
      "trust.2.text": "فريق قانوني ومستشارون",
      "trust.3.title": "ترخيص ومقرات رسمية",
      "trust.3.text": "سجل تجاري ومقر موثق",
      "trust.4.title": "<bdi dir=\"ltr\">+9</bdi> سنوات خبرة",
      "trust.4.text": "في تقديم الخدمات الدولية",
      "subsidiaries.eyebrow": "BIG GROUP SUBSIDIARIES",
      "subsidiaries.title": "مؤسسات وشركات<br><span>المجموعة</span>",
      "subsidiaries.note": "منظومة متكاملة من الأكاديميات والشركات المتخصصة لدعم الطلاب والأفراد في التعليم والسفر والتجارة الدولية.",
      "about.eyebrow": "ABOUT US",
      "about.title": "خبرة تحوّل التفاصيل<br><span>إلى نتائج</span>",
      "about.lead": "مجموعة بغداد الدولية هي بوابتك للخدمات الدولية المصممة للأفراد، العائلات، والطلاب والأعمال.",
      "about.text": "نساعدك في ترتيب خطواتك، فهم الإجراءات، واختيار الحل المناسب — بوضوح، سرعة، واحترافية مع فرق دعم متخصصة بين المقر الرئيسي في بغداد ومقر القاهرة.",
      "about.signature": "مجموعة بغداد الدولية",
      "about.years": "<bdi dir=\"ltr\">+9</bdi>",
      "about.yearsLabel": "سنوات من الخبرة في السوق",
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
      "education.note": "ننسق خدمات الدراسة، التعليم المدرسي (ابتدائي، إعدادي، ثانوي)، القبولات الجامعية، والدورات التدريبية المتخصصة في كافة المجالات.",
      "program.1.title": "الدراسة والقبولات الجامعية",
      "program.1.text": "يشمل التعليم المدرسي للمراحل (ابتدائي، إعدادي، ثانوي)، بالإضافة إلى القبولات الجامعية.",
      "program.2.title": "الدورات والبرامج التدريبية",
      "program.2.text": "برامج تدريبية متخصصة ومتقدمة لتطوير المهارات العملية والمهنية في كافة المجالات.",
      "program.3.title": "المؤتمرات وبرامج الـ MBA",
      "program.3.text": "المؤتمرات العلمية والدورات التخصصية الاحترافية وتشمل برامج الـ MBA.",
      "stats.clients": "عميل وطالب تم خدمتهم",
      "stats.partners": "جامعة وشريك دولي",
      "stats.success": "نسبة نجاح وتسهيل المعاملات",
      "stats.years": "سنوات من الخبرة المستمرة",
      "destinations.eyebrow": "DESTINATIONS & COVERAGE",
      "destinations.title": "شبكة خدماتنا الدولية<br><span>عبر أهم الوجهات</span>",
      "destinations.note": "نربط عملائنا بأحدث الفرص التعليمية، خيارات السفر والإقامة، والتسهيلات التجارية في الدول المستهدفة.",
      "dest.hq": "المقر الرئيسي",
      "dest.hub": "مقر القاهرة",
      "dest.active": "متابعة مباشرة",
      "dest.available": "خدمات منسقة",
      "dest.egypt.name": "جمهورية مصر العربية",
      "dest.egypt.code": "Egypt • Regional Hub",
      "dest.egypt.desc": "مقرنا بالقاهرة والدقي — تقديمات جامعية، والتعليم المدرسي والمدارس، عقود وسكن، وإسناد إجرائي كامل للمقيمين والوافدين.",
      "dest.iraq.name": "جمهورية العراق",
      "dest.iraq.code": "Iraq • Primary HQ",
      "dest.iraq.desc": "المقر الرئيسي في بغداد (زيونة - شارع الربيعي - بداية كوين) — المتابعة والخدمات المباشرة للطلاب والتجار.",
      "dest.turkey.name": "تركيا",
      "dest.turkey.code": "Turkey • Yalova Branch",
      "dest.turkey.desc": "فرع تركيا (Rüstem Paşa, Şahin Sk. No:13, Yalova) — قبولات جامعية ومدارس دولية وعراقية، وتنسيق تجاري وسياحي.",
      "dest.sudan.name": "جمهورية السودان",
      "dest.sudan.code": "Sudan • Al-Niel Hub",
      "dest.sudan.desc": "خدمات شركة النيل للخدمات المتكاملة — الاستيراد والتصدير، التسهيلات التجارية، والإسناد الإجرائي بين السودان ومصر والعراق.",
      "dest.iran.name": "إيران",
      "dest.iran.code": "Iran • Academic & Medical",
      "dest.iran.desc": "برامج مقاعد جامعية متخصصة، دورات تدريبية، ومتابعة المسارات التعليمية الطبية والهندسية.",
      "dest.russia.name": "روسيا الاتحادية",
      "dest.russia.code": "Russia • Medical Universities",
      "dest.russia.desc": "تنسيق القبولات الجامعية في التخصصات الطبية والهندسية، سنة تحضيرية، ومتابعة ملفات السفر.",
      "dest.tag.uni": "جامعات دولية",
      "dest.tag.school": "التعليم المدرسي والمدارس",
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
      "dest.tag.niel": "النيل للخدمات المتكاملة",
      "banner.eyebrow": "مجموعة بغداد الدولية",
      "banner.title": "خدمات دولية | سفر | تعليم | تجارة عامة",
      "services.eyebrow": "WHAT WE DO",
      "services.title": "خدماتنا، بشكل<br><span>أبسط وأوضح</span>",
      "service.1.title": "خدمات السفر والإقامة",
      "service.1.text": "تنسيق الفيزا، تذاكر السفر، ترتيبات السكن الإيجاري، والإقامة بخطوات واضحة ومتابعة مستمرة.",
      "service.3.title": "التجارة العامة والاستيراد",
      "service.3.text": "دعم خدمات الاستيراد والتصدير والمتابعة التجارية بين الأسواق المستهدفة.",
      "service.6.title": "الدعم والإسناد القانوني",
      "service.6.text": "فريق محامين متخصص للمساندة وحماية العملاء في الحالات القانونية والإجرائية.",
      "service.ai.title": "الذكاء الاصطناعي والبرمجيات",
      "service.ai.text": "تطوير البرمجيات الحديثة، الحلول التقنية الذكية، وتوفير الاستشارات البرمجية للأعمال.",
      "service.4.title": "التعليم والخدمات المدرسية",
      "service.4.text": "تنسيق القبولات الجامعية والتعليم المدرسي للمراحل (ابتدائي، إعدادي، ثانوي).",
      "service.5.title": "التدريب في كافة المجالات",
      "service.5.text": "برامج تدريبية متخصصة في كل المجالات (طبي، هندسي، إداري، تقني) ومؤتمرات الـ MBA.",
      "service.more": "اعرف المزيد ↙",
      "why.eyebrow": "WHY BIG",
      "why.title": "أكثر من مجرد خدمة<br><span>تجربة متكاملة</span>",
      "why.caption": "مصممة حول خطوتك القادمة.",
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
      "modal.titlePrefix": "طلب خدمة:",
      "modal.subtext": "يمكنك تعديل الخدمة أو الدولة المختارة وملء البيانات للتواصل والمتابعة.",
      "modal.serviceLabel": "نوع الخدمة المطلوبة *",
      "modal.countryLabel": "الدولة المستهدفة *",
      "modal.fullName": "الاسم الكامل *",
      "modal.phone": "رقم الواتساب / الهاتف *",
      "modal.nationality": "الجنسية / الإقامة الحالية",
      "modal.details": "التخصص أو التفاصيل المطلوبة",
      "modal.timeline": "الموعد المتوقع للبدء",
      "modal.notes": "ملاحظات إضافية",
      "modal.submit": "إرسال طلب الخدمة ↗",
      "modal.waDirect": "واتساب مباشر",
      "modal.namePlaceholder": "اكتب اسمك الثلاثي",
      "modal.nationalityPlaceholder": "مثال: عراقي، مقيم بمصر...",
      "modal.detailsPlaceholder": "مثال: طب بشرى، ابتدائي، تأشيرة...",
      "modal.notesPlaceholder": "أي تفاصيل أخرى ترغب في إضافتها...",
      "modal.success": "تم إرسال طلب الخدمة بنجاح! وسنتواصل معك قريباً.",
      "modal.validation": "يرجى كتابة الاسم ورقم الهاتف.",
      "contact.addressLabel1": "المقر الرئيسي (بغداد - العراق) ⭐",
      "contact.address1": "بغداد — زيونة — شارع الربيعي — بداية كوين",
      "contact.addressLabel2": "مقر القاهرة (مصر)",
      "contact.address2": "عمارة رقم ٧، شارع عقبة بن نافع، الدور الأول، مكتب رقم ٣ — أمام البيت الثقافي الروسي، الدقي، الجيزة",
      "contact.addressLabel3": "فرع تركيا (يالوفا)",
      "contact.address3": "Rüstem Paşa, Şahin Sk. No:13, 77200 Yalova Merkez/Yalova, تركيا",
      "contact.directions": "احصل على الاتجاهات ↗",
      "contact.numbersTitle": "أرقام التواصل والواتساب المباشرة حسب الدولة",
      "contact.iraqBranch": "🇮🇶 المقر الرئيسي (بغداد — العراق)",
      "contact.iraqSub": "أرقام الإدارة والخدمات بالعراق",
      "contact.cairoBranch": "🇪🇬 مقر القاهرة (مصر)",
      "contact.cairoSub": "خدمات الطلاب والسفر بمصر",
      "contact.academyBranch": "🎓 فرع أكاديمية بغداد وشركة الليل",
      "contact.academySub": "الخدمات الأكاديمية والتنفيذية",
      "contact.turkeyBranch": "🇹🇷 فرع تركيا (يلوى واسطنبول — بلاتفورم والمدارس)",
      "contact.turkeySub": "الخدمات والمدارس بتركيا",
      "ticker.eyebrow": "GROUP SUBSIDIARIES & BRAND LOGOS",
      "ticker.title": "المؤسسات والشركات المعتمدة في مجموعة بغداد الدولية",
      "brand.title": "مجموعة بغداد الدولية",
      "brand.sub": "BAGHDAD INTERNATIONAL GROUP"
    },
    en: {
      "brand.title": "Baghdad International",
      "brand.sub": "GROUP",
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
      "dest.egypt.desc": "Our office in Cairo & Dokki — University admissions, school education & K-12 schooling, contracts & housing, and full legal support.",
      "dest.iraq.name": "Republic of Iraq",
      "dest.iraq.code": "Iraq • Primary HQ",
      "dest.iraq.desc": "Main HQ in Baghdad (Zeyouna - Al Rubaie St - Beginning of Queen) — Direct services for students and traders.",
      "dest.turkey.name": "Turkey",
      "dest.turkey.code": "Turkey • Yalova Branch",
      "dest.turkey.desc": "Turkey Branch (Rüstem Paşa, Şahin Sk. No:13, Yalova) — University & school admissions in Istanbul & Yalova, commercial coordination and travel.",
      "dest.sudan.name": "Republic of Sudan",
      "dest.sudan.code": "Sudan • Al-Niel Hub",
      "dest.sudan.desc": "Al-Niel Integrated Services — Import & export, trade facilities, and procedural support across Sudan, Egypt, and Iraq.",
      "dest.iran.name": "Iran",
      "dest.iran.code": "Iran • Academic & Medical",
      "dest.iran.desc": "Specialized academic placements, professional training programs, and medical/engineering path follow-ups.",
      "dest.russia.name": "Russian Federation",
      "dest.russia.code": "Russia • Medical Universities",
      "dest.russia.desc": "Coordinating university admissions in medical and engineering fields, preparatory year, and travel processing.",
      "dest.tag.uni": "International Universities",
      "dest.tag.school": "School Education & K-12",
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
      "dest.tag.niel": "Al-Niel Integrated Services",
      "banner.eyebrow": "BAGHDAD INTERNATIONAL GROUP",
      "banner.title": "International Services | Travel | Education | General Trade",
      "services.eyebrow": "WHAT WE DO",
      "services.title": "Our services,<br><span>simple and clear</span>",
      "service.1.title": "Travel & Residency Services",
      "service.1.text": "Visa coordination, flight tickets, rental housing arrangements, and residency with clear steps and continuous follow-up.",
      "service.3.title": "General Trade & Import",
      "service.3.text": "Import/export services and commercial follow-up between target markets.",
      "service.6.title": "Legal Support & Advocacy",
      "service.6.text": "A specialized legal team to support and protect clients in legal and procedural cases.",
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
      "modal.titlePrefix": "Service request:",
      "modal.subtext": "You can adjust the service or country and fill in your details for follow-up.",
      "modal.serviceLabel": "Required service type *",
      "modal.countryLabel": "Target country *",
      "modal.fullName": "Full name *",
      "modal.phone": "WhatsApp / phone number *",
      "modal.nationality": "Nationality / current residency",
      "modal.details": "Specialization or required details",
      "modal.timeline": "Expected start date",
      "modal.notes": "Additional notes",
      "modal.submit": "Send service request ↗",
      "modal.waDirect": "Direct WhatsApp",
      "modal.namePlaceholder": "Your full name",
      "modal.nationalityPlaceholder": "e.g. Iraqi, resident in Egypt...",
      "modal.detailsPlaceholder": "e.g. Medicine, primary school, visa...",
      "modal.notesPlaceholder": "Any other details you would like to add...",
      "modal.success": "Your service request was sent successfully! We will contact you soon.",
      "modal.validation": "Please enter your name and phone number.",
      "contact.addressLabel1": "Main HQ (Baghdad - Iraq) ⭐",
      "contact.address1": "Baghdad — Zeyouna — Al Rubaie St — Beginning of Queen",
      "contact.addressLabel2": "Cairo Office (Egypt)",
      "contact.address2": "Building 7, Okba Ibn Nafeh St., 1st Floor, Office 3 — In front of the Russian Cultural Centre, Dokki, Giza",
      "contact.addressLabel3": "Turkey Branch (Yalova)",
      "contact.address3": "Rüstem Paşa, Şahin Sk. No:13, 77200 Yalova Merkez/Yalova, Turkey",
      "contact.directions": "Get directions ↗",
      "contact.numbersTitle": "Direct Contact & WhatsApp Numbers by Country",
      "contact.iraqBranch": "🇮🇶 Primary HQ (Baghdad — Iraq)",
      "contact.iraqSub": "Management & Services in Iraq",
      "contact.cairoBranch": "🇪🇬 Cairo Branch (Egypt)",
      "contact.cairoSub": "Student & Travel Services in Egypt",
      "contact.academyBranch": "🎓 Baghdad Academy & Al-Lail Co.",
      "contact.academySub": "Academic & Executive Services",
      "contact.turkeyBranch": "🇹🇷 Turkey Branch (Yalova & Istanbul)",
      "contact.turkeySub": "Services & Schools in Turkey",
      "ticker.eyebrow": "GROUP SUBSIDIARIES & BRAND LOGOS",
      "ticker.title": "Approved Subsidiaries & Companies in Baghdad International Group"
    }
  };

  // --- Saved Theme & Language Load ---
  const savedTheme = localStorage.getItem("big-theme");
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    body.classList.add("dark");
  }

  const savedLang = localStorage.getItem("big-lang");
  if (savedLang === "en") {
    body.classList.remove("lang-ar");
    body.classList.add("lang-en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  } else {
    body.classList.remove("lang-en");
    body.classList.add("lang-ar");
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }

  function updatePageLanguage() {
    const isEn = body.classList.contains("lang-en");
    const dict = translations[isEn ? "en" : "ar"];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-placeholder");
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  function setLanguage(lang) {
    const isEn = lang === "en";
    body.classList.toggle("lang-en", isEn);
    body.classList.toggle("lang-ar", !isEn);
    document.documentElement.lang = isEn ? "en" : "ar";
    document.documentElement.dir = isEn ? "ltr" : "rtl";

    updatePageLanguage();
    localStorage.setItem("big-lang", isEn ? "en" : "ar");

    updateSlideTexts();
    if (servicesData.length) renderServices(servicesData);
    if (subsidiariesData.length) {
      renderSubsidiaries(subsidiariesData);
      renderCompaniesTicker(subsidiariesData);
    }
    if (destinationsData.length) {
      renderDestinations(destinationsData);
    }
    updateModalLanguage();
  }

  const modalServiceOptions = [
    { value: "جامعات دولية", ar: "جامعات دولية", en: "International Universities" },
    { value: "التعليم المدرسي (ابتدائي، إعدادي، ثانوي)", ar: "🎒 التعليم المدرسي (ابتدائي، إعدادي، ثانوي)", en: "🎒 School Education (Primary, Preparatory & Secondary)" },
    { value: "الدورات والبرامج التدريبية (كافة المجالات)", ar: "🎯 الدورات والبرامج التدريبية (كافة المجالات)", en: "🎯 Training Courses (All Fields)" },
    { value: "خدمات الذكاء الاصطناعي وتطوير البرمجيات", ar: "🤖 الذكاء الاصطناعي وتطوير البرمجيات", en: "🤖 AI & Software Development" },
    { value: "إقامة وسكن", ar: "إقامة وسكن", en: "Housing & Residency" },
    { value: "خدمات رجال أعمال", ar: "خدمات رجال أعمال", en: "Business Services" },
    { value: "متابعة طلابية", ar: "متابعة طلابية", en: "Student Support" },
    { value: "تجارة عامة", ar: "تجارة عامة", en: "General Trade" },
    { value: "تأشيرات رحلات", ar: "تأشيرات رحلات", en: "Travel Visas" },
    { value: "جامعات خاصة", ar: "جامعات خاصة", en: "Private Universities" },
    { value: "استيراد وتصدير", ar: "استيراد وتصدير", en: "Import & Export" },
    { value: "سفر ومعارض", ar: "سفر ومعارض", en: "Travel & Exhibitions" },
    { value: "طب وهندسة", ar: "طب وهندسة", en: "Medicine & Engineering" },
    { value: "منح ومقاعد", ar: "منح ومقاعد", en: "Scholarships" },
    { value: "سنة تحضيرية", ar: "سنة تحضيرية", en: "Preparatory Year" },
    { value: "جامعات حكومية", ar: "جامعات حكومية", en: "State Universities" },
    { value: "خدمة أخرى / استفسار عام", ar: "خدمة أخرى / استفسار عام", en: "Other service / general inquiry" }
  ];

  const modalCountryOptions = [
    { value: "جمهورية العراق", ar: "🇮🇶 العراق (المقر الرئيسي)", en: "🇮🇶 Iraq (Main HQ)" },
    { value: "جمهورية مصر العربية", ar: "🇪🇬 مصر", en: "🇪🇬 Egypt" },
    { value: "تركيا", ar: "🇹🇷 تركيا", en: "🇹🇷 Turkey" },
    { value: "إيران", ar: "🇮🇷 إيران", en: "🇮🇷 Iran" },
    { value: "روسيا الاتحادية", ar: "🇷🇺 روسيا", en: "🇷🇺 Russia" },
    { value: "وجهة أخرى", ar: "🌐 وجهة أخرى", en: "🌐 Other destination" }
  ];

  const modalTimelineOptions = [
    { value: "urgent", ar: "عاجل جداً (خلال أيام)", en: "Very urgent (within days)" },
    { value: "month", ar: "خلال هذا الشهر", en: "Within this month" },
    { value: "season", ar: "بداية التيرم / الموسم القادم", en: "Next term / season start" },
    { value: "inquiry", ar: "استفسار عام فقط", en: "General inquiry only" }
  ];

  const serviceModal = document.getElementById("serviceModal");
  const closeServiceModalBtn = document.getElementById("closeServiceModal");
  const serviceModalForm = document.getElementById("serviceModalForm");
  const modalServiceName = document.getElementById("modalServiceName");
  const modalServiceSelect = document.getElementById("modalServiceSelect");
  const modalCountrySelect = document.getElementById("modalCountrySelect");
  const modalWaBtn = document.getElementById("modalWaBtn");
  const modalStatus = document.getElementById("modalStatus");

  function findServiceOptionByLabel(label) {
    const text = String(label || "").trim();
    if (!text) return null;
    return modalServiceOptions.find((opt) =>
      opt.value === text || opt.ar === text || opt.en === text ||
      text.includes(opt.value) || opt.ar.includes(text) || opt.en.includes(text)
    ) || null;
  }

  function findCountryOptionByLabel(label) {
    const text = String(label || "").trim();
    if (!text) return null;
    return modalCountryOptions.find((opt) =>
      opt.value === text || opt.ar.includes(text) || opt.en.includes(text) ||
      text.includes(opt.value)
    ) || null;
  }

  function rebuildModalSelect(selectEl, options, selectedValue) {
    if (!selectEl) return;
    const isEn = body.classList.contains("lang-en");
    selectEl.innerHTML = options.map((opt) => {
      const label = isEn ? opt.en : opt.ar;
      const selected = opt.value === selectedValue ? " selected" : "";
      return `<option value="${escapeHtml(opt.value)}"${selected}>${escapeHtml(label)}</option>`;
    }).join("");
  }

  function updateModalLanguage() {
    const isEn = body.classList.contains("lang-en");
    const dict = translations[isEn ? "en" : "ar"];
    const selectedService = modalServiceSelect ? modalServiceSelect.value : "";
    const selectedCountry = modalCountrySelect ? modalCountrySelect.value : "";
    const selectedTimeline = serviceModalForm ? (serviceModalForm.querySelector('[name="timeline"]') || {}).value : "inquiry";

    rebuildModalSelect(modalServiceSelect, modalServiceOptions, selectedService);
    rebuildModalSelect(modalCountrySelect, modalCountryOptions, selectedCountry);

    const timelineSelect = serviceModalForm ? serviceModalForm.querySelector('[name="timeline"]') : null;
    if (timelineSelect) {
      timelineSelect.innerHTML = modalTimelineOptions.map((opt) => {
        const label = isEn ? opt.en : opt.ar;
        const selected = opt.value === selectedTimeline ? " selected" : "";
        return `<option value="${escapeHtml(opt.value)}"${selected}>${escapeHtml(label)}</option>`;
      }).join("");
    }

    if (modalServiceName && selectedService) {
      const match = findServiceOptionByLabel(selectedService);
      modalServiceName.textContent = match ? (isEn ? match.en : match.ar) : selectedService;
    }
  }

  function openServiceModal(serviceLabel, countryLabel) {
    const isEn = body.classList.contains("lang-en");
    const serviceOpt = findServiceOptionByLabel(serviceLabel) || modalServiceOptions[0];
    const countryOpt = findCountryOptionByLabel(countryLabel) || modalCountryOptions[0];
    const serviceValue = serviceOpt.value;
    const countryValue = countryOpt.value;
    const displayService = isEn ? serviceOpt.en : serviceOpt.ar;
    const displayCountry = isEn ? countryOpt.en : countryOpt.ar;

    if (modalServiceName) modalServiceName.textContent = displayService;
    rebuildModalSelect(modalServiceSelect, modalServiceOptions, serviceValue);
    rebuildModalSelect(modalCountrySelect, modalCountryOptions, countryValue);

    const waText = encodeURIComponent(
      isEn
        ? `Hello Baghdad International Group, I would like to inquire about (${displayService}) in (${displayCountry}).`
        : `مرحباً Baghdad International Group، أرغب في الاستفسار والتقديم على خدمة (${displayService}) الخاصة بدولة (${displayCountry}).`
    );
    if (modalWaBtn) {
      const waBase = modalWaBtn.href.split("?")[0] || "https://wa.me/9647742881766";
      modalWaBtn.href = `${waBase}?text=${waText}`;
    }

    if (modalStatus) {
      modalStatus.textContent = "";
      modalStatus.className = "form-status";
    }

    if (serviceModal) {
      serviceModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  function closeServiceModal() {
    if (serviceModal) serviceModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const tagBtn = e.target.closest(".dest-tag-btn");
    if (tagBtn) {
      e.preventDefault();
      e.stopPropagation();
      const serviceKey = tagBtn.dataset.serviceKey;
      const countryKey = tagBtn.dataset.countryKey;
      const isEn = body.classList.contains("lang-en");
      const dict = translations[isEn ? "en" : "ar"];
      const serviceLabel = tagBtn.dataset.serviceVal || (serviceKey && dict[serviceKey]) || "";
      const countryLabel = tagBtn.dataset.countryVal || (countryKey && dict[countryKey]) || "";
      openServiceModal(serviceLabel, countryLabel);
      return;
    }

    if (serviceModal && e.target === serviceModal) {
      closeServiceModal();
    }
  });

  if (closeServiceModalBtn) {
    closeServiceModalBtn.addEventListener("click", closeServiceModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && serviceModal && !serviceModal.classList.contains("hidden")) {
      closeServiceModal();
    }
  });

  if (serviceModalForm) {
    serviceModalForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isEn = body.classList.contains("lang-en");
      const dict = translations[isEn ? "en" : "ar"];
      const submitBtn = serviceModalForm.querySelector('button[type="submit"]');
      const formData = new FormData(serviceModalForm);
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const service = String(formData.get("service_name") || "").trim();
      const country = String(formData.get("country_name") || "").trim();
      const nationality = String(formData.get("nationality") || "").trim();
      const details = String(formData.get("details") || "").trim();
      const timeline = String(formData.get("timeline") || "").trim();
      const notes = String(formData.get("notes") || "").trim();

      if (!name || !phone) {
        if (modalStatus) {
          modalStatus.textContent = dict["modal.validation"];
          modalStatus.className = "form-status error";
        }
        return;
      }

      if (modalStatus) {
        modalStatus.textContent = dict["form.sending"] || "جار إرسال طلبك...";
        modalStatus.className = "form-status info";
      }
      if (submitBtn) submitBtn.disabled = true;

      const messageCombined = `[${dict["modal.titlePrefix"] || 'طلب خدمة:'} ${service} - ${country}]\nالجنسية: ${nationality || "-"}\nالتفاصيل: ${details || "-"}\nالموعد: ${timeline}\nملاحظات: ${notes || "-"}`;

      try {
        const response = await fetch(`${apiUrl}?action=order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, message: messageCombined, page: "/service-modal" })
        });
        const data = await response.json().catch(() => ({}));

        const waMessage = encodeURIComponent(
          `مرحباً مجموعة بغداد الدولية 👋\nأرغب في تقديم طلب خدمة:\n\n📌 الخدمة: ${service}\n🌐 الدولة: ${country}\n👤 الاسم: ${name}\n📱 الهاتف: ${phone}\n🎓 الجنسية/الإقامة: ${nationality || '-'}\n📝 التفاصيل: ${details || '-'}\n💬 ملاحظات: ${notes || '-'}`
        );
        const waUrl = `https://wa.me/9647742881766?text=${waMessage}`;

        if (modalStatus) {
          modalStatus.innerHTML = `<div style="margin-top:10px;padding:12px;background:rgba(37,211,102,0.12);border:1px solid rgba(37,211,102,0.4);border-radius:10px;color:#25D366;font-weight:700;"><i class="fa-solid fa-circle-check"></i> تم حفظ طلبك باللوحة وجارٍ فتح الواتساب للتواصل المباشر...<br><a href="${waUrl}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;padding:6px 14px;background:#25D366;color:#fff;border-radius:8px;text-decoration:none;font-size:12px;"><i class="fa-brands fa-whatsapp"></i> فتح الواتساب الآن ↗</a></div>`;
          modalStatus.className = "form-status success";
        }

        setTimeout(() => {
          window.open(waUrl, "_blank");
        }, 800);

        serviceModalForm.reset();
        setTimeout(closeServiceModal, 3500);
      } catch (err) {
        if (modalStatus) {
          modalStatus.textContent = err.message || dict["form.error"];
          modalStatus.className = "form-status error";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  updateModalLanguage();

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
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      nav.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove("open");
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }

  // Initial Language Sync
  updatePageLanguage();

  // --- Helper to Resolve Image / Media URLs ---
  function resolveMediaUrl(src) {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/") || src.startsWith("data:")) {
      return src;
    }
    return `/${src}`;
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

  // --- Dynamic Showcase Slider Logic ---
  let slidesTrack = document.getElementById("slides");
  let dotsContainer = document.getElementById("dots");
  let prevBtn = document.getElementById("prevSlide");
  let nextBtn = document.getElementById("nextSlide");
  let slideIndex = 0;
  let slideTimer;

  function updateSlideTexts() {
    if (slidesData.length && slidesTrack) {
      const isEn = body.classList.contains("lang-en");
      const slideArticles = slidesTrack.querySelectorAll(".slide");
      slideArticles.forEach((art, i) => {
        const slide = slidesData[i];
        if (!slide) return;
        const titleEl = art.querySelector("h3");
        const textEl = art.querySelector("p");
        if (titleEl) titleEl.textContent = isEn ? (slide.title_en || slide.title_ar) : (slide.title_ar || slide.title_en);
        if (textEl) textEl.textContent = isEn ? (slide.text_en || slide.text_ar) : (slide.text_ar || slide.text_en);
      });
    }
  }

  function showSlide(index) {
    if (!slidesTrack) return;
    const slides = slidesTrack.children;
    const dots = dotsContainer ? dotsContainer.children : [];
    if (!slides.length) return;

    slideIndex = (index + slides.length) % slides.length;

    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.toggle("active", i === slideIndex);
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === slideIndex);
    }
  }

  function startSlider() {
    stopSlider();
    slideTimer = setInterval(() => showSlide(slideIndex + 1), 6000);
  }

  function stopSlider() {
    if (slideTimer) clearInterval(slideTimer);
  }

  function restartSlider() {
    startSlider();
  }

  function renderSlides(slides) {
    if (!slidesTrack || !Array.isArray(slides) || !slides.length) return;
    slidesData = slides;
    const isEn = body.classList.contains("lang-en");

    slidesTrack.innerHTML = slides.map((slide, i) => {
      const isVideo = slide.type === "video" || (slide.src && slide.src.match(/\.(mp4|webm)$/i));
      const title = isEn ? (slide.title_en || slide.title_ar) : (slide.title_ar || slide.title_en);
      const text = isEn ? (slide.text_en || slide.text_ar) : (slide.text_ar || slide.text_en);
      const badge = slide.badge || String(i + 1).padStart(2, "0");
      const mediaSrc = resolveMediaUrl(slide.src);

      const mediaHtml = isVideo
        ? `<video src="${escapeHtml(mediaSrc)}" autoplay loop muted playsinline width="1200" height="800"></video>`
        : `<img src="${escapeHtml(mediaSrc)}" width="1200" height="800" alt="${escapeHtml(title)}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

      return `
        <article class="slide${i === 0 ? " active" : ""}">
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

    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((_, i) =>
        `<button class="dot${i === 0 ? " active" : ""}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`
      ).join("");
    }

    slideIndex = 0;
    showSlide(0);
    startSlider();
  }

  function initStaticSlides() {
    if (!slidesTrack) return;
    if (prevBtn) prevBtn.addEventListener("click", () => { showSlide(slideIndex - 1); restartSlider(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { showSlide(slideIndex + 1); restartSlider(); });

    if (dotsContainer) {
      dotsContainer.addEventListener("click", (e) => {
        const dot = e.target.closest(".dot");
        if (dot && dot.dataset.index !== undefined) {
          showSlide(parseInt(dot.dataset.index, 10));
          restartSlider();
        }
      });
    }

    startSlider();
  }

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

  // --- Dynamic Services Rendering ---
  function renderServices(services) {
    const serviceGrid = document.querySelector(".service-grid");
    if (!serviceGrid || !Array.isArray(services) || services.length < 6) return;
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

  // --- Dynamic Subsidiaries & Marquee Rendering ---
  function renderSubsidiaries(list) {
    const grid = document.querySelector(".subsidiary-grid");
    if (!grid || !Array.isArray(list) || !list.length) return;
    subsidiariesData = list;
    const isEn = body.classList.contains("lang-en");
    const fbLabel = isEn ? "Official Facebook Page" : "صفحة الفيسبوك الرسمية";

    grid.innerHTML = list.map((sub) => {
      const title = isEn ? (sub.title_en || sub.title_ar) : (sub.title_ar || sub.title_en);
      const tag = isEn ? (sub.tag_en || sub.tag_ar) : (sub.tag_ar || sub.tag_en);
      const desc = isEn ? (sub.desc_en || sub.desc_ar) : (sub.desc_ar || sub.desc_en);
      const logoSrc = sub.logo ? resolveMediaUrl(sub.logo) : "";

      const logoHtml = logoSrc
        ? `<img src="${escapeHtml(logoSrc)}" width="56" height="56" alt="${escapeHtml(title)}" class="sub-logo-img" loading="lazy">`
        : `<div class="sub-icon"><i class="fa-solid fa-briefcase"></i></div>`;

      const fbHtml = sub.fb
        ? `<a href="${escapeHtml(sub.fb)}" target="_blank" rel="noopener noreferrer" class="sub-fb-link"><i class="fa-brands fa-facebook"></i> <span>${fbLabel}</span> <span>↗</span></a>`
        : "";

      return `
        <article class="subsidiary-card reveal visible">
          <div class="sub-header">
            ${logoHtml}
            <div>
              <h3>${escapeHtml(title)}</h3>
              <span class="sub-tag">${escapeHtml(tag)}</span>
            </div>
          </div>
          <p>${escapeHtml(desc)}</p>
          ${fbHtml}
        </article>
      `;
    }).join("");
  }

  function renderCompaniesTicker(list) {
    const track = document.getElementById("companiesTickerTrack");
    if (!track || !Array.isArray(list) || !list.length) return;
    const isEn = body.classList.contains("lang-en");

    const cardsHtml = list.map((sub) => {
      const title = isEn ? (sub.title_en || sub.title_ar) : (sub.title_ar || sub.title_en);
      const tag = isEn ? (sub.tag_en || sub.tag_ar) : (sub.tag_ar || sub.tag_en);
      const logoSrc = sub.logo ? resolveMediaUrl(sub.logo) : "";
      const logoHtml = logoSrc
        ? `<img src="${escapeHtml(logoSrc)}" width="56" height="56" alt="${escapeHtml(title)}" class="ticker-logo" loading="lazy">`
        : `<div class="ticker-logo-icon" style="width:56px;height:56px;border-radius:50%;background:rgba(228,196,125,0.15);display:grid;place-items:center;color:var(--gold-light);font-size:22px;flex:none;"><i class="fa-solid fa-briefcase"></i></div>`;

      return `
        <div class="ticker-card">
          ${logoHtml}
          <div class="ticker-info">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(tag)}</span>
          </div>
        </div>
      `;
    }).join("");

    // Multiply 4 times for endless unbroken loop in both Arabic and English
    track.innerHTML = cardsHtml + cardsHtml + cardsHtml + cardsHtml;
  }

  fetch(`${apiUrl}?action=subsidiaries`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && Array.isArray(data.subsidiaries) && data.subsidiaries.length) {
        renderSubsidiaries(data.subsidiaries);
        renderCompaniesTicker(data.subsidiaries);
      }
    })
    .catch(() => {});

  // --- Dynamic Destinations Rendering ---
  function renderDestinations(list) {
    const grid = document.querySelector(".destinations-grid");
    if (!grid || !Array.isArray(list) || !list.length) return;
    destinationsData = list;
    const isEn = body.classList.contains("lang-en");

    grid.innerHTML = list.map((dest, index) => {
      const name = isEn ? (dest.name_en || dest.name_ar) : (dest.name_ar || dest.name_en);
      const badge = isEn ? (dest.badge_en || dest.badge_ar) : (dest.badge_ar || dest.badge_en);
      const desc = isEn ? (dest.desc_en || dest.desc_ar) : (dest.desc_ar || dest.desc_en);
      const code = dest.code || `${name} • Coverage`;
      const flagSrc = dest.flag ? resolveMediaUrl(dest.flag) : "https://flagcdn.com/w40/un.png";
      const isActive = index === 0 ? " active" : "";

      const tagsHtml = (Array.isArray(dest.tags) ? dest.tags : []).map((t) => {
        const tagValAr = t.val_ar || t.val_en || t;
        const tagValEn = t.val_en || t.val_ar || t;
        const tagVal = isEn ? tagValEn : tagValAr;
        return `
          <button type="button" class="dest-tag-btn"
            data-service-val="${escapeHtml(tagValAr)}"
            data-country-val="${escapeHtml(isEn ? (dest.name_en || dest.name_ar) : (dest.name_ar || dest.name_en))}">
            <span>${escapeHtml(tagVal)}</span> <span>↗</span>
          </button>
        `;
      }).join("");

      return `
        <article class="destination-card${isActive} reveal visible" data-country="${escapeHtml(dest.id || '')}">
          <div class="dest-card-header">
            <img src="${escapeHtml(flagSrc)}" width="24" height="16" alt="${escapeHtml(name)}" class="dest-flag-img">
            <div>
              <h3>${escapeHtml(name)}</h3>
              <small>${escapeHtml(code)}</small>
            </div>
            <span class="dest-badge">${escapeHtml(badge)}</span>
          </div>
          <p>${escapeHtml(desc)}</p>
          <div class="dest-tags">
            ${tagsHtml}
          </div>
        </article>
      `;
    }).join("");

    const cards = grid.querySelectorAll(".destination-card");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".dest-tag-btn")) return;
        cards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
      });
    });
  }

  fetch(`${apiUrl}?action=destinations`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && Array.isArray(data.destinations) && data.destinations.length) {
        renderDestinations(data.destinations);
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
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const payload = { name, phone, message };

      if (statusEl) {
        statusEl.textContent = dict["form.sending"] || "جار إرسال طلبك...";
        statusEl.className = "form-status info";
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(`${apiUrl}?action=order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        const waMessage = encodeURIComponent(
          `مرحباً مجموعة بغداد الدولية 👋\nلدي طلب تواصل واستفسار جديد:\n\n👤 الاسم: ${name}\n📱 رقم الهاتف: ${phone}\n💬 الرسالة: ${message || 'استفسار عام'}`
        );
        const waUrl = `https://wa.me/9647742881766?text=${waMessage}`;

        if (statusEl) {
          statusEl.innerHTML = `<div style="margin-top:12px;padding:14px;background:rgba(37,211,102,0.12);border:1px solid rgba(37,211,102,0.4);border-radius:12px;color:#25D366;font-weight:700;"><i class="fa-solid fa-circle-check"></i> تم حفظ طلبك في لوحة التحكم وجارٍ توجيهك للواتساب للتواصل المباشر...<br><a href="${waUrl}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;padding:8px 16px;background:#25D366;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;"><i class="fa-brands fa-whatsapp"></i> فتح محادثة الواتساب الآن ↗</a></div>`;
          statusEl.className = "form-status success";
        }

        setTimeout(() => {
          window.open(waUrl, "_blank");
        }, 800);

        contactForm.reset();
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = err.message || dict["form.error"];
          statusEl.className = "form-status error";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
