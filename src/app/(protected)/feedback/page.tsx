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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SyncedReviewPanel({ reviews, ratingCounts, avgRating, loadingList, fmtDate }: any) {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    function sync() {
      const panel = document.getElementById("feedback-form-panel");
      if (panel) setHeight(panel.offsetHeight);
    }
    sync();
    const ro = new ResizeObserver(sync);
    const panel = document.getElementById("feedback-form-panel");
    if (panel) ro.observe(panel);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="card p-6" style={{
      display: "flex", flexDirection: "column", overflow: "hidden",
      height: height ?? "auto",
    }}>
      <h2 className="font-bold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)", flexShrink: 0 }}>
        Seyahat Yorumları
      </h2>

      {reviews.length > 0 && (
        <div className="flex gap-6 items-center mb-4 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="text-4xl font-bold leading-none" style={{ color: "var(--primary)", fontFamily: "var(--font-dm-sans)" }}>{avgRating}</div>
            <StarDisplay value={Math.round(Number(avgRating))} />
            <div className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>{reviews.length} değerlendirme</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)", flexShrink: 0 }} />
          <div className="flex-1" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ratingCounts.map(({ star, count, pct }: { star: number; count: number; pct: number }) => (
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-light)" }}>
          <div className="text-3xl mb-2 animate-pulse">💬</div>
          Yorumlar yükleniyor...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="text-5xl mb-3">✍️</div>
          <p className="font-semibold" style={{ color: "var(--text)" }}>Henüz yorum yok</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>İlk yorumu sen yaz!</p>
        </div>
      ) : (
        <div style={{ overflowY: "auto", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 16, paddingRight: 4 }}>
          {reviews.map((r: any) => (
            <div key={r.id} style={{
              background: "var(--card)", borderRadius: "var(--radius)",
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
              overflow: "hidden", flexShrink: 0,
            }}>
              <ReviewImages imageUrl={r.image_url} />
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={r.full_name} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{r.full_name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                        <StarDisplay value={r.rating} />
                        {r.plan_name && (
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600, background: "var(--primary-soft)", color: "var(--primary)" }}>
                            {r.plan_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-light)", flexShrink: 0 }}>
                    <Clock size={11} />
                    {fmtDate(r.created_at)}
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "#2D3748", margin: 0 }}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const h = urls.length === 1 ? 120 : 90;
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 12px 0" }}>
      {urls.map((url, i) => (
        <div key={i} style={{ flex: 1, borderRadius: 10, overflow: "hidden", height: h }}>
          <img src={url} alt={`Seyahat fotoğrafı ${i + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
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
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Başlık */}
      <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--primary-soft)" }}>
          <MessageSquare size={20} style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Seyahat Yorumları</h1>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>Deneyimini paylaş, başkalarına ilham ver</p>
        </div>
      </div>

      {/* İki sütun — mobilde alt alta */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 24, alignItems: "start" }}>

        {/* Sol: Yorum formu — yüksekliği içeriğe göre sabit */}
        <div id="feedback-form-panel" style={{
          background: "var(--card)", borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
          padding: 28, display: "flex", flexDirection: "column",
        }}>
          <h2 className="font-bold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)", flexShrink: 0 }}>Yorum Yaz</h2>

          {sent ? (
            <div className="flex items-center gap-3 py-3 text-sm font-semibold" style={{ color: "var(--success)" }}>
              <CheckCircle size={20} /> Yorumun yayınlandı, teşekkürler! 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Puanın</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
                  Hangi seyahat planın için?{" "}
                  <span style={{ fontWeight: 400, color: "var(--text-light)" }}>isteğe bağlı</span>
                </label>
                <input className="input-field" placeholder="örn. İstanbul 3 Gün, Roma 5 Gün..."
                  value={planName} onChange={e => setPlanName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Yorumun</label>
                <textarea className="input-field resize-none" rows={3}
                  placeholder="Seyahat deneyimini ve planın nasıl yardımcı olduğunu anlat..."
                  value={text} onChange={e => setText(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
                  Seyahat fotoğrafları{" "}
                  <span style={{ fontWeight: 400, color: "var(--text-light)" }}>
                    isteğe bağlı · max {MAX_IMAGES} resim
                  </span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8 }}>
                  {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                    const src = imagePreviews[idx];
                    if (src) {
                      return (
                        <div key={idx} style={{ position: "relative", borderRadius: 12, border: "2px solid var(--border)", padding: 4 }}>
                          <img src={src} alt={`Önizleme ${idx + 1}`}
                            style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 8, display: "block" }} />
                          <button type="button" onClick={() => removeImage(idx)}
                            style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={10} />
                          </button>
                        </div>
                      );
                    }
                    if (idx === imagePreviews.length) {
                      return (
                        <button key={idx} type="button" onClick={() => fileRef.current?.click()}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 12, border: "2px dashed var(--border)", background: "var(--bg)", color: "var(--text-light)", height: 90, cursor: "pointer" }}>
                          <ImagePlus size={18} style={{ color: "var(--primary)" }} />
                          <span style={{ fontSize: 11, fontWeight: 500 }}>Ekle</span>
                          <span style={{ fontSize: 10, opacity: 0.6 }}>{imagePreviews.length}/{MAX_IMAGES}</span>
                        </button>
                      );
                    }
                    return (
                      <div key={idx} style={{ borderRadius: 12, border: "2px dashed var(--border)", background: "var(--bg)", height: 90, opacity: 0.4 }} />
                    );
                  })}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
              </div>

              {error && <p className="text-sm" style={{ color: "#B91C1C" }}>{error}</p>}

              <button type="submit" disabled={!rating || !text.trim() || sending}
                style={{
                  marginTop: 4, alignSelf: "flex-start",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 24px", borderRadius: 999,
                  background: (!rating || !text.trim() || sending) ? "var(--primary-soft)" : "var(--primary)",
                  color: (!rating || !text.trim() || sending) ? "var(--primary)" : "white",
                  border: "none", cursor: (!rating || !text.trim() || sending) ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600, fontSize: 15,
                  opacity: sending ? 0.7 : 1, transition: "all 0.2s",
                }}>
                {sending ? <span className="spinner" /> : <Send size={15} />}
                {sending ? "Gönderiliyor..." : "Yorumu Gönder"}
              </button>
            </form>
          )}
        </div>

        <SyncedReviewPanel reviews={reviews} ratingCounts={ratingCounts} avgRating={avgRating} loadingList={loadingList} fmtDate={fmtDate} />

      </div>

    </div>
  );
}
