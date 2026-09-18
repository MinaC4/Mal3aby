// Minimal load test for the two hot public read paths.
const BASE = process.env.BASE || 'http://malaby-dev.192.168.1.8.nip.io';
const N = Number(process.env.N || 200);
const CONC = Number(process.env.CONC || 10);
const paths = ['/api/pitches', '/api/bookings/availability?pitchId=' + (process.env.PITCH || '') + '&date=2026-12-01&duration=1'];
async function one(path) { const t = process.hrtime.bigint(); const r = await fetch(BASE + path); await r.text(); return Number(process.hrtime.bigint() - t) / 1e6; }
function pct(a, p) { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))]; }
(async () => {
  const pitch = (await (await fetch(BASE + '/api/pitches')).json()).data[0]._id;
  const path = paths[0];
  const lat = []; const errs = [];
  const workers = Array.from({ length: CONC }, async () => { for (let i = 0; i < N / CONC; i++) { try { lat.push(await one(path)); } catch (e) { errs.push(String(e)); } } });
  const t0 = Date.now(); await Promise.all(workers); const dur = (Date.now() - t0) / 1000;
  console.log(JSON.stringify({ path, requests: lat.length, errors: errs.length, rps: +(lat.length / dur).toFixed(1), p50: +pct(lat, 50).toFixed(1), p95: +pct(lat, 95).toFixed(1), p99: +pct(lat, 99).toFixed(1) }));
})();
