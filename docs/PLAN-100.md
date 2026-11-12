# Ekologiya taqdimoti — 100 bosqichli reja (v7)

Har bir bosqich bajarilgach belgilanadi. Maqsad: ekologiya mazmuni birinchi o‘rinda,
animatsiya uni qo‘llab-quvvatlaydigan, professional taqdimot.

## A. Tahlil (1–10)
1. Joriy (v6) dek matnlarini XML'dan o‘qish
2. `ekologiya/index.html` dan kanonik matnlarni ajratib olish
3. Dek matni vs sahifa matni — farqlarni yozib chiqish
4. Alifbo auditı: yo‘l→yöl, yechim→yeçim, idish→idiş, o‘ylab→öylab, to‘rt→tört…
5. Fakt raqamlari auditı: 91,9% · 85% · 31% · 100/92 · 5 000/1 000/6 000
6. 12 slayd bo‘yicha qamrov (barcha 8 qism + kirish + chegara + manbalar + yakun)
7. Ierarxiya auditı: qaysi matn kichik/qoldiq (14pt dan past = nuqson)
8. Effektlar/uzatishlar taqsimoti auditı
9. Palitra tekshiruvi (krem/ko‘mir/to‘q sariq/yashil — sahifa bilan bir xil)
10. Nuqsonlar ro‘yxati

## B. Matn tozalash (11–25)
11. YECHIM→YEÇIM, yechim→yeçim
12. yo‘l→yöl, yo‘lida→yölida, yo‘lini→yölini, YO‘LDA→YÖLDA, Yo‘l→Yöl
13. qo‘lingizdagi→qölingizdagi
14. OYLAB KORING→ÖYLAB KÖRING
15. idish→idiş, IDISH→IDIŞ (faqat matnda, kod tegmasin)
16. yig‘ish→yiğiş, qog‘oz→qoğoz
17. to‘rt→tört (bosqichlar)
18. U+02BC faqat: masʼuliyat, eʼlon, maʼlumot
19. Yagona “?” — faqat yakun savolida
20. Yakun savoli aynan: “Bugun qölingizdagi butilka, ertaga kimning yölida qoladi?”
21. Tirnoq belgilari: ‘ (U+2018) bir xil
22. Vergul nuqta: 5 000 / 1 000 — bo‘sh joy bilan
23. O‘nlik: 91,9% (vergul bilan)
24. Manbalar matni sahifadagidek
25. Ortiqcha (sahifada yo‘q) matnlarni o‘chirish — “Bu O‘zbekiston ko‘rsatkichi emas” o‘rniga sahifa matni

## C. Kompozitsiya (26–50)
26. Global to‘r: margen 0.75", matn ustuni 7", vizual ustun 4.2"
27. Global tip-ketma-ketlik: 40 / 26 / 18 / 15 / 13 / 11
28. Har slaydda yuqori yorliq (11pt, to‘q sariq, interval bilan)
29. Slayd 1 — kirish: display 40pt, 3 qator, vizual pastda
30. Slayd 2 — muammo: 3 gap ketma-ket, UNECE izohi
31. Slayd 3 — tanlov: qorong‘i, 2 karta teng
32. Slayd 4 — yechim: sarlavha + jismoniy izoh + 4 bosqich
33. Slayd 5 — narx: tenglama markazda, 3 printsiyp yonma-yon
34. Slayd 6 — avtomat: matn katta, chizma yon tomonda (kichikroq)
35. Slayd 7 — tizim: 4 tomon kartalari teng
36. Slayd 8 — Litva: 100→92 vizual chapda, 91,9% katta
37. Slayd 9 — yurtlar: 3 karta + ogohlantirish (sahifa matni)
38. Slayd 10 — chegara: qorong‘i, 2 printsiyp + subtil eslatma
39. Slayd 11 — manbalar: 2 ustun, 7 hujjat
40. Slayd 12 — yakun: savol markazda, qushlar pastda
41. Har slaydda bo‘sh joyni himoya qilish (40%+ ochiq)
42. Vizual elementlar matnni bosmaydi — kichikroq, yon tomonda
43. Sarlavha ostida 1.1" masofa
44. Izohlar 13pt, kulrang-yashil
45. Yorliq + chiziq (ingichka rule) bir xil andozada
46. Qorong‘i slaydlar balansi: 3/12 (3, 6?, 10) — 3, 10 qorong‘i
47. Har slaydda kamida bitta vizual muvozanat (rasm/raqam/chizma)
48. Har slaydda matn ketma-ketligi yuqoridan pastga
49. Sarlavhalar gap boshida katta harf (sahifa uslubi)
50. Yakuniy umumiy ko‘rinish — bitta uslub

## D. Harakat (51–75)
51. Har slayd uchun alohida sxema (bir xil tartib emas)
52. Yorliq → sarlavha → matn → izoh → vizual (o‘qish tartibi)
53. 380ms asosiy stagger, 520ms guruhlar orasida
54. Slayd 1: fade ketma-ket + qushlar motion (croll = ilgarigi swipe metaforasi)
55. Slayd 2: wipeUp gaplar + pul flyL + floatUp izoh
56. Slayd 3: splitV kartalar + grow raqamlar
57. Slayd 4: wipeUp jadval + flyL qadamlar + motion tanga
58. Slayd 5: zoom tenglama + flyB + grow rivojlanish
59. Slayd 6: wipe + flyB skaner + flyR coins + grow ✓
60. Slayd 7: flyL tomonlar + fade izohlar (alohida kechikish)
61. Slayd 8: flyL/zoom barlar + count-up 91,9% (grow)
62. Slayd 9: flyB kartalar + zoom raqamlar + floatUp ogohlantirish
63. Slayd 10: wipeDown printsiyplar + fade eslatma
64. Slayd 11: flyL manbalar ikki to‘lqin
65. Slayd 12: zoom savol + motion qushlar + fade eslatma
66. Motion path — egri chiziq (tekis emas)
67. Uchuvchi qushlar — alohida kechikish bilan
68. Har slayd oxirida bo‘sh pauza (250ms)
69. Effekt turlari: 9+ xil oila saqlanadi
70. Bir xil effekt ketma-ket 3 martadan ko‘p emas
71. Uzatishlar: 11 xil, mazmumga mos (cover→dissolve→split→push→wipe→wheel→fade→strips→pull→fade→zoom)
72. Uzatish tezligi 500–800ms oralig‘ida
73. animScale/animMotion parametrlari silliqligini tekshirish
74. set-visibility har kirishda bor
75. mainSeq ichida bitta par — pauza banneri chiqmasin

## E. Tekshiruv (76–92)
76. lxml — 12 slayd XML valid
77. `<p:timing>` — 12/12 slaydda bor
78. `<p:transition>` — 12/12, 11 xil
79. `<p:bg>` — 12/12 slaydda (sahifa foni qotib turmaydi)
80. custGeom gullar — 3
81. python-pptx reopen OK
82. Matnlarni qayta o‘qib alifbo auditı (2-marta)
83. Yagona “?” tekshiruvi
84. Yakun savoli aynan tekshiruvi
85. Effekt hisoblagich: 180+ kirish/urg‘u
86. Fakt raqamlari joyida (count-up shartlari)
87. Sarlavha o‘lchamlari ≥ 26pt
88. Matn o‘lchamlari ≥ 14pt (asosiy)
89. Fayl hajmi < 10MB
90. v6 bilan farq — faqat yaxshilanishlar
91. Muvozanat: vizual matnni bosmaydi
92. Umumiy “Professional” baho — o‘z-o‘zini tekshirish

## F. Yetkazish (93–100)
93. `/home/user/ekologiya-taqdimot.pptx` ga saqlash
94. Repo nusxasiga ko‘chirish
95. docs/PLAN-100.md qo‘shish
96. commit
97. push
98. Vercel deploy (production)
99. READY + alias tekshirish
100. Havolalar + reja hisoboti
