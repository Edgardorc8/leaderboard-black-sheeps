// ============================================================
// LeaderboardTable.jsx — Puestos 4 en adelante (cabezas 3D)
// ============================================================
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

function formatMoney(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' USD';
}

export default function LeaderboardTable({ data, onOpenCharacterModal }) {
  const tableData = data.slice(3); // Puestos 4+

  if (tableData.length === 0) return null;

  return (
    <section className="mt-2">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span className="text-lg">📊</span>
          Clasificación General del Equipo
        </h2>
        <span className="text-xs text-white/40">
          Mostrando {tableData.length} asesores
        </span>
      </div>

      {/* ---- Tabla ---- */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">Asesor Comercial &amp; Avatar</th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">Discord Tag</th>
              <th className="px-6 py-4 text-center text-[11px] font-semibold text-white/40 uppercase tracking-wider">Cierres</th>
              <th className="px-6 py-4 text-right text-[11px] font-semibold text-white/40 uppercase tracking-wider">Volumen Ventas</th>
              <th className="px-6 py-4 text-center text-[11px] font-semibold text-white/40 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
                className="border-b border-white/[0.03] last:border-b-0 cursor-default transition-colors"
              >
                {/* RANK */}
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-dtodo-purple">
                    #{String(user.rank).padStart(2, '0')}
                  </span>
                </td>

                {/* ASESOR & AVATAR */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-dtodo-purple/30 bg-white/10 flex-shrink-0">
                      <img
                        src={user.character_avatar_url || user.user_avatar_url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/90">{user.name}</p>
                      <p className="text-xs text-white/40">{user.country || ''}</p>
                    </div>
                  </div>
                </td>

                {/* DISCORD TAG */}
                <td className="px-6 py-4">
                  <span className="text-sm text-dtodo-purple">{user.discord_tag}</span>
                </td>

                {/* CIERRES */}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-neon-green" />
                    <span className="text-sm text-white/70">{user.sales_count} ventas</span>
                  </div>
                </td>

                {/* VOLUMEN */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-neon-green text-glow-green">
                    {formatMoney(user.total_sales)}
                  </span>
                </td>

                {/* ACCIÓN */}
                <td className="px-6 py-4 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenCharacterModal(user)}
                    className="px-4 py-1.5 text-xs font-medium rounded-lg border border-white/10 
                               text-white/60 hover:text-white hover:border-dtodo-purple/40 hover:bg-dtodo-purple/10
                               transition-all duration-200"
                  >
                    Avatar
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
