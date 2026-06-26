"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
    } else {
      router.push("/dashboard");
      router.refresh();
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
    width: "100%", padding: "10px 16px 10px 42px",
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

  return (
    <div style={{
      height: "100vh", overflow: "hidden",
      background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, #8B3E25 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
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
          <p style={{ color: "rgba(255,255,255,0.75)", marginTop: 2, fontSize: 13 }}>
            Yapay zeka destekli seyahat planlayıcı
          </p>
        </div>

        {/* Kart */}
        <div style={{
          background: "white", borderRadius: 16, padding: "28px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}>
          <h2 style={{
            textAlign: "center", fontSize: "1.25rem", fontWeight: 700,
            color: "var(--text)", marginBottom: 18,
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}>Giriş Yap</h2>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              color: "#B91C1C", borderRadius: 10, padding: "10px 14px",
              fontSize: 14, marginBottom: 16,
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={labelStyle}>E-posta</label>
              <div style={{ position: "relative" }}>
                <Mail size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  style={inputStyle} placeholder="ornek@email.com" required />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Şifre</label>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 44 }} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", display: "flex", alignItems: "center", padding: 0 }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "11px 24px", borderRadius: 10,
              background: "var(--primary)", color: "white",
              border: "none", fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", boxSizing: "border-box",
            }}>
              {loading ? <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> : "Giriş Yap"}
            </button>
          </form>

          {/* Ayraç */}
          <div style={{ position: "relative", margin: "14px 0" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%", borderTop: "1px solid var(--border)" }} />
            </div>
            <div style={{ position: "relative", display: "flex", justifyContent: "center", fontSize: 13 }}>
              <span style={{ background: "white", padding: "0 12px", color: "var(--text-light)" }}>veya</span>
            </div>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading} style={{
            width: "100%", padding: "10px 24px", borderRadius: 10,
            background: "white", color: "var(--text)",
            border: "1.5px solid var(--border)", fontFamily: "var(--font-dm-sans), sans-serif",
            fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.2s", boxSizing: "border-box",
          }}>
            {googleLoading ? (
              <span style={{ width: 18, height: 18, border: "2px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Google ile giriş yap
          </button>

          <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--text-light)" }}>
            Hesabın yok mu?{" "}
            <Link href="/register" style={{ fontWeight: 600, color: "var(--primary)" }}>Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
