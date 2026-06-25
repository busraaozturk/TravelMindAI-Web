"use client";

import { ArrowLeftRight, RefreshCw, Download, Share2, Bookmark, Compass } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlanHeader({ plan }: { plan: any }) {
  const planData = plan.plan_data;

  const subtitle = [
    plan.duration_days ? `${plan.duration_days} gün` : null,
    plan.travelers ? `${plan.travelers} kişi` : null,
    plan.travelers === 1 ? "Tek başına" : null,
    "Dengeli tarz",
    plan.start_date
      ? new Date(plan.start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const tags: string[] = planData?.interests ?? plan.interests ?? [];

  function handlePDF() {
    window.print();
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: planData?.title ?? plan.destination, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Bağlantı kopyalandı!");
    }
  }

  return (
    <div className="space-y-4">
      {/* Başlık + alt bilgi */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
          {plan.destination} Seyahat Planınız
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-light)" }}>{subtitle}</p>
      </div>

      {/* Aksiyon butonları */}
      <div className="flex flex-wrap gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ background: "var(--primary-soft)", color: "var(--primary)", border: "1px solid var(--border)" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <ArrowLeftRight size={15} />
          Alternatif Plan
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <RefreshCw size={15} />
          Yeniden Oluştur
        </button>

        <button
          onClick={handlePDF}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <Download size={15} />
          PDF Olarak İndir
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <Share2 size={15} />
          Paylaş
        </button>

        <button
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all"
          style={{ background: "var(--primary)" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <Bookmark size={15} />
          Planı Kaydet
        </button>
      </div>

      {/* Özet kartı */}
      {planData?.summary && (
        <div style={{
          background: "linear-gradient(135deg, #FFF4EC, #FDF8F1)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          padding: "28px",
          marginBottom: "0px",
        }}>
          <div style={{ fontSize: "1.12rem", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "var(--primary-soft)", color: "var(--primary)",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <Compass size={17} />
            </div>
            <span className="font-bold" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text)" }}>
              Seyahat Özeti
            </span>
          </div>

          <p style={{ color: "var(--text)", fontSize: ".98rem", lineHeight: "1.7" }}>
            {planData.summary}
          </p>

          {tags.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
              {tags.map((tag: string) => (
                <span key={tag} style={{
                  fontSize: ".78rem",
                  fontWeight: 600,
                  background: "#fff",
                  border: "1px solid var(--border)",
                  color: "var(--primary-dark)",
                  padding: "5px 12px",
                  borderRadius: "999px",
                }}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
