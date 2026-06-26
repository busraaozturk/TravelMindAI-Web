"use client";
import Link from "next/link";
import { useState } from "react";
import "./landing.css";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="lp-root">
        {/* Navbar */}
        <nav className="navbar">
          <div className="container nav-inner">
            <div className="logo">
              <div className="logo-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 19 21l-7-4-7 4Z"/></svg>
              </div>
              TravelMind <em style={{ fontStyle: "normal", color: "var(--primary)" }}>AI</em>
            </div>
            <div className="nav-links">
              <a href="#nasil">Nasıl Çalışır</a>
              <a href="#ozellikler">Özellikler</a>
              <a href="#ornek">Örnek Plan</a>
              <a href="#yorumlar">Yorumlar</a>
            </div>
            <div className="nav-cta">
              <Link href="/login" className="btn btn-primary btn-sm">Seyahatimi Planla</Link>
              <button className="nav-burger" aria-label="Menüyü aç" onClick={() => setMenuOpen(o => !o)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16"/>
                </svg>
              </button>
            </div>
          </div>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mmenu">
            <a href="#nasil" onClick={() => setMenuOpen(false)}>Nasıl Çalışır</a>
            <a href="#ozellikler" onClick={() => setMenuOpen(false)}>Özellikler</a>
            <a href="#ornek" onClick={() => setMenuOpen(false)}>Örnek Plan</a>
            <a href="#yorumlar" onClick={() => setMenuOpen(false)}>Yorumlar</a>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: "var(--primary)", fontWeight: 700 }}>Seyahatimi Planla</Link>
          </div>
        </nav>

        {/* Hero */}
        <header className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow"><span className="dot"></span> Gerçek zamanlı hava durumu · Canlı döviz kuru · Kişisel seyahat planı</span>
              <h1>Seyahatinizi planlamayın, <span className="accent">danışın
                <svg viewBox="0 0 200 12" preserveAspectRatio="none" fill="none"><path d="M3 9 C 60 2, 140 2, 197 8" stroke="#E8B27D" strokeWidth="5" strokeLinecap="round"/></svg>
              </span></h1>
              <p className="lead">TravelMind AI; tercihlerinizi öğrenir, gideceğiniz tarihe ait gerçek hava durumunu çeker ve bütçenize, ilgi alanlarınıza, ulaşım tercihinize göre saat saat optimize edilmiş kişisel seyahat planı oluşturur.</p>
              <div className="hero-actions">
                <Link href="/register" className="btn btn-primary">
                  Seyahatimi Planla
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
                </Link>
                <a href="#ornek" className="btn btn-ghost">Örnek Planı İncele</a>
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><b>5 adım</b><span>rehberli form süreci</span></div>
                <div className="hero-stat"><b>16 güne</b><span>kadar hava tahmini</span></div>
                <div className="hero-stat"><b>29 para</b><span>birimi döviz desteği</span></div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div className="float-chip c1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C96C4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 19 21l-7-4-7 4Z"/></svg>
                <span className="sparkle s1"></span><span className="sparkle s2"></span>
              </div>
              <div className="float-chip c2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5E9C76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 4.8a2 2 0 0 1-1.3 1.3L4 11l4.8 1.9a2 2 0 0 1 1.3 1.3L12 19l1.9-4.8a2 2 0 0 1 1.3-1.3L20 11l-4.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
                <span className="sparkle s1"></span><span className="sparkle s2"></span>
              </div>
              <div className="mock-card">
                <div className="mock-head">
                  <div><h3>Roma · 2. Gün</h3><small>Tarih + Gastronomi ağırlıklı</small></div>
                  <span className="mock-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    AI planı hazır
                  </span>
                </div>
                <div className="mock-item"><span className="mock-time">08:30</span><div><b>Trastevere&apos;de kahvaltı</b><span>Mahalle fırınında cornetto &amp; espresso</span></div></div>
                <div className="mock-item"><span className="mock-time">10:00</span><div><b>Kolezyum turu</b><span>Sıra beklemeden giriş, ~2 saat</span></div></div>
                <div className="mock-item"><span className="mock-time">13:00</span><div><b>Testaccio pazarında öğle</b><span>Yerel lezzet durakları</span></div></div>
                <div className="mock-item"><span className="mock-time">16:30</span><div><b>Aventino Tepesi</b><span>Anahtar deliği manzarası · gizli mekan</span></div></div>
                <div className="mock-budget">
                  <small>Bütçe dağılımı · ₺38.500</small>
                  <div className="mock-bars">
                    <i style={{ width:"42%", background:"#C96C4A" }}></i>
                    <i style={{ width:"24%", background:"#E8B27D" }}></i>
                    <i style={{ width:"14%", background:"#5E9C76" }}></i>
                    <i style={{ width:"12%", background:"#6B8CAE" }}></i>
                    <i style={{ width:"8%", background:"#CBB8A6" }}></i>
                  </div>
                  <div className="mock-legend">
                    <span><i style={{ background:"#C96C4A" }}></i>Konaklama</span>
                    <span><i style={{ background:"#E8B27D" }}></i>Yemek</span>
                    <span><i style={{ background:"#5E9C76" }}></i>Aktivite</span>
                    <span><i style={{ background:"#6B8CAE" }}></i>Ulaşım</span>
                    <span><i style={{ background:"#CBB8A6" }}></i>Acil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Nasıl Çalışır */}
        <section className="block" id="nasil">
          <div className="container">
            <div className="section-head">
              <span className="tag">Nasıl Çalışır</span>
              <h2>Birkaç dakikada eksiksiz seyahat planı</h2>
              <p>Tercihlerinizi girin, sistem gerçek verilerle planı hazırlasın; siz sadece seyahatin keyfini çıkarın.</p>
            </div>
            <div className="steps-grid">
              <div className="step-card"><div className="step-num">1</div><h3>Tercihlerinizi girin</h3><p>5 adımlık rehberli formda şehir, tarih, bütçe, kişi sayısı, ilgi alanları, ulaşım tercihi ve varsa uçuş ile otel bilgilerinizi paylaşın.</p></div>
              <div className="step-card"><div className="step-num">2</div><h3>Sistem verileri toplar ve planı oluşturur</h3><p>Gideceğiniz tarihe ait gerçek hava durumu çekilir, döviz kuru hesaplanır; bütçeniz kalemlere bölünür ve rota hava koşullarına göre optimize edilir.</p></div>
              <div className="step-card"><div className="step-num">3</div><h3>Planı keşfedin, kaydedin, paylaşın</h3><p>Saat saat rota, bütçe grafiği, otel önerileri, bavul listesi ve yağmurlu gün alternatifi tek ekranda. PDF indirin, planı kaydedin.</p></div>
            </div>
          </div>
        </section>

        {/* Özellikler */}
        <section className="block" id="ozellikler" style={{ background:"#FDF3EA", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
          <div className="container">
            <div className="section-head">
              <span className="tag">Özellikler</span>
              <h2>Gerçek verilerle çalışan eksiksiz planlama aracı</h2>
              <p>Sabit şablonlar değil; tarihinize özel hava durumu, canlı döviz kuru ve tercihlerinize göre şekillenen kişisel plan.</p>
            </div>
            <div className="features-grid">
              {[
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>, title: "Saat saat günlük rota", desc: "Kahvaltıdan akşama her durak planlanır. Duraklar arası yürüyüş, toplu taşıma ve taksi süreleri gösterilir." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.6A5 5 0 0 0 18 7h-1.3A7 7 0 1 0 5 15.9"/><path d="M8 19v2M12 18v3M16 19v2"/></svg>, title: "Gerçek zamanlı hava durumu", desc: "Open-Meteo API ile seyahat tarihinize ait günlük sıcaklık ve yağış tahmini çekilir. Yağmurlu günlerde Plan B devreye girer." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="7" rx="1"/><rect x="12" y="7" width="3" height="11" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/></svg>, title: "Akıllı bütçe dağılımı", desc: "Toplam bütçeniz 5 kalemde otomatik bölünür. Yurt dışı planlarında canlı döviz kuruyla çevrilir." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 18h18M3 14h18M7 9V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3"/></svg>, title: "Konum bazlı otel önerileri", desc: "Ekonomik, orta segment ve premium 3 seçenek. Bölge, merkeze mesafe, toplu taşıma erişimi ve artı/eksileriyle." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/></svg>, title: "Seyahat hazırlık kartı", desc: "Tarihe ve iklime göre mevsimsel kıyafet, aksesuar, teknoloji ve sağlık önerileri. İşaretlenebilir bavul listesi." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>, title: "Kaydet ve PDF indir", desc: "Planlarınız hesabınıza bağlı olarak saklanır. PDF olarak indirip telefonsuz da kullanabilirsiniz." },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Örnek Plan */}
        <section className="block" id="ornek">
          <div className="container">
            <div className="section-head">
              <span className="tag">Örnek Çıktı</span>
              <h2>Plan çıktısında neler var?</h2>
              <p>Metin yığını değil; sekmeli günlük rota, interaktif bütçe grafiği ve gerçek hava durumu kartıyla okunabilir bir plan.</p>
            </div>
            <div className="sample-wrap">
              <div className="sample-info">
                <h3>İstanbul · 3 gün · 2 kişi · ₺25.000</h3>
                <p>&ldquo;Tarih ve gastronomi ağırlıklı deneyimler sunarken bütçeyi koruyarak şehri verimli keşfetmenizi sağlar.&rdquo;</p>
                <ul className="sample-list">
                  {[
                    ["Seyahat özeti", "ilgi alanları ve seyahat tipine özel kısa değerlendirme"],
                    ["Saat saat günlük rota", "duraklar arası ulaşım süresi ve neden önerildi açıklamaları"],
                    ["Otel önerileri", "3 segment, konum ve fiyat detayıyla"],
                    ["Bütçe dağılımı", "5 kalem görsel grafik, yurt dışında döviz karşılığı"],
                    ["Hava durumu & yağmurlu gün planı", "gerçek zamanlı tahmin ve B rotası"],
                    ["Bavul listesi", "mevsim ve ilgi alanına göre kıyafet & aksesuar önerileri"],
                    ["Gizli mekanlar, yerel tavsiyeler, manzara noktaları", ""],
                  ].map(([bold, rest], i) => (
                    <li key={i}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      <span><b>{bold}</b>{rest ? ` — ${rest}` : ""}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="btn btn-primary">Kendi planımı oluştur</Link>

              </div>
              <div className="sample-card">
                <div className="sample-card-head">
                  <h4>1. Gün — Tarihi Yarımada</h4>
                  <span>Yürüyüş ağırlıklı · tahmini günlük harcama ₺2.600</span>
                </div>
                <div className="sample-card-body">
                  {[
                    ["08:30","Karaköy'de kahvaltı","Sahil hattında klasik serpme kahvaltı","₺450"],
                    ["10:00","Ayasofya & Sultanahmet","Erken saat, kalabalık öncesi giriş","₺800"],
                    ["13:00","Esnaf lokantasında öğle","Sirkeci'de yerel mutfak","₺500"],
                    ["15:00","Yerebatan Sarnıcı","Fotoğraf için ideal ışık saati","₺600"],
                    ["19:30","Galata'da akşam yemeği","Kule manzaralı meyhane","₺1.100"],
                  ].map(([time, title, sub, cost]) => (
                    <div key={time} className="tl-item">
                      <div className="tl-rail"><div className="tl-dot"></div><div className="tl-line"></div></div>
                      <span className="tl-time">{time}</span>
                      <div className="tl-body"><b>{title}</b><span>{sub}</span></div>
                      <span className="tl-cost">{cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Yorumlar */}
        <section className="block" id="yorumlar" style={{ background:"#FDF3EA", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
          <div className="container">
            <div className="section-head">
              <span className="tag">Kullanıcı Yorumları</span>
              <h2>Gezginler TravelMind AI hakkında ne diyor?</h2>
            </div>
            <div className="quotes-grid">
              {[
                { stars:"★★★★★", text:"Barselona için 4 günlük plan istedim; bütçe dağılımı o kadar gerçekçiydi ki dönüşte hesap yaptım, sapma %5'in altındaydı. Gizli mekan önerileri gezinin en iyi kısmıydı.", initials:"EK", name:"Elif K.", city:"Barselona", color:"#C96C4A" },
                { stars:"★★★★★", text:"Ailecek Roma'ya gittik. Çocuklu seyahat için tempo ayarı ve öğle araları kusursuzdu. Yağmur bastırınca B planını açtık, gün boşa gitmedi.", initials:"MA", name:"Murat A.", city:"Roma", color:"#E8B27D" },
                { stars:"★★★★☆", text:"Tek başıma Amsterdam'a gittim. Plan saat saat hazırdı; ben sadece 'yeniden oluştur' deyip gece hayatı ağırlıklı versiyonu seçtim. Saatlerce blog okumaktan kurtardı.", initials:"SD", name:"Selin D.", city:"Amsterdam", color:"#5E9C76" },
              ].map((q, i) => (
                <div key={i} className="quote-card">
                  <div className="stars">{q.stars}</div>
                  <p>&ldquo;{q.text}&rdquo;</p>
                  <div className="quote-who">
                    <span className="avatar" style={{ background: q.color, color:"#fff" }}>{q.initials}</span>
                    <div><b>{q.name}</b><span className="city">{q.city}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobil Uygulama */}
        <section className="block app-section" id="mobil">
          <div className="container">
            <div className="app-grid">
              {/* Sol */}
              <div className="app-left">
                <span className="app-tag">Mobil Uygulama</span>
                <h2 className="app-title">TravelMind AI her zaman cebinizde</h2>
                <p className="app-desc">Seyahat planınızı oluşturduktan sonra telefonunuzdan takip edin, günlük rotanıza bakın ve anlık önerilere ulaşın.</p>
                <ul className="app-features">
                  {[
                    { icon: <><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="4"/></>, label: "Çevrimdışı plan görüntüleme" },
                    { icon: <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 0 0-5-5.917V4a1 1 0 0 0-2 0v1.083A6 6 0 0 0 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9"/>, label: "Günlük rota bildirimleri" },
                    { icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>, label: "Konum bazlı yerel öneriler" },
                    { icon: <><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01"/></>, label: "Planlarınıza her yerden erişin" },
                  ].map((f, i) => (
                    <li key={i}>
                      <span className="feat-icon">
                        <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">{f.icon}</svg>
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>
                <div className="app-store-btns">
                  <button className="store-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div className="store-btn-text"><small>App Store&apos;dan</small><strong>İndir</strong></div>
                  </button>
                  <button className="store-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76a2 2 0 0 0 2.73.76l.1-.06 9.43-5.45-2.61-2.61-9.65 7.36zm16.09-10.93L16.44 11l-2.87 2.87 2.87 2.87 2.86-1.65a1.36 1.36 0 0 0 0-2.26zM3 1.25A1.37 1.37 0 0 0 2.5 2.4V21.6a1.37 1.37 0 0 0 .5 1.15l.06.05 10.74-10.74v-.25L3.06 1.2zm10.57 9.28L3.18.24A2 2 0 0 0 .45 1l12.73 9.5.39-.01z"/></svg>
                    <div className="store-btn-text"><small>Google Play&apos;den</small><strong>İndir</strong></div>
                  </button>
                </div>
                <div className="app-qr">
                  <div style={{ width:60, height:60 }}>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" fill="white" rx="8"/><rect x="8" y="8" width="20" height="20" rx="2" fill="#1a1a1a"/><rect x="11" y="11" width="14" height="14" rx="1" fill="white"/><rect x="14" y="14" width="8" height="8" fill="#1a1a1a"/><rect x="32" y="8" width="20" height="20" rx="2" fill="#1a1a1a"/><rect x="35" y="11" width="14" height="14" rx="1" fill="white"/><rect x="38" y="14" width="8" height="8" fill="#1a1a1a"/><rect x="8" y="32" width="20" height="20" rx="2" fill="#1a1a1a"/><rect x="11" y="35" width="14" height="14" rx="1" fill="white"/><rect x="14" y="38" width="8" height="8" fill="#1a1a1a"/><rect x="32" y="32" width="6" height="6" fill="#1a1a1a"/><rect x="40" y="32" width="6" height="6" fill="#1a1a1a"/><rect x="32" y="40" width="6" height="6" fill="#1a1a1a"/><rect x="40" y="40" width="6" height="6" fill="#1a1a1a"/><rect x="46" y="32" width="6" height="6" fill="#1a1a1a"/><rect x="46" y="46" width="6" height="6" fill="#1a1a1a"/><rect x="32" y="46" width="6" height="6" fill="#1a1a1a"/></svg>
                  </div>
                  <div className="app-qr-text">Hızlı indirmek için<br/><strong>telefonunuzla tarayın</strong></div>
                </div>
              </div>

              {/* Sağ: Telefon mockup */}
              <div className="app-right">
                <div className="phone-wrap">
                  <div className="phone-scene">
                    <div className="chip-float chip-tl">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2.5 19.5 21 12 2.5 4.5 7 12l-4.5 7.5ZM7 12h7"/></svg>
                      <div className="chip-float-text"><strong>Planın hazır</strong><small>İstanbul rotası</small></div>
                    </div>
                    <div className="chip-float chip-mr">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
                      <div className="chip-float-text"><strong>12 durak</strong><small>Bugünkü rota</small></div>
                    </div>
                    <div className="chip-float chip-bl">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      <div className="chip-float-text"><strong>3 gün</strong><small>Seyahat süresi</small></div>
                    </div>
                    <div className="phone-outer">
                      <div className="phone-inner">
                        <div className="phone-screen">
                          <div className="phone-statusbar">
                            <span>9:41</span>
                            <span style={{ display:"flex", gap:4, alignItems:"center" }}>
                              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4 2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                              <svg width="14" height="12" viewBox="0 0 22 12" fill="currentColor"><rect x="0" y="2" width="16" height="8" rx="2" opacity=".3"/><rect x="0" y="2" width="12" height="8" rx="2"/><rect x="17" y="4" width="2" height="4" rx="1"/></svg>
                            </span>
                          </div>
                          <div className="phone-topbar">
                            <div className="phone-topbar-logo">
                              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2 19 21l-7-4-7 4Z"/></svg>
                            </div>
                            <span>TravelMind AI</span>
                          </div>
                          <div className="phone-content">
                            <div className="phone-scroll">
                              <div className="plan-card-ph">
                                <div className="plan-card-ph-img"><span>İstanbul · 3 Gün</span></div>
                                <h5>Kültür &amp; Lezzet Turu</h5>
                                <p>Bütçe: ₺4.200 · 2 kişi</p>
                              </div>
                              <div style={{ padding:"0 2px" }}>
                                <p style={{ fontSize:".65rem", fontWeight:700, color:"#333", marginBottom:6 }}>Bugünkü Rota</p>
                                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                                  <div className="rota-row"><div className="rota-dot"></div><div className="rota-info"><span>Topkapı Sarayı</span><small>09:00 · Müze</small></div></div>
                                  <div className="rota-row"><div className="rota-dot" style={{ background:"#a0c4b0" }}></div><div className="rota-info"><span>Kapalıçarşı</span><small>11:30 · Alışveriş</small></div></div>
                                  <div className="rota-row"><div className="rota-dot" style={{ background:"#c4a0b0" }}></div><div className="rota-info"><span>Sultanahmet Meydanı</span><small>14:00 · Tarihi Alan</small></div></div>
                                </div>
                              </div>
                              <div className="plan-card-ph">
                                <div className="plan-card-ph-img" style={{ background:"linear-gradient(135deg,#6a8dd4 0%,#8ab4e8 100%)" }}><span>Kapadokya · 4 Gün</span></div>
                                <h5>Doğa &amp; Macera Turu</h5>
                                <p>Bütçe: ₺6.800 · 2 kişi</p>
                              </div>
                            </div>
                          </div>
                          <div className="phone-nav">
                            {[
                              { icon: <path d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"/>, label: "Ana Sayfa", active: true },
                              { icon: <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13 6-3m-6 3V7m6 10 4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"/>, label: "Rotam" },
                              { icon: <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"/>, label: "Favoriler" },
                              { icon: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>, label: "Profil" },
                            ].map((n, i) => (
                              <div key={i} className={`nav-item${n.active ? " active" : ""}`}>
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{n.icon}</svg>
                                <span>{n.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section className="block" id="sss">
          <div className="container">
            <div className="section-head">
              <span className="tag">SSS</span>
              <h2>Sık sorulan sorular</h2>
            </div>
            <div className="faq-list">
              {[
                { q: "Planı oluşturmak için ne girmem gerekiyor?", a: "5 adımlık rehberli form: şehir ve seyahat tarihleri, bütçe ve kişi sayısı, ilgi alanları ve ulaşım tercihi, varsa uçuş saatleri ve otel tercihi, ek notlar. Tüm adımlar yaklaşık 2 dakika sürer." },
                { q: "Hava durumu bilgisi gerçek mi, yoksa tahmini mi?", a: "Gerçek zamanlı ve tarihe özel. Open-Meteo API ile şehrin koordinatları bulunur, seyahat tarihlerinize ait günlük sıcaklık ve yağış tahmini çekilir. Yağış ihtimali yüksek günlerde rota otomatik olarak kapalı alanlara yönlendirilir." },
                { q: "Yurt dışı planlarında döviz nasıl hesaplanıyor?", a: "Hedef ülkenin para birimi otomatik belirlenir ve bütçeniz canlı döviz kuru üzerinden çevrilir. Ayrıca 29 para birimi destekleyen ayrı bir Döviz Çevirici sayfası da mevcuttur." },
                { q: "Planı beğenmezsem ne olur?", a: '"Yeniden Oluştur" ile aynı tercihlerle farklı bir plan alabilir, "Alternatif Plan" ile öncelik ağırlıkları değiştirilmiş bir versiyon görebilir ya da forma dönüp tercihlerinizi tamamen değiştirebilirsiniz.' },
                { q: "Otel veya uçak rezervasyonu yapıyor musunuz?", a: "Hayır. TravelMind AI bir seyahat danışmanıdır; rezervasyon motoru değil. Uçuş saatlerinizi ve otel tercihlerinizi forma girerek planı buna göre optimize edebilirsiniz; satın alma işlemini istediğiniz platformda yaparsınız." },
                { q: "Planları kaydedip tekrar açabilir miyim?", a: 'Evet. Giriş yaptıktan sonra "Planı Kaydet" ile planı hesabınıza bağlayabilirsiniz. Seyahatlerim sayfasında kart görünümünde listelenir; dilediğinizde açabilir, PDF indirebilir veya yorum bırakabilirsiniz.' },
              ].map((faq, i) => (
                <details key={i} className="faq" open={i === 0}>
                  <summary>
                    {faq.q}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  </summary>
                  <div className="faq-body">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="block" style={{ paddingTop:20 }}>
          <div className="container">
            <div className="cta-band">
              <h2>Bir sonraki seyahatiniz iki dakika uzakta</h2>
              <p>Formu doldurun, kişisel seyahat danışmanınız planı hazırlasın.</p>
              <Link href="/register" className="btn">Seyahatimi Planla</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="container footer-bottom">
            <div className="logo" style={{ fontSize:"1rem" }}>
              <div className="logo-mark" style={{ width:28, height:28 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 19 21l-7-4-7 4Z"/></svg>
              </div>
              TravelMind <em style={{ fontStyle:"normal", color:"var(--primary)" }}>AI</em>
            </div>
            <span>© 2026 TravelMind AI · Made with ❤ in Turkey</span>
            <div style={{ display:"flex", gap:16 }}>
              <Link href="/login" style={{ color:"var(--text-light)" }}>Giriş Yap</Link>
              <Link href="/register" style={{ color:"var(--primary)", fontWeight:600 }}>Kayıt Ol</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
