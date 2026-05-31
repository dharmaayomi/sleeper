# Refactor: Hapus HOC `WindowWrapper` → Custom Hook + Compound Component

## 🎯 Tujuan Refactor

Mengganti pola `WindowWrapper` HOC di `src/hoc/WindowWrapper.jsx` dengan **custom hook `useWindow`** yang lebih composable, lebih mudah di-debug, dan menghilangkan masalah umum HOC (prop drilling opacity, display name loss, wrapping overhead).

---

## 📋 Konteks Masalah HOC yang Sekarang

### Cara Kerja HOC Saat Ini

```
WindowWrapper(MyWindow, "mywindow")
    ↓
Membungkus komponen → kehilangan display name di DevTools
    ↓
Prop drilling implisit (windowKey hardcoded di wrapping layer)
    ↓
Susah di-test karena logic animasi & drag tercampur di satu tempat
    ↓
Setiap window baru WAJIB diekspor sebagai HOC result, bukan komponen langsung
```

### File yang Terlibat (Scope Refactor)

| File | Status | Keterangan |
|------|--------|------------|
| `src/hoc/WindowWrapper.jsx` | ❌ HAPUS | Seluruh HOC dihapus |
| `src/hooks/useWindow.js` | ✅ BUAT BARU | Custom hook pengganti |
| `src/windows/Finder.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/windows/Safari.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/windows/Terminal.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/windows/Resume.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/windows/Contact.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/windows/Photos.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/windows/Text.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/windows/Image.jsx` | 🔄 UBAH | Migrasi dari HOC ke hook |
| `src/hoc/` (folder) | ❌ HAPUS | Folder tidak diperlukan lagi |
| `vite.config.js` | 🔄 UBAH | Hapus alias `#hoc` jika ada |

---

## 🏗️ Arsitektur Target (Setelah Refactor)

### Sebelum

```
Finder.jsx
  └── WindowWrapper(Finder, "finder")   ← HOC wrapping di luar komponen
        ├── useWindowStore
        ├── useGSAP (open/minimize/restore animation)
        ├── Draggable.create()
        └── visibility/zIndex management
```

### Sesudah

```
Finder.jsx
  └── function Finder() {
        const { containerRef, headerRef } = useWindow("finder")  ← hook di dalam
        return (
          <div ref={containerRef}>
            <div ref={headerRef}>...</div>   ← drag handle
            {/* content */}
          </div>
        )
      }
```

---

## 📁 Step 1 — Buat Custom Hook `useWindow`

**Buat file:** `src/hooks/useWindow.js`

Hook ini mengambil SEMUA logic yang sebelumnya ada di `WindowWrapper.jsx`:
- Subscribe ke `useWindowStore` untuk state window spesifik
- GSAP animation (open, minimize, restore)
- GSAP Draggable setup & cleanup
- Visibility dan z-index management

```js
// src/hooks/useWindow.js

import { useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/Window";

/**
 * useWindow — pengganti WindowWrapper HOC
 *
 * @param {string} windowKey — key unik window, harus match dengan WINDOW_CONFIG
 * @returns {{ containerRef, headerRef }} — ref yang di-attach ke elemen DOM
 *
 * Cara pakai:
 *   const { containerRef, headerRef } = useWindow("finder");
 *   return <div ref={containerRef}><div ref={headerRef}>...</div></div>
 */
export function useWindow(windowKey) {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const draggableRef = useRef(null);

  // Subscribe HANYA ke window yang relevan, bukan seluruh windows object
  const isOpen = useWindowStore((state) => state.windows[windowKey]?.isOpen ?? false);
  const isMinimized = useWindowStore((state) => state.windows[windowKey]?.isMinimized ?? false);
  const zIndex = useWindowStore((state) => state.windows[windowKey]?.zIndex ?? 0);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  // --- Z-Index & Visibility sync ---
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.style.zIndex = zIndex;
    // visibility hidden saat closed agar tidak blocking pointer events
    el.style.visibility = isOpen && !isMinimized ? "visible" : "hidden";
  }, [zIndex, isOpen, isMinimized]);

  // --- GSAP Animations ---
  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      if (isOpen && !isMinimized) {
        // Open / Restore animation
        gsap.fromTo(
          el,
          { scale: 0.8, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            onStart: () => {
              el.style.visibility = "visible";
            },
          }
        );
      } else if (isMinimized) {
        // Minimize animation — animasikan menuju posisi tengah dock
        const dockEl = document.getElementById("dock");
        const dockRect = dockEl?.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        const targetX = dockRect
          ? dockRect.left + dockRect.width / 2 - elRect.left - elRect.width / 2
          : 0;
        const targetY = dockRect ? dockRect.top - elRect.top : 200;

        gsap.to(el, {
          scale: 0.3,
          opacity: 0,
          x: targetX,
          y: targetY,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            el.style.visibility = "hidden";
            // Reset transform setelah disembunyikan agar restore mulai dari posisi benar
            gsap.set(el, { x: 0, y: 0, scale: 1, opacity: 0 });
          },
        });
      } else {
        // Close — langsung hide tanpa animasi (atau bisa tambah fade)
        gsap.to(el, {
          scale: 0.9,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            el.style.visibility = "hidden";
            gsap.set(el, { scale: 1, opacity: 1 });
          },
        });
      }
    },
    { dependencies: [isOpen, isMinimized] }
  );

  // --- GSAP Draggable Setup ---
  useGSAP(
    () => {
      const el = containerRef.current;
      const handle = headerRef.current ?? el; // fallback ke container jika tidak ada header
      if (!el) return;

      gsap.registerPlugin(Draggable);

      const [instance] = Draggable.create(el, {
        trigger: handle,       // drag hanya dari header
        type: "x,y",
        edgeResistance: 0.65,
        bounds: "body",        // tidak bisa di-drag keluar viewport
        onPress() {
          focusWindow(windowKey); // bring to front saat diklik
        },
      });

      draggableRef.current = instance;

      return () => {
        instance.kill(); // cleanup saat unmount
      };
    },
    { dependencies: [] } // hanya run sekali saat mount
  );

  return { containerRef, headerRef };
}
```

---

## 📁 Step 2 — Update Setiap Window Component

Pola migrasi untuk SETIAP file di `src/windows/`:

### Pola SEBELUM (HOC)

```jsx
// src/windows/Finder.jsx  — SEBELUM

import WindowWrapper from "#hoc/WindowWrapper";
import { WindowControls } from "#components";

const Finder = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <h2>Finder</h2>
      </div>
      <div>content...</div>
    </>
  );
};

const FinderWrapped = WindowWrapper(Finder, "finder");
export default FinderWrapped;
```

### Pola SESUDAH (Custom Hook)

```jsx
// src/windows/Finder.jsx  — SESUDAH

import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";  // ← import hook baru

const Finder = () => {
  const { containerRef, headerRef } = useWindow("finder");  // ← pakai hook

  return (
    <div ref={containerRef} className="window finder-window">
      {/* headerRef di-attach ke elemen yang menjadi drag handle */}
      <div ref={headerRef} id="window-header">
        <WindowControls target="finder" />
        <h2>Finder</h2>
      </div>
      <div>content...</div>
    </div>
  );
};

// Tidak perlu HOC wrapping — langsung export komponen
export default Finder;
```

### Tabel Semua Window yang Harus Dimigasi

| File | `windowKey` yang dipakai |
|------|--------------------------|
| `Finder.jsx` | `"finder"` |
| `Safari.jsx` | `"safari"` |
| `Terminal.jsx` | `"terminal"` |
| `Resume.jsx` | `"resume"` |
| `Contact.jsx` | `"contact"` |
| `Photos.jsx` | `"photos"` |
| `Text.jsx` | `"text"` |
| `Image.jsx` | `"image"` |

> **Penting:** Pastikan `windowKey` yang dipakai di hook **identik** dengan key di `WINDOW_CONFIG` di `src/constants/index.js`. Jika tidak sama, window tidak akan bisa di-open/close.

---

## 📁 Step 3 — Tambah Path Alias untuk Hook (Opsional tapi Disarankan)

Edit `vite.config.js` — tambah alias `#hooks`:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#components": path.resolve(__dirname, "src/components"),
      "#windows": path.resolve(__dirname, "src/windows"),
      "#store": path.resolve(__dirname, "src/store"),
      "#hooks": path.resolve(__dirname, "src/hooks"),      // ← TAMBAH INI
      "#constants": path.resolve(__dirname, "src/constants"),
      "#assets": path.resolve(__dirname, "src/assets"),
      // "#hoc" bisa dihapus setelah semua migrasi selesai
    },
  },
});
```

Edit juga `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#components/*": ["src/components/*"],
      "#windows/*": ["src/windows/*"],
      "#store/*": ["src/store/*"],
      "#hooks/*": ["src/hooks/*"],
      "#constants/*": ["src/constants/*"],
      "#assets/*": ["src/assets/*"]
    }
  }
}
```

---

## 📁 Step 4 — Hapus HOC Folder

Setelah semua window telah dimigasi dan tidak ada lagi import ke `#hoc` atau `../hoc/WindowWrapper`:

1. Hapus file `src/hoc/WindowWrapper.jsx`
2. Hapus folder `src/hoc/` jika sudah kosong
3. Hapus alias `#hoc` dari `vite.config.js` dan `jsconfig.json`

Lakukan step ini **terakhir** setelah verifikasi semua window berfungsi.

---

## ✅ Standar Keberhasilan Refactor

Refactor dinyatakan **BERHASIL** jika SELURUH kriteria berikut terpenuhi:

### 1. Kriteria Fungsional (Wajib Semua Lulus)

| No | Kriteria | Cara Verifikasi |
|----|----------|-----------------|
| F1 | Semua 8 window bisa dibuka dari dock | Klik setiap ikon di dock, window muncul |
| F2 | Semua 8 window bisa dibuka dari navbar | Klik "Projects", "Contact", "Resume" di navbar |
| F3 | Open animation berfungsi (scale + fade in) | Perhatikan animasi saat window muncul |
| F4 | Close animation berfungsi (fade out) | Klik tombol merah, window fade out |
| F5 | Minimize animation berfungsi (menuju dock) | Klik tombol kuning, window mengecil ke dock |
| F6 | Restore dari minimize berfungsi | Klik ikon dock yang sedang minimize |
| F7 | Window bisa di-drag dari header | Klik dan drag area header window |
| F8 | Drag tidak keluar dari batas viewport | Drag window ke tepi layar |
| F9 | Klik window membawa ke depan (z-index) | Buka 2 window, klik yang di belakang |
| F10 | `WindowControls` (close/min/max) berfungsi | Test setiap tombol di setiap window |
| F11 | State Zustand masih sinkron | Buka DevTools → Zustand, cek `isOpen`/`isMinimized` berubah |
| F12 | Tidak ada import ke `WindowWrapper` atau `#hoc` tersisa | Search di codebase: `grep -r "WindowWrapper\|#hoc"` |

### 2. Kriteria Kualitas Kode (Wajib Semua Lulus)

| No | Kriteria | Cara Verifikasi |
|----|----------|-----------------|
| C1 | Tidak ada file di `src/hoc/` | `ls src/hoc/` harus error atau kosong |
| C2 | Semua window export langsung komponen (bukan HOC result) | Cek setiap file: tidak ada `WindowWrapper(Comp, key)` |
| C3 | Setiap window punya `containerRef` dan `headerRef` yang di-attach | Review kode tiap window |
| C4 | `useWindow` hook ada di `src/hooks/useWindow.js` | `ls src/hooks/` |
| C5 | GSAP Draggable cleanup dilakukan (`instance.kill()`) | Review kode hook, ada `return () => instance.kill()` |
| C6 | Tidak ada memory leak (Draggable tidak di-create berulang) | Dependencies array `useGSAP` untuk drag hanya `[]` |
| C7 | `windowKey` di hook match dengan key di `WINDOW_CONFIG` | Cross-check constants vs hook calls |

### 3. Kriteria Performa (Target)

| No | Kriteria | Target |
|----|----------|--------|
| P1 | Tidak ada re-render berlebihan | Setiap window hanya re-render saat state window ITU berubah |
| P2 | Bundle size tidak bertambah signifikan | Delta < 5KB dari sebelum refactor |
| P3 | Animasi tetap smooth | 60fps di Chrome DevTools Performance panel |
| P4 | Tidak ada warning di console | Console bersih saat buka/tutup window |

### 4. Kriteria Negatif (Tidak Boleh Ada)

| No | Hal yang TIDAK Boleh Ada |
|----|--------------------------|
| N1 | Import `WindowWrapper` di manapun dalam kodebase |
| N2 | File `src/hoc/WindowWrapper.jsx` masih exist |
| N3 | Window yang tidak bisa di-drag sama sekali |
| N4 | Window yang z-index-nya tidak berubah saat diklik |
| N5 | Animasi open/close yang hilang atau broken |
| N6 | GSAP error di console (`Cannot read properties of null`) |
| N7 | React error tentang hooks (`Invalid hook call`) |

---

## 🧪 Urutan Testing

Lakukan testing dalam urutan berikut setelah refactor selesai:

### Phase 1 — Smoke Test (Cek tidak ada error)
1. `npm run dev` — pastikan tidak ada compile error
2. Buka browser, buka DevTools Console
3. Pastikan tidak ada error merah di console

### Phase 2 — Per-Window Test
Untuk SETIAP window (Finder, Safari, Terminal, Resume, Contact, Photos, Text, Image):
1. Klik ikon di dock → window muncul dengan animasi ✓
2. Drag window dari headernya → bergerak ✓
3. Klik tombol minimize (kuning) → animasi ke dock ✓
4. Klik ikon dock lagi → window restore ✓
5. Klik tombol close (merah) → window tutup ✓

### Phase 3 — Multi-Window Test
1. Buka 3 window sekaligus
2. Klik window yang paling belakang → harus naik ke depan
3. Minimize 1 window, buka window lain → tidak saling mengganggu
4. Drag beberapa window bersamaan (bergantian) → tidak crash

### Phase 4 — Regression Test
1. Buka "Projects" dari navbar → Finder terbuka ✓
2. Buka "Contact" dari navbar → Contact terbuka ✓
3. Buka "Resume" dari navbar → Resume PDF terbuka ✓
4. Semua dock indicators (dot putih/abu) muncul dengan benar ✓

---

## ⚠️ Hal yang Perlu Diperhatikan

### Tentang `containerRef` vs Elemen Existing

HOC lama mungkin menggunakan elemen root yang sudah ada. Saat migrasi, **pastikan setiap window component memiliki satu root `<div>` yang menerima `containerRef`**. Jangan attach ke fragment (`<>`) karena GSAP tidak bisa animate fragment.

```jsx
// ❌ SALAH — Fragment tidak bisa di-ref
const Finder = () => {
  const { containerRef } = useWindow("finder");
  return (
    <>   {/* ← ini tidak bisa punya ref */}
      <div ref={containerRef}>...</div>
    </>
  );
};

// ✅ BENAR — Satu root div
const Finder = () => {
  const { containerRef } = useWindow("finder");
  return (
    <div ref={containerRef}>   {/* ← langsung div */}
      ...
    </div>
  );
};
```

### Tentang Initial Visibility

Saat pertama kali render, window harus dalam keadaan `visibility: hidden` dan `opacity: 0` agar tidak muncul sebelum animasi open berjalan. Pastikan CSS default window tidak override ini.

Tambahkan di `src/index.css` atau di style window:

```css
/* Default state untuk semua window — tersembunyi sebelum diopen */
.window {
  visibility: hidden;
  opacity: 0;
}
```

### Tentang `focusWindow` saat Drag

Saat `Draggable.create` di-setup di `useGSAP` dengan dependency `[]`, closure `focusWindow` akan stale jika store berubah. Gunakan `useRef` untuk menyimpan fungsi terbaru:

```js
// Di dalam useWindow.js
const focusWindowRef = useRef(focusWindow);
useLayoutEffect(() => {
  focusWindowRef.current = focusWindow;
}, [focusWindow]);

// Lalu di Draggable:
Draggable.create(el, {
  onPress() {
    focusWindowRef.current(windowKey);  // ← selalu pakai versi terbaru
  },
});
```

---

## 📐 Struktur File Akhir yang Diharapkan

```
src/
├── components/       # Tidak berubah
├── windows/          # Semua file dimigasi, tidak ada HOC pattern
│   ├── Finder.jsx    # export default Finder (bukan wrapped)
│   ├── Safari.jsx
│   ├── Terminal.jsx
│   ├── Resume.jsx
│   ├── Contact.jsx
│   ├── Photos.jsx
│   ├── Text.jsx
│   ├── Image.jsx
│   └── index.js
├── store/            # Tidak berubah
├── hooks/            # ← BARU
│   └── useWindow.js  # Custom hook pengganti HOC
├── hoc/              # ← DIHAPUS SEPENUHNYA
├── constants/        # Tidak berubah
└── assets/           # Tidak berubah
```

---

## 🔁 Rollback Plan

Jika refactor mengalami masalah kritis:

1. Jangan hapus `src/hoc/WindowWrapper.jsx` sampai semua window sudah diverifikasi
2. Bisa revert per-file (per window) jika ada yang bermasalah
3. Commit sebelum mulai refactor agar bisa `git revert` dengan aman

```bash
# Sebelum mulai, buat commit checkpoint
git add .
git commit -m "chore: checkpoint before HOC refactor"

# Jika perlu rollback
git revert HEAD
```

---

*Dokumen ini dibuat untuk AI agent. Ikuti step secara berurutan: buat hook → migasi windows satu per satu → hapus HOC → verifikasi dengan standar keberhasilan di atas.*
