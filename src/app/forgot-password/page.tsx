"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError("E-posta gönderilemedi. Lütfen tekrar deneyin.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  const bgStyle: React.CSSProperties = {
    height: "100vh", overflow: "hidden",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, #8B3E25 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
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

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", marginBottom: 10 }}>
                E-posta Gönderildi!
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.65, marginBottom: 24 }}>
                <strong style={{ color: "var(--text)" }}>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik. Gelen kutunu kontrol et.
              </p>
              <Link href="/login" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 600, color: "var(--primary)", textDecoration: "none",
              }}>
                <ArrowLeft size={15} /> Giriş sayfasına dön
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: 6, textAlign: "center" }}>
                Şifremi Unuttum
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-light)", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
                E-posta adresini gir, şifre sıfırlama bağlantısı gönderelim.
              </p>

              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 14, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "var(--text)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                    E-posta
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="ornek@email.com" required
                      style={{ width: "100%", padding: "10px 16px 10px 42px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 15, outline: "none", background: "white", color: "var(--text)", fontFamily: "var(--font-inter), sans-serif", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: "11px 24px", borderRadius: 10,
                  background: "var(--primary)", color: "white", border: "none",
                  fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600, fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {loading
                    ? <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                    : "Sıfırlama Bağlantısı Gönder"
                  }
                </button>
              </form>

              <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--text-light)" }}>
                <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                  <ArrowLeft size={14} /> Giriş sayfasına dön
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
