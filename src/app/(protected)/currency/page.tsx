"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, TrendingUp, RefreshCw, ArrowRight } from "lucide-react";
import Flag from "react-world-flags";

const CURRENCIES = [
  { code: "TRY", name: "Türk Lirası",          flag: "🇹🇷" },
  { code: "EUR", name: "Euro",                  flag: "🇪🇺" },
  { code: "USD", name: "Amerikan Doları",        flag: "🇺🇸" },
  { code: "GBP", name: "İngiliz Sterlini",       flag: "🇬🇧" },
  { code: "JPY", name: "Japon Yeni",             flag: "🇯🇵" },
  { code: "AUD", name: "Avustralya Doları",      flag: "🇦🇺" },
  { code: "CAD", name: "Kanada Doları",          flag: "🇨🇦" },
  { code: "CHF", name: "İsviçre Frangı",         flag: "🇨🇭" },
  { code: "CNY", name: "Çin Yuanı",             flag: "🇨🇳" },
  { code: "INR", name: "Hint Rupisi",            flag: "🇮🇳" },
  { code: "MXN", name: "Meksika Pesosu",         flag: "🇲🇽" },
  { code: "BRL", name: "Brezilya Reali",         flag: "🇧🇷" },
  { code: "KRW", name: "Güney Kore Wonu",        flag: "🇰🇷" },
  { code: "SGD", name: "Singapur Doları",        flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Doları",       flag: "🇭🇰" },
  { code: "NOK", name: "Norveç Kronu",           flag: "🇳🇴" },
  { code: "SEK", name: "İsveç Kronu",            flag: "🇸🇪" },
  { code: "DKK", name: "Danimarka Kronu",        flag: "🇩🇰" },
  { code: "NZD", name: "Yeni Zelanda Doları",    flag: "🇳🇿" },
  { code: "ZAR", name: "Güney Afrika Randı",     flag: "🇿🇦" },
  { code: "AED", name: "BAE Dirhemi",            flag: "🇦🇪" },
  { code: "SAR", name: "Suudi Arabistan Riyali", flag: "🇸🇦" },
  { code: "THB", name: "Tayland Bahtı",          flag: "🇹🇭" },
  { code: "MYR", name: "Malezya Ringgiti",       flag: "🇲🇾" },
  { code: "IDR", name: "Endonezya Rupisi",       flag: "🇮🇩" },
  { code: "PHP", name: "Filipin Pesosu",         flag: "🇵🇭" },
  { code: "VND", name: "Vietnam Dongu",          flag: "🇻🇳" },
  { code: "EGP", name: "Mısır Poundu",           flag: "🇪🇬" },
  { code: "RON", name: "Romen Leyi",             flag: "🇷🇴" },
];

/* currency code → ISO 3166-1 alpha-2 */
const CC: Record<string, string> = {
  TRY:"TR", EUR:"EU", USD:"US", GBP:"GB", JPY:"JP", AUD:"AU", CAD:"CA",
  CHF:"CH", CNY:"CN", INR:"IN", MXN:"MX", BRL:"BR", KRW:"KR", SGD:"SG",
  HKD:"HK", NOK:"NO", SEK:"SE", DKK:"DK", NZD:"NZ", ZAR:"ZA", AED:"AE",
  SAR:"SA", THB:"TH", MYR:"MY", IDR:"ID", PHP:"PH", VND:"VN", EGP:"EG", RON:"RO",
};

function CurrencyFlag({ code, width = 28 }: { code: string; width?: number }) {
  const cc = CC[code] ?? "UN";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", flexShrink:0, borderRadius:4, overflow:"hidden", boxShadow:"0 0 0 1px rgba(0,0,0,0.1)" }}>
      <Flag code={cc} width={width} />
    </span>
  );
}

function CurrencySelect({ value, onChange, id, openId, setOpenId }: {
  value: string;
  onChange: (v: string) => void;
  id: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const open = openId === id;
  const selected = CURRENCIES.find(c => c.code === value);
  const ref = { current: null as HTMLDivElement | null };

  // Dışarı tıklayınca kapat
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div style={{ position: "relative" }} ref={r => { ref.current = r; }}>
      {/* Trigger */}
      <button type="button" onClick={() => setOpenId(open ? null : id)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10,
          background: "var(--card)", cursor: "pointer", textAlign: "left",
          fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "var(--text)",
        }}>
        <CurrencyFlag code={value} width={24} />
        <span style={{ fontWeight: 600 }}>{selected?.code}</span>
        <span style={{ color: "var(--text-light)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>— {selected?.name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-light)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxHeight: 280, overflowY: "auto",
        }}>
          {CURRENCIES.map(c => (
            <button key={c.code} type="button"
              onClick={() => { onChange(c.code); setOpenId(null); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 14px", border: "none", cursor: "pointer", textAlign: "left",
                background: c.code === value ? "var(--primary-soft)" : "transparent",
                color: "var(--text)", fontFamily: "var(--font-inter), sans-serif", fontSize: 13,
              }}
              onMouseEnter={e => { if (c.code !== value) (e.currentTarget as HTMLElement).style.background = "var(--bg)"; }}
              onMouseLeave={e => { if (c.code !== value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <CurrencyFlag code={c.code} width={22} />
              <span style={{ fontWeight: 600, minWidth: 36 }}>{c.code}</span>
              <span style={{ color: "var(--text-light)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CurrencyPage() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("TRY");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  async function fetchRates(base: string) {
    setLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      const data = await res.json();
      if (data.rates) {
        setRates(data.rates);
        setLastUpdate(new Date());
      }
    } catch {
      // fallback
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRates(from);
  }, [from]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const result = rates[to] ? (Number(amount) * rates[to]).toFixed(2) : null;
  const reverseRate = rates[to] ? (1 / rates[to]).toFixed(4) : null;

  const popularPairs = [
    { from: "USD", to: "TRY" },
    { from: "EUR", to: "TRY" },
    { from: "GBP", to: "TRY" },
    { from: "TRY", to: "USD" },
    { from: "TRY", to: "EUR" },
    { from: "USD", to: "EUR" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>Döviz Çevirici</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>29 para birimi • Anlık kur bilgisi</p>
      </div>

      <div className="currency-grid grid gap-5" style={{ gridTemplateColumns: "1fr auto" }}>
        {/* Sol: Çevirici */}
        <div className="card p-6 space-y-4 flex flex-col justify-between" style={{ minWidth: 0 }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Tutar</label>
              <input type="number" className="input-field text-xl font-semibold" value={amount}
                onChange={(e) => setAmount(e.target.value)} placeholder="1000" min="0" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div style={{ flex: "1 1 200px" }}>
                <label className="block text-sm font-semibold mb-1.5">Kaynak Para Birimi</label>
                <CurrencySelect value={from} onChange={setFrom} id="from" openId={openSelect} setOpenId={setOpenSelect} />
              </div>

              <button onClick={swap} className="mt-6 p-3 rounded-xl border-2 transition-colors"
                style={{ borderColor: "var(--border)" }}>
                <ArrowLeftRight size={20} style={{ color: "var(--text-light)" }} />
              </button>

              <div style={{ flex: "1 1 200px" }}>
                <label className="block text-sm font-semibold mb-1.5">Hedef Para Birimi</label>
                <CurrencySelect value={to} onChange={setTo} id="to" openId={openSelect} setOpenId={setOpenSelect} />
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #C96C4A, #8B3E25)" }}>
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-orange-100 py-4">
                <RefreshCw size={16} className="animate-spin" />
                Kur bilgisi alınıyor...
              </div>
            ) : result ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  {/* Kaynak */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CurrencyFlag code={from} />
                      <span className="text-xs text-orange-200 uppercase tracking-widest font-medium">{from}</span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      <span style={{ fontSize:"clamp(1.3rem,3vw,1.8rem)", fontWeight:800, lineHeight:1, wordBreak:"break-all" }}>{Number(amount).toLocaleString("tr-TR")}</span>
                      <span style={{ fontSize:11, opacity:0.75 }}>{CURRENCIES.find(c => c.code === from)?.name}</span>
                    </div>
                  </div>

                  {/* Ok */}
                  <div className="flex flex-col items-center gap-1 px-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  {/* Hedef */}
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <span className="text-xs text-orange-200 uppercase tracking-widest font-medium">{to}</span>
                      <CurrencyFlag code={to} />
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:2, alignItems:"flex-end" }}>
                      <span style={{ fontSize:"clamp(1.3rem,3vw,1.8rem)", fontWeight:800, lineHeight:1, wordBreak:"break-all", textAlign:"right" }}>{Number(result).toLocaleString("tr-TR")}</span>
                      <span style={{ fontSize:11, opacity:0.75 }}>{CURRENCIES.find(c => c.code === to)?.name}</span>
                    </div>
                  </div>
                </div>

                {reverseRate && (
                  <div className="mt-4 pt-4 text-center text-xs text-orange-200" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                    1 {to} = {reverseRate} {from}
                  </div>
                )}
              </>
            ) : (
              <div className="text-orange-100 text-center py-4">Kur bilgisi yüklenemedi</div>
            )}
          </div>

          {lastUpdate && (
            <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
              <TrendingUp size={12} />
              Son güncelleme: {lastUpdate.toLocaleTimeString("tr-TR")}
              <button onClick={() => fetchRates(from)} className="ml-2 hover:underline" style={{ color: "var(--primary)" }}>
                Yenile
              </button>
            </p>
          )}
        </div>

        {/* Sağ: Popüler Kurlar */}
        <div className="currency-right card p-6 flex flex-col" style={{ width: 320, minWidth: 280 }}>
          <h2 className="font-bold mb-4" style={{ color: "var(--primary)" }}>Popüler Kurlar</h2>
          <div className="flex flex-col gap-3 flex-1">
            {popularPairs.map((pair) => {
              let rate: string | null = null;
              if (from === pair.from && rates[pair.to]) {
                rate = rates[pair.to].toFixed(4);
              }
              const pairFrom = CURRENCIES.find((c) => c.code === pair.from);
              const pairTo = CURRENCIES.find((c) => c.code === pair.to);
              return (
                <button key={`${pair.from}-${pair.to}`}
                  onClick={() => { setFrom(pair.from); setTo(pair.to); }}
                  className="p-3 rounded-xl text-left transition-all hover:shadow-sm flex-1"
                  style={{
                    border: from === pair.from && to === pair.to ? "2px solid var(--primary)" : "2px solid var(--border)",
                    background: from === pair.from && to === pair.to ? "var(--primary-soft)" : "var(--card)",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    <CurrencyFlag code={pair.from} width={22} />
                    {pair.from}
                    <span style={{ color: "var(--text-light)", fontWeight: 400 }}>→</span>
                    <CurrencyFlag code={pair.to} width={22} />
                    {pair.to}
                  </div>
                  {rate && <div className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>1 {pair.from} = {rate} {pair.to}</div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .currency-grid { grid-template-columns: 1fr !important; }
          .currency-right { width: 100% !important; min-width: unset !important; }
        }
      `}</style>
    </div>
  );
}
