import { createClient } from "@/lib/supabase/server";
import { MapPin, Calendar, Clock, Wallet, Star, Mail, User, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

const AVATAR_COLORS = ["#C96C4A", "#6B8CAE", "#5E9C76", "#E8B27D", "#B05A3A", "#9B59B6"];

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: plans } = await supabase
    .from("travel_plans")
    .select("id, destination, duration_days, budget, currency, created_at, travelers")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating")
    .eq("user_id", user!.id);

  const fullName = user?.user_metadata?.full_name ?? "";
  const email = user?.email ?? "";
  const initials = fullName
    ? fullName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : email[0]?.toUpperCase() ?? "U";
  const avatarColor = AVATAR_COLORS[email.charCodeAt(0) % AVATAR_COLORS.length];
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })
    : "—";

  const totalPlans = plans?.length ?? 0;
  const totalDays = plans?.reduce((s, p) => s + (p.duration_days ?? 0), 0) ?? 0;
  const totalBudget = plans?.reduce((s, p) => s + (p.budget ?? 0), 0) ?? 0;
  const totalReviews = reviews?.length ?? 0;
  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const destinations = [...new Set(plans?.map(p => p.destination) ?? [])].slice(0, 6);

  const stats = [
    { icon: MapPin, label: "Toplam Plan", value: totalPlans, color: "#C96C4A", bg: "#F6E3DA" },
    { icon: Clock,  label: "Toplam Gün",  value: `${totalDays} gün`, color: "#6B8CAE", bg: "#EAF1F7" },
    { icon: Wallet, label: "Toplam Bütçe", value: `₺${totalBudget.toLocaleString("tr-TR")}`, color: "#5E9C76", bg: "#E7F2EB" },
    { icon: Star,   label: "Yorum", value: totalReviews, color: "#E8B27D", bg: "#FBEEDD" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Profil kartı */}
      <div style={{
        background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
        borderRadius: 20, padding: "32px 36px", color: "white",
        display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: avatarColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "white", flexShrink: 0,
          border: "3px solid rgba(255,255,255,0.3)",
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "1.6rem", margin: 0, marginBottom: 4 }}>
            {fullName || email.split("@")[0]}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.85, fontSize: 14 }}>
            <Mail size={14} />
            {email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.7, fontSize: 13, marginTop: 4 }}>
            <Calendar size={13} />
            {memberSince} tarihinden beri üye
          </div>
        </div>

        {avgRating && (
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>{avgRating}</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Ortalama Puan</div>
            <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 4 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} style={{ fill: Number(avgRating) >= s ? "#F5A623" : "rgba(255,255,255,0.3)", color: Number(avgRating) >= s ? "#F5A623" : "rgba(255,255,255,0.3)" }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* İstatistikler */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "20px 22px",
            boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

        {/* Hesap Bilgileri */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--primary-soft)", display: "grid", placeItems: "center" }}>
              <User size={16} style={{ color: "var(--primary)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Hesap Bilgileri</span>
          </div>

          {[
            { label: "Ad Soyad", value: fullName || "—" },
            { label: "E-posta", value: email },
            { label: "Üyelik", value: memberSince },
            { label: "Hesap Türü", value: "Standart Üye" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, color: "var(--text-light)" }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Güvenlik */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--info-soft)", display: "grid", placeItems: "center" }}>
              <Shield size={16} style={{ color: "var(--info)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Güvenlik</span>
          </div>

          {[
            { label: "Şifre", value: "••••••••", hint: "Supabase üzerinden değiştirilebilir" },
            { label: "İki Faktörlü Doğrulama", value: "Pasif", hint: "Hesabını güvende tut" },
            { label: "Oturum", value: "Aktif", hint: "Bu cihazda oturum açık" },
          ].map(({ label, value, hint }) => (
            <div key={label} style={{ padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--text-light)" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{value}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-light)", opacity: 0.7, marginTop: 2 }}>{hint}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Son Seyahatler */}
      {destinations.length > 0 && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--success-soft)", display: "grid", placeItems: "center" }}>
                <MapPin size={16} style={{ color: "var(--success)" }} />
              </div>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Gezilen Destinasyonlar</span>
            </div>
            <Link href="/saved-travels" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
              Tümü <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {destinations.map(dest => (
              <span key={dest} style={{
                padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                background: "var(--primary-soft)", color: "var(--primary)",
                border: "1px solid var(--border)",
              }}>
                📍 {dest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Son Planlar */}
      {plans && plans.length > 0 && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Son Planlar</span>
            <Link href="/saved-travels" style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
              Tümünü Gör →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {plans.slice(0, 4).map((p, i) => (
              <Link key={p.id} href={`/saved-travels/${p.id}`} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 8px",
                borderRadius: 10, textDecoration: "none",
                borderBottom: i < Math.min(plans.length, 4) - 1 ? "1px solid var(--border)" : "none",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={15} style={{ color: "var(--primary)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.destination}</div>
                  <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 1 }}>{p.duration_days} gün · {p.travelers} kişi</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", flexShrink: 0 }}>
                  ₺{p.budget?.toLocaleString("tr-TR")}
                </div>
                <ChevronRight size={14} style={{ color: "var(--text-light)", flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
