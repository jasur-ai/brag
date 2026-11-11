# Vizual hikoya doktrinasi — BRAG

> “Matnni o‘qish yoki eshitish xotiraga to‘g‘ridan-to‘g‘ri bormaydi.
> Xotiraga eng yo‘l — vizualizatsiya.” — loyiha tamoyili

Bu hujjat saytning **ideologiyasi**: nima uchun har bir bob ko‘rish va harakat
orqali yetkaziladi. Eski metodlar (uzun matn, ro‘yxat, hisobot) o‘rniga —
yangicha qarash: har bir fikr = bitta ko‘rinadigan, harakatlanadigan sahna.

## Tamoyillar

1. **Ko‘rsat, aytpa.** Har bir g‘oyaning vizual jismi bo‘lsin: rasm, belgi,
   diagramma, harakat. Matn — yordamchi, asosiy emas.
2. **Harakat — mazmun.** Animatsiya bezak emas: u diqqatni boshqaradi,
   sabab-oqibatni ko‘rsatadi, vaqt o‘tishini his ettiradi.
3. **Bitta bob — bitta rasm.** Har bo‘limning yagona kadrda eslab qolinadigan
   bir tasviri bor (ovqat — bug‘ ko‘tariladigan lagan; ekologiya — yo‘lda
   ketayotgan butulka).
4. **Qushlar — saytning nafasi.** Oq-qora qo‘lda chizilgan qarshalar (qushlar)
   osmonda uchib yuradi: maktub “tirik”, harakatda ekanini bildiradi.
5. **Raqam — halqa ichida.** Statistika matn sifatida emas, to‘ladigan
   diagramma (ring) sifatida ko‘rinadi — son ko‘z oldida o‘sadi.
6. **Tizim — chiziq orqali.** Rollar va bosqichlar nuqtalar va oqim chiziqlari
   bilan bog‘lanadi: kim nimani qilishi bir qarashda tushunarli.
7. **Har bir sahifada kamida bitta “jonli” element.** Suv bug‘i, uchayotgan
   qush, aylanayotgan halqa, suzuvchi kartochka — hech qaysi ekran mutlaqo
   statik emas.
8. **Harakat — hamma uchun.** `prefers-reduced-motion` da hammasi sokin
   yakuniy holatda; JavaScriptsiz ham vizual hikoya to‘liq ko‘rinadi.

## Boblar kesimida vizual qurilmalar

| Bob | Vizual fikr | Harakat |
|-----|-------------|---------|
| Kirish | 1991–2026 varaqlari kitob sahifasi kabi ochiladi | 4 varaqli kirish, keyin tozalanadi |
| Maktub | Qog‘oz kompozitsiya, surat-kartochkalar | Parallax, suzuvchi kartochkalar, qushlar |
| Ona yurt | Satrlar sahna bo‘yicha almashadi | Scroll bilan satr almashinuvi |
| Tabiat | Oq-qora gravyura + osmon | Qushlar floti, sekin masshtab, parallax |
| Ekologiya portali | Harflar ichida daryo (cutout type) | Marquee, strelka, kartochka |
| Til | Kitob kollaji | Burilayotgan kitob, qo‘lda yozuv |
| Dasturxon | Lagan atrofida orbita | Bug‘, tebranayotgan yorliq, aylanuvchi halqalar |
| Şaharlar | Xotira kartalari | Ken Burns, hover chiziqlar |
| Xotima | “Yo‘l yo‘q” — katta tip | Parallax, yozuv tebranishi |
| Galereya | 15 ta reversiv karta | Stagger kirish, flip |
| Ekologiya | Butulkaning to‘liq yo‘li | Scroll-simulyator, ring-grafiklar, tiker |

## Matnni qisqartirish qoidasi

Har bir matn bloki uchun so‘raladi: “Buni ko‘rsatish mumkinmi?”
Mumkin bo‘lsa — ko‘rsatiladi, matn qisqaradi. Qolgan matn — qisqa, izchil,
bitta nafasda o‘qiladigan gaplar.

## Manba

Vizual uslub: Obys (The Message to Ukraine) + Eleken 50 namunasi tahlili
(bkz. `docs/TOP-SITES-NOTES.md`). Bu hujjat — shu tahlil va foydalanuvchi
talabidan hosil bo‘lgan amaliy tamoyillar to‘plami.

## The Message to Ukraine — chuqur texnika tahlili (2026-11-11)

Manba: `themessagetoukraine.obys.agency` (Obys) butun sahifa bo‘yicha o‘rganildi.
Qo‘llaniladigan texnikalar ro‘yxati va ularning bizdagi ifodasi:

| # | Texnika (asl saytda) | Bizdagi ifoda |
|---|---|---|
| 1 | **Skroll bilan yig‘iluvchi harflar** — she’r so‘zlari parchalarga bo‘lingan, swipe qilganda joyiga o‘tiradi | Fork sarlavhasi harflari skroll bilan yig‘iladi (`letterScatter`) |
| 2 | **Qatlamli kollaj** — naqsh/gravyura qatlamlari bir-biriga nisbatan siljiydi | Qog‘oz tog‘ qatlamlari, daryo gravyurasi, suzuvchi parchalar |
| 3 | **Bir qadam — bir sahna** (poem beats) | “Içildi/Taşlandi/Va qolaverdi” uch zarba; 4 ta yo‘l bosqichi |
| 4 | **Skrub qilinadigan parallax** — hech narsa o‘zi o‘ynamaydi | Qushlar, tog‘lar, fork chiziqlari — hammasi swipe bilan |
| 5 | **Sanoq sahnalari** (shahar raqamlari) | Dalillar raqamlari kassa sanag‘idek sanaladi |
| 6 | **Katta harflar — grafik element** sifatida (sochilib yotadi, yig‘iladi) | Sarlavha harflari scatter→compose |
| 7 | **Marquee lentasi** (footer UKRAINE-UKRAINE) | Eco tiker, uy sahifasi marquee |
| 8 | **Muhr/shtamp elementlari** (qo‘lyozma, muhr) | “GAROV QAYTARILDI” muhri, visual-stamp, qalam chiziqlari |
| 9 | **To‘liq ekran sahna** — tasvir va matn ustma-ust | Hero foto+qatlam, gravyura+yorliq |
| 10 | **Yopiq rang palitrasi** — krem/siyoh/qo‘lda chiziq | Butun sayt: qog‘oz, siyoh, sage, gravyura |

Qoida: har bir yangi animatsiya shu jadvaldagi joyiga mos bo‘lsin va matnni
o‘rniga emas, uni ko‘rsatish uchun xizmat qilsin.

## Garov avtomati (yangi sahna, 2026-11-11)

Foydalanuvchi talabi: pul qaytarish **sensor/skaner va tanga** orqali bo‘lsin
(Germaniya Pfand avtomati kabi). Sahna tsikli: butilka teshikka kiradi →
datchik skanerlashi (yorug‘ chiziq + nurlanish) → ekranda “PET · ANIQLANDI” →
tangalar laganda to‘planadi → “GAROV QAYTARILDI” muhri. Fork o‘ng yo‘li shu
avtomatga olib boradi (vizual ip).
