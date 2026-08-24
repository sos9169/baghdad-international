import fs from 'fs';
import path from 'path';
import { createOrder, isSupabaseConfigured, trackEvent } from './supabase-store.js';

const dataDir = path.join(process.cwd(), 'data');

function readJson(filename, fallback) {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function writeJson(filename, data) {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse Body safely
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

  // Extract action from query or body or URL
  let action = req.query.action || body.action;
  if (!action && req.url) {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      action = url.searchParams.get('action');
    } catch (e) {}
  }
  action = action || 'slides';

  if (action === 'settings') {
    const settings = readJson('settings.json', {
      facebook: 'https://facebook.com/',
      instagram: 'https://instagram.com/',
      whatsapp: '201000000000',
      maps: 'https://www.google.com/maps/search/?api=1&query=7+Okba+Ibn+Nafeh+St+Dokki+Giza+Egypt'
    });
    return res.status(200).json({ ok: true, settings });
  }

  if (action === 'slides') {
    const slides = readJson('slides.json', []);
    return res.status(200).json({ ok: true, slides });
  }

  if (action === 'services') {
    const services = readJson('services.json', []);
    return res.status(200).json({ ok: true, services });
  }

  if (action === 'track') {
    const type = String(body.type || 'visit');
    const page = String(body.page || '/');

    if (isSupabaseConfigured()) {
      await trackEvent(type, page).catch(() => null);
    }

    const metrics = readJson('metrics.json', { visits: 0, interactions: 0, whatsappClicks: 0, formSubmits: 0 });
    if (type === 'visit') {
      metrics.visits = (metrics.visits || 0) + 1;
    } else if (type === 'whatsapp') {
      metrics.whatsappClicks = (metrics.whatsappClicks || 0) + 1;
      metrics.interactions = (metrics.interactions || 0) + 1;
    } else {
      metrics.interactions = (metrics.interactions || 0) + 1;
    }
    writeJson('metrics.json', metrics);

    return res.status(200).json({ ok: true, metrics });
  }

  if (action === 'order') {
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();

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
      ? await createOrder({ name, phone, message }).catch(() => fallbackOrder)
      : fallbackOrder;

    const orders = readJson('orders.json', []);
    orders.unshift(order);
    writeJson('orders.json', orders);

    const metrics = readJson('metrics.json', { visits: 0, interactions: 0, whatsappClicks: 0, formSubmits: 0 });
    metrics.formSubmits = (metrics.formSubmits || 0) + 1;
    metrics.interactions = (metrics.interactions || 0) + 1;
    writeJson('metrics.json', metrics);

    return res.status(200).json({ ok: true, order });
  }

  return res.status(404).json({ ok: false, error: 'Unknown action' });
}
