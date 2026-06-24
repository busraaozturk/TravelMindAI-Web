"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, MapPin, Wallet, Heart, Hotel, FileText, Plane, Loader2, User, Users, UserPlus, DollarSign, Scale, Gem, Landmark, UtensilsCrossed, TreePine, Camera, Zap, Moon, Footprints, Bus, Car, Shuffle, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const MONTHS_TR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const DAYS_TR = ["Pt","Sa","Ça","Pe","Cu","Ct","Pz"];

function DatePicker({ label, value, onChange, min }: { label: string; value: string; onChange: (v: string) => void; min?: string }) {
  const [open, setOpen] = useState(false);
  const today = new Date(); today.setHours(0,0,0,0);
  const minDate = min ? new Date(min) : today;
  const selected = value ? new Date(value) : null;
  const [view, setView] = useState(() => {
    const d = selected || minDate;
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
  function firstDay(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; } // Mon=0

  function selectDay(day: number) {
    const d = new Date(view.year, view.month, day);
    onChange(d.toISOString().split("T")[0]);
    setOpen(false);
  }

  function prevMonth() {
    setView(v => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  }
  function nextMonth() {
    setView(v => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  }

  const displayValue = selected
    ? selected.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";

  const totalDays = daysInMonth(view.year, view.month);
  const startOffset = firstDay(view.year, view.month);

  return (
    <div className="relative">
      <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>{label}</label>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="input-field flex items-center justify-between w-full text-left"
        style={{ background: "var(--bg)", cursor: "pointer" }}>
        <span style={{ color: displayValue ? "var(--text)" : "var(--text-light)" }}>
          {displayValue || "GG.AA.YYYY"}
        </span>
        <CalendarDays size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 rounded-2xl shadow-lg p-4 w-72"
          style={{ background: "white", border: "1.5px solid var(--border)", top: "100%", left: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-slate-100">
              <ChevronLeft size={16} style={{ color: "var(--text-light)" }} />
            </button>
            <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
              {MONTHS_TR[view.month]} {view.year}
            </span>
            <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-slate-100">
              <ChevronRight size={16} style={{ color: "var(--text-light)" }} />
            </button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_TR.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: "var(--text-light)" }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const date = new Date(view.year, view.month, day);
              const isSelected = selected && date.toDateString() === selected.toDateString();
              const isDisabled = date < minDate;
              const isToday = date.toDateString() === today.toDateString();
              return (
                <button key={day} type="button"
                  disabled={isDisabled}
                  onClick={() => selectDay(day)}
                  className="text-xs rounded-lg py-1.5 font-medium transition-all"
                  style={{
                    background: isSelected ? "var(--primary)" : isToday ? "var(--primary-soft)" : "transparent",
                    color: isSelected ? "white" : isDisabled ? "#CBD5E0" : "var(--text)",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const STEPS = [
  { label: "Şehir & Süre",        icon: MapPin   },
  { label: "Bütçe & Kişi",        icon: Wallet   },
  { label: "Tarz & İlgi",         icon: Heart    },
  { label: "Uçuş & Konaklama",    icon: Hotel    },
  { label: "Ek Bilgiler",         icon: FileText },
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
    duration: "3",
    budget: "",
    currency: "TRY",
    travelers: "1",
    travelType: "",
    travelStyle: "",
    flightStatus: "",
    hotelStatus: "",
    hotelName: "",
    hotelAddress: "",
    checkInTime: "",
    checkOutTime: "",
    hotelLocation: "",
    hotelType: "",
    hotelBreakfast: "",
    hotelFeature: "",
    arrivalCity: "",
    arrivalAirport: "",
    arrivalTime: "",
    returnCity: "",
    returnAirport: "",
    returnTime: "",
    preferredDepartureCity: "",
    preferredDepartureTime: "",
    preferredArrivalCity: "",
    preferredArrivalTime: "",
    groundArrivalTime: "",
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
    if (form.startDate && form.endDate) {
      const diff = (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(1, Math.round(diff));
    }
    return Number(form.duration) || 3;
  }

  function handleDateChange(key: "startDate" | "endDate", value: string) {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      if (updated.startDate && updated.endDate) {
        const diff = Math.max(1, Math.round((new Date(updated.endDate).getTime() - new Date(updated.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
        updated.duration = String(diff);
      }
      return updated;
    });
  }

  function canNext() {
    if (step === 0) return form.destination.trim() && (form.startDate || Number(form.duration) > 0);
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
          <Plane size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: "var(--primary)" }} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>Planın Hazırlanıyor...</h2>
          <p className="text-slate-500">Yapay zeka {form.destination} için özel rotanı oluşturuyor</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {["Hava durumu kontrol ediliyor...", "Döviz hesaplanıyor...", "Rota oluşturuluyor..."].map((msg, i) => (
            <div key={i} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm shadow-sm" style={{ border: "1px solid var(--border)", color: "var(--text-light)" }}>
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
      {/* Başlık */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
          Seyahatinizi planlayalım
        </h1>
        <p style={{ color: "var(--text-light)" }}>{STEPS.length} kısa adım — yaklaşık 2 dakika</p>
      </div>

      {/* Step indicator */}
      <div className="flex mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center relative">
            {/* Connecting line to next step */}
            {i < STEPS.length - 1 && (
              <div className="absolute h-px"
                style={{
                  top: "20px",
                  left: "50%",
                  right: "-50%",
                  background: i < step ? "var(--success)" : "#CBD5E0",
                }} />
            )}
            {/* Circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10 transition-all"
              style={
                i < step
                  ? { background: "var(--success)", color: "white", border: "2px solid var(--success)" }
                  : i === step
                  ? { background: "var(--primary)", color: "white", border: "2px solid var(--primary)", boxShadow: "0 0 0 5px var(--primary-soft)" }
                  : { background: "white", color: "var(--text-light)", border: "2px solid #CBD5E0" }
              }
            >
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            {/* Label */}
            <span className="text-xs font-medium text-center leading-tight mt-2 hidden sm:block"
              style={{ color: i === step ? "var(--primary)" : i < step ? "var(--success)" : "var(--text-light)" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Kart */}
      <div className="card p-8 fade-in-up">

        {/* Step 1 — Şehir & Süre */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
                Nereye gidiyorsunuz?
              </h2>
              <p style={{ color: "var(--text-light)", fontSize: 14 }}>Şehri ve kaç gün kalacağınızı belirtin.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                Hangi şehre gideceksiniz?
              </label>
              <input className="input-field" placeholder="örn. İstanbul, Roma, Paris..."
                style={{ background: "var(--bg)" }}
                value={form.destination} onChange={(e) => set("destination", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                label="Seyahat başlangıç tarihi"
                value={form.startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(v) => handleDateChange("startDate", v)}
              />
              <DatePicker
                label="Seyahat bitiş tarihi"
                value={form.endDate}
                min={form.startDate || new Date().toISOString().split("T")[0]}
                onChange={(v) => handleDateChange("endDate", v)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                Kaç gün kalacaksınız?{" "}
                <span className="font-normal" style={{ color: "var(--text-light)", fontSize: 11 }}>
                  1–14 gün · tarih seçince otomatik hesaplanır
                </span>
              </label>
              <input
                type="number" className="input-field" min="1" max="14"
                style={{ background: "var(--bg)" }}
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2 — Bütçe & Kişi */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Bütçe ve kişi sayısı</h2>
              <p style={{ color: "var(--text-light)", fontSize: 14 }}>Toplam bütçenizi yazın; AI kalemlere dağıtsın.</p>
            </div>

            {/* Bütçe + Kişi yan yana */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                  Toplam bütçeniz (₺)
                </label>
                <input type="number" className="input-field" placeholder="25000"
                  style={{ background: "var(--bg)" }}
                  value={form.budget} onChange={(e) => set("budget", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                  Kaç kişi gideceksiniz?
                </label>
                <input type="number" className="input-field" placeholder="2" min="1" max="20"
                  style={{ background: "var(--bg)" }}
                  value={form.travelers} onChange={(e) => set("travelers", e.target.value)} />
              </div>
            </div>

            {/* Seyahat tipi */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Seyahat tipi</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "solo",   Icon: User,     label: "Tek başına",   desc: "Kendi temponuzda özgür keşif" },
                  { value: "couple", Icon: Heart,    label: "Çift",          desc: "Romantik duraklar öncelikli" },
                  { value: "family", Icon: Users,    label: "Aile",          desc: "Çocuk dostu tempo ve molalar" },
                  { value: "group",  Icon: UserPlus, label: "Arkadaş grubu", desc: "Sosyal ve hareketli program" },
                ].map(({ value, Icon, label, desc }) => {
                  const active = form.travelType === value;
                  return (
                    <button key={value} type="button"
                      onClick={() => set("travelType", value)}
                      className="p-4 rounded-2xl text-left transition-all"
                      style={{
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: active ? "var(--primary-soft)" : "var(--bg)",
                      }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} style={{ color: "var(--primary)" }} />
                        <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{label}</div>
                      </div>
                      <div className="text-xs leading-snug" style={{ color: "var(--text-light)" }}>{desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Tarz & İlgi */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Tarzınız ve ilgi alanlarınız</h2>
              <p style={{ color: "var(--text-light)", fontSize: 14 }}>Plan tam size göre şekillensin.</p>
            </div>

            {/* Seyahat tarzı */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Seyahat tarzınız</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "ekonomik", Icon: DollarSign, label: "Ekonomik", desc: "Akıllı harcama, yerel seçimler" },
                  { value: "dengeli",  Icon: Scale,      label: "Dengeli",  desc: "Konfor ve bütçe dengesi" },
                  { value: "luks",     Icon: Gem,        label: "Lüks",     desc: "Premium deneyim öncelikli" },
                ].map(({ value, Icon, label, desc }) => {
                  const active = form.travelStyle === value;
                  return (
                    <button key={value} type="button" onClick={() => set("travelStyle", value)}
                      className="p-4 rounded-2xl text-left transition-all"
                      style={{
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: active ? "var(--primary-soft)" : "var(--bg)",
                      }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} style={{ color: "var(--primary)" }} />
                        <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{label}</span>
                      </div>
                      <div className="text-xs leading-snug" style={{ color: "var(--text-light)" }}>{desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* İlgi alanları */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>İlgi alanlarınız</label>
                <span className="text-xs" style={{ color: "var(--text-light)" }}>birden fazla seçebilirsiniz</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "tarih",       Icon: Landmark,       label: "Tarih" },
                  { value: "gastronomi",  Icon: UtensilsCrossed,label: "Gastronomi" },
                  { value: "doga",        Icon: TreePine,       label: "Doğa" },
                  { value: "fotograf",    Icon: Camera,         label: "Fotoğrafçılık" },
                  { value: "macera",      Icon: Zap,            label: "Macera" },
                  { value: "gece",        Icon: Moon,           label: "Gece Hayatı" },
                  { value: "luks-deneyim",Icon: Gem,            label: "Lüks Deneyimler" },
                ].map(({ value, Icon, label }) => {
                  const active = form.interests.includes(value);
                  return (
                    <button key={value} type="button" onClick={() => toggleArray("interests", value)}
                      className="p-3 rounded-2xl text-left transition-all"
                      style={{
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: active ? "var(--primary-soft)" : "var(--bg)",
                      }}>
                      <div className="flex items-center gap-2">
                        <Icon size={16} style={{ color: "var(--primary)" }} />
                        <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ulaşım tercihi */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Ulaşım tercihiniz</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "yuruyus",  Icon: Footprints, label: "Yürüyüş",       desc: "Şehri adımlayarak keşif" },
                  { value: "toplu",    Icon: Bus,        label: "Toplu taşıma",   desc: "Metro, tramvay, otobüs" },
                  { value: "taksi",    Icon: Car,        label: "Taksi",           desc: "Konfor ve hız öncelikli" },
                  { value: "karma",    Icon: Shuffle,    label: "Karma",           desc: "Duruma göre en mantıklısı" },
                ].map(({ value, Icon, label, desc }) => {
                  const active = form.transport.includes(value);
                  return (
                    <button key={value} type="button" onClick={() => set("transport", [value])}
                      className="p-4 rounded-2xl text-left transition-all"
                      style={{
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: active ? "var(--primary-soft)" : "var(--bg)",
                      }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} style={{ color: "var(--primary)" }} />
                        <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{label}</span>
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-light)" }}>{desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Uçuş & Konaklama */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Uçuş ve konaklama</h2>
              <p style={{ color: "var(--text-light)", fontSize: 14 }}>Rezervasyon durumunuzu belirtin; AI buna göre plan yapsın.</p>
            </div>

            {/* Uçuş durumu */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Uçuş durumunuz</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "var",   Icon: Plane,       label: "Uçuşum var",       desc: "Rezervasyon tamamlandı" },
                  { value: "yok",   Icon: MapPin,      label: "Henüz yok",         desc: "Uçuş aramam gerekiyor" },
                  { value: "gitmiyorum", Icon: Car,    label: "Uçmuyorum",         desc: "Kara/deniz yolu tercih" },
                ].map(({ value, Icon, label, desc }) => {
                  const active = form.flightStatus === value;
                  return (
                    <button key={value} type="button" onClick={() => set("flightStatus", value)}
                      className="p-4 rounded-2xl text-left transition-all"
                      style={{
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: active ? "var(--primary-soft)" : "var(--bg)",
                      }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} style={{ color: "var(--primary)" }} />
                        <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{label}</span>
                      </div>
                      <div className="text-xs leading-snug" style={{ color: "var(--text-light)" }}>{desc}</div>
                    </button>
                  );
                })}
              </div>
              {form.flightStatus === "yok" && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <Plane size={15} style={{ color: "var(--primary)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Gidiş tercihleri</span>
                      <span className="text-xs ml-auto" style={{ color: "var(--text-light)" }}>AI uygun uçuş önerir</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Kalkış şehri</label>
                        <input className="input-field text-sm" style={{ background: "white" }}
                          placeholder="ör. İstanbul"
                          value={form.preferredDepartureCity} onChange={(e) => set("preferredDepartureCity", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Tercih edilen saat</label>
                        <input type="time" className="input-field text-sm" style={{ background: "white" }}
                          value={form.preferredDepartureTime} onChange={(e) => set("preferredDepartureTime", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <Plane size={15} className="rotate-180" style={{ color: "var(--primary)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Dönüş tercihleri</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Varış şehri</label>
                        <input className="input-field text-sm" style={{ background: "white" }}
                          placeholder="ör. İstanbul"
                          value={form.preferredArrivalCity} onChange={(e) => set("preferredArrivalCity", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Tercih edilen saat</label>
                        <input type="time" className="input-field text-sm" style={{ background: "white" }}
                          value={form.preferredArrivalTime} onChange={(e) => set("preferredArrivalTime", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {form.flightStatus === "var" && (
                <div className="mt-4 space-y-4">
                  {/* Varış */}
                  <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <Plane size={15} style={{ color: "var(--primary)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Varış bilgileri</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Şehir</label>
                        <input className="input-field text-sm" style={{ background: "white" }}
                          placeholder="ör. Paris"
                          value={form.arrivalCity} onChange={(e) => set("arrivalCity", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Havalimanı</label>
                        <input className="input-field text-sm" style={{ background: "white" }}
                          placeholder="ör. CDG"
                          value={form.arrivalAirport} onChange={(e) => set("arrivalAirport", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>İniş saati</label>
                      <input type="time" className="input-field text-sm" style={{ background: "white" }}
                        value={form.arrivalTime} onChange={(e) => set("arrivalTime", e.target.value)} />
                    </div>
                  </div>

                  {/* Dönüş */}
                  <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <Plane size={15} className="rotate-180" style={{ color: "var(--primary)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Dönüş bilgileri</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Şehir</label>
                        <input className="input-field text-sm" style={{ background: "white" }}
                          placeholder="ör. İstanbul"
                          value={form.returnCity} onChange={(e) => set("returnCity", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Havalimanı</label>
                        <input className="input-field text-sm" style={{ background: "white" }}
                          placeholder="ör. SAW"
                          value={form.returnAirport} onChange={(e) => set("returnAirport", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Kalkış saati</label>
                      <input type="time" className="input-field text-sm" style={{ background: "white" }}
                        value={form.returnTime} onChange={(e) => set("returnTime", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {form.flightStatus === "gitmiyorum" && (
                <div className="mt-4 rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <Car size={15} style={{ color: "var(--primary)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Tahmini varış saati</span>
                    <span className="text-xs ml-auto" style={{ color: "var(--text-light)" }}>AI ilk günü buna göre planlar</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Kalkış şehri</label>
                      <input className="input-field text-sm" style={{ background: "white" }}
                        placeholder="ör. Ankara"
                        value={form.preferredDepartureCity} onChange={(e) => set("preferredDepartureCity", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-light)" }}>Tahmini varış saati</label>
                      <input type="time" className="input-field text-sm" style={{ background: "white" }}
                        value={form.groundArrivalTime} onChange={(e) => set("groundArrivalTime", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Konaklama durumu */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Otel rezervasyonunuz var mı?</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "var",    Icon: Hotel,   label: "Evet",             desc: "Mevcut rezervasyonum var" },
                  { value: "yok",    Icon: MapPin,  label: "Hayır",             desc: "Bana otel önerisi yap" },
                  { value: "airbnb", Icon: Heart,   label: "Airbnb / Kiralık", desc: "Ev tipi konaklama" },
                ].map(({ value, Icon, label, desc }) => {
                  const active = form.hotelStatus === value;
                  return (
                    <button key={value} type="button" onClick={() => set("hotelStatus", value)}
                      className="p-4 rounded-2xl text-left transition-all"
                      style={{
                        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border)",
                        background: active ? "var(--primary-soft)" : "var(--bg)",
                      }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} style={{ color: active ? "var(--primary)" : "var(--text-light)" }} />
                        <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{label}</span>
                      </div>
                      <div className="text-xs leading-snug" style={{ color: "var(--text-light)" }}>{desc}</div>
                    </button>
                  );
                })}
              </div>

              {form.hotelStatus === "yok" && (
                <div className="mt-4 rounded-2xl p-4 space-y-4" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text)" }}>Konaklama konumu tercihi</label>
                      <select className="input-field text-sm" style={{ background: "white" }}
                        value={form.hotelLocation} onChange={(e) => set("hotelLocation", e.target.value)}>
                        <option value="">Seçiniz</option>
                        <option value="merkez">Şehir merkezi</option>
                        <option value="sahil">Sahil / Su kenarı</option>
                        <option value="tarihi">Tarihi bölge</option>
                        <option value="havalimani">Havalimanı yakını</option>
                        <option value="fark-etmez">Fark etmez</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-medium" style={{ color: "var(--text)" }}>Otel tipi</label>
                        <span className="text-xs" style={{ color: "var(--text-light)" }}>isteğe bağlı</span>
                      </div>
                      <select className="input-field text-sm" style={{ background: "white" }}
                        value={form.hotelType} onChange={(e) => set("hotelType", e.target.value)}>
                        <option value="">Fark etmez</option>
                        <option value="butik">Butik otel</option>
                        <option value="3yildiz">3 yıldız</option>
                        <option value="4yildiz">4 yıldız</option>
                        <option value="5yildiz">5 yıldız</option>
                        <option value="hostel">Hostel</option>
                        <option value="apart">Apart / Daire</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text)" }}>Kahvaltı tercihi</label>
                      <select className="input-field text-sm" style={{ background: "white" }}
                        value={form.hotelBreakfast} onChange={(e) => set("hotelBreakfast", e.target.value)}>
                        <option value="">Fark etmez</option>
                        <option value="dahil">Kahvaltı dahil olsun</option>
                        <option value="haric">Kahvaltı dahil olmasın</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-medium" style={{ color: "var(--text)" }}>Özel özellik</label>
                        <span className="text-xs" style={{ color: "var(--text-light)" }}>isteğe bağlı</span>
                      </div>
                      <select className="input-field text-sm" style={{ background: "white" }}
                        value={form.hotelFeature} onChange={(e) => set("hotelFeature", e.target.value)}>
                        <option value="">Fark etmez</option>
                        <option value="havuz">Havuzlu</option>
                        <option value="spa">Spa & Wellness</option>
                        <option value="deniz-manzara">Deniz manzaralı</option>
                        <option value="evcil">Evcil hayvan dostu</option>
                        <option value="otopark">Otoparklı</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {form.hotelStatus === "airbnb" && (
                <div className="mt-4 rounded-2xl p-4 space-y-4" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text)" }}>Konaklama adresi</label>
                    <input className="input-field text-sm" style={{ background: "white" }}
                      placeholder="örn. Cihangir, Beyoğlu / Airbnb linki"
                      value={form.hotelAddress} onChange={(e) => set("hotelAddress", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text)" }}>Check-in saati</label>
                      <input type="time" className="input-field text-sm" style={{ background: "white" }}
                        value={form.checkInTime} onChange={(e) => set("checkInTime", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text)" }}>Check-out saati</label>
                      <input type="time" className="input-field text-sm" style={{ background: "white" }}
                        value={form.checkOutTime} onChange={(e) => set("checkOutTime", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {form.hotelStatus === "var" && (
                <div className="mt-4 rounded-2xl p-4 space-y-4" style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-light)" }}>Otel adı</label>
                    <input className="input-field text-sm" style={{ background: "white" }}
                      placeholder="örn. Galata Boutique Otel"
                      value={form.hotelName} onChange={(e) => set("hotelName", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-light)" }}>Otel adresi</label>
                    <input className="input-field text-sm" style={{ background: "white" }}
                      placeholder="örn. Galata, Beyoğlu"
                      value={form.hotelAddress} onChange={(e) => set("hotelAddress", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-light)" }}>Check-in saati</label>
                      <input type="time" className="input-field text-sm" style={{ background: "white" }}
                        value={form.checkInTime} onChange={(e) => set("checkInTime", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-light)" }}>Check-out saati</label>
                      <input type="time" className="input-field text-sm" style={{ background: "white" }}
                        value={form.checkOutTime} onChange={(e) => set("checkOutTime", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5 — Son Dokunuşlar */}
        {step === 4 && (() => {
          const TRAVEL_TYPE_LABELS: Record<string, string> = { solo: "Tek başına", couple: "Çift", family: "Aile", group: "Arkadaş grubu" };
          const TRAVEL_STYLE_LABELS: Record<string, string> = { ekonomik: "Ekonomik", dengeli: "Dengeli", luks: "Lüks" };
          const TRANSPORT_LABELS: Record<string, string> = { yuruyus: "Yürüyüş", toplu: "Toplu taşıma", taksi: "Taksi", karma: "Karma" };
          const INTEREST_LABELS: Record<string, string> = { tarih: "Tarih", gastronomi: "Gastronomi", doga: "Doğa", fotograf: "Fotoğrafçılık", macera: "Macera", gece: "Gece Hayatı", "luks-deneyim": "Lüks Deneyimler" };
          const HOTEL_LOC_LABELS: Record<string, string> = { merkez: "Şehir Merkezi", sahil: "Sahil", tarihi: "Tarihi Bölge", havalimani: "Havalimanı Yakını", "fark-etmez": "Fark etmez" };
          const HOTEL_TYPE_LABELS: Record<string, string> = { butik: "Butik", "3yildiz": "3★", "4yildiz": "4★", "5yildiz": "5★", hostel: "Hostel", apart: "Apart" };
          const FLIGHT_STATUS_LABELS: Record<string, string> = { var: "Rezervasyon var", yok: "Henüz yok (AI önersin)", gitmiyorum: "Uçmuyor (kara/deniz)" };
          const HOTEL_STATUS_LABELS: Record<string, string> = { var: "Rezervasyon var", yok: "AI önersin", airbnb: "Airbnb / Kiralık" };
          const BREAKFAST_LABELS: Record<string, string> = { dahil: "Kahvaltı dahil", haric: "Kahvaltı hariç" };
          const FEATURE_LABELS: Record<string, string> = { havuz: "Havuzlu", spa: "Spa & Wellness", "deniz-manzara": "Deniz manzaralı", evcil: "Evcil hayvan dostu", otopark: "Otoparklı" };

          function formatDate(d: string) {
            if (!d) return "";
            return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
          }

          const summaryRows = [
            form.destination ? { label: "Şehir", value: form.destination } : null,
            form.startDate && form.endDate ? { label: "Tarih", value: `${formatDate(form.startDate)} – ${formatDate(form.endDate)}` } : null,
            { label: "Süre", value: `${getDuration()} gün` },
            form.budget ? { label: "Bütçe", value: `${form.currency} ${Number(form.budget).toLocaleString("tr-TR")} · ${form.travelers} kişi` } : null,
            (form.travelType || form.travelStyle) ? { label: "Tip / Tarz", value: [TRAVEL_TYPE_LABELS[form.travelType], TRAVEL_STYLE_LABELS[form.travelStyle]].filter(Boolean).join(" · ") } : null,
            form.interests.length ? { label: "İlgi alanları", value: form.interests.map(i => INTEREST_LABELS[i] ?? i).join(", ") } : null,
            form.transport.length ? { label: "Ulaşım", value: TRANSPORT_LABELS[form.transport[0]] ?? form.transport[0] } : null,
            form.flightStatus ? { label: "Uçuş durumu", value: FLIGHT_STATUS_LABELS[form.flightStatus] ?? form.flightStatus } : null,
            form.flightStatus === "var" && form.arrivalCity ? { label: "Varış", value: `${form.arrivalCity}${form.arrivalAirport ? ` (${form.arrivalAirport})` : ""}${form.arrivalTime ? ` · ${form.arrivalTime}` : ""}` } : null,
            form.flightStatus === "var" && form.returnCity ? { label: "Dönüş", value: `${form.returnCity}${form.returnAirport ? ` (${form.returnAirport})` : ""}${form.returnTime ? ` · ${form.returnTime}` : ""}` } : null,
            form.flightStatus === "yok" && form.preferredDepartureCity ? { label: "Tercih kalkış", value: `${form.preferredDepartureCity}${form.preferredDepartureTime ? ` · ${form.preferredDepartureTime}` : ""}` } : null,
            form.flightStatus === "gitmiyorum" && form.groundArrivalTime ? { label: "Tahmini varış", value: `${form.preferredDepartureCity ? form.preferredDepartureCity + " · " : ""}${form.groundArrivalTime}` } : null,
            form.hotelStatus ? { label: "Konaklama", value: HOTEL_STATUS_LABELS[form.hotelStatus] ?? form.hotelStatus } : null,
            form.hotelName ? { label: "Otel", value: `${form.hotelName}${form.hotelAddress ? ` · ${form.hotelAddress}` : ""}` } : null,
            (form.checkInTime || form.checkOutTime) ? { label: "Check-in / out", value: `${form.checkInTime || "—"} / ${form.checkOutTime || "—"}` } : null,
            form.hotelLocation ? { label: "Konaklama konumu", value: HOTEL_LOC_LABELS[form.hotelLocation] ?? form.hotelLocation } : null,
            form.hotelType ? { label: "Otel tipi", value: HOTEL_TYPE_LABELS[form.hotelType] ?? form.hotelType } : null,
            form.hotelBreakfast ? { label: "Kahvaltı", value: BREAKFAST_LABELS[form.hotelBreakfast] ?? form.hotelBreakfast } : null,
            form.hotelFeature ? { label: "Özel özellik", value: FEATURE_LABELS[form.hotelFeature] ?? form.hotelFeature } : null,
          ].filter(Boolean) as { label: string; value: string }[];

          return (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>Son dokunuşlar</h2>
                <p style={{ color: "var(--text-light)", fontSize: 14 }}>Varsa özel isteklerinizi ekleyin, özeti kontrol edin.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>Ek notlar</label>
                  <span className="text-xs" style={{ color: "var(--text-light)" }}>isteğe bağlı</span>
                </div>
                <textarea className="input-field resize-none" rows={4}
                  style={{ background: "var(--bg)" }}
                  placeholder="örn. Vejetaryen restoran önceliği, sabahları geç başlayalım, müze yoğunluğu az olsun..."
                  value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>

              {/* Plan özeti */}
              <div className="rounded-2xl p-5" style={{ background: "var(--primary-soft)", border: "1.5px dashed var(--primary)" }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: "var(--primary)" }}>Plan özeti</h3>
                <div className="space-y-2.5">
                  {summaryRows.map((row) => (
                    <div key={row.label} className="flex gap-4 text-sm">
                      <span className="w-36 flex-shrink-0" style={{ color: "var(--text-light)" }}>{row.label}</span>
                      <span className="font-semibold" style={{ color: "var(--text)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => step === 0 ? router.push("/dashboard") : setStep((s) => s - 1)}
            className="font-semibold px-6 py-3 transition-all"
            style={{
              borderRadius: "999px",
              border: "2px solid var(--border)",
              color: "var(--primary)",
              background: "transparent",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {step === 0 ? "İptal" : "← Geri"}
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}
              className="font-semibold px-7 py-3 text-white transition-all disabled:opacity-40"
              style={{
                borderRadius: "999px",
                background: "var(--primary)",
                fontFamily: "var(--font-dm-sans)",
              }}>
              Devam Et →
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="font-semibold px-7 py-3 text-white transition-all flex items-center gap-2"
              style={{
                borderRadius: "999px",
                background: "var(--primary)",
                fontFamily: "var(--font-dm-sans)",
              }}>
              <Plane size={16} />
              Planımı Oluştur
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
