# Refactor Spec: Window Manager, PDF Resume, Photo Gallery

> **Target Agent:** OpenAI Codex  
> **Repo Stack:** React + TypeScript + GSAP + Tailwind CSS  
> **Scope:** 3 isolated tasks — baca satu per satu, kerjakan berurutan.

---

## TASK 1 — Fix: Restore Animation Glitch (`src/hooks/useWindow.ts`)

### Problem
`Draggable.enable()` dipanggil di dalam `onComplete` callback. Kalau user langsung drag jendela sebelum animasi selesai, koordinat `translate3d` (GSAP) dan `top/left` inline styles bertabrakan → jendela teleport/glitch.

### Root Cause
```ts
// ❌ SEKARANG — hanya aktif setelah animasi 100% selesai
onComplete: () => {
  draggableInstanceRef.current?.enable();
  draggableInstanceRef.current?.update();
}
```

### Fix
Dalam blok `else` (restore dari maximize) di dalam `useGSAP()`, ganti seluruh logika menjadi:

```ts
} else {
  const wasMaximized =
    el.style.width === "100vw" ||
    el.getBoundingClientRect().width === window.innerWidth;

  if (wasMaximized) {
    // ✅ 1. Enable Draggable SEBELUM animasi mulai
    draggableInstanceRef.current?.enable();

    gsap.to(el, {
      x: lastPositionRef.current.x,
      y: lastPositionRef.current.y,
      width: windowConfigRef.current?.width ?? "auto",
      height: windowConfigRef.current?.height ?? "auto",
      borderRadius: "12px",
      duration: 0.5,
      ease: "power4.out",
      clearProps: "top,left",

      // ✅ 2. Sync koordinat Draggable setiap frame
      onUpdate: () => {
        draggableInstanceRef.current?.update();
      },

      // ✅ 3. Lock koordinat final setelah selesai
      onComplete: () => {
        draggableInstanceRef.current?.update();
      },
    });
  } else {
    // logika open window normal — jangan diubah
  }
}
```

### CSS Guard (`src/App.css` atau file global)
Hapus atau batasi `transition` pada `.window` supaya tidak tabrakan dengan GSAP:

```css
/* ❌ JANGAN — akan bikin stuttering */
.window {
  transition: all 0.3s ease;
}

/* ✅ BOLEH — hanya properti dekoratif */
.window {
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}
```

### Definition of Done
- [ ] Drag jendela di tengah animasi restore → tidak ada lompatan piksel
- [ ] Animasi menggunakan kurva `power4.out` (cepat di awal, lambat di akhir)
- [ ] Border radius melengkung kembali secara smooth bersamaan dengan resize

---

## TASK 2 — Fix: PDF Resume Tidak Center & Tidak Responsif (`src/windows/Resume.tsx`)

### Problem
Komponen `<Page />` dari `react-pdf` render `<canvas>` dengan dimensi absolut berdasarkan metadata PDF. Saat jendela di-maximize, canvas tetap di sisi kiri dengan ukuran lama.

### Root Cause
`width` prop di `<Page />` di-hardcode atau tidak diupdate saat dimensi jendela berubah.

### Fix

**Step 1 — Pasang `ResizeObserver` untuk baca lebar kontainer:**

```ts
// Di dalam Resume.tsx
const containerRef = useRef<HTMLDivElement>(null);
const [containerWidth, setContainerWidth] = useState<number>(0);

useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const observer = new ResizeObserver(([entry]) => {
    setContainerWidth(entry.contentRect.width);
  });

  observer.observe(el);
  return () => observer.disconnect();
}, []);
```

**Step 2 — Terapkan ke markup:**

```tsx
<div
  ref={containerRef}
  className="flex flex-col items-center w-full h-full overflow-auto px-4 py-6"
>
  <Document file={pdfFile}>
    <Page
      pageNumber={pageNumber}
      width={containerWidth > 0 ? containerWidth - 32 : undefined}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  </Document>
</div>
```

> `- 32` = kompensasi padding horizontal (`px-4` = 16px × 2).

### Definition of Done
- [ ] Buka jendela Resume → PDF langsung center
- [ ] Klik Maximize → PDF otomatis melebar mengisi lebar jendela
- [ ] Restore kembali → PDF menyesuaikan lebar normal tanpa perlu reload

---

## TASK 3 — Fix: Dead Space Galeri Foto (`src/windows/Photos.tsx`)

### Problem
Grid/Flexbox uniform menyamakan tinggi semua item berdasarkan foto tertinggi. Foto landscape di sebelah foto portrait → ruang kosong besar di bawah foto landscape.

### Root Cause
Struktur grid saat ini menggunakan `grid-cols-X` atau `flex` dengan `h-full` / `aspect-ratio` paksa pada `<li>`.

### Fix
Ganti seluruh kontainer grid dengan CSS Columns (Masonry layout):

```tsx
// ✅ Ganti struktur gallery menjadi ini
<div className="flex-1 p-4 overflow-auto max-h-[calc(85vh-2.5rem)]">
  <ul className="columns-2 md:columns-3 gap-4 space-y-4">
    {gallery.map(({ id, img }) => (
      <li
        key={id}
        className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        onClick={() => openWindow("imgfile", { id, imageUrl: img })}
      >
        <img
          src={img}
          alt={`Photo ${id}`}
          className="w-full h-auto object-contain block rounded-lg"
        />
      </li>
    ))}
  </ul>
</div>
```

### Kenapa `break-inside-avoid`?
Mencegah foto terpotong di antara dua kolom CSS. Setiap `<li>` diperlakukan sebagai satu blok utuh yang tidak boleh dibelah.

### Definition of Done
- [ ] Foto landscape dan portrait mengalir natural seperti layout Pinterest
- [ ] Tidak ada kotak kosong (dead space) vertikal di bawah foto manapun
- [ ] `gap-4` konsisten di semua sisi antar foto

---

## Urutan Eksekusi untuk Codex

```
1. Kerjakan TASK 1 dulu → test drag selama restore animation
2. Kerjakan TASK 2 → test PDF maximize + restore
3. Kerjakan TASK 3 → test galeri dengan foto campuran portrait/landscape
```

Jangan merge semua perubahan sekaligus. Commit tiap task secara terpisah agar mudah di-revert kalau ada issue.

---

## Files yang Dimodifikasi

| File | Task |
|------|------|
| `src/hooks/useWindow.ts` | TASK 1 |
| `src/App.css` | TASK 1 |
| `src/windows/Resume.tsx` | TASK 2 |
| `src/windows/Photos.tsx` | TASK 3 |

---

*Dokumen ini cukup — tidak perlu file tambahan. Semua perubahan bersifat surgical (targeted), tidak ada refactor arsitektural besar.*
