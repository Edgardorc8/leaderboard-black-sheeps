// ============================================================
// LeaderboardTable.jsx — Tabla de Clasificación General del Equipo
// Responsive: tarjetas apiladas en móvil, tabla en desktop
// ============================================================
import { motion } from 'framer-motion';
import { formatCurrency, getTierByRank } from '../lib/tiers';
import { Eye, Sparkles } from 'lucide-react';

export default function LeaderboardTable({
  users,
  onOpenCharacterModal,
  onSelectUser,
}) {
  return (
    <section className="bg-[#120e24] border border-[#2d2255] rounded-2xl p-4 md:p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
      {/* Header de la tabla */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">👥</span>
          <h3 className="text-base font-bold text-white">
            Clasificación General del Equipo
          </h3>
        </div>

        <span className="text-xs text-slate-400 font-semibold px-2.5 py-1 rounded-full bg-black/40 border border-[#2d2255]">
          {users.length} asesores
        </span>
      </div>

      {/* ── Vista Móvil: Tarjetas apiladas ── */}
      <div className="md:hidden space-y-3">
        {users.map((u, idx) => {
          const currentRank = u.rank || idx + 1;
          const tier = getTierByRank(currentRank);
          const isTop3 = currentRank <= 3;

          return (
            <motion.div
              key={u.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onSelectUser(u)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                isTop3
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-white/[0.02] border-[#2d2255] hover:border-purple-500/30'
              }`}
            >
              {/* Rank */}
              <span className={`font-mono font-black text-sm w-8 text-center flex-shrink-0 ${
                isTop3 ? 'text-amber-400' : 'text-purple-400'
              }`}>
                #{currentRank}
              </span>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/40 bg-black/50 flex-shrink-0">
                <img
                  src={u.character_avatar_url || '/characters/01_sheep_alex/avatar.png'}
                  alt={u.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm truncate">{u.name}</span>
                  <span className="text-xs">{u.country?.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold border ${tier.badgeBg} ${tier.border} ${tier.text}`}>
                    {tier.icon} {tier.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{u.sales_count} ventas</span>
                </div>
              </div>

              {/* Volumen */}
              <div className="text-right flex-shrink-0">
                <div className="font-mono font-bold text-emerald-400 text-sm">
                  {formatCurrency(u.total_sales)}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenCharacterModal(u); }}
                  className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
                >
                  ✨ Avatar
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Vista Desktop: Tabla tradicional ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#2d2255] text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="pb-3 pl-2 font-semibold">RANK</th>
              <th className="pb-3 font-semibold">TIER</th>
              <th className="pb-3 font-semibold">ASESOR COMERCIAL &amp; AVATAR</th>
              <th className="pb-3 font-semibold">DISCORD TAG</th>
              <th className="pb-3 font-semibold">CIERRES</th>
              <th className="pb-3 font-semibold">VOLUMEN VENTAS</th>
              <th className="pb-3 pr-2 text-right font-semibold">ACCIÓN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2255]/40">
            {users.map((u, idx) => {
              const currentRank = u.rank || idx + 1;
              const tier = getTierByRank(currentRank);
              const rankFormatted = `#${String(currentRank).padStart(2, '0')}`;
              const isTop3 = currentRank <= 3;

              return (
                <motion.tr
                  key={u.id}
                  layout
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                  className="group transition-colors cursor-pointer"
                  onClick={() => onSelectUser(u)}
                >
                  {/* RANK */}
                  <td className="py-3.5 pl-2">
                    <span
                      className={`font-mono font-bold text-xs ${
                        isTop3
                          ? 'text-amber-400 font-extrabold'
                          : 'text-purple-400'
                      }`}
                    >
                      {rankFormatted}
                    </span>
                  </td>

                  {/* TIER BADGE */}
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.badgeBg} ${tier.border} ${tier.text}`}
                    >
                      <span>{tier.icon}</span>
                      <span>{tier.name}</span>
                    </span>
                  </td>

                  {/* ASESOR COMERCIAL & AVATAR */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-purple-500/40 bg-black/50 p-0.5 shrink-0 group-hover:border-purple-400 transition-colors">
                        <img
                          src={u.character_avatar_url || '/characters/01_sheep_alex/avatar.png'}
                          alt={u.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                          {u.name}
                          <span className="text-xs">{u.country?.split(' ')[0]}</span>
                        </div>
                        <div className="text-[10px] text-purple-300 flex items-center gap-1">
                          <span>⚔️</span>
                          <span>{u.custom_character_name || u.character_name || 'Black Sheep'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DISCORD TAG */}
                  <td className="py-3.5 font-mono text-slate-300 text-xs">
                    {u.discord_tag}
                  </td>

                  {/* CIERRES */}
                  <td className="py-3.5 text-slate-300 font-medium">
                    {u.sales_count} ventas
                  </td>

                  {/* VOLUMEN VENTAS */}
                  <td className="py-3.5 font-mono font-bold text-emerald-400 text-sm tracking-tight">
                    {formatCurrency(u.total_sales)}
                  </td>

                  {/* ACCIÓN */}
                  <td className="py-3.5 pr-2 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectUser(u)}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Ver Estadísticas"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenCharacterModal(u)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1a1435] border border-[#2d2255] text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-900/30 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-3 h-3" />
                        Avatar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
