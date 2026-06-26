"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Star, Send, Clock, CheckCircle, ImagePlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((s) => (
        <button key={s} type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className="transition-transform hover:scale-110">
          <Star size={22} style={{
            color: (onChange ? (hover || value) : value) >= s ? "#F5A623" : "var(--border)",
            fill:  (onChange ? (hover || value) : value) >= s ? "#F5A623" : "none",
          }} />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={13} style={{ color: value >= s ? "#F5A623" : "var(--border)", fill: value >= s ? "#F5A623" : "none" }} />
      ))}
    </div>
  );
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ["#C96C4A","#6B8CAE","#5E9C76","#E8B27D","#B05A3A"];
  const color = colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>
      {initials || "?"}
    </div>
  );
}

function ReviewImages({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) return null;
  let urls: string[] = [];
  try { urls = JSON.parse(imageUrl); } catch { urls = [imageUrl]; }
  if (!urls.length) return null;
  return (
    <div className={`grid gap-1 ${urls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {urls.map((url, i) => (
        <img key={i} src={url} alt={`Seyahat fotoğrafı ${i + 1}`}
          className="w-full object-cover"
          style={{ height: urls.length === 1 ? 160 : 110 }} />
      ))}
    </div>
  );
}

interface Review {
  id: string;
  full_name: string;
  plan_name: string | null;
  rating: number;
  text: string;
  image_url: string | null;
  created_at: string;
}

const MAX_IMAGES = 4;

export default function FeedbackPage() {
  const supabase = createClient();

  const [reviews, setReviews]           = useState<Review[]>([]);
  const [loadingList, setLoadingList]   = useState(true);
  const [rating, setRating]             = useState(0);
  const [planName, setPlanName]         = useState("");
  const [text, setText]                 = useState("");
  const [imageFiles, setImageFiles]     = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sending, setSending]           = useState(false);
  const [sent, setSent]                 = useState(false);
  const [error, setError]               = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const ratingCounts = [5,4,3,2,1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
    pct: reviews.length ? Math.round(reviews.filter(r => r.rating === s).length / reviews.length * 100) : 0,
  }));

  async function loadReviews() {
    setLoadingList(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoadingList(false);
  }

  useEffect(() => { loadReviews(); }, []);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const toAdd = files.slice(0, MAX_IMAGES - imageFiles.length);
    for (const f of toAdd) {
      if (f.size > 5 * 1024 * 1024) { setError("Her resim 5 MB'dan küçük olmalı."); return; }
    }
    setImageFiles(prev => [...prev, ...toAdd]);
    setImagePreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(idx: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || !text.trim()) return;
    setSending(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    const fullName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Anonim";

    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const ext  = file.name.split(".").pop();
      const path = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("review-images").upload(path, file, { upsert: true });
      if (upErr) { setError("Resim yüklenemedi: " + upErr.message); setSending(false); return; }
      const { data: pub } = supabase.storage.from("review-images").getPublicUrl(path);
      uploadedUrls.push(pub.publicUrl);
    }

    const image_url = uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null;

    const { error: dbErr } = await supabase.from("reviews").insert({
      user_id: user!.id, full_name: fullName,
      plan_name: planName.trim() || null,
      rating, text: text.trim(), image_url,
    });
    if (dbErr) { setError("Yorum gönderilemedi: " + dbErr.message); setSending(false); return; }

    await fetch("https://formspree.io/f/xpqeyzwo", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        isim: fullName, email: user?.email ?? "",
        plan: planName.trim() || "Belirtilmedi",
        puan: `${"⭐".repeat(rating)} (${rating}/5)`,
        yorum: text.trim(),
        resimler: uploadedUrls.join(", ") || "Eklenmedi",
        tarih: new Date().toLocaleString("tr-TR"),
      }),
    });

    setSending(false); setSent(true);
    setRating(0); setPlanName(""); setText(""); setImageFiles([]); setImagePreviews([]);
    await loadReviews();
    setTimeout(() => setSent(false), 3000);
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Başlık */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--primary-soft)" }}>
          <MessageSquare size={20} style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Seyahat Yorumları</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>Deneyimini paylaş, başkalarına ilham ver</p>
        </div>
      </div>


      {/* İki sütun */}
      <div className="flex gap-6 items-start">

        {/* Sol: Yorum formu */}
        <div className="card p-6 flex-shrink-0" style={{ width: 640 }}>
          <h2 className="font-bold mb-5" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Yorum Yaz</h2>

          {sent ? (
            <div className="flex items-center gap-3 py-3 text-sm font-semibold" style={{ color: "var(--success)" }}>
              <CheckCircle size={20} /> Yorumun yayınlandı, teşekkürler! 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Puanın</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                  Hangi seyahat planın için?{" "}
                  <span className="font-normal" style={{ color: "var(--text-light)" }}>isteğe bağlı</span>
                </label>
                <input className="input-field" placeholder="örn. İstanbul 3 Gün, Roma 5 Gün..."
                  value={planName} onChange={e => setPlanName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>Yorumun</label>
                <textarea className="input-field resize-none" rows={4}
                  placeholder="Seyahat deneyimini ve planın nasıl yardımcı olduğunu anlat..."
                  value={text} onChange={e => setText(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Seyahat fotoğrafları{" "}
                  <span className="font-normal" style={{ color: "var(--text-light)" }}>
                    isteğe bağlı · max {MAX_IMAGES} resim
                  </span>
                </label>
                <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative rounded-2xl" style={{ border: "2px solid var(--border)", padding: "6px" }}>
                      <img src={src} alt={`Önizleme ${idx + 1}`}
                        className="rounded-xl object-cover block w-full" style={{ height: 120 }} />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ top: "6px", right: "6px", background: "var(--primary)", color: "white" }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < MAX_IMAGES && (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-1 rounded-2xl font-medium transition-all"
                      style={{ border: "2px dashed var(--border)", color: "var(--text-light)", background: "var(--bg)", width: "100%", height: 138 }}>
                      <ImagePlus size={22} style={{ color: "var(--primary)" }} />
                      <span className="text-xs">{imagePreviews.length > 0 ? "Ekle" : "Fotoğraf ekle"}</span>
                      <span className="text-xs" style={{ opacity: 0.6 }}>{imagePreviews.length}/{MAX_IMAGES}</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
              </div>

              {error && <p className="text-sm" style={{ color: "#B91C1C" }}>{error}</p>}

              <button type="submit" disabled={!rating || !text.trim() || sending}
                className="btn-primary flex items-center gap-2 disabled:opacity-40">
                {sending ? <span className="spinner" /> : <Send size={15} />}
                {sending ? "Gönderiliyor..." : "Yorumu Gönder"}
              </button>
            </form>
          )}
        </div>

        {/* Sağ: Yorum listesi */}
        <div className="card p-6 flex-1 min-w-0 flex flex-col" style={{ maxHeight: "80vh" }}>
          <h2 className="font-bold mb-4 flex-shrink-0" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
            Seyahat Yorumları
          </h2>

          {/* Özet istatistik — kart içinde */}
          {reviews.length > 0 && (
            <div className="flex gap-6 items-center mb-4 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="text-4xl font-bold leading-none" style={{ color: "var(--primary)", fontFamily: "var(--font-dm-sans)" }}>{avgRating}</div>
                <StarDisplay value={Math.round(Number(avgRating))} />
                <div className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>{reviews.length} değerlendirme</div>
              </div>
              <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)", flexShrink: 0 }} />
              <div className="flex-1 space-y-1.5">
                {ratingCounts.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs font-semibold w-3 text-right flex-shrink-0" style={{ color: "var(--text)" }}>{star}</span>
                    <Star size={10} style={{ color: "#F5A623", fill: "#F5A623", flexShrink: 0 }} />
                    <div className="flex-1 rounded-full overflow-hidden h-2" style={{ background: "var(--border)" }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: pct > 0 ? "var(--primary)" : "transparent" }} />
                    </div>
                    <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: count > 0 ? "var(--text)" : "var(--text-light)" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingList ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ color: "var(--text-light)" }}>
              <div className="text-3xl mb-2 animate-pulse">💬</div>
              Yorumlar yükleniyor...
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-3">✍️</div>
              <p className="font-semibold" style={{ color: "var(--text)" }}>Henüz yorum yok</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>İlk yorumu sen yaz!</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {reviews.map(r => (
                <div key={r.id} className="card overflow-hidden">
                  <ReviewImages imageUrl={r.image_url} />
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.full_name} />
                        <div>
                          <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{r.full_name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarDisplay value={r.rating} />
                            {r.plan_name && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                                {r.plan_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: "var(--text-light)" }}>
                        <Clock size={11} />
                        {fmtDate(r.created_at)}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
