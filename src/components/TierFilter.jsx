// ============================================================
// TierFilter.jsx — Filtro Dinámico por Tier (Todos, S, A, B, C)
// ============================================================
import { TIERS } from '../lib/tiers';

export default function TierFilter({ activeTier, onTierChange }) {
  const tiersList = [
    { id: 'ALL', label: 'Todos los Asesores', icon: '👥', badge: null },
    { id: 'S', label: 'Tier S', icon: '👑', color: 'text-amber-400 border-amber-400/40' },
    { id: 'A', label: 'Tier A', icon: '⚡', color: 'text-purple-400 border-purple-400/40' },
    { id: 'B', label: 'Tier B', icon: '💎', color: 'text-cyan-400 border-cyan-400/40' },
    { id: 'C', label: 'Tier C', icon: '🛡️', color: 'text-emerald-400 border-emerald-400/40' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tiersList.map((t) => {
        const isActive = activeTier === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTierChange(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              isActive
                ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-[#141026] border-[#2d2255] text-slate-400 hover:text-slate-200 hover:border-slate-500'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
