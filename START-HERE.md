# Tayyor loyiha: O‘zbekistonga maktub

## 1. ZIP’ni oching

`brag-push-ready` papkasini kompyuteringizga to‘liq chiqarib oling. ZIP ichidan bevosita ishga tushirmang.

## 2. Bir buyruq bilan GitHub’ga push

Shu papkada terminal oching va bajaring:

```bash
bash push-to-github.sh
```

Windows’da **Git Bash**, macOS/Linux’da Terminal ishlating.

Skript quyidagilarni bajaradi:

1. `https://github.com/jasur-ai/brag` reposini vaqtinchalik ishchi papkaga clone qiladi.
2. Barcha sayt kodi, rasmlar, shriftlar va grafikalarni ko‘chiradi.
3. Commit yaratadi va repo’ning amaldagi default branch’iga push qiladi. Bo‘sh repoda `main` ishlatiladi.
4. Mavjud commit tarixini saqlaydi. `--force` ishlatilmaydi. Boshqa mavjud fayllarni ommaviy o‘chirmaydi; bir xil nomdagi sayt fayllari ushbu versiya bilan yangilanadi.

**Kerak bo‘ladi:** Git o‘rnatilgan bo‘lishi, Git ismingiz/emailingiz sozlangan bo‘lishi va ushbu repoga yozish huquqi bilan GitHub autentifikatsiyasi. Skript sizning hisobingizdan foydalanadi; ZIP ichida token yoki parol yo‘q. Autentifikatsiya bo‘lmasa, Git so‘rashi yoki push’ni rad etishi mumkin. Bunday holda Git Credential Manager yoki GitHub CLI orqali avval hisobingizga kiring.

Skript avtomatik publish niyatingiz uchun tayyorlangan; arxivni ochishning o‘zi hech narsani GitHub’ga yubormaydi.

## 3. Saytni kompyuteringizda ko‘rish

Node.js 20+ bilan:

```bash
npm run dev
```

Brauzerda: `http://localhost:3000`

Paket o‘rnatish kerak emas. Tashqi kutubxona yo‘q.

## 4. Vercel

Hisobingizda `brags` loyihasi yaratildi, ammo bu sessiyada production deploy bajarilmadi. Sabab: connector birinchi deploy uchun talab qilinadigan `projectSettings` parametrini yubora olmaydi.

GitHub’ga push tugagach, Vercel dashboard’da repoga ulang yoki o‘z terminalingizdan:

```bash
npx vercel login
npx vercel --prod
```

Sozlamalar:

- Existing project: `brags`
- Framework preset: `Other`
- Build command: **bo‘sh**
- Output directory: **`.`**
- Root directory: shu loyiha papkasi

`vercel.json` ichida `/gallery/` marshruti tayyor. Barcha rasmlar va shriftlar lokal. Ishga tushgan sayt vaqtinchalik preview yoki fayl almashish xizmatiga bog‘liq emas.

## Ichidagi asosiy fayllar

- `index.html`, `style.css`, `app.js` — to‘liq sayt
- `assets/` — barcha rasmlar, shriftlar, original SVG grafikalar va manbalar
- `server.cjs`, `package.json` — mahalliy ishga tushirish
- `vercel.json` — Vercel marshrutlari va headerlar
- `push-to-github.sh` — bir buyruqli push
- `README.md` — loyiha tavsifi va kreditlar

Screenshotlar, sinov fayllari, vaqtinchalik deploy importeri, maxfiy ma’lumotlar va `node_modules` arxivga kiritilmagan.
