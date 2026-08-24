const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

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

export async function getMetrics() {
  const rows = await supabaseRequest('site_metrics?id=eq.main&select=*');
  return toMetrics(Array.isArray(rows) ? rows[0] : null);
}

export async function getOrders() {
  const rows = await supabaseRequest('site_orders?select=*&order=created_at.desc&limit=200');
  return Array.isArray(rows) ? rows.map(toOrder) : [];
}

export async function trackEvent(type, page) {
  const eventType = String(type || 'interaction').slice(0, 60);
  const eventPage = String(page || '').slice(0, 250);
  const rows = await supabaseRequest('rpc/big_track_event', {
    method: 'POST',
    body: JSON.stringify({
      event_type: eventType,
      event_page: eventPage
    })
  });

  return toMetrics(Array.isArray(rows) ? rows[0] : rows);
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

  await trackEvent('form_submit', '/contact').catch(() => null);
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
