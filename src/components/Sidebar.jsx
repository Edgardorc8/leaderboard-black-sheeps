// ============================================================
// Sidebar.jsx — Navegación lateral fija
// ============================================================
import { Trophy, Gem, Zap, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'characters', label: 'Elegir Personaje', icon: Gem },
  { id: 'simulator', label: 'Simular Discord', icon: Zap },
];

export default function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="glass-sidebar fixed left-0 top-0 bottom-0 w-[240px] flex flex-col z-50">
      {/* ---- Logo ---- */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dtodo-purple to-dtodo-pink flex items-center justify-center shadow-neon-purple">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-dtodo-purple to-dtodo-pink bg-clip-text text-transparent leading-tight">
              DTodoSales
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase">
              Enterprise Hub
            </p>
          </div>
        </div>
      </div>

      {/* ---- Menu Items ---- */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-dtodo-purple/20 text-dtodo-purple border border-dtodo-purple/30 shadow-neon-purple'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }
              `}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* ---- Discord Sync Status ---- */}
      <div className="px-5 py-5 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-neon-green animate-ping opacity-75" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70">Discord Sync</p>
            <p className="text-[10px] text-white/40">Bot conectado en tiempo real escuchando cierres de ventas.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
