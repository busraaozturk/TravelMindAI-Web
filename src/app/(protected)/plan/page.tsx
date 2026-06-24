"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, ChevronRight, ChevronLeft, MapPin, Calendar, Wallet, Users, Heart, Plane, Hotel, FileText, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Destinasyon & Tarih", icon: MapPin },
  { label: "Bütçe & Grup", icon: Wallet },
  { label: "İlgiler & Ulaşım", icon: Heart },
  { label: "Uçuş & Konaklama", icon: Hotel },
  { label: "Ek Notlar", icon: FileText },
];

const INTERESTS = [
  "Tarih & Kültür", "Doğa & Macera", "Yemek & Gastronomi", "Alışveriş",
  "Müzik & Sanat", "Spor & Aktivite", "Gece Hayatı", "Aile Dostu",
  "Romantik", "Fotoğrafçılık", "Müze & Galeri", "Plaj & Deniz",
];

const TRANSPORT = ["Uçak", "Tren", "Otobüs", "Kiralık Araç", "Toplu Taşıma", "Yürüyüş"];

const CURRENCIES = ["TRY", "EUR", "USD", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"];

export default function PlanPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    currency: "TRY",
    travelers: "1",
    interests: [] as string[],
    transport: [] as string[],
    flightInfo: "",
    hotelInfo: "",
    notes: "",
  });

  function set(key: string, value: string | string[]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArray(key: "interests" | "transport", value: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  function getDuration() {
    if (!form.startDate || !form.endDate) return 0;
    const diff = (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff));
  }

  function canNext() {
    if (step === 0) return form.destination.trim() && form.startDate && form.endDate && getDuration() > 0;
    if (step === 1) return form.budget && Number(form.budget) > 0 && Number(form.travelers) > 0;
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, duration: getDuration(), userId: user?.id }),
    });

    if (response.ok) {
      const { id } = await response.json();
      router.push(`/saved-travels/${id}`);
    } else {
      alert("Plan oluşturulurken hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 animate-spin" style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }} />
          <Plane size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: "var(--text)" }} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>Planın Hazırlanıyor...</h2>
          <p className="text-slate-500">Yapay zeka {form.destination} için özel rotanı oluşturuyor</p>
        </div>
        <div className="flex gap-2">
          {["Hava durumu kontrol ediliyor...", "Döviz hesaplanıyor...", "Rota oluşturuluyor..."].map((msg, i) => (
            <div key={i} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
              <Loader2 size={14} className="animate-spin" style={{ color: "var(--primary)" }} />
              {msg}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`step-dot ${i < step ? "completed" : i === step ? "active" : "pending"}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-red-500" : i < step ? "text-green-600" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < step ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6 sm:p-8 fade-in-up">
        {/* Step 1 */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              <MapPin size={20} className="inline mr-2" style={{ color: "var(--primary)" }} />
              Nereye gitmek istiyorsun?
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Destinasyon</label>
              <input className="input-field" placeholder="ör. İstanbul, Paris, Tokyo..."
                value={form.destination} onChange={(e) => set("destination", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Başlangıç Tarihi</label>
                <input type="date" className="input-field" value={form.startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Bitiş Tarihi</label>
                <input type="date" className="input-field" value={form.endDate}
                  min={form.startDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("endDate", e.target.value)} />
              </div>
            </div>
            {getDuration() > 0 && (
              <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                📅 Toplam {getDuration()} günlük seyahat
                {getDuration() > 16 && <span className="text-orange-500 ml-2">⚠️ 16 gün üzeri hava tahmini desteklenmiyor</span>}
              </div>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              <Wallet size={20} className="inline mr-2" style={{ color: "var(--primary)" }} />
              Bütçe ve Grup Bilgileri
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Toplam Bütçe</label>
              <div className="flex gap-2">
                <input type="number" className="input-field" placeholder="5000"
                  value={form.budget} onChange={(e) => set("budget", e.target.value)} />
                <select className="input-field w-28" value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Kaç Kişisiniz?</label>
              <div className="flex gap-3">
                {["1", "2", "3", "4", "5", "6+"].map((n) => (
                  <button key={n} type="button"
                    onClick={() => set("travelers", n)}
                    className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all text-sm ${
                      form.travelers === n
                        ? "border-transparent text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                    style={form.travelers === n ? { background: "var(--primary)" } : {}}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              <Heart size={20} className="inline mr-2" style={{ color: "var(--primary)" }} />
              İlgi Alanları & Ulaşım
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-2">İlgi Alanların (birden fazla seçebilirsin)</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button key={interest} type="button"
                    onClick={() => toggleArray("interests", interest)}
                    className={`tag border-2 transition-all cursor-pointer ${
                      form.interests.includes(interest)
                        ? "border-transparent text-white"
                        : "border-slate-200 text-slate-600 bg-white hover:border-slate-400"
                    }`}
                    style={form.interests.includes(interest) ? { background: "var(--primary)", borderColor: "var(--primary)", color: "white" } : {}}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tercih Ettiğin Ulaşım</label>
              <div className="flex flex-wrap gap-2">
                {TRANSPORT.map((t) => (
                  <button key={t} type="button"
                    onClick={() => toggleArray("transport", t)}
                    className={`tag border-2 transition-all cursor-pointer ${
                      form.transport.includes(t)
                        ? "border-transparent text-white"
                        : "border-slate-200 text-slate-600 bg-white hover:border-slate-400"
                    }`}
                    style={form.transport.includes(t) ? { background: "var(--primary)", borderColor: "var(--primary)" } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              <Hotel size={20} className="inline mr-2" style={{ color: "var(--primary)" }} />
              Uçuş & Konaklama (İsteğe Bağlı)
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Uçuş Bilgisi</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="ör. THY TK134, İstanbul - Paris, 10:30 kalkış"
                value={form.flightInfo} onChange={(e) => set("flightInfo", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Konaklama Bilgisi</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="ör. Marriott Hotel, Champs-Élysées — veya 'henüz belirsiz'"
                value={form.hotelInfo} onChange={(e) => set("hotelInfo", e.target.value)} />
            </div>
            <p className="text-sm text-slate-400">Bu bilgiler isteğe bağlıdır. Boş bırakırsanız AI size otel önerileri de sunar.</p>
          </div>
        )}

        {/* Step 5 */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              <FileText size={20} className="inline mr-2" style={{ color: "var(--primary)" }} />
              Ek Notlar & Özel İstekler
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Notlarınız</label>
              <textarea className="input-field resize-none" rows={5}
                placeholder="ör. Vegan besleniyorum, çok yürüyemiyorum, çocuklarım var..."
                value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <h3 className="font-semibold text-slate-700">Özet</h3>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <span>📍 {form.destination}</span>
                <span>📅 {getDuration()} gün</span>
                <span>💰 {Number(form.budget).toLocaleString("tr-TR")} {form.currency}</span>
                <span>👥 {form.travelers} kişi</span>
              </div>
              {form.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.interests.map((i) => <span key={i} className="tag text-xs" style={{ background: "#fef2f2", color: "var(--accent)" }}>{i}</span>)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-0">
            <ChevronLeft size={18} />
            Geri
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}
              className="btn-primary">
              İleri
              <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary px-8">
              <Plane size={18} />
              Planımı Oluştur
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
