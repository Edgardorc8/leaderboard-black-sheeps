// ============================================================
// Sidebar.jsx — Barra Lateral de Navegación Oficial
// ============================================================
import { Trophy, Sparkles, BarChart3, Shield, HelpCircle, FileText } from 'lucide-react';

export default function Sidebar({
  activeView,
  onNavigate,
  onOpenCharacterModal,
  onOpenAdminUsers,
  isAdmin,
}) {
  const menuItems = [
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      action: () => onNavigate('leaderboard'),
    },
    {
      id: 'characters',
      label: 'Elegir Personaje',
      icon: Sparkles,
      action: onOpenCharacterModal,
    },
    {
      id: 'reports',
      label: 'Reportes & Estadísticas',
      icon: BarChart3,
      action: () => onNavigate('reports'),
    },
  ];

  // Si es administrador, añadir acceso a Gestión de Usuarios
  if (isAdmin) {
    menuItems.push({
      id: 'admin_users',
      label: 'Gestión de Usuarios',
      icon: Shield,
      action: onOpenAdminUsers,
      isAdminBadge: true,
    });
  }

  return (
    <aside className="hidden md:flex w-64 h-screen sticky top-0 flex-col justify-between p-5 bg-[#090713] border-r border-[#2d2255]/60 z-40 select-none">
      <div>
        {/* Logo Black Sheeps ENTERPRISE HUB */}
        <div className="flex items-center gap-3 px-2 py-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e94560] to-[#a855f7] p-0.5 shadow-[0_0_15px_rgba(233,69,96,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#120e24] rounded-[10px] flex items-center justify-center text-lg">
              🐑
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wide leading-tight">
              Black Sheeps
            </h1>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              Enterprise Hub
            </span>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/40 to-purple-950/20 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-purple-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.isAdminBadge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    ADMIN
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer con status Discord Sync idéntico a capturas */}
      <div className="p-4 rounded-xl bg-[#120e24] border border-[#2d2255]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            Discord Sync
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Bot conectado en tiempo real escuchando cierres de ventas.
        </p>
      </div>
    </aside>
  );
}
