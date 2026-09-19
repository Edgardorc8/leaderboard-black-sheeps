// ============================================================
// DiscordSimulator.jsx — Simulador en Vivo de Ventas de Discord
// (Idéntico a la captura media_1789828829025.jpg)
// ============================================================
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { formatCurrency } from '../lib/tiers';

export default function DiscordSimulator({ users, onSimulateSale }) {
  return (
    <section className="bg-[#120e24] border border-[#2d2255] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
      {/* Header idéntico a la foto */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mt-0.5">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Simulador en Vivo de Ventas de Discord
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Presiona los botones para inyectar ventas reales y mira cómo rotan los puestos y cambian los trofeos al instante.
          </p>
        </div>
      </div>

      {/* Grid de 2 columnas idéntico a captura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            layout
            className="p-4 rounded-xl bg-[#141026] border border-[#2d2255] hover:border-purple-500/40 transition-all flex flex-col justify-between"
          >
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">
                  {user.name}
                </span>
                <span className="text-xs text-slate-400">
                  {user.sales_count} cierres
                </span>
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-400 mt-0.5">
                {formatCurrency(user.total_sales)}
              </div>
            </div>

            {/* Botones +$5K y +$25K idénticos */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSimulateSale(user.id, 5000)}
                className="py-2 px-3 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/60 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                +$5K
              </button>

              <button
                onClick={() => onSimulateSale(user.id, 25000)}
                className="py-2 px-3 rounded-lg text-xs font-bold text-purple-200 bg-purple-950/50 border border-purple-500/40 hover:bg-purple-900/60 hover:border-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                +$25K
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
