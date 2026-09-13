import fs from 'fs';
import path from 'path';

const tmpFile = path.join('/tmp', 'big_store.json');
const rootDataDir = path.join(process.cwd(), 'data');

const defaultDestinations = [
  {
    id: "iraq",
    name_ar: "جمهورية العراق",
    name_en: "Republic of Iraq",
    code: "Iraq • Primary HQ",
    badge_ar: "المقر الرئيسي",
    badge_en: "Main HQ",
    flag: "https://flagcdn.com/w40/iq.png",
    desc_ar: "المقر الرئيسي في بغداد (زيونة - شارع الربيعي - بداية كوين) — المتابعة والخدمات المباشرة للطلاب والتجار.",
    desc_en: "Main HQ in Baghdad (Zeyouna - Al Rubaie St - Beginning of Queen) — Direct services for students and traders.",
    tags: [
      { val_ar: "متابعة طلابية", val_en: "Student Support" },
      { val_ar: "تجارة عامة", val_en: "General Trade" },
      { val_ar: "تأشيرات رحلات", val_en: "Travel Visas" }
    ]
  },
  {
    id: "egypt",
    name_ar: "جمهورية مصر العربية",
    name_en: "Arab Republic of Egypt",
    code: "Egypt • Regional Hub",
    badge_ar: "مقر القاهرة",
    badge_en: "Cairo Hub",
    flag: "https://flagcdn.com/w40/eg.png",
    desc_ar: "مقرنا بالقاهرة والدقي — تقديمات جامعية، والتعليم المدرسي والمدارس، عقود وسكن، وإسناد إجرائي كامل للمقيمين والوافدين.",
    desc_en: "Our office in Cairo & Dokki — University admissions, school education & K-12 schooling, contracts & housing, and full legal support.",
    tags: [
      { val_ar: "جامعات دولية", val_en: "International Universities" },
      { val_ar: "التعليم المدرسي والمدارس", val_en: "School Education & K-12" },
      { val_ar: "إقامة وسكن", val_en: "Housing & Residency" },
      { val_ar: "خدمات رجال أعمال", val_en: "Business Services" }
    ]
  },
  {
    id: "turkey",
    name_ar: "تركيا",
    name_en: "Turkey",
    code: "Turkey • Yalova Branch",
    badge_ar: "فرع تركيا",
    badge_en: "Turkey Branch",
    flag: "https://flagcdn.com/w40/tr.png",
    desc_ar: "فرع تركيا (Rüstem Paşa, Şahin Sk. No:13, Yalova) — قبولات جامعية ومدارس دولية وعراقية، وتنسيق تجاري وسياحي.",
    desc_en: "Turkey Branch (Rüstem Paşa, Şahin Sk. No:13, Yalova) — University & school admissions in Istanbul & Yalova, commercial coordination and travel.",
    tags: [
      { val_ar: "جامعات خاصة", val_en: "Private Universities" },
      { val_ar: "التعليم المدرسي والمدارس", val_en: "School Education & K-12" },
      { val_ar: "استيراد وتصدير", val_en: "Import & Export" },
      { val_ar: "سفر ومعارض", val_en: "Travel & Exhibitions" }
    ]
  },
  {
    id: "sudan",
    name_ar: "جمهورية السودان",
    name_en: "Republic of Sudan",
    code: "Sudan • Al-Niel Hub",
    badge_ar: "خدمات منسقة",
    badge_en: "Coordinated Services",
    flag: "https://flagcdn.com/w40/sd.png",
    desc_ar: "خدمات شركة النيل للخدمات المتكاملة — الاستيراد والتصدير، التسهيلات التجارية، والإسناد الإجرائي بين السودان ومصر والعراق.",
    desc_en: "Al-Niel Integrated Services — Import & export, trade facilities, and procedural support across Sudan, Egypt, and Iraq.",
    tags: [
      { val_ar: "النيل للخدمات المتكاملة", val_en: "Al-Niel Integrated Services" },
      { val_ar: "تجارة عامة", val_en: "General Trade" },
      { val_ar: "رحلات وتنسيق", val_en: "Travel & Coordination" }
    ]
  },
  {
    id: "iran",
    name_ar: "إيران",
    name_en: "Iran",
    code: "Iran • Academic & Medical",
    badge_ar: "خدمات منسقة",
    badge_en: "Coordinated Services",
    flag: "https://flagcdn.com/w40/ir.png",
    desc_ar: "برامج مقاعد جامعية متخصصة، دورات تدريبية، ومتابعة المسارات التعليمية الطبية والهندسية.",
    desc_en: "Specialized academic placements, professional training programs, and medical/engineering path follow-ups.",
    tags: [
      { val_ar: "طب وهندسة", val_en: "Medicine & Engineering" },
      { val_ar: "منح ومقاعد", val_en: "Scholarships" }
    ]
  },
  {
    id: "russia",
    name_ar: "روسيا الاتحادية",
    name_en: "Russian Federation",
    code: "Russia • Medical Universities",
    badge_ar: "خدمات منسقة",
    badge_en: "Coordinated Services",
    flag: "https://flagcdn.com/w40/ru.png",
    desc_ar: "تنسيق القبولات الجامعية في التخصصات الطبية والهندسية، سنة تحضيرية، ومتابعة ملفات السفر.",
    desc_en: "Coordinating university admissions in medical and engineering fields, preparatory year, and travel processing.",
    tags: [
      { val_ar: "سنة تحضيرية", val_en: "Preparatory Year" },
      { val_ar: "جامعات حكومية", val_en: "State Universities" }
    ]
  }
];

const defaultSubsidiaries = [
  {
    id: "sub-1",
    title_ar: "بغداد انترناشونال جروب (الأكاديمية)",
    title_en: "Baghdad International Group",
    tag_ar: "فرع القاهرة — مصر (تأسست 2025)",
    tag_en: "Cairo — Egypt (Est. 2025)",
    logo: "images/logo_baghdad_academy.png",
    desc_ar: "بغداد انترناشونال جروب 🎓 — خدمات تعليمية لكافة المراحل، سفر، ذكاء اصطناعي وبرمجيات، وتجارة عامة.",
    desc_en: "Baghdad International Group 🎓 — K-12 & University admissions, travel, AI & software development, and general trade.",
    fb: "https://www.facebook.com/share/19AA5UiUaj/",
    email: "bghdadacademy22@gmail.com"
  },
  {
    id: "sub-2",
    title_ar: "مدارس يلوا كولج",
    title_en: "Yalova Koleji Schools",
    tag_ar: "تركيا (يلوى واسطنبول)",
    tag_en: "Yalova & Istanbul — Turkey",
    logo: "images/logo_yalova.jpg",
    desc_ar: "مدارس يلوا كولج للمنهج التركي — تعليم لكافة المراحل (ثانوي، إعدادي، ابتدائي) ناشونال وانترناشونال بكادر تعليمي مؤهل.",
    desc_en: "Yalova Koleji Schools for the Turkish curriculum — K-12 education with national & international tracks and expert faculty.",
    fb: "https://www.facebook.com/share/195Jt1v3p4/",
    email: "yalovakolejiar@gmail.com"
  },
  {
    id: "sub-3",
    title_ar: "مدارس قرطبة الدولية",
    title_en: "Cortoba International Schools",
    tag_ar: "فرع اسطنبول — تركيا",
    tag_en: "Istanbul — Turkey",
    logo: "images/logo_cortoba.jpg",
    desc_ar: "مدارس قرطبة الدولية في اسطنبول — تعليم مدرسي متكامل لجميع المراحل وكادر تعليمي مؤهل ومدرسين ذوي كفاءة ممتازة.",
    desc_en: "Cortoba International Schools in Istanbul — Integrated school education for all stages with qualified faculty.",
    fb: "https://www.facebook.com/share/1bwDgqMFYh/",
    email: "bghdadacademy22@gmail.com"
  },
  {
    id: "sub-4",
    title_ar: "مدارس الحضارة العراقية",
    title_en: "Al-Hadhara Iraqi Schools",
    tag_ar: "تركيا (يلوى واسطنبول)",
    tag_en: "Yalova & Istanbul — Turkey",
    logo: "images/logo_hadhara.jpg",
    desc_ar: "مدارس الحضارة العراقية بتركيا — تعليم لكافة المراحل الدراسية بتركيا بكادر تعليمي مؤهل ومدرسين ذوي كفاءة ممتازة.",
    desc_en: "Al-Hadhara Iraqi Schools in Turkey — K-12 schooling with modern facilities and expert teaching staff.",
    fb: "https://www.facebook.com/share/1EpVAXXhkH/",
    email: "alhadharaschools@gmail.com"
  },
  {
    "id": "sub-5",
    title_ar: "شركة النيل للخدمات المتكاملة",
    title_en: "Al-Niel Integrated Services",
    tag_ar: "مصر والسودان (تأسست 2026)",
    tag_en: "Sudan & Egypt (Est. 2026)",
    logo: "images/logo_niel.png",
    desc_ar: "شركة النيل للخدمات المتكاملة (تأسست 2026) — كل ما يخص التعليم لكل المراحل، السفر والتأشيرات، والخدمات العامة.",
    desc_en: "Al-Niel Integrated Services (Est. 2026) — Complete education services for all stages, travel, and commercial consulting.",
    fb: "https://www.facebook.com/share/1JPjSGbuz7/",
    email: "alnyll223@gmail.com"
  },
  {
    id: "sub-6",
    title_ar: "شركة بلاتفورم التركية & B2B",
    title_en: "Platform Turkish Company & B2B",
    tag_ar: "تركيا ومصر (تأسست 2023)",
    tag_en: "Turkey & Egypt (Est. 2023)",
    logo: "images/logo_platform.png",
    desc_ar: "شركة بلاتفورم التركية (تأسست 2023) — استيراد وتصدير وتأسيس الشركات، وممثلية منصة تركيا لار ماركت B2B بمصر.",
    desc_en: "Platform Turkish Company (Est. 2023) — Import/export, company setup, and Egypt B2B platform representation.",
    fb: "https://www.facebook.com/share/1JPjSGbuz7/",
    email: "info@platformgroup.net"
  }
];

function readJsonFile(dir, filename, fallback) {
  try {
    const filePath = path.join(dir, filename);
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
}

export function getGlobalStore() {
  if (!global.__BIG_STORE__) {
    let loadedFromTmp = null;
    try {
      if (fs.existsSync(tmpFile)) {
        loadedFromTmp = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
      }
    } catch (e) {}

    if (loadedFromTmp && loadedFromTmp.metrics) {
      global.__BIG_STORE__ = loadedFromTmp;
      if (!Array.isArray(global.__BIG_STORE__.destinations) || !global.__BIG_STORE__.destinations.length) {
        global.__BIG_STORE__.destinations = defaultDestinations;
      }
      if (!Array.isArray(global.__BIG_STORE__.subsidiaries) || !global.__BIG_STORE__.subsidiaries.length) {
        global.__BIG_STORE__.subsidiaries = defaultSubsidiaries;
      }
    } else {
      global.__BIG_STORE__ = {
        metrics: readJsonFile(rootDataDir, 'metrics.json', { visits: 0, interactions: 0, whatsappClicks: 0, formSubmits: 0, lastVisit: '', events: [] }),
        orders: readJsonFile(rootDataDir, 'orders.json', []),
        slides: readJsonFile(rootDataDir, 'slides.json', []),
        services: readJsonFile(rootDataDir, 'services.json', []),
        destinations: readJsonFile(rootDataDir, 'destinations.json', defaultDestinations),
        subsidiaries: readJsonFile(rootDataDir, 'subsidiaries.json', defaultSubsidiaries),
        settings: readJsonFile(rootDataDir, 'settings.json', {
          facebook: 'https://facebook.com/',
          instagram: 'https://instagram.com/',
          whatsapp: '9647742881766',
          maps: 'https://www.google.com/maps/search/?api=1&query=7+Okba+Ibn+Nafeh+St+Dokki+Giza+Egypt'
        }),
        admin: readJsonFile(rootDataDir, 'admin.json', {
          currentPassword: '241000',
          salt: 'big-admin-v1',
          passwordHash: 'fc504ffee9de2aac38f03685a217e80781fef123223e80ac97fb745b3dce3541'
        })
      };
    }
  }

  return global.__BIG_STORE__;
}

export function saveGlobalStore() {
  const store = getGlobalStore();

  try {
    if (fs.existsSync(rootDataDir)) {
      fs.writeFileSync(path.join(rootDataDir, 'metrics.json'), JSON.stringify(store.metrics, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'orders.json'), JSON.stringify(store.orders, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'slides.json'), JSON.stringify(store.slides, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'services.json'), JSON.stringify(store.services, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'destinations.json'), JSON.stringify(store.destinations, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'subsidiaries.json'), JSON.stringify(store.subsidiaries, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'settings.json'), JSON.stringify(store.settings, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'admin.json'), JSON.stringify(store.admin, null, 2), 'utf8');
    }
  } catch (err) {}

  try {
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {}
}
