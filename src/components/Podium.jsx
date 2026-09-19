// ============================================================
// Podium.jsx — Podio de Honor Top 3 con Trofeos Oficiales 3D Dinámicos
// (Oro, Plata, Bronce) y Personajes en Fullbody
// ============================================================
import { motion } from 'framer-motion';
import { formatCurrency, getTier } from '../lib/tiers';

export default function Podium({ top3, onSelectUser }) {
  if (!top3 || top3.length === 0) return null;

  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  // Configuración de cada escalón
  const podiumSteps = [
    {
      data: second,
      rank: 2,
      label: '2nd 🥈',
      trophyUrl: '/trophies/trophy_silver.png',
      borderColor: 'border-slate-400/60',
      badgeBg: 'bg-slate-400/20 text-slate-200 border-slate-400/40',
      glow: 'shadow-[0_0_25px_rgba(148,163,184,0.2)]',
      cardHeight: 'h-[440px]',
      order: 'order-1',
    },
    {
      data: first,
      rank: 1,
      label: '👑 1ST LEADER · ORO 👑',
      trophyUrl: '/trophies/trophy_gold.png',
      borderColor: 'border-amber-400',
      badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/50',
      glow: 'shadow-[0_0_35px_rgba(251,191,36,0.3)]',
      cardHeight: 'h-[490px]',
      order: 'order-2',
      isFirst: true,
    },
    {
      data: third,
      rank: 3,
      label: '3rd 🥉',
      trophyUrl: '/trophies/trophy_bronze.png',
      borderColor: 'border-amber-700/60',
      badgeBg: 'bg-amber-700/20 text-amber-400 border-amber-700/40',
      glow: 'shadow-[0_0_25px_rgba(180,83,9,0.2)]',
      cardHeight: 'h-[420px]',
      order: 'order-3',
    },
  ];

  return (
    <section className="mb-10">
      {/* Encabezado del podio */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏆</span> Podio de Honor · Top 3 Ventas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Asesores con personajes de cuerpo completo sosteniendo sus trofeos oficiales
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#120e24] border border-[#2d2255] text-xs text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="font-semibold">Actualización en Vivo</span>
        </div>
      </div>

      {/* Grid del podio */}
      <div className="grid grid-cols-3 gap-6 items-end">
        {podiumSteps.map((step) => {
          const user = step.data;
          if (!user) return <div key={step.rank} className={step.order} />;

          const tier = getTier(user.total_sales);

          return (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => onSelectUser(user)}
              className={`relative ${step.order} ${step.cardHeight} cursor-pointer group flex flex-col justify-between p-6 rounded-2xl bg-[#141026] border ${step.borderColor} ${step.glow} backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]`}
            >
              {/* Badge de posición superior */}
              <div className="flex items-center justify-between z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider ${step.badgeBg}`}>
                  {step.label}
                </span>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.badgeBg} ${tier.border} ${tier.text}`}>
                  {tier.icon} {tier.name}
                </span>
              </div>

              {/* Área del Personaje y Trofeo */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                {/* Personaje de cuerpo completo flotante */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="relative z-10 w-full h-full flex items-center justify-center"
                >
                  <img
                    src={user.character_fullbody_url || '/characters/01_sheep_alex/fullbody.png'}
                    alt={user.name}
                    className="max-h-[260px] w-auto object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.7)]"
                  />

                  {/* Trofeo 3D dinámico superpuesto en la escena */}
                  <motion.div
                    animate={{ y: [3, -3, 3], rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="absolute -bottom-2 -right-1 w-20 h-20 z-20 pointer-events-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]"
                  >
                    <img
                      src={step.trophyUrl}
                      alt="Trofeo Oficial"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </motion.div>

                {/* Sombra elíptica en el suelo */}
                <motion.div
                  animate={{ scale: [1, 0.85, 1], opacity: [0.5, 0.3, 0.5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute bottom-2 w-36 h-4 bg-black/60 rounded-full blur-md"
                />
              </div>

              {/* Datos del Asesor y Volumen */}
              <div className="text-center z-10 pt-2 border-t border-[#2d2255]/60">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {user.name}
                  </h3>
                  <span className="text-sm">{user.country?.split(' ')[0]}</span>
                </div>

                <p className="text-xs text-purple-300 font-mono mt-0.5">
                  {user.discord_tag}
                </p>

                <div className="flex items-center justify-between mt-3 px-2 py-1.5 rounded-lg bg-black/30 border border-[#2d2255]">
                  <span className="text-xs text-slate-400">
                    {user.sales_count} cierres
                  </span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono tracking-tight">
                    {formatCurrency(user.total_sales)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
