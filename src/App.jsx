import React, { useMemo, useState, useEffect, useRef } from "react";

// === TRAGO AVATAR Showcase ===
// نسخة لعرض أفتارات TRAGO بلون جميل وخاص بمجّودي
// ✔ عدّة أفتارات مع صور متعددة + رابط VRChat لكل واحد
// ✔ زر "إضافة أفتار" للمالك فقط (رمز الدخول السري 102361)
// ✔ حفظ تلقائي في localStorage واستيراد/تصدير JSON

const OWNER_CODE = "102361"; // رمز المالك

const SAMPLE = [
  {
    id: "trago-main",
    name: "TRAGO AVATAR — Signature",
    vrchat: "https://vrchat.com/home/avatar/xxxxxxxx",
    images: [
      "https://images.unsplash.com/photo-1557264337-e8a93017fe92?w=1600&q=60&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1600&q=60&auto=format&fit=crop",
    ],
    createdAt: "2025-10-05",
    tags: ["trago", "stylish", "vrchat"],
  },
];

function useOwner() {
  const [owner, setOwner] = useState(false);
  useEffect(() => {
    setOwner(localStorage.getItem("trago_owner") === "1");
  }, []);
  const activate = () => {
    const code = prompt("أدخل رمز المالك:");
    if (code === OWNER_CODE) {
      localStorage.setItem("trago_owner", "1");
      setOwner(true);
      alert("تم الدخول كمالك ✅");
    } else alert("رمز غير صحيح ❌");
  };
  const deactivate = () => {
    localStorage.removeItem("trago_owner");
    setOwner(false);
  };
  return { owner, activate, deactivate };
}

function Lightbox({ item, open, onClose }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [item?.id]);
  if (!open || !item) return null;
  const imgs = item.images || [];
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={imgs[idx]} alt={item.name} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-lg" />
        <div className="mt-4 flex justify-between items-center text-white">
          <div className="flex gap-2">
            <button onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">←</button>
            <button onClick={() => setIdx((i) => (i + 1) % imgs.length)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">→</button>
          </div>
          <div className="flex gap-2">
            <a href={item.vrchat} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl font-semibold">VRChat ↗</a>
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddAvatar({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [vrchat, setVrchat] = useState("");
  const [images, setImages] = useState("");
  if (!open) return null;
  const save = () => {
    if (!name || !vrchat || !images.trim()) return alert("املأ كل الخانات");
    const imgs = images.split(/\n|,\s*/).map((x) => x.trim()).filter(Boolean);
    onSave({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, vrchat, images: imgs, createdAt: new Date().toISOString().slice(0, 10) });
    onClose();
    setName(""); setVrchat(""); setImages("");
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl max-w-lg w-full border border-gray-300 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-center mb-4">إضافة أفتار جديد</h3>
        <input className="w-full p-2 rounded-xl mb-2 border dark:bg-gray-800" placeholder="اسم الأفتار" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full p-2 rounded-xl mb-2 border dark:bg-gray-800" placeholder="رابط VRChat" value={vrchat} onChange={(e) => setVrchat(e.target.value)} />
        <textarea className="w-full p-2 rounded-xl mb-2 border h-28 dark:bg-gray-800" placeholder="روابط الصور (كل سطر = صورة)" value={images} onChange={(e) => setImages(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-xl">إلغاء</button>
          <button onClick={save} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold">حفظ</button>
        </div>
      </div>
    </div>
  );
}

function Card({ item, onOpen }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-b from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 shadow-md hover:shadow-xl transition">
      <button onClick={() => onOpen(item)} className="text-left w-full">
        <img src={item.images?.[0]} alt={item.name} className="w-full h-56 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
          <a href={item.vrchat} target="_blank" rel="noreferrer" className="inline-block mt-3 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-sm font-semibold">VRChat ↗</a>
        </div>
      </button>
    </div>
  );
}

export default function App() {
  const { owner, activate, deactivate } = useOwner();
  const [items, setItems] = useState(() => {
    try {
      const data = localStorage.getItem("trago_items");
      return data ? JSON.parse(data) : SAMPLE;
    } catch {
      return SAMPLE;
    }
  });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("trago_items", JSON.stringify(items));
  }, [items]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const s = search.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(s));
  }, [items, search]);

  // Export JSON (owner only)
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "avatars.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 backdrop-blur bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent tracking-tight">TRAGO AVATAR</h1>
          <div className="flex gap-2 items-center">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="rounded-xl px-3 py-2 border bg-white/80 dark:bg-gray-800/80" />
            {owner ? (
              <>
                <button onClick={() => setAddOpen(true)} className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">+ أضف أفتار</button>
                <button onClick={exportJSON} className="px-3 py-2 border rounded-xl">تصدير</button>
                <button onClick={deactivate} className="px-3 py-2 border rounded-xl">خروج</button>
              </>
            ) : (
              <button onClick={activate} className="px-3 py-2 border rounded-xl">تسجيل دخول المالك</button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item) => <Card key={item.id} item={item} onOpen={setSelected} />)}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} TRAGO • Designed by Majoodi
      </footer>

      <Lightbox open={!!selected} item={selected} onClose={() => setSelected(null)} />
      <AddAvatar open={addOpen} onClose={() => setAddOpen(false)} onSave={(a) => setItems((prev) => [a, ...prev])} />
    </div>
  );
}
