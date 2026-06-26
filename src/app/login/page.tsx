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


          <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--text-light)" }}>
            Hesabın yok mu?{" "}
            <Link href="/register" style={{ fontWeight: 600, color: "var(--primary)" }}>Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
