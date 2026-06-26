"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) { setError("Şifreler eşleşmiyor."); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalıdır."); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } },
    });
    if (error) {
      setError(error.message === "User already registered" ? "Bu e-posta ile zaten kayıt olunmuş." : "Kayıt sırasında hata oluştu.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 16px 11px 44px",
    border: "1.5px solid var(--border)", borderRadius: 10,
    fontSize: 15, outline: "none", background: "white",
    color: "var(--text)", fontFamily: "var(--font-inter), sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 14, fontWeight: 600,
    marginBottom: 6, color: "var(--text)",
    fontFamily: "var(--font-dm-sans), sans-serif",
  };

  const bgStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, #8B3E25 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  };

  if (success) {
    return (
      <div style={bgStyle}>
        <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-dm-sans), sans-serif" }}>Kayıt Başarılı!</h2>
          <p style={{ color: "var(--text-light)", fontSize: 14 }}>E-posta adresinize bir doğrulama bağlantısı gönderdik. Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={bgStyle}>
      <div style={{ width: "100%", maxWidth: 620 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: 16, marginBottom: 14,
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 19 21l-7-4-7 4Z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "white", fontFamily: "var(--font-dm-sans), sans-serif", margin: 0 }}>
            TravelMind <em style={{ fontStyle: "normal", color: "var(--secondary)" }}>AI</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", marginTop: 4, fontSize: 14 }}>
            Yapay zeka destekli seyahat planlayıcı
          </p>
        </div>

        {/* Kart */}
        <div style={{
          background: "white", borderRadius: 16, padding: "24px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}>
          <h2 style={{
            textAlign: "center", fontSize: "1.4rem", fontWeight: 700,
            color: "var(--text)", marginBottom: 18,
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}>Kayıt Ol</h2>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              color: "#B91C1C", borderRadius: 10, padding: "10px 14px",
              fontSize: 14, marginBottom: 16,
            }}>{error}</div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Sıra 1: Ad Soyad + E-posta */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Ad Soyad</label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }} placeholder="Ad Soyad" required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>E-posta</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }} placeholder="ornek@email.com" required />
                </div>
              </div>
            </div>

            {/* Sıra 2: Şifre + Şifre Tekrar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Şifre</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 36, paddingRight: 36, fontSize: 13 }} placeholder="Min. 6 karakter" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", display: "flex", alignItems: "center", padding: 0 }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Şifre Tekrar</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                  <input type={showPassword ? "text" : "password"} value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }} placeholder="Tekrar girin" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px 24px", borderRadius: 10,
              background: "var(--primary)", color: "white",
              border: "none", fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", boxSizing: "border-box", marginTop: 4,
            }}>
              {loading ? <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> : "Kayıt Ol"}
            </button>
          </form>


          <p style={{ textAlign: "center", marginTop: 14, fontSize: 14, color: "var(--text-light)" }}>
            Zaten hesabın var mı?{" "}
            <Link href="/login" style={{ fontWeight: 600, color: "var(--primary)" }}>Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
