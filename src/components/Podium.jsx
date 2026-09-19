// ============================================================
// Podium.jsx — Top 3 con Ovejas 3D de cuerpo completo
// ============================================================
import { motion } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';

const podiumConfig = {
  1: {
    label: '1ST LEADER · ORO',
    borderColor: 'border-neon-gold/60',
    glowShadow: 'shadow-neon-gold',
    trophyColor: 'text-neon-gold',
    badgeBg: 'bg-neon-gold/20 border-neon-gold/40 text-neon-gold',
    height: 'h-[340px]',
    imgHeight: 'h-[220px]',
    nameGlow: 'text-glow-gold',
    order: 'order-2', // centro
    delay: 0.2,
  },
  2: {
    label: '2nd',
    borderColor: 'border-neon-silver/40',
    glowShadow: 'shadow-neon-silver',
    trophyColor: 'text-neon-silver',
    badgeBg: 'bg-neon-silver/15 border-neon-silver/30 text-neon-silver',
    height: 'h-[290px]',
    imgHeight: 'h-[180px]',
    nameGlow: '',
    order: 'order-1', // izquierda
    delay: 0.0,
  },
  3: {
    label: '3rd',
    borderColor: 'border-neon-bronze/40',
    glowShadow: 'shadow-neon-bronze',
    trophyColor: 'text-neon-bronze',
    badgeBg: 'bg-neon-bronze/15 border-neon-bronze/30 text-neon-bronze',
    height: 'h-[270px]',
    imgHeight: 'h-[170px]',
    nameGlow: '',
    order: 'order-3', // derecha
    delay: 0.4,
  },
};

function formatMoney(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' USD';
}

function PodiumCard({ user, position }) {
  const config = podiumConfig[position];
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: config.delay, ease: 'easeOut' }}
      className={`${config.order} flex-1 max-w-[280px]`}
    >
      <div
        className={`
          relative glass-strong rounded-2xl ${config.borderColor} ${config.height}
          flex flex-col items-center justify-end pb-5 px-4
          ${position === 1 ? config.glowShadow : ''}
          transition-all duration-300
        `}
      >
        {/* ---- Badge de Posición ---- */}
        {position === 1 ? (
          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border text-xs font-bold ${config.badgeBg} flex items-center gap-1.5 whitespace-nowrap`}>
            <Crown className="w-3.5 h-3.5" />
            {config.label}
            <Crown className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className={`absolute -top-2 ${position === 2 ? 'left-3' : 'right-3'} px-3 py-1 rounded-full border text-xs font-bold ${config.badgeBg} flex items-center gap-1`}>
            {config.label}
            <Trophy className="w-3 h-3" />
          </div>
        )}

        {/* ---- Personaje de Cuerpo Completo (Flotante) ---- */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className={`${config.imgHeight} w-full flex items-end justify-center mb-2 mt-8`}
        >
          <img
            src={user.character_fullbody_url}
            alt={user.character_name || user.name}
            className="max-h-full w-auto object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </motion.div>

        {/* ---- Sombra Elíptica (Ilusión 3D) ---- */}
        <div className="bg-black/60 blur-md w-3/4 h-4 rounded-full mx-auto -mt-2 mb-3" />

        {/* ---- Info del Asesor ---- */}
        <div className="text-center w-full">
          <h3 className={`text-sm font-bold ${config.nameGlow} ${position === 1 ? 'text-neon-gold' : 'text-white/90'}`}>
            {user.name}
          </h3>
          <p className="text-xs text-dtodo-purple mt-0.5">{user.discord_tag}</p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs text-white/50">{user.sales_count} {position === 1 ? 'cierres' : 'ventas'}</span>
            <span className={`text-sm font-bold ${position === 1 ? 'text-neon-green text-glow-green' : 'text-neon-green/80'}`}>
              {formatMoney(user.total_sales)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Podium({ data }) {
  const top3 = data.slice(0, 3);

  // Placeholder si no hay datos
  if (top3.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40 text-sm">No hay datos de ventas aún. Usa el simulador para empezar.</p>
      </div>
    );
  }

  return (
    <section className="mb-8">
      {/* ---- Header del Podio ---- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">👑</span>
            Podio de Honor · Top 3 Ventas
          </h2>
          <p className="text-xs text-white/40 mt-1">
            Asesores con personajes de cuerpo completo sosteniendo sus trofeos oficiales.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs text-white/60 font-medium">Mes Actual · Actualización en Vivo</span>
        </div>
      </div>

      {/* ---- Podio (3 columnas: 2nd | 1st | 3rd) ---- */}
      <div className="flex items-end justify-center gap-5 px-4">
        {top3.map((user, idx) => (
          <PodiumCard key={user.id} user={user} position={idx + 1} />
        ))}
      </div>
    </section>
  );
}
