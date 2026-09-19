// ============================================================
// TimeFilter.jsx — Filtro Temporal: Diario, Semanal, Mensual
// ============================================================
import { Calendar, Clock, Trophy } from 'lucide-react';

export default function TimeFilter({ activePeriod, onPeriodChange }) {
  const options = [
    { id: 'daily', label: 'Hoy (Diario)', icon: Clock },
    { id: 'weekly', label: 'Esta Semana', icon: Calendar },
    { id: 'monthly', label: 'Mes Actual (Septiembre)', icon: Trophy },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#120e24] border border-[#2d2255] rounded-xl backdrop-blur-md">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = activePeriod === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onPeriodChange(opt.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-[#e94560] to-[#a855f7] text-white shadow-[0_0_12px_rgba(233,69,96,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
