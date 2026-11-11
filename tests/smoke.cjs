const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { once } = require('node:events');

let server, base;
before(async () => {
  // Reserve a free local port for this smoke test.
  const net = require('node:net');
  const probe = net.createServer(); await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port; await new Promise(resolve => probe.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['server.cjs'], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'inherit'] });
  await once(server.stdout, 'data');
});
after(() => server?.kill());

test('home and direct gallery entry serve the same page', async () => {
  const home = await fetch(base + '/'); const gallery = await fetch(base + '/gallery/');
  assert.equal(home.status, 200); assert.equal(gallery.status, 200);
  assert.match(await gallery.text(), /id="gallery-view"/);
});

test('local page assets exist and missing files return 404', async () => {
  const html = readFileSync('index.html', 'utf8');
  const paths = [...html.matchAll(/(?:src|href)="(\/(?:assets\/[^"#]+|style\.css|app\.js))"/g)].map(match => match[1]);
  for (const path of new Set(paths)) assert.equal((await fetch(base + path)).status, 200, path);
  assert.equal((await fetch(base + '/not-a-file')).status, 404);
});

test('engraving has the correct image content type', async () => {
  const response = await fetch(base + '/assets/nature-engraving.png');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^image\/png/);
});


test('ecology explains an evidence-backed deposit-return proposal', async () => {
  for (const route of ['/ekologiya', '/ekologiya/']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /id="yechim"/);
    assert.match(html, /id="manbalar"/);
    assert.match(html, /Qaytariladigan garov/i);
    assert.match(html, /91,9/);
    assert.match(html, /id="journey-next"/);
    assert.match(html, /class="narrative-track"/);
    assert.equal((html.match(/class="narrative-panel"/g) || []).length, 4);
    assert.match(html, /HAQIQIY TÖLOV EMAS/);
    assert.match(html, /<noscript>/);
    assert.doesNotMatch(html, /<form|hisoblagich|kalkulyator/i);
    assert.doesNotMatch(html, /murojaat/i);
    assert.doesNotMatch(html, /Yilning eng yaxshi ekologiya/);
  }
  for (const asset of ['/ekologiya/eco.css', '/ekologiya/eco.js', '/assets/eco-river-illustration.png', '/assets/eco-mahalla-engraving.png']) {
    assert.equal((await fetch(base + asset)).status, 200, asset);
  }
});


test('new alphabet and accessible entrance are used across the site', async () => {
  const home = await (await fetch(base + '/')).text();
  const eco = await (await fetch(base + '/ekologiya/')).text();
  const homeScript = await (await fetch(base + '/app.js')).text();
  const ecoScript = await (await fetch(base + '/ekologiya/eco.js')).text();
  for (const html of [home, eco]) {
    assert.match(html, /class="entrance" aria-hidden="true"/);
    assert.match(html, /href="\/entrance.css"/);
    assert.match(html, /src="\/entrance.js"/);
    assert.match(html, /Özbekistonga/);
  }
  assert.match(home, /Toşkent/);
  assert.match(homeScript, /Çorvoq/);
  assert.match(ecoScript, /DÖKONDA/);
  assert.match(ecoScript, /1 000 söm/);
  assert.match(eco, /kimning yölida qoladi\?/);
  // The opening lanes live in the entrance only; the hero opens on the title.
  assert.doesNotMatch(home, /hero-grid|year-column/);
  // Questions appear only at the very end of the ecology story.
  assert.doesNotMatch(home, /\?/);
  assert.equal((eco.match(/\?/g) || []).length, 1, 'only the closing question keeps a question mark');
  const css = await (await fetch(base + '/entrance.css')).text();
  assert.match(css, /prefers-reduced-motion:no-preference/);
  assert.match(css, /pointer-events:none/);
  assert.equal((await fetch(base + '/entrance.js')).status, 200);
});

test('home transitions to ecology through the portal scene', async () => {
  const home = await (await fetch(base + '/')).text();
  assert.match(home, /class="eco-portal dark"/);
  assert.match(home, /class="eco-portal-title"/);
  assert.match(home, /EKOLO<span class="cut">GIYA<\/span>/);
  assert.match(home, /Butun tizim — bir butilka orqali/);
  assert.match(home, /eco-marquee/);
});

test('ecology frames the problem bigger than the bottle', async () => {
  const eco = await (await fetch(base + '/ekologiya/')).text();
  assert.match(eco, /MUAMMO — BUTILKA EMAS/);
  assert.match(eco, /Uning yöli/);
  assert.match(eco, /BUTILKA ORQALI — BUTUN TIZIM/);
  assert.doesNotMatch(eco, /hisoblagich|kalkulyator/i);
});

test('ecology evidence wears animated stat rings', async () => {
  const eco = await (await fetch(base + '/ekologiya/')).text();
  assert.equal((eco.match(/class="stat-ring"/g) || []).length, 3);
  assert.match(eco, /--p:\.919/);
  assert.match(eco, /--p:\.85/);
  assert.match(eco, /--p:\.31/);
  assert.match(eco, /class="eco-ticker"/);
  assert.match(eco, /class="station reveal"/);
});

test('ecology closing image stays a small postcard', async () => {
  const eco = await (await fetch(base + '/ekologiya/')).text();
  assert.match(eco, /class="closing-card"/);
  assert.match(eco, /kimning yölida qoladi\?/);
  assert.equal((eco.match(/class="story-step reveal"/g) || []).length, 3);
});
