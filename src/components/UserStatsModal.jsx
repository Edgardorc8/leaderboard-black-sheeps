// ============================================================
// UserStatsModal.jsx — Ficha Técnica de Estadísticas Individuales
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Award, Calendar, DollarSign, MessageSquare, ShieldCheck } from 'lucide-react';
import { getTier, formatCurrency } from '../lib/tiers';

export default function UserStatsModal({ user, character, isOpen, onClose }) {
  const [period, setPeriod] = useState('monthly');

  if (!isOpen || !user) return null;

  const currentSales =
    period === 'daily'
      ? user.daily_sales || 0
      : period === 'weekly'
      ? user.weekly_sales || 0
      : user.total_sales || 0;

  const tier = getTier(currentSales);
  const avgTicket = user.sales_count > 0 ? Math.round(user.total_sales / user.sales_count) : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#120e24] border border-[#2d2255] rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden"
        >
          {/* Header con gradiente */}
          <div className="relative p-6 border-b border-[#2d2255] bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-black/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <img
                  src={character?.card_url || character?.avatar_url || '/characters/01_sheep_alex/avatar.png'}
                  alt={user.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <span className="text-sm">{user.country?.split(' ')[0]}</span>
                  {user.role === 'super_admin' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300">
                      SUPER ADMIN
                    </span>
                  )}
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 border border-purple-400/40 text-purple-300">
                      ADMIN
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-purple-300 mt-0.5">
                  ⚔️ {user.custom_character_name || character?.name || 'Guerrero Black Sheep'}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Discord: <span className="text-slate-300">{user.discord_tag}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Selector de periodo */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Filtro de Rendimiento
              </span>
              <div className="flex gap-1 p-1 bg-black/40 border border-[#2d2255] rounded-xl">
                {[
                  { id: 'daily', label: 'Diario' },
                  { id: 'weekly', label: 'Semanal' },
                  { id: 'monthly', label: 'Mensual' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      period === p.id
                        ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tarjetas KPI */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-black/30 border border-[#2d2255]">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Volumen ({period})</span>
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  {formatCurrency(currentSales)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span className={tier.text}>{tier.icon} {tier.name}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-[#2d2255]">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cierres Totales</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {user.sales_count} ventas
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Acumuladas</div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-[#2d2255]">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ticket Promedio</span>
                </div>
                <div className="text-lg font-bold text-cyan-400">
                  {formatCurrency(avgTicket)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Por contrato</div>
              </div>
            </div>

            {/* Grito de guerra */}
            {user.battle_cry && (
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    Grito de Cierre Oficial
                  </div>
                  <p className="text-xs text-slate-200 italic mt-0.5">
                    «{user.battle_cry}»
                  </p>
                </div>
              </div>
            )}

            {/* Historial de ventas recientes */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Ventas Recientes Registradas
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {user.recent_sales && user.recent_sales.length > 0 ? (
                  user.recent_sales.map((sale, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-[#2d2255] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300">Cierre confirmado</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-[11px]">{sale.time}</span>
                        <span className="font-bold text-emerald-400">+{formatCurrency(sale.amount)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center rounded-lg bg-black/20 border border-[#2d2255] text-xs text-slate-400">
                    No hay ventas registradas en las últimas horas.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
