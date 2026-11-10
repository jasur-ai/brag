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


test('ecology has a refill solution and impact estimator', async () => {
  for (const route of ['/ekologiya', '/ekologiya/']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /id="yechim"/);
    assert.match(html, /id="refill-form"/);
    assert.match(html, /id="bottle-result"/);
    assert.match(html, /id="money-result"/);
    assert.doesNotMatch(html, /murojaat/i);
    assert.doesNotMatch(html, /Yilning eng yaxshi ekologiya/);
  }
  for (const asset of ['/ekologiya/eco.css', '/ekologiya/eco.js', '/assets/eco-river-illustration.png']) {
    assert.equal((await fetch(base + asset)).status, 200, asset);
  }
});
