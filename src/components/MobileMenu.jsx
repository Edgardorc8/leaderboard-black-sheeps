// ============================================================
// MobileMenu.jsx — Drawer de Navegación para Móvil
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2, Users, Trophy, FileText, Settings, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'sales',       label: 'Mis Ventas',  icon: Zap },
  { id: 'team',        label: 'Mi Equipo',   icon: Users },
  { id: 'reports',     label: 'Reportes',    icon: FileText },
  { id: 'analytics',  label: 'Analytics',   icon: BarChart2 },
  { id: 'settings',   label: 'Ajustes',     icon: Settings },
];

export default function MobileMenu({ isOpen, onClose, activeSection, onNavigate }) {
  const handleNav = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-72 bg-[#0d0a1e] border-r border-[#2d2255] flex flex-col shadow-[4px_0_40px_rgba(168,85,247,0.2)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#2d2255] bg-gradient-to-r from-purple-900/30 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-lg font-black text-white shadow-lg shadow-purple-500/30">
                  BS
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">Black Sheeps</p>
                  <p className="text-purple-400 text-xs mt-0.5">Sales Hub</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-inner'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                    {label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#2d2255]">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  BS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">Black Sheeps</p>
                  <p className="text-gray-500 text-xs truncate">v1.0 Production</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
