# Bukti TDD — Quiet Current

Catatan eksekusi nyata lane gpt-6-astra, 20 Oktober 2026. Spec dan plan asli tidak diubah. Semua perintah dijalankan di /root/projects/roxy-landing. Tidak ada deploy atau commit.

## Slice 1: hero statis

1. Menulis tes hero sebelum index.html atau styles.css ada: satu H1 Indonesia, lang=id, PNG naturalWidth=338/naturalHeight=655, CTA ke #grimoire.
2. npm install --ignore-scripts: added 4 packages; audited 5 packages; 0 vulnerabilities.
3. npm test pertama gagal pada setup: webServer menunggu index yang belum ada, timeout 60000ms. Ini bukan RED perilaku. Menambahkan endpoint health untuk readiness dan mengarahkan konfigurasi tes ke endpoint tersebut.
4. npm test: 1 failed (5.3s pada tes). RED perilaku: getByRole('heading', { level: 1 }), expected “Tenang di permukaan. Dalam di pemikiran.”; element(s) not found.
5. Membuat HTML Indonesia lengkap, CSS responsif, dan SVG dekoratif; tidak menyentuh PNG kanonis.
6. npm test: 1 passed (1.5s). GREEN hero, gambar nyata, dan CTA.

## Slice 2: bahasa, storage, grimoire

1. Menambahkan tes bahasa/persistensi dan tes storage ditolak + grimoire keyboard sebelum implementasi app.js.
2. npm test: 2 failed, 1 passed (8.1s). Kedua tes baru gagal pada klik Switch to English: element is not enabled, timeout 2000ms. Tombol memang masih disabled dalam HTML statis.
3. Implementasi ES module: snapshot teks Indonesia, kamus Inggris, terjemahan metadata/aria/alt/lang, storage get/set aman, tabs progresif dengan roving tabindex, arrow/Home/End/Space, dan pembukaan hash.
4. npm test: 3 passed (3.4s). GREEN bahasa, reload, storage ditolak, grimoire keyboard, hero.

## Slice 3: gerak

1. Menambahkan tes reduced motion + explicit off + persistensi sebelum kode animasi.
2. npm test -- --grep motion: 1 failed. RED: #motion expected enabled, received disabled, timeout 2000ms.
3. Implementasi satu animasi Web Animations API pada SVG; tidak ada rAF. Reduced motion mencegah animasi meskipun preferensi on. Off membatalkan animasi. Visibility change pause/resume.
4. Wrapper parent terhenti setelah kode motion ditulis; tidak ada rollback.
5. Pada kelanjutan, npm test -- --grep motion: 1 passed (2.0s). GREEN.

## Quality gates dan perbaikan nyata

Menambahkan tes matriks responsif, axe pada setiap tab, no-JS, request/console, metadata/terjemahan, anchor, skip link, visibility, dan screenshot.

Eksekusi awal npm run check && npm test && npm run build && npm audit:
- Check lolos.
- Browser: 17 passed, 5 failed (25.5s).
- Empat tes axe mengungkap contrast ratio 2.47 pada nomor halaman dan 4.49 pada catatan miring ivory.
- Satu assertion terjemahan keliru mengharuskan proper name “02 / GRIMOIRE” berubah dalam bahasa Inggris.
- Karena &&, build dan audit belum dieksekusi pada run ini.

Perbaikan: tingkatkan opacity nomor halaman dari .4 ke .65, gelapkan catatan ivory dari #586e6b ke #4f6562. Tidak menonaktifkan aturan axe. Assertion nama grimoire kini secara eksplisit memastikan nama tetap sama; seluruh teks lain tetap wajib berubah. Tambahkan CSS off untuk scroll-behavior dan penyesuaian tab Inggris di layar terkecil.

Eksekusi ulang npm run check && npm test && npm run build && npm audit:
- Check: exit 0.
- Browser: 22 passed (19.9s).
- Axe: zero violations, tag wcag2a/wcag2aa/wcag21aa, 390 dan 1440px, ID/EN, setiap panel.
- Build: Built 5 static files: 71538 bytes (uncompressed).
- Audit: found 0 vulnerabilities.

Tambahkan pemeriksaan tinggi target minimal 44px dan batas tab yang tidak saling menimpa. Verifikasi artefak build, bukan hanya source:

    SERVE_DIST=1 npm test && npm run check

Hasil: 22 passed (20.3s); node --check seluruh JS/config/script/test exit 0. Kedua screenshot full-page diperbarui dari dist:
- test-results/desktop.png — viewport 1440×900
- test-results/mobile.png — viewport 390×900

Git diff untuk PNG kanonis serta spec/plan kosong. Seluruh implementasi baru masih uncommitted.

## Koreksi audit independen dan acceptance parent

Reviewer Astra terpisah (`20261020_211613_9dea39`) memberikan `fix-first`: panel `<article role="tabpanel">` tidak valid, suite WCAG-only melewatkan aturan best-practice, dan server pengembangan perlu allowlist/penolakan symlink. Fingerprint staged diff sebelum/sesudah reviewer sama (`9365d05743894886d911ad160ccdc5663561fc0f796006d4f305a0f6d9399b6c`); reviewer tidak mengubah source.

Astra implementer (`20261020_210321_d99e73`) memperbaiki panel menjadi kontainer netral, memperluas axe dengan best-practice, menambah orientasi keyboard responsif, menjelaskan override reduced-motion, memperkuat roundtrip terjemahan, mengunci server ke lima file publik dan realpath bebas symlink, serta menambatkan build/server ke direktori skrip. Source diformat dengan Prettier 3.9.10 sekali jalan, bukan dependensi runtime. Worker melaporkan sembilan RED nyata sebelum koreksi; log mentah tersimpan di `test-red.log`, `test-green.log`, dan `test-dist.log` (tidak dipaketkan). Karena batas iterasi, worker berhenti sebelum mencatat tambahan ini; parent menyelesaikan dokumentasi, bukan mengarang keberhasilan worker.

Parent menjalankan sendiri setelah koreksi pada 2026-10-20:
- `npm run check`: exit 0.
- `node node_modules/@playwright/test/cli.js test --reporter=json`: **28 expected/passed, 0 unexpected, 0 skipped, 0 flaky**; laporan `artifacts/source-tests.json`.
- `npm run build`: **5 static files, 80,280 bytes uncompressed**.
- `SERVE_DIST=1 node node_modules/@playwright/test/cli.js test --reporter=json`: **28 expected/passed, 0 unexpected, 0 skipped, 0 flaky**; laporan `artifacts/dist-tests.json`.
- `npm audit --json`: **0 vulnerabilities**; laporan `artifacts/dependency-audit.json`.
- Audit parent tambahan: **12 kombinasi viewport/bahasa**, 320/390/650/768/1024/1440px × ID/EN; tidak ada overflow, error console/request, request eksternal, atau gambar gagal. Axe termasuk best-practice di 320/390/1440px kedua bahasa: tidak ada pelanggaran terdeteksi.
- HTML mandiri yang dibuat dari source yang sama diuji pada `file://` di 320 dan 1440px: artwork 338×655 berhasil dimuat, tombol bahasa dan grimoire berfungsi, tidak ada overflow/error/request HTTP. Bukan sekadar screenshot.
- Parent memeriksa screenshot desktop dan mobile secara langsung dengan alat gambar, termasuk crop ukuran asli; tidak menemukan overlap, clipping artwork, atau kesalahan komposisi. Ini bukan pengujian pengguna/perangkat fisik.

Angka di bagian Quality gates sebelumnya adalah riwayat iterasi, bukan hasil final. Artefak final dan fingerprint diperiksa lagi saat pengemasan.

## Batas bukti

Pengujian menggunakan Chromium lokal yang disediakan. Tidak menguji Safari/Firefox, screen reader manual, atau perangkat fisik. Visibility diuji lewat override document.hidden dan event visibilitychange, bukan perpindahan tab OS. Tautan eksternal tidak diikuti; pengujian runtime justru memastikan tidak ada request eksternal. Worker menghasilkan screenshot tanpa menginspeksi gambarnya; parent kemudian menginspeksinya langsung sebagaimana dicatat di atas. Klaim tidak ada overflow didukung pengukuran browser dan inspeksi screenshot. Tidak ada klaim sertifikasi aksesibilitas menyeluruh.
