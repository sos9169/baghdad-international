import fs from 'fs';
import path from 'path';

const tmpFile = path.join('/tmp', 'big_store.json');
const rootDataDir = path.join(process.cwd(), 'data');

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
    } else {
      global.__BIG_STORE__ = {
        metrics: readJsonFile(rootDataDir, 'metrics.json', { visits: 0, interactions: 0, whatsappClicks: 0, formSubmits: 0, lastVisit: '', events: [] }),
        orders: readJsonFile(rootDataDir, 'orders.json', []),
        slides: readJsonFile(rootDataDir, 'slides.json', []),
        services: readJsonFile(rootDataDir, 'services.json', []),
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

  // Try writing to root data dir if writable (local dev environment)
  try {
    if (fs.existsSync(rootDataDir)) {
      fs.writeFileSync(path.join(rootDataDir, 'metrics.json'), JSON.stringify(store.metrics, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'orders.json'), JSON.stringify(store.orders, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'slides.json'), JSON.stringify(store.slides, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'services.json'), JSON.stringify(store.services, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'settings.json'), JSON.stringify(store.settings, null, 2), 'utf8');
      fs.writeFileSync(path.join(rootDataDir, 'admin.json'), JSON.stringify(store.admin, null, 2), 'utf8');
    }
  } catch (err) {}

  // Write to /tmp/big_store.json (always writable on Vercel serverless)
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {}
}
