"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plane, LayoutDashboard, BookMarked, DollarSign, CloudSun, LogOut, Menu, X, Plus } from "lucide-react";

const navItems = [
  { href: "/dashboard",     label: "Ana Sayfa",          icon: LayoutDashboard },
  { href: "/saved-travels", label: "Kayıtlı Seyahatler", icon: BookMarked },
  { href: "/currency",      label: "Döviz Çevirici",     icon: DollarSign },
  { href: "/weather",       label: "Hava Durumu",         icon: CloudSun },
];

export default function Navbar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--primary)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <Plane size={16} className="text-white" />
            </div>
            TravelMind AI
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white uppercase"
              style={{ background: "var(--primary)" }}>
              {userEmail?.[0] ?? "U"}
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-light)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-light)")}>
              <LogOut size={18} />
            </button>
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
