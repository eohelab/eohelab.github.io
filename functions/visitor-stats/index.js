const cloudbase = require('@cloudbase/node-sdk');
const geoip = require('geoip-country');

const app = cloudbase.init();
const db = app.database();
const command = db.command;
const stats = db.collection('eohe_visitor_stats');
const allowedOrigins = new Set([
  'https://eohelab.github.io',
  'https://sysu-eohe-2026-d9gc38h0203342f7d-1453818758.tcloudbaseapp.com',
]);

function response(statusCode, origin, body) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    Vary: 'Origin',
  };
  if (allowedOrigins.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return { statusCode, headers, body: body ? JSON.stringify(body) : '' };
}

function clientIp(event) {
  const headers = event.headers || {};
  const forwarded = headers['x-forwarded-for'] || headers['X-Forwarded-For'];
  return String(forwarded || headers['x-real-ip'] || headers['X-Real-IP'] || event.requestContext?.sourceIp || '')
    .split(',')[0]
    .trim()
    .replace(/^::ffff:/, '');
}

async function increment(docId, initial) {
  try {
    const result = await stats.doc(docId).update({ views: command.inc(1), updatedAt: new Date() });
    if (!result.updated) await stats.doc(docId).set({ ...initial, views: 1, updatedAt: new Date() });
  } catch {
    await stats.doc(docId).set({ ...initial, views: 1, updatedAt: new Date() });
  }
}

async function snapshot() {
  const [totalResult, countryResult] = await Promise.all([
    stats.doc('total').get(),
    stats.where({ type: 'country' }).orderBy('views', 'desc').limit(5).get(),
  ]);
  const totalDoc = Array.isArray(totalResult.data) ? totalResult.data[0] : totalResult.data;
  return {
    total: totalDoc?.views || 0,
    countries: (countryResult.data || []).map(({ code, views }) => ({ code, views })),
  };
}

exports.main = async (event = {}) => {
  const headers = event.headers || {};
  const origin = headers.origin || headers.Origin || '';
  const method = event.httpMethod || event.requestContext?.httpMethod || 'GET';
  if (method === 'OPTIONS') return response(204, origin);
  if (method !== 'GET' || (origin && !allowedOrigins.has(origin))) return response(403, origin, { error: 'forbidden' });

  try {
    const query = event.queryStringParameters || {};
    if (String(query.count) === '1') {
      const match = geoip.lookup(clientIp(event));
      const code = match?.country && /^[A-Z]{2}$/.test(match.country) ? match.country : 'ZZ';
      await Promise.all([
        increment('total', { type: 'total' }),
        increment(`country_${code}`, { type: 'country', code }),
      ]);
    }
    return response(200, origin, await snapshot());
  } catch (error) {
    console.error('visitor statistics error', error);
    return response(503, origin, { error: 'statistics_unavailable' });
  }
};
