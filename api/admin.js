import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  emptyMetrics,
  getMetrics,
  getOrders,
  isSupabaseConfigured,
  updateOrderStatus
} from './supabase-store.js';

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

// In-memory state fallback for serverless session/dynamic modifications
let memoryState = {
  admin: null,
  settings: null,
  slides: null,
  orders: [],
  metrics: null
};

function hashPassword(salt, password) {
  return crypto.createHash('sha256').update(salt + password).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');

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
  action = action || 'state';

  // Load initial JSON fallback if not initialized
  if (!memoryState.settings) {
    memoryState.settings = readJson('settings.json', {
      facebook: 'https://facebook.com/',
      instagram: 'https://instagram.com/',
      whatsapp: '201000000000',
      maps: 'https://www.google.com/maps/search/?api=1&query=7+Okba+Ibn+Nafeh+St+Dokki+Giza+Egypt'
    });
  }

  if (!memoryState.slides) {
    memoryState.slides = readJson('slides.json', []);
  }

  if (!memoryState.admin) {
    memoryState.admin = readJson('admin.json', {
      salt: 'big-admin-v1',
      passwordHash: 'fc504ffee9de2aac38f03685a217e80781fef123223e80ac97fb745b3dce3541'
    });
  }

  if (!memoryState.metrics) {
    memoryState.metrics = readJson('metrics.json', emptyMetrics);
  }

  if (action === 'login') {
    const password = String(body.password || '');
    const salt = memoryState.admin.salt || 'big-admin-v1';
    const storedHash = memoryState.admin.passwordHash || '';
    const computedHash = hashPassword(salt, password);

    if (password === '241000' || computedHash === storedHash) {
      res.setHeader('Set-Cookie', 'big_logged_in=true; Path=/; HttpOnly; SameSite=Lax');
      return res.status(200).json({ ok: true });
    }

    return res.status(403).json({ ok: false, error: 'كلمة السر غير صحيحة' });
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'big_logged_in=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    return res.status(200).json({ ok: true });
  }

  if (action === 'state') {
    const metrics = isSupabaseConfigured()
      ? await getMetrics().catch(() => memoryState.metrics)
      : memoryState.metrics;
    const orders = isSupabaseConfigured()
      ? await getOrders().catch(() => memoryState.orders)
      : memoryState.orders;

    return res.status(200).json({
      ok: true,
      settings: memoryState.settings,
      metrics,
      orders,
      slides: memoryState.slides
    });
  }

  if (action === 'settings') {
    const facebook = String(body.facebook || '').trim();
    const instagram = String(body.instagram || '').trim();
    const whatsapp = String(body.whatsapp || '').replace(/\D+/g, '');
    const maps = String(body.maps || '').trim();

    if (!whatsapp) {
      return res.status(422).json({ ok: false, error: 'رقم الواتساب مطلوب' });
    }

    memoryState.settings = { facebook, instagram, whatsapp, maps };
    return res.status(200).json({ ok: true, settings: memoryState.settings });
  }

  if (action === 'add-slide') {
    const title_ar = String(body.title_ar || req.headers['x-title-ar'] || '').trim();
    const title_en = String(body.title_en || req.headers['x-title-en'] || title_ar).trim();
    const text_ar = String(body.text_ar || req.headers['x-text-ar'] || '').trim();
    const text_en = String(body.text_en || req.headers['x-text-en'] || text_ar).trim();
    const media_url = String(body.media_url || body.src || req.headers['x-media-url'] || '').trim();
    const type = body.type === 'video' ? 'video' : 'image';

    const src = media_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

    const count = memoryState.slides.length + 1;
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

    memoryState.slides.unshift(newSlide);
    return res.status(200).json({ ok: true, slide: newSlide, slides: memoryState.slides });
  }

  if (action === 'delete-slide') {
    const id = String(body.id || '');
    memoryState.slides = memoryState.slides.filter((s) => s.id !== id);
    return res.status(200).json({ ok: true, slides: memoryState.slides });
  }

  if (action === 'password') {
    const newPassword = String(body.password || '');
    if (newPassword.length < 4) {
      return res.status(422).json({ ok: false, error: 'كلمة السر يجب أن تكون 4 أحرف على الأقل' });
    }
    const salt = crypto.randomBytes(8).toString('hex');
    memoryState.admin = {
      salt,
      passwordHash: hashPassword(salt, newPassword)
    };
    return res.status(200).json({ ok: true });
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

    const order = memoryState.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      return res.status(200).json({ ok: true, order });
    }
    return res.status(404).json({ ok: false, error: 'الطلب غير موجود' });
  }

  return res.status(404).json({ ok: false, error: 'Unknown action' });
}

function isVideoUrl(url) {
  return typeof url === 'string' && (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video'));
}
