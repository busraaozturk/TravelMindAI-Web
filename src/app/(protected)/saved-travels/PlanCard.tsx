"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Wallet, Users, Calendar, Trash2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface Plan {
  id: string;
  destination: string;
  title: string;
  start_date: string;
  duration_days: number;
  budget: number;
  currency: string;
  travelers: number;
  created_at: string;
}

function DeleteModal({ destination, onConfirm, onCancel, deleting }: {
  destination: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="card p-6 w-full max-w-sm fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* İkon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--error-soft)" }}>
            <AlertTriangle size={26} style={{ color: "var(--error)" }} />
          </div>
        </div>

        {/* Metin */}
        <h3 className="text-center font-bold text-lg mb-1"
          style={{ fontFamily: "var(--font-dm-sans)", color: "var(--text)" }}>
          Planı Sil
        </h3>
        <p className="text-center text-sm mb-6" style={{ color: "var(--text-light)", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: "var(--text)" }}>{destination}</span> planını silmek
          istediğine emin misin? Bu işlem geri alınamaz.
        </p>

        {/* Butonlar */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "var(--bg)", border: "1.5px solid var(--border)", color: "var(--text)" }}
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: deleting ? "#d97b5f" : "var(--error)" }}
          >
            {deleting
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Trash2 size={14} /> Evet, Sil</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlanCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    setDeleting(true);
    await supabase.from("travel_plans").delete().eq("id", plan.id);
    router.refresh();
  }

  return (
    <>
      {showModal && (
        <DeleteModal
          destination={plan.destination}
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
          deleting={deleting}
        />
      )}

    <div className="card p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 relative group">
      {/* Sil butonu */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
        className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-light)" }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--error-soft)";
          (e.currentTarget as HTMLElement).style.color = "#EF4444";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--error-soft)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-light)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        }}
        title="Planı sil"
      >
        <Trash2 size={14} />
      </button>

      {/* Kart içeriği — tıklanabilir alan */}
      <Link href={`/saved-travels/${plan.id}`} className="block">
        <div className="flex items-start justify-between mb-3 pr-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} style={{ color: "var(--primary)" }} />
              <span className="font-bold text-lg">{plan.destination}</span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-1">{plan.title}</p>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            {new Date(plan.start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            {plan.duration_days} gün
          </span>
          <span className="flex items-center gap-1.5">
            <Wallet size={13} className="text-slate-400" />
            {plan.budget?.toLocaleString("tr-TR")} {plan.currency}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-slate-400" />
            {plan.travelers} kişi
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          {new Date(plan.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </Link>
    </div>
    </>
  );
}
