# Roxy — The Quiet Current

**Live:** https://aichrisz.github.io/roxy-landing/

**Source:** https://github.com/aichrisz/roxy-landing

GitHub Pages menyajikan branch `gh-pages` dari root `/` melalui HTTPS. Branch `main` menyimpan source dan tes; branch deployment hanya memuat lima file runtime hasil build beserta `.nojekyll`, bukan server pengembangan atau dependensi Node. Deployment awal berasal dari source `07eee9c`; artefak `a0ec086` telah diverifikasi lewat HTTP, hash kelima file, dan browser publik di mobile/desktop ID/EN.

Landing page editorial untuk persona mentor AI fan-made milik Abel. HTML statis berbahasa Indonesia, dengan peningkatan JavaScript untuk bahasa Inggris, preferensi gerak, dan grimoire bertab. Bukan manusia dan bukan situs resmi anime.

## Menjalankan

Dari direktori proyek:

    npm install --ignore-scripts
    node scripts/server.mjs

Buka http://127.0.0.1:4173/ atau http://127.0.0.1:4173/roxy-landing/. Server ini hanya untuk pengembangan lokal; hentikan dengan Ctrl+C. Tidak ada layanan yang dipasang atau dikonfigurasi. HTML/CSS dan seluruh isi Indonesia juga bisa dibaca langsung dari index.html tanpa build. Untuk ES modules dan peningkatan interaktif gunakan HTTP lokal, bukan file:// (pembatasan CORS browser).

## Membuka hasil tanpa instalasi

Buka `Roxy-Quiet-Current.html` dari arsip unduhan langsung di browser. Ini versi mandiri yang memuat CSS, ilustrasi, SVG, dan JavaScript secara inline; bahasa dan grimoire tetap berfungsi pada `file://` tanpa Node.js atau internet. Di pohon proyek host, berkas berada di `artifacts/`. Tautan profil/sumber tentu memerlukan internet bila diikuti. Ini berbeda dari `index.html` sumber yang memuat ES module eksternal dan sebaiknya disajikan lewat HTTP.

## Arsitektur

`index.html` menyediakan konten Indonesia semantik sebagai baseline. `styles.css` menyimpan token warna, tipografi dan layout responsif; `app.js` hanya menambahkan terjemahan aman, tab keyboard dan preferensi gerak. `scripts/public-files.mjs` adalah batas allowlist bersama untuk server/build, bukan backend aplikasi. Tidak ada layanan chat, penyimpanan server, framework runtime, atau request jaringan saat halaman dimuat. Pengujian diserialkan karena regresi build mengubah `dist/`; ini mencegah race dengan browser yang sedang membacanya.

## Verifikasi dan produksi

    npm run check
    npm test
    npm run build
    SERVE_DIST=1 npm test
    npm audit

Node modern dengan ES modules diperlukan. Runtime dependencies: nol. Dev dependencies dipatok tepat pada @playwright/test 1.64.1 dan axe-core 4.14.0. Tidak ada browser yang diunduh oleh proyek.

Playwright memakai CHROMIUM_PATH bila tersedia, lalu mendeteksi binary lokal /root/.hermes/tools/chromium-1208/chrome-linux/chrome. Di mesin lain arahkan ke Chromium yang sudah tersedia:

    CHROMIUM_PATH=/path/to/chrome npm test

Build menyalin hanya index.html, styles.css, app.js dan dua aset ke dist/. Server hanya melayani lima file publik itu serta /health, bukan docs, package, .git, atau file arbitrer. Pemeriksaan allowlist, symlink pada tiap komponen, dan realpath digunakan bersama oleh build/server. Keduanya memakai root proyek berdasarkan lokasi script, bukan cwd. Build hanya mengganti dist/ proyek ini; jangan simpan pekerjaan manual di sana. Output terbaru terukur: 80.280 byte, tanpa kompresi. Semua URL aset relatif, sehingga subpath didukung.

## Isi dan interaksi

- Hero serif, palet midnight/cyan/gold, gambar asli utuh, diagram lingkaran air SVG buatan khusus.
- Filosofi mentor, grimoire rekayasa/riset/belajar, proses belajar di bagian ivory, tautan profil GitHub Abel dan sumber ilustrasi.
- Bahasa Indonesia adalah baseline HTML lengkap. Tombol bahasa dan gerak nonaktif sampai JavaScript siap. Tanpa JS, seluruh isi grimoire terlihat dan tautan menuju setiap disiplin tetap bekerja.
- Bahasa mengganti teks, judul dokumen, deskripsi, alt, label aksesibel, dan document.lang. Nama Roxy, Grimoire, dan The Quiet Current tetap sebagai nama.
- localStorage hanya menyimpan roxy-language dan roxy-motion. Akses/get/set yang ditolak tidak menggagalkan UI.
- Grimoire memakai div netral untuk tabpanel. Desktop memakai aria-orientation vertical dan panah atas/bawah; <=650px memakai horizontal dan kiri/kanan. Kiri/kanan tetap kompatibel di desktop. Klik, Enter, Space, Home/End, fokus keyboard, dan hash langsung tetap didukung.
- Gerak hanya pada diagram di belakang ilustrasi, bukan teks. Reduced motion selalu mengalahkan preferensi aktif; tombol menyimpan preferensi, tetapi animasi tetap tidak berjalan selama pengaturan sistem reduce aktif. Off membatalkan animasi serta smooth scrolling. Dokumen tersembunyi menjeda animasi; tidak ada loop requestAnimationFrame.
- Tidak ada backend chat, formulir palsu, analytics, audio, font eksternal, atau API runtime.

## Pengujian

28 tes mencakup dua bahasa di 320/390/768/1024/1440px, overflow dan batas gambar, target minimal 44px, keyboard/orientasi, panel tersembunyi dari accessibility tree, persistensi, storage ditolak, reduced motion, toggle, visibility, no-JS, subpath, metadata/aria/alt roundtrip, tidak ada request eksternal, serta PNG asli 338×655. Regresi server menolak jalur privat; helper menolak symlink file/direktori; build dari cwd alternatif mempertahankan sentinel dist di cwd tersebut. Axe WCAG 2A/AA + 2.1AA dan best-practice memeriksa setiap panel pada 390px dan 1440px dalam kedua bahasa tanpa pengecualian aturan.

Tombol bahasa memakai lang bahasa tujuan. Ketika preferensi gerak hidup dikalahkan reduced-motion sistem, aria-description terjemahan menjelaskan alasannya. Sumber diformat dengan Prettier 3.9.10 satu kali via npm exec; tidak ada dependency permanen tambahan. artifacts/ diabaikan Git untuk packaging offline oleh parent.

Screenshot full-page dibuat ulang oleh npm test:

    test-results/desktop.png
    test-results/mobile.png

Bukti RED/GREEN dan hasil perintah ada di docs/tdd-evidence.md. Pemeriksaan otomatis bukan sertifikasi aksesibilitas menyeluruh. Pengujian hanya memakai Chromium, bukan Safari/Firefox atau perangkat fisik. Visibility test menyimulasikan document.hidden. Parent telah memeriksa screenshot desktop/mobile dan menerima komposisinya sebelum pass koreksi ini; itu inspeksi parent, bukan lane ini. Screenshot terbaru diperbarui oleh tes. Tautan eksternal sesuai spesifikasi, tidak di-fetch atau diuji melalui jaringan eksternal.

## Hak cipta dan sumber ilustrasi

assets/roxy-official.png adalah aset kanonis yang disediakan parent dan tidak diubah. Ilustrasi serta karakter Roxy Migurdia/Mushoku Tensei tetap milik pemegang hak terkait; tidak dilisensikan ulang sebagai MIT atau sebagai kode proyek.

Halaman sumber resmi: https://mushokutensei.jp/character/

URL ilustrasi resmi: https://mushokutensei.jp/wp-content/themes/mushoku_re/img/character/img_character02.png

HTML, CSS, JavaScript, salinan editorial, dan dekorasi assets/current.svg dibuat khusus untuk proyek ini. Tidak ada artwork karakter lain. Proyek fan-made ini tidak menyiratkan afiliasi, sponsor, atau persetujuan dari pemegang hak. Tinjau izin ilustrasi sebelum distribusi publik.
