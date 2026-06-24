"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, TrendingUp, RefreshCw } from "lucide-react";

const CURRENCIES = [
  { code: "TRY", name: "Türk Lirası", flag: "🇹🇷" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "USD", name: "Amerikan Doları", flag: "🇺🇸" },
  { code: "GBP", name: "İngiliz Sterlini", flag: "🇬🇧" },
  { code: "JPY", name: "Japon Yeni", flag: "🇯🇵" },
  { code: "AUD", name: "Avustralya Doları", flag: "🇦🇺" },
  { code: "CAD", name: "Kanada Doları", flag: "🇨🇦" },
  { code: "CHF", name: "İsviçre Frangı", flag: "🇨🇭" },
  { code: "CNY", name: "Çin Yuanı", flag: "🇨🇳" },
  { code: "INR", name: "Hint Rupisi", flag: "🇮🇳" },
  { code: "MXN", name: "Meksika Pesosu", flag: "🇲🇽" },
  { code: "BRL", name: "Brezilya Reali", flag: "🇧🇷" },
  { code: "KRW", name: "Güney Kore Wonu", flag: "🇰🇷" },
  { code: "SGD", name: "Singapur Doları", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Doları", flag: "🇭🇰" },
  { code: "NOK", name: "Norveç Kronu", flag: "🇳🇴" },
  { code: "SEK", name: "İsveç Kronu", flag: "🇸🇪" },
  { code: "DKK", name: "Danimarka Kronu", flag: "🇩🇰" },
  { code: "NZD", name: "Yeni Zelanda Doları", flag: "🇳🇿" },
  { code: "ZAR", name: "Güney Afrika Randı", flag: "🇿🇦" },
  { code: "AED", name: "BAE Dirhemi", flag: "🇦🇪" },
  { code: "SAR", name: "Suudi Arabistan Riyali", flag: "🇸🇦" },
  { code: "THB", name: "Tayland Bahtı", flag: "🇹🇭" },
  { code: "MYR", name: "Malezya Ringgiti", flag: "🇲🇾" },
  { code: "IDR", name: "Endonezya Rupisi", flag: "🇮🇩" },
  { code: "PHP", name: "Filipin Pesosu", flag: "🇵🇭" },
  { code: "VND", name: "Vietnam Dongu", flag: "🇻🇳" },
  { code: "EGP", name: "Mısır Poundu", flag: "🇪🇬" },
  { code: "RON", name: "Romen Leyi", flag: "🇷🇴" },
];

export default function CurrencyPage() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("TRY");
  const [to, setTo] = useState("EUR");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>Döviz Çevirici</h1>
        <p className="text-slate-500 mt-1">29 para birimi • Anlık kur bilgisi</p>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Tutar</label>
          <input type="number" className="input-field text-xl font-semibold" value={amount}
            onChange={(e) => setAmount(e.target.value)} placeholder="1000" min="0" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1.5">Kaynak Para Birimi</label>
            <select className="input-field" value={from} onChange={(e) => setFrom(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          <button onClick={swap} className="mt-6 p-3 rounded-xl border-2 border-slate-200 hover:border-slate-400 transition-colors">
            <ArrowLeftRight size={20} className="text-slate-500" />
          </button>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1.5">Hedef Para Birimi</label>
            <select className="input-field" value={to} onChange={(e) => setTo(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-2xl p-6 text-white text-center" style={{ background: "linear-gradient(135deg, #0f3460, #16213e)" }}>
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-blue-200">
              <RefreshCw size={16} className="animate-spin" />
              Kur bilgisi alınıyor...
            </div>
          ) : result ? (
            <>
              <div className="text-sm text-blue-200 mb-1">{Number(amount).toLocaleString("tr-TR")} {from} =</div>
              <div className="text-4xl font-bold">{Number(result).toLocaleString("tr-TR")}</div>
              <div className="text-xl mt-1 text-blue-200">{to}</div>
              {reverseRate && (
                <div className="text-xs text-blue-300 mt-3">
                  1 {to} = {reverseRate} {from}
                </div>
              )}
            </>
          ) : (
            <div className="text-blue-200">Kur bilgisi yüklenemedi</div>
          )}
        </div>

        {lastUpdate && (
          <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
            <TrendingUp size={12} />
            Son güncelleme: {lastUpdate.toLocaleTimeString("tr-TR")}
            <button onClick={() => fetchRates(from)} className="ml-2 text-blue-500 hover:underline">
              Yenile
            </button>
          </p>
        )}
      </div>

      {/* Popular pairs */}
      <div className="card p-6">
        <h2 className="font-bold mb-4" style={{ color: "var(--primary)" }}>Popüler Kurlar</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                className="p-3 rounded-xl text-left transition-all hover:shadow-sm"
                style={{
                  border: from === pair.from && to === pair.to ? "2px solid var(--primary)" : "2px solid var(--border)",
                  background: from === pair.from && to === pair.to ? "var(--primary-soft)" : "var(--card)",
                }}>
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {pairFrom?.flag} {pair.from} → {pairTo?.flag} {pair.to}
                </div>
                {rate && <div className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>1 {pair.from} = {rate} {pair.to}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
