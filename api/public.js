import { createOrder, isSupabaseConfigured, trackEvent } from './supabase-store.js';
import { getGlobalStore, saveGlobalStore } from './store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
  action = action || 'slides';

  if (action === 'settings') {
    return res.status(200).json({ ok: true, settings: store.settings });
  }

  if (action === 'slides') {
    return res.status(200).json({ ok: true, slides: store.slides });
  }

  if (action === 'services') {
    return res.status(200).json({ ok: true, services: store.services });
  }

  if (action === 'destinations') {
    return res.status(200).json({ ok: true, destinations: store.destinations });
  }

  if (action === 'subsidiaries') {
    return res.status(200).json({ ok: true, subsidiaries: store.subsidiaries });
  }

  if (action === 'track') {
    const type = String(body.type || 'visit');
    const page = String(body.page || '/');
    const userAgent = req.headers['user-agent'] || '';

    let device = String(body.device || '');
    if (!device) {
      if (/tablet|ipad/i.test(userAgent)) device = 'تابلت 📱';
      else if (/mobile|iphone|android/i.test(userAgent)) device = 'هاتف جوال 📱';
      else device = 'كمبيوتر 💻';
    }

    if (isSupabaseConfigured()) {
      await trackEvent(type, page, device).catch(() => null);
    }

    if (!store.metrics) {
      store.metrics = { visits: 0, interactions: 0, whatsappClicks: 0, formSubmits: 0, lastVisit: '', events: [] };
    }

    if (type === 'visit') {
      store.metrics.visits = (store.metrics.visits || 0) + 1;
      store.metrics.lastVisit = new Date().toISOString();
    } else if (type === 'whatsapp') {
      store.metrics.whatsappClicks = (store.metrics.whatsappClicks || 0) + 1;
      store.metrics.interactions = (store.metrics.interactions || 0) + 1;
    } else {
      store.metrics.interactions = (store.metrics.interactions || 0) + 1;
    }

    if (!Array.isArray(store.metrics.events)) store.metrics.events = [];
    store.metrics.events.unshift({
      type,
      page,
      device,
      createdAt: body.createdAt || new Date().toISOString()
    });
    if (store.metrics.events.length > 200) {
      store.metrics.events = store.metrics.events.slice(0, 200);
    }

    saveGlobalStore();
    return res.status(200).json({ ok: true, metrics: store.metrics });
  }

  if (action === 'order') {
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();
    const page = String(body.page || '/contact');
    const userAgent = req.headers['user-agent'] || '';
    const device = body.device
      ? String(body.device)
      : (/tablet|ipad/i.test(userAgent)
        ? 'تابلت 📱'
        : (/mobile|iphone|android/i.test(userAgent) ? 'هاتف جوال 📱' : 'كمبيوتر 💻'));

    if (!name || !phone) {
      return res.status(422).json({ ok: false, error: 'الاسم ورقم الهاتف مطلوبان' });
    }

    const fallbackOrder = {
      id: 'order-' + Date.now(),
      name,
      phone,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const order = isSupabaseConfigured()
      ? await createOrder({ name, phone, message, page, device }).catch(() => fallbackOrder)
      : fallbackOrder;

    if (!Array.isArray(store.orders)) store.orders = [];
    store.orders.unshift(order);

    if (!store.metrics) {
      store.metrics = { visits: 0, interactions: 0, whatsappClicks: 0, formSubmits: 0, lastVisit: '', events: [] };
    }
    store.metrics.formSubmits = (store.metrics.formSubmits || 0) + 1;
    store.metrics.interactions = (store.metrics.interactions || 0) + 1;
    if (!Array.isArray(store.metrics.events)) store.metrics.events = [];
    store.metrics.events.unshift({
      type: 'form_submit',
      page,
      device,
      createdAt: new Date().toISOString()
    });
    if (store.metrics.events.length > 200) {
      store.metrics.events = store.metrics.events.slice(0, 200);
    }

    saveGlobalStore();
    return res.status(200).json({ ok: true, order });
  }

  return res.status(404).json({ ok: false, error: 'Unknown action' });
}
