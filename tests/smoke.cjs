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


test('ecology page has a complete, focused initiative', async () => {
  for (const route of ['/ekologiya', '/ekologiya/']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /id="nominatsiyalar"/);
    assert.match(html, /Yilning eng yaxshi ekologiya himoyachisi/);
    assert.match(html, /Toza makon/);
    assert.match(html, /id="harakat"/);
    assert.equal((html.match(/type="checkbox"/g) || []).length, 4);
    assert.match(html, /O‘tkir yoki xavfli buyumlarga tegmang/);
    assert.equal((html.match(/class="initiative reveal"/g) || []).length, 1);
  }
  for (const asset of ['/ekologiya/eco.css', '/ekologiya/eco.js']) {
    assert.equal((await fetch(base + asset)).status, 200, asset);
  }
});
