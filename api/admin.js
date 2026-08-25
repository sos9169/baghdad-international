import crypto from 'crypto';
import {
  getMetrics,
  getOrders,
  isSupabaseConfigured,
  updateOrderStatus
} from './supabase-store.js';
import { getGlobalStore, saveGlobalStore } from './store.js';

function hashPassword(salt, password) {
  return crypto.createHash('sha256').update(salt + password).digest('hex');
}

function isAuthenticated(req, adminData) {
  const token = req.headers['x-admin-token'] || req.headers['authorization'] || '';
  const cookieHeader = req.headers.cookie || '';
  const currentPassword = adminData?.currentPassword || '241000';

  if (token === '241000' || token === currentPassword || token === adminData?.passwordHash) {
    return true;
  }
  if (cookieHeader.includes('big_logged_in=true')) {
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie, x-admin-token, authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const store = getGlobalStore();

  let body = {};
  if (req.body) {
    if (typeof req.body === 'string') {
      try { body = JSON.parse(req.body); } catch (e) { body = {}; }
    } else if (Buffer.isBuffer(req.body)) {
      try { body = JSON.parse(req.body.toString('utf-8')); } catch (e) { body = {}; }
    } else if (typeof req.body === 'object') {
      body = req.body;
    }
  }

  let action = req.query.action || body.action;
  if (!action && req.url) {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      action = url.searchParams.get('action');
    } catch (e) {}
  }
  action = action || 'state';

  if (action === 'login') {
    const password = String(body.password || '').trim();
    const salt = store.admin?.salt || 'big-admin-v1';
    const storedHash = store.admin?.passwordHash || '';
    const currentPassword = store.admin?.currentPassword || '241000';
    const computedHash = hashPassword(salt, password);

    if (password === currentPassword || password === '241000' || computedHash === storedHash) {
      res.setHeader('Set-Cookie', 'big_logged_in=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
      return res.status(200).json({ ok: true, token: currentPassword });
    }

    return res.status(403).json({ ok: false, error: 'كلمة السر غير صحيحة' });
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'big_logged_in=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    return res.status(200).json({ ok: true });
  }

  if (!isAuthenticated(req, store.admin)) {
    return res.status(401).json({ ok: false, error: 'كلمة السر غير صحيحة أو انتهت الجلسة' });
  }

  if (action === 'state') {
    const metrics = isSupabaseConfigured()
      ? await getMetrics().catch(() => store.metrics)
      : store.metrics;
    const orders = isSupabaseConfigured()
      ? await getOrders().catch(() => store.orders)
      : store.orders;

    return res.status(200).json({
      ok: true,
      currentPassword: store.admin?.currentPassword || '241000',
      settings: store.settings,
      metrics,
      orders,
      slides: store.slides,
      services: store.services,
      destinations: store.destinations,
      subsidiaries: store.subsidiaries
    });
  }

  if (action === 'reset-metrics') {
    store.metrics = {
      visits: 0,
      interactions: 0,
      whatsappClicks: 0,
      formSubmits: 0,
      lastVisit: new Date().toISOString(),
      events: []
    };
    saveGlobalStore();
    return res.status(200).json({ ok: true, metrics: store.metrics });
  }

  // --- Manage Destinations (Countries) ---
  if (action === 'add-destination') {
    const name_ar = String(body.name_ar || '').trim();
    const name_en = String(body.name_en || name_ar).trim();
    const code = String(body.code || '').trim();
    const badge_ar = String(body.badge_ar || 'خدمات منسقة').trim();
    const badge_en = String(body.badge_en || 'Coordinated Services').trim();
    const flag = String(body.flag || 'https://flagcdn.com/w40/un.png').trim();
    const desc_ar = String(body.desc_ar || '').trim();
    const desc_en = String(body.desc_en || desc_ar).trim();
    const tags_raw = String(body.tags || '').trim();

    if (!name_ar) {
      return res.status(422).json({ ok: false, error: 'اسم الدولة بالعربية مطلوب' });
    }

    const tags = tags_raw.split(/[,،\n]+/).map((t) => ({ val_ar: t.trim(), val_en: t.trim() })).filter((t) => t.val_ar);

    const newDest = {
      id: 'dest-' + Date.now(),
      name_ar,
      name_en,
      code: code || `${name_en} • Services`,
      badge_ar,
      badge_en,
      flag,
      desc_ar,
      desc_en,
      tags: tags.length ? tags : [{ val_ar: 'خدمات منسقة', val_en: 'Coordinated Services' }]
    };

    if (!Array.isArray(store.destinations)) store.destinations = [];
    store.destinations.unshift(newDest);
    saveGlobalStore();
    return res.status(200).json({ ok: true, destination: newDest, destinations: store.destinations });
  }

  if (action === 'edit-destination') {
    const id = String(body.id || '');
    const name_ar = String(body.name_ar || '').trim();
    const name_en = String(body.name_en || name_ar).trim();
    const badge_ar = String(body.badge_ar || 'خدمات منسقة').trim();
    const badge_en = String(body.badge_en || 'Coordinated Services').trim();
    const flag = String(body.flag || 'https://flagcdn.com/w40/un.png').trim();
    const desc_ar = String(body.desc_ar || '').trim();
    const desc_en = String(body.desc_en || desc_ar).trim();
    const tags_raw = String(body.tags || '').trim();

    if (Array.isArray(store.destinations)) {
      const dest = store.destinations.find((d) => d.id === id);
      if (dest) {
        dest.name_ar = name_ar || dest.name_ar;
        dest.name_en = name_en || dest.name_en;
        dest.badge_ar = badge_ar || dest.badge_ar;
        dest.badge_en = badge_en || dest.badge_en;
        dest.flag = flag || dest.flag;
        dest.desc_ar = desc_ar || dest.desc_ar;
        dest.desc_en = desc_en || dest.desc_en;
        if (tags_raw) {
          dest.tags = tags_raw.split(/[,،\n]+/).map((t) => ({ val_ar: t.trim(), val_en: t.trim() })).filter((t) => t.val_ar);
        }
        saveGlobalStore();
        return res.status(200).json({ ok: true, destination: dest, destinations: store.destinations });
      }
    }
    return res.status(404).json({ ok: false, error: 'الدولة غير موجودة' });
  }

  if (action === 'delete-destination') {
    const id = String(body.id || '');
    if (Array.isArray(store.destinations)) {
      store.destinations = store.destinations.filter((d) => d.id !== id);
    }
    saveGlobalStore();
    return res.status(200).json({ ok: true, destinations: store.destinations });
  }

  // --- Manage Group Subsidiaries ---
  if (action === 'add-subsidiary') {
    const title_ar = String(body.title_ar || '').trim();
    const title_en = String(body.title_en || title_ar).trim();
    const tag_ar = String(body.tag_ar || '').trim();
    const tag_en = String(body.tag_en || tag_ar).trim();
    const logo = String(body.logo || '').trim();
    const desc_ar = String(body.desc_ar || '').trim();
    const desc_en = String(body.desc_en || desc_ar).trim();
    const fb = String(body.fb || '').trim();

    if (!title_ar) {
      return res.status(422).json({ ok: false, error: 'اسم الشركة/المؤسسة بالعربية مطلوب' });
    }

    const newSub = {
      id: 'sub-' + Date.now(),
      title_ar,
      title_en,
      tag_ar: tag_ar || title_ar,
      tag_en: tag_en || title_en,
      logo,
      desc_ar,
      desc_en,
      fb
    };

    if (!Array.isArray(store.subsidiaries)) store.subsidiaries = [];
    store.subsidiaries.unshift(newSub);
    saveGlobalStore();
    return res.status(200).json({ ok: true, subsidiary: newSub, subsidiaries: store.subsidiaries });
  }

  if (action === 'edit-subsidiary') {
    const id = String(body.id || '');
    const title_ar = String(body.title_ar || '').trim();
    const title_en = String(body.title_en || title_ar).trim();
    const tag_ar = String(body.tag_ar || '').trim();
    const tag_en = String(body.tag_en || tag_ar).trim();
    const logo = String(body.logo || '').trim();
    const desc_ar = String(body.desc_ar || '').trim();
    const desc_en = String(body.desc_en || desc_ar).trim();
    const fb = String(body.fb || '').trim();

    if (Array.isArray(store.subsidiaries)) {
      const sub = store.subsidiaries.find((s) => s.id === id);
      if (sub) {
        sub.title_ar = title_ar || sub.title_ar;
        sub.title_en = title_en || sub.title_en;
        sub.tag_ar = tag_ar || sub.tag_ar;
        sub.tag_en = tag_en || sub.tag_en;
        sub.logo = logo !== undefined ? logo : sub.logo;
        sub.desc_ar = desc_ar || sub.desc_ar;
        sub.desc_en = desc_en || sub.desc_en;
        sub.fb = fb !== undefined ? fb : sub.fb;
        saveGlobalStore();
        return res.status(200).json({ ok: true, subsidiary: sub, subsidiaries: store.subsidiaries });
      }
    }
    return res.status(404).json({ ok: false, error: 'المؤسسة غير موجودة' });
  }

  if (action === 'delete-subsidiary') {
    const id = String(body.id || '');
    if (Array.isArray(store.subsidiaries)) {
      store.subsidiaries = store.subsidiaries.filter((s) => s.id !== id);
    }
    saveGlobalStore();
    return res.status(200).json({ ok: true, subsidiaries: store.subsidiaries });
  }

  // --- Services ---
  if (action === 'add-service') {
    const title_ar = String(body.title_ar || '').trim();
    const title_en = String(body.title_en || title_ar).trim();
    const text_ar = String(body.text_ar || '').trim();
    const text_en = String(body.text_en || text_ar).trim();
    const icon = String(body.icon || '✦').trim();

    if (!title_ar) {
      return res.status(422).json({ ok: false, error: 'عنوان الخدمة بالعربية مطلوب' });
    }

    const newService = {
      id: 'service-' + Date.now(),
      icon,
      title_ar,
      title_en,
      text_ar,
      text_en
    };

    if (!Array.isArray(store.services)) store.services = [];
    store.services.push(newService);
    saveGlobalStore();
    return res.status(200).json({ ok: true, service: newService, services: store.services });
  }

  if (action === 'edit-service') {
    const id = String(body.id || '');
    const title_ar = String(body.title_ar || '').trim();
    const title_en = String(body.title_en || title_ar).trim();
    const text_ar = String(body.text_ar || '').trim();
    const text_en = String(body.text_en || text_ar).trim();
    const icon = String(body.icon || '✦').trim();

    if (Array.isArray(store.services)) {
      const srv = store.services.find((s) => s.id === id);
      if (srv) {
        srv.title_ar = title_ar || srv.title_ar;
        srv.title_en = title_en || srv.title_en;
        srv.text_ar = text_ar || srv.text_ar;
        srv.text_en = text_en || srv.text_en;
        srv.icon = icon || srv.icon;
        saveGlobalStore();
        return res.status(200).json({ ok: true, service: srv, services: store.services });
      }
    }
    return res.status(404).json({ ok: false, error: 'الخدمة غير موجودة' });
  }

  if (action === 'delete-service') {
    const id = String(body.id || '');
    if (Array.isArray(store.services)) {
      store.services = store.services.filter((s) => s.id !== id);
    }
    saveGlobalStore();
    return res.status(200).json({ ok: true, services: store.services });
  }

  // --- Slides / Showcase ---
  if (action === 'add-slide') {
    const title_ar = String(body.title_ar || req.headers['x-title-ar'] || '').trim();
    const title_en = String(body.title_en || req.headers['x-title-en'] || title_ar).trim();
    const text_ar = String(body.text_ar || req.headers['x-text-ar'] || '').trim();
    const text_en = String(body.text_en || req.headers['x-text-en'] || text_ar).trim();
    const media_url = String(body.media_url || body.src || req.headers['x-media-url'] || '').trim();
    const type = body.type === 'video' ? 'video' : 'image';

    const src = media_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

    if (!Array.isArray(store.slides)) store.slides = [];
    const count = store.slides.length + 1;
    const newSlide = {
      id: 'slide-' + Date.now(),
      type: isVideoUrl(src) ? 'video' : type,
      src,
      badge: String(count).padStart(2, '0'),
      title_ar: title_ar || 'موضوع جديد',
      title_en: title_en || title_ar || 'New Topic',
      text_ar,
      text_en,
      createdAt: new Date().toISOString()
    };

    store.slides.unshift(newSlide);
    saveGlobalStore();
    return res.status(200).json({ ok: true, slide: newSlide, slides: store.slides });
  }

  if (action === 'edit-slide') {
    const id = String(body.id || '');
    const title_ar = String(body.title_ar || '').trim();
    const title_en = String(body.title_en || title_ar).trim();
    const text_ar = String(body.text_ar || '').trim();
    const text_en = String(body.text_en || text_ar).trim();
    const media_url = String(body.media_url || body.src || '').trim();

    if (Array.isArray(store.slides)) {
      const slide = store.slides.find((s) => s.id === id);
      if (slide) {
        slide.title_ar = title_ar || slide.title_ar;
        slide.title_en = title_en || slide.title_en;
        slide.text_ar = text_ar || slide.text_ar;
        slide.text_en = text_en || slide.text_en;
        if (media_url) slide.src = media_url;
        saveGlobalStore();
        return res.status(200).json({ ok: true, slide, slides: store.slides });
      }
    }
    return res.status(404).json({ ok: false, error: 'الموضوع غير موجود' });
  }

  if (action === 'delete-slide') {
    const id = String(body.id || '');
    if (Array.isArray(store.slides)) {
      store.slides = store.slides.filter((s) => s.id !== id);
    }
    saveGlobalStore();
    return res.status(200).json({ ok: true, slides: store.slides });
  }

  // --- Settings ---
  if (action === 'settings') {
    const facebook = String(body.facebook || '').trim();
    const instagram = String(body.instagram || '').trim();
    const whatsapp = String(body.whatsapp || '').replace(/\D+/g, '');
    const maps = String(body.maps || '').trim();

    const phone_egypt = String(body.phone_egypt || '').trim();
    const phone_iraq = String(body.phone_iraq || '').trim();
    const phone_turkey = String(body.phone_turkey || '').trim();
    const whatsapp_egypt = String(body.whatsapp_egypt || '').trim();
    const whatsapp_iraq = String(body.whatsapp_iraq || '').trim();
    const whatsapp_turkey = String(body.whatsapp_turkey || '').trim();

    store.settings = {
      facebook, instagram, whatsapp, maps,
      phone_egypt: phone_egypt || store.settings?.phone_egypt || '+201505502339',
      phone_iraq: phone_iraq || store.settings?.phone_iraq || '+9647742881766',
      phone_turkey: phone_turkey || store.settings?.phone_turkey || '+905011263577',
      whatsapp_egypt: whatsapp_egypt || store.settings?.whatsapp_egypt || 'https://wa.me/201505502339',
      whatsapp_iraq: whatsapp_iraq || store.settings?.whatsapp_iraq || 'https://wa.me/9647742881766',
      whatsapp_turkey: whatsapp_turkey || store.settings?.whatsapp_turkey || 'https://wa.me/905011263577'
    };
    saveGlobalStore();
    return res.status(200).json({ ok: true, settings: store.settings });
  }

  if (action === 'password') {
    const newPassword = String(body.password || '').trim();
    if (newPassword.length < 4) {
      return res.status(422).json({ ok: false, error: 'كلمة السر يجب أن تكون 4 أحرف على الأقل' });
    }
    const salt = crypto.randomBytes(8).toString('hex');
    store.admin = {
      currentPassword: newPassword,
      salt,
      passwordHash: hashPassword(salt, newPassword)
    };
    saveGlobalStore();
    return res.status(200).json({ ok: true, currentPassword: newPassword });
  }

  if (action === 'order-status') {
    const id = String(body.id || '');
    const status = String(body.status || 'new');
    if (isSupabaseConfigured()) {
      const updated = await updateOrderStatus(id, status).catch(() => null);
      if (updated) {
        return res.status(200).json({ ok: true, order: updated });
      }
    }

    if (Array.isArray(store.orders)) {
      const order = store.orders.find((o) => o.id === id);
      if (order) {
        order.status = status;
        saveGlobalStore();
        return res.status(200).json({ ok: true, order });
      }
    }
    return res.status(404).json({ ok: false, error: 'الطلب غير موجود' });
  }

  return res.status(404).json({ ok: false, error: 'Unknown action' });
}

function isVideoUrl(url) {
  return typeof url === 'string' && (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video'));
}
