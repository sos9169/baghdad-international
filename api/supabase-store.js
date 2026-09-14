const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

const UPSTASH_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || 'https://probable-rooster-99529.upstash.io').replace(/\/+$/, '');
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAYTJAAIncDJhZmQ3MmQzMTkzMGM0NzVmODM4MTE3ZGNkMWVjNWI1OHAyOTk1Mjk';
const UPSTASH_KEY = 'baghdad_site_content_v1';

export const emptyMetrics = {
  visits: 0,
  interactions: 0,
  whatsappClicks: 0,
  formSubmits: 0,
  lastVisit: '',
  events: []
};

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

async function supabaseRequest(path, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || response.statusText);
  }

  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

function toMetrics(row) {
  if (!row) return { ...emptyMetrics };
  return {
    visits: Number(row.visits || 0),
    interactions: Number(row.interactions || 0),
    whatsappClicks: Number(row.whatsapp_clicks || 0),
    formSubmits: Number(row.form_submits || 0),
    lastVisit: row.last_visit || '',
    events: []
  };
}

function toOrder(row) {
  return {
    id: row.id,
    name: row.name || '',
    phone: row.phone || '',
    message: row.message || '',
    status: row.status || 'new',
    createdAt: row.created_at || ''
  };
}

function toEvent(row) {
  return {
    type: row.event_type || row.type || 'interaction',
    page: row.page || '/',
    device: row.device || '',
    createdAt: row.created_at || row.createdAt || ''
  };
}

const siteContentKeys = [
  'slides',
  'services',
  'destinations',
  'subsidiaries',
  'officialEmails',
  'settings',
  'admin'
];

function pickSiteContent(store = {}) {
  return siteContentKeys.reduce((content, key) => {
    if (store[key] !== undefined) content[key] = store[key];
    return content;
  }, {});
}

export async function getSiteContent() {
  // 1. Try Upstash Redis Cloud Persistence
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${UPSTASH_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        if (parsed && typeof parsed === 'object') return parsed;
      }
    }
  } catch (err) {}

  // 2. Try Supabase site_content_store
  try {
    const rows = await supabaseRequest('site_content_store?id=eq.main&select=content');
    const row = Array.isArray(rows) ? rows[0] : null;
    if (row && row.content && typeof row.content === 'object') {
      return row.content;
    }
  } catch (err) {}

  // 3. Try Supabase site_orders fallback
  try {
    const rows = await supabaseRequest('site_orders?id=eq.__SITE_CONTENT_STORE__&select=message');
    const row = Array.isArray(rows) ? rows[0] : null;
    if (row && row.message) {
      const parsed = JSON.parse(row.message);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (err) {}

  return null;
}

export async function saveSiteContent(store) {
  const content = pickSiteContent(store);
  const updatedAt = new Date().toISOString();
  const jsonStr = JSON.stringify(content);

  // 1. Save to Upstash Redis Cloud Database
  try {
    await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', UPSTASH_KEY, jsonStr])
    });
  } catch (err) {}

  // 2. Save to Supabase
  try {
    const patched = await supabaseRequest('site_content_store?id=eq.main', {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        content,
        updated_at: updatedAt
      })
    });

    if (Array.isArray(patched) && patched.length > 0) {
      return patched[0];
    }

    const inserted = await supabaseRequest('site_content_store?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify([{
        id: 'main',
        content,
        updated_at: updatedAt
      }])
    });

    if (inserted) return Array.isArray(inserted) ? inserted[0] : inserted;
  } catch (err) {}

  // 3. Save to Supabase site_orders fallback
  try {
    const patchedOrder = await supabaseRequest('site_orders?id=eq.__SITE_CONTENT_STORE__', {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        name: 'site_content',
        phone: '1.0',
        message: jsonStr,
        status: 'system'
      })
    });

    if (Array.isArray(patchedOrder) && patchedOrder.length > 0) {
      return patchedOrder[0];
    }

    const insertedOrder = await supabaseRequest('site_orders?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify([{
        id: '__SITE_CONTENT_STORE__',
        name: 'site_content',
        phone: '1.0',
        message: jsonStr,
        status: 'system',
        created_at: updatedAt
      }])
    });

    return Array.isArray(insertedOrder) ? insertedOrder[0] : insertedOrder;
  } catch (err) {}

  return content;
}

export async function getMetrics() {
  const rows = await supabaseRequest('site_metrics?id=eq.main&select=*');
  const metrics = toMetrics(Array.isArray(rows) ? rows[0] : null);
  metrics.events = await getEvents().catch(() => []);
  return metrics;
}

export async function getEvents() {
  const rows = await supabaseRequest('site_events?select=*&order=created_at.desc&limit=200');
  return Array.isArray(rows) ? rows.map(toEvent) : [];
}

export async function getOrders() {
  const rows = await supabaseRequest('site_orders?id=neq.__SITE_CONTENT_STORE__&select=*&order=created_at.desc&limit=200');
  return Array.isArray(rows) ? rows.filter((r) => r.id !== '__SITE_CONTENT_STORE__').map(toOrder) : [];
}

export async function trackEvent(type, page, device = '') {
  const eventType = String(type || 'interaction').slice(0, 60);
  const eventPage = String(page || '').slice(0, 250);
  const eventDevice = String(device || '').slice(0, 80);
  let rows;

  try {
    rows = await supabaseRequest('rpc/big_track_event', {
      method: 'POST',
      body: JSON.stringify({
        event_type: eventType,
        event_page: eventPage,
        event_device: eventDevice
      })
    });
  } catch (err) {
    rows = await supabaseRequest('rpc/big_track_event', {
      method: 'POST',
      body: JSON.stringify({
        event_type: eventType,
        event_page: eventPage
      })
    });
  }

  return toMetrics(Array.isArray(rows) ? rows[0] : rows);
}

export async function resetMetrics() {
  await supabaseRequest('site_events?id=gte.0', {
    method: 'DELETE'
  }).catch(() => null);

  const rows = await supabaseRequest('site_metrics?id=eq.main', {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      visits: 0,
      interactions: 0,
      whatsapp_clicks: 0,
      form_submits: 0,
      last_visit: new Date().toISOString()
    })
  });

  return toMetrics(Array.isArray(rows) ? rows[0] : null);
}

export async function createOrder(input) {
  const order = {
    id: `order-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: String(input.name || '').trim().slice(0, 120),
    phone: String(input.phone || '').trim().slice(0, 80),
    message: String(input.message || '').trim().slice(0, 1000),
    status: 'new',
    created_at: new Date().toISOString()
  };

  const rows = await supabaseRequest('site_orders', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(order)
  });

  await trackEvent('form_submit', input.page || '/contact', input.device || '').catch(() => null);
  return toOrder(Array.isArray(rows) ? rows[0] : order);
}

export async function updateOrderStatus(id, status) {
  const rows = await supabaseRequest(`site_orders?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status })
  });

  return Array.isArray(rows) && rows[0] ? toOrder(rows[0]) : null;
}
