"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase oturumu hash'ten otomatik kurulur
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setError("Geçersiz veya süresi dolmuş bağlantı. Lütfen tekrar deneyin.");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) { setError("Şifreler eşleşmiyor."); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalıdır."); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("Şifre güncellenemedi. Lütfen tekrar deneyin.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }
    setLoading(false);
  }

  const bgStyle: React.CSSProperties = {
    height: "100vh", overflow: "hidden",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, #8B3E25 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 16px 10px 42px",
    border: "1.5px solid var(--border)", borderRadius: 10,
    fontSize: 15, outline: "none", background: "white",
    color: "var(--text)", fontFamily: "var(--font-inter), sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={bgStyle}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 48, height: 48, borderRadius: 14, marginBottom: 10,
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 19 21l-7-4-7 4Z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", fontFamily: "var(--font-dm-sans), sans-serif", margin: 0 }}>
            TravelMind <em style={{ fontStyle: "normal", color: "var(--secondary)" }}>AI</em>
          </h1>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: "32px 36px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", marginBottom: 8 }}>
                Şifren Güncellendi!
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-light)" }}>Ana sayfaya yönlendiriliyorsun...</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: 6, textAlign: "center" }}>
                Yeni Şifre Belirle
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-light)", textAlign: "center", marginBottom: 24 }}>
                Hesabın için yeni bir şifre oluştur.
              </p>

              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 14, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              {ready && (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--text)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                      Yeni Şifre
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="En az 6 karakter" required
                        style={{ ...inputStyle, paddingRight: 42 }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", display: "flex", alignItems: "center", padding: 0 }}>
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--text)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                      Şifre Tekrar
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                        placeholder="Şifreni tekrar gir" required
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} style={{
                    width: "100%", padding: "11px 24px", borderRadius: 10, marginTop: 4,
                    background: "var(--primary)", color: "white", border: "none",
                    fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600, fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {loading
                      ? <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                      : "Şifremi Güncelle"
                    }
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
