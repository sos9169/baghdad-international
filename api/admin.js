import crypto from 'crypto';
import {
  getMetrics,
  getOrders,
  isSupabaseConfigured,
  resetMetrics,
  updateOrderStatus,
  getSiteContent,
  saveSiteContent
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

function getContentTime(content) {
  const time = Date.parse(content?.updatedAt || content?.updated_at || '');
  return Number.isNaN(time) ? 0 : time;
}

function asArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function cleanString(value) {
  return String(value || '').trim();
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie, x-admin-token, authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const store = getGlobalStore();
  const remoteContent = await getSiteContent().catch(() => null);
  if (remoteContent && getContentTime(remoteContent) >= getContentTime(store)) {
    Object.assign(store, remoteContent);
  }

  async function persistStore() {
    store.updatedAt = new Date().toISOString();
    saveGlobalStore();
    await saveSiteContent(store).catch(() => null);
  }

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
      : (Array.isArray(global.__BIG_ORDERS_CACHE__) && global.__BIG_ORDERS_CACHE__.length
          ? global.__BIG_ORDERS_CACHE__
          : store.orders);

    return res.status(200).json({
      ok: true,
      currentPassword: store.admin?.currentPassword || '241000',
      settings: store.settings,
      metrics,
      orders,
      officialEmails: store.officialEmails || [],
      slides: store.slides,
      services: store.services,
      destinations: store.destinations,
      subsidiaries: store.subsidiaries,
      updatedAt: store.updatedAt || ''
    });
  }

  if (action === 'reset-metrics') {
    if (isSupabaseConfigured()) {
      const metrics = await resetMetrics().catch(() => null);
      if (metrics) {
        store.metrics = metrics;
        store.metrics.events = [];
        saveGlobalStore();
        return res.status(200).json({ ok: true, metrics: store.metrics });
      }
    }

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
    await persistStore();
    return res.status(200).json({ ok: true, destination: newDest, destinations: store.destinations, updatedAt: store.updatedAt || '' });
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
        await persistStore();
        return res.status(200).json({ ok: true, destination: dest, destinations: store.destinations, updatedAt: store.updatedAt || '' });
      }
    }
    return res.status(404).json({ ok: false, error: 'الدولة غير موجودة' });
  }

  if (action === 'delete-destination') {
    const id = String(body.id || '');
    if (Array.isArray(store.destinations)) {
      store.destinations = store.destinations.filter((d) => d.id !== id);
    }
    await persistStore();
    return res.status(200).json({ ok: true, destinations: store.destinations, updatedAt: store.updatedAt || '' });
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

    const email = String(body.email || '').trim();
    const est_ar = String(body.est_ar || '').trim();
    const address_ar = String(body.address_ar || '').trim();
    const address_en = String(body.address_en || address_ar).trim();
    const services_ar = asArray(body.services_ar).map(cleanString).filter(Boolean);
    const services_en = asArray(body.services_en, services_ar).map(cleanString).filter(Boolean);
    const phones = asArray(body.phones).map((phone) => ({
      label_ar: cleanString(phone.label_ar || phone.label || 'رقم التواصل'),
      label_en: cleanString(phone.label_en || phone.label || 'Contact Number'),
      number: cleanString(phone.number || phone.value)
    })).filter((phone) => phone.number);

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
      fb,
      email,
      est_ar,
      address_ar,
      address_en,
      services_ar,
      services_en,
      phones
    };

    if (!Array.isArray(store.subsidiaries)) store.subsidiaries = [];
    store.subsidiaries.unshift(newSub);
    await persistStore();
    return res.status(200).json({ ok: true, subsidiary: newSub, subsidiaries: store.subsidiaries, updatedAt: store.updatedAt || '' });
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
    const email = String(body.email || '').trim();
    const est_ar = String(body.est_ar || '').trim();
    const address_ar = String(body.address_ar || '').trim();
    const address_en = String(body.address_en || address_ar).trim();
    const services_ar = asArray(body.services_ar).map(cleanString).filter(Boolean);
    const services_en = asArray(body.services_en, services_ar).map(cleanString).filter(Boolean);
    const phones = asArray(body.phones).map((phone) => ({
      label_ar: cleanString(phone.label_ar || phone.label || 'رقم التواصل'),
      label_en: cleanString(phone.label_en || phone.label || 'Contact Number'),
      number: cleanString(phone.number || phone.value)
    })).filter((phone) => phone.number);

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
        sub.fb = hasOwn(body, 'fb') ? fb : sub.fb;
        sub.email = hasOwn(body, 'email') ? email : sub.email;
        sub.est_ar = hasOwn(body, 'est_ar') ? est_ar : sub.est_ar;
        sub.address_ar = hasOwn(body, 'address_ar') ? address_ar : sub.address_ar;
        sub.address_en = hasOwn(body, 'address_en') ? address_en : sub.address_en;
        sub.services_ar = hasOwn(body, 'services_ar') ? services_ar : (Array.isArray(sub.services_ar) ? sub.services_ar : []);
        sub.services_en = hasOwn(body, 'services_en') ? services_en : (Array.isArray(sub.services_en) ? sub.services_en : sub.services_ar || []);
        sub.phones = hasOwn(body, 'phones') ? phones : (Array.isArray(sub.phones) ? sub.phones : []);
        await persistStore();
        return res.status(200).json({ ok: true, subsidiary: sub, subsidiaries: store.subsidiaries, updatedAt: store.updatedAt || '' });
      }
    }
    return res.status(404).json({ ok: false, error: 'المؤسسة غير موجودة' });
  }

  if (action === 'delete-subsidiary') {
    const id = String(body.id || '');
    if (Array.isArray(store.subsidiaries)) {
      store.subsidiaries = store.subsidiaries.filter((s) => s.id !== id);
    }
    await persistStore();
    return res.status(200).json({ ok: true, subsidiaries: store.subsidiaries, updatedAt: store.updatedAt || '' });
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
    await persistStore();
    return res.status(200).json({ ok: true, service: newService, services: store.services, updatedAt: store.updatedAt || '' });
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
        await persistStore();
        return res.status(200).json({ ok: true, service: srv, services: store.services, updatedAt: store.updatedAt || '' });
      }
    }
    return res.status(404).json({ ok: false, error: 'الخدمة غير موجودة' });
  }

  if (action === 'delete-service') {
    const id = String(body.id || '');
    if (Array.isArray(store.services)) {
      store.services = store.services.filter((s) => s.id !== id);
    }
    await persistStore();
    return res.status(200).json({ ok: true, services: store.services, updatedAt: store.updatedAt || '' });
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
    await persistStore();
    return res.status(200).json({ ok: true, slide: newSlide, slides: store.slides, updatedAt: store.updatedAt || '' });
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
        await persistStore();
        return res.status(200).json({ ok: true, slide, slides: store.slides, updatedAt: store.updatedAt || '' });
      }
    }
    return res.status(404).json({ ok: false, error: 'الموضوع غير موجود' });
  }

  if (action === 'delete-slide') {
    const id = String(body.id || '');
    if (Array.isArray(store.slides)) {
      store.slides = store.slides.filter((s) => s.id !== id);
    }
    await persistStore();
    return res.status(200).json({ ok: true, slides: store.slides, updatedAt: store.updatedAt || '' });
  }

  // --- Settings ---
  if (action === 'settings') {
    const facebook = String(hasOwn(body, 'facebook') ? body.facebook : (store.settings?.facebook || '')).trim();
    const instagram = String(hasOwn(body, 'instagram') ? body.instagram : (store.settings?.instagram || '')).trim();
    const maps = String(hasOwn(body, 'maps') ? body.maps : (store.settings?.maps || '')).trim();

    const phone_egypt = String(hasOwn(body, 'phone_egypt') ? body.phone_egypt : (store.settings?.phone_egypt || '+201507501547')).trim();
    const phone_iraq = String(hasOwn(body, 'phone_iraq') ? body.phone_iraq : (store.settings?.phone_iraq || '+9647742881766')).trim();
    const phone_turkey = String(hasOwn(body, 'phone_turkey') ? body.phone_turkey : (store.settings?.phone_turkey || '+905011263577')).trim();
    const whatsapp = String(hasOwn(body, 'whatsapp') ? body.whatsapp : (phone_iraq || store.settings?.whatsapp || '')).replace(/\D+/g, '');
    const whatsapp_egypt = String(hasOwn(body, 'whatsapp_egypt') ? body.whatsapp_egypt : `https://wa.me/${phone_egypt.replace(/\D+/g, '')}`).trim();
    const whatsapp_iraq = String(hasOwn(body, 'whatsapp_iraq') ? body.whatsapp_iraq : `https://wa.me/${phone_iraq.replace(/\D+/g, '')}`).trim();
    const whatsapp_turkey = String(hasOwn(body, 'whatsapp_turkey') ? body.whatsapp_turkey : `https://wa.me/${phone_turkey.replace(/\D+/g, '')}`).trim();
    const contact_addresses = asArray(body.contact_addresses, store.settings?.contact_addresses || []);
    const contact_channels = asArray(body.contact_channels, store.settings?.contact_channels || []);
    const contact_title_ar = String(hasOwn(body, 'contact_title_ar') ? body.contact_title_ar : (store.settings?.contact_title_ar || '')).trim();
    const contact_title_en = String(hasOwn(body, 'contact_title_en') ? body.contact_title_en : (store.settings?.contact_title_en || '')).trim();
    const contact_text_ar = String(hasOwn(body, 'contact_text_ar') ? body.contact_text_ar : (store.settings?.contact_text_ar || '')).trim();
    const contact_text_en = String(hasOwn(body, 'contact_text_en') ? body.contact_text_en : (store.settings?.contact_text_en || '')).trim();
    const footer_desc_ar = String(hasOwn(body, 'footer_desc_ar') ? body.footer_desc_ar : (store.settings?.footer_desc_ar || '')).trim();
    const footer_desc_en = String(hasOwn(body, 'footer_desc_en') ? body.footer_desc_en : (store.settings?.footer_desc_en || '')).trim();
    const footer_hours_ar = String(hasOwn(body, 'footer_hours_ar') ? body.footer_hours_ar : (store.settings?.footer_hours_ar || '')).trim();
    const footer_hours_en = String(hasOwn(body, 'footer_hours_en') ? body.footer_hours_en : (store.settings?.footer_hours_en || '')).trim();

    store.settings = {
      facebook, instagram, whatsapp, maps,
      phone_egypt,
      phone_iraq,
      phone_turkey,
      whatsapp_egypt,
      whatsapp_iraq,
      whatsapp_turkey,
      contact_title_ar,
      contact_title_en,
      contact_text_ar,
      contact_text_en,
      footer_desc_ar,
      footer_desc_en,
      footer_hours_ar,
      footer_hours_en,
      contact_addresses,
      contact_channels
    };
    await persistStore();
    return res.status(200).json({ ok: true, settings: store.settings, updatedAt: store.updatedAt || '' });
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
    await persistStore();
    return res.status(200).json({ ok: true, currentPassword: newPassword, updatedAt: store.updatedAt || '' });
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

    if (Array.isArray(global.__BIG_ORDERS_CACHE__)) {
      const o = global.__BIG_ORDERS_CACHE__.find((x) => x.id === id);
      if (o) o.status = status;
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

  if (action === 'delete-order') {
    const id = String(body.id || '');
    if (Array.isArray(global.__BIG_ORDERS_CACHE__)) {
      global.__BIG_ORDERS_CACHE__ = global.__BIG_ORDERS_CACHE__.filter((o) => o.id !== id);
    }
    if (Array.isArray(store.orders)) {
      store.orders = store.orders.filter((o) => o.id !== id);
      saveGlobalStore();
      return res.status(200).json({ ok: true, orders: store.orders });
    }
    return res.status(404).json({ ok: false, error: 'الطلب غير موجود' });
  }

  if (action === 'clear-orders') {
    global.__BIG_ORDERS_CACHE__ = [];
    store.orders = [];
    saveGlobalStore();
    return res.status(200).json({ ok: true, orders: [] });
  }

  // --- Manage Official Domain Emails ---
  if (action === 'add-official-email') {
    const email = String(body.email || '').trim().toLowerCase();
    const label_ar = String(body.label_ar || 'إيميل رسمي').trim();
    const provider = String(body.provider || 'Google Workspace').trim();

    if (!email || !email.includes('@')) {
      return res.status(422).json({ ok: false, error: 'عنوان الإيميل غير صحيح' });
    }

    const newEmailItem = {
      id: 'email-' + Date.now(),
      email,
      label_ar,
      provider
    };

    if (!Array.isArray(store.officialEmails)) store.officialEmails = [];
    store.officialEmails.push(newEmailItem);
    await persistStore();
    return res.status(200).json({ ok: true, officialEmail: newEmailItem, officialEmails: store.officialEmails, updatedAt: store.updatedAt || '' });
  }

  if (action === 'edit-official-email') {
    const id = String(body.id || '');
    const email = String(body.email || '').trim().toLowerCase();
    const label_ar = String(body.label_ar || '').trim();
    const provider = String(body.provider || '').trim();

    if (Array.isArray(store.officialEmails)) {
      const item = store.officialEmails.find((e) => e.id === id);
      if (item) {
        if (email) item.email = email;
        if (label_ar) item.label_ar = label_ar;
        if (provider) item.provider = provider;
        await persistStore();
        return res.status(200).json({ ok: true, officialEmail: item, officialEmails: store.officialEmails, updatedAt: store.updatedAt || '' });
      }
    }
    return res.status(404).json({ ok: false, error: 'الإيميل غير موجود' });
  }

  if (action === 'delete-official-email') {
    const id = String(body.id || '');
    if (Array.isArray(store.officialEmails)) {
      store.officialEmails = store.officialEmails.filter((e) => e.id !== id);
      await persistStore();
      return res.status(200).json({ ok: true, officialEmails: store.officialEmails, updatedAt: store.updatedAt || '' });
    }
    return res.status(404).json({ ok: false, error: 'الإيميل غير موجود' });
  }

  return res.status(404).json({ ok: false, error: 'Unknown action' });
}

function isVideoUrl(url) {
  return typeof url === 'string' && (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video'));
}

