"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, BookMarked, DollarSign, CloudSun, MessageSquare, LogOut, Menu, X, Plus, User } from "lucide-react";

const navItems = [
  { href: "/dashboard",     label: "Ana Sayfa",          icon: LayoutDashboard },
  { href: "/saved-travels", label: "Kayıtlı Seyahatler", icon: BookMarked },
  { href: "/currency",      label: "Döviz Çevirici",     icon: DollarSign },
  { href: "/weather",       label: "Hava Durumu",         icon: CloudSun },
  { href: "/feedback",      label: "Topluluk",            icon: MessageSquare },
];

export default function Navbar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 19 21l-7-4-7 4Z"/>
              </svg>
            </div>
            TravelMind <em style={{ fontStyle: "normal", color: "var(--primary)" }}>AI</em>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={pathname === href
                  ? { background: "var(--primary)", color: "white" }
                  : { color: "var(--text-light)" }}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/plan" className="btn-primary text-sm py-2 px-4">
              <Plus size={16} />
              Yeni Plan
            </Link>

            {/* Avatar + Dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white uppercase transition-all"
                style={{ background: "var(--primary)", outline: dropdownOpen ? "2px solid var(--secondary)" : "none", outlineOffset: 2 }}
              >
                {userEmail?.[0] ?? "U"}
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  minWidth: 200, zIndex: 100, overflow: "hidden",
                }}>
                  {/* Kullanıcı bilgisi */}
                  <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {userEmail?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {userEmail ?? "Kullanıcı"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-light)" }}>Üye</div>
                      </div>
                    </div>
                  </div>

                  {/* Menü öğeleri */}
                  <div style={{ padding: "6px 0" }}>
                    <Link href="/account" onClick={() => setDropdownOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", fontSize: 14, color: "var(--text)", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <User size={15} style={{ color: "var(--text-light)" }} />
                      Hesabım
                    </Link>

                    <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

                    <button onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", fontSize: 14, color: "#DC2626", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FEF2F2"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <LogOut size={15} />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" style={{ color: "var(--text)" }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-3 space-y-1" style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={pathname === href
                ? { background: "var(--primary)", color: "white" }
                : { color: "var(--text-light)" }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <Link href="/plan" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-sm py-2.5 mt-2">
            <Plus size={16} />
            Yeni Plan Oluştur
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium"
            style={{ color: "var(--primary)" }}>
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      )}
    </nav>
  );
}
