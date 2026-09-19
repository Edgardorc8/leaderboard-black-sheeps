// ============================================================
// Header.jsx — Barra Superior con Búsqueda, Usuario Activo y Selector
// ============================================================
import { useState } from 'react';
import { Search, Bell, ChevronDown, UserCheck, Shield } from 'lucide-react';

export default function Header({
  currentUser,
  users,
  onSwitchUser,
  onOpenLogin,
  searchQuery,
  onSearchChange,
  onOpenStats,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-[#090713]/80 backdrop-blur-xl border-b border-[#2d2255]/50">
      {/* Buscador idéntico a captura */}
      <div className="relative w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar asesor o @tag de Discord..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141026] border border-[#2d2255] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400/80 focus:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all"
        />
      </div>

      {/* Acciones Derecha */}
      <div className="flex items-center gap-4">
        {/* Notificación Bell */}
        <button className="relative p-2 rounded-xl bg-[#141026] border border-[#2d2255] text-slate-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e94560]" />
        </button>

        {/* User Widget con Dropdown para cambiar de asesor */}
        {currentUser ? (
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-[#141026] border border-[#2d2255] hover:border-purple-500/50 cursor-pointer transition-all"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStats(currentUser);
                }}
                className="w-9 h-9 rounded-full overflow-hidden border border-purple-500/50 bg-black/40 shrink-0 hover:scale-105 transition-transform"
                title="Ver mi Ficha de Estadísticas"
              >
                <img
                  src={currentUser.character_avatar_url || '/characters/01_sheep_alex/avatar.png'}
                  alt={currentUser.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  {currentUser.role === 'super_admin' && (
                    <Shield className="w-3 h-3 text-amber-400" title="Super Admin" />
                  )}
                </div>
                <span className="text-[10px] text-purple-300 font-mono block leading-none">
                  {currentUser.discord_tag}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Dropdown de cambio rápido de perfil para pruebas */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#141026] border border-[#2d2255] rounded-xl shadow-2xl p-2 z-50 divide-y divide-[#2d2255]/40">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Simular Asesor Activo (Modo Dev)
                </div>

                <div className="py-1 max-h-60 overflow-y-auto space-y-0.5">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-purple-600/20 text-purple-200 font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.discord_tag}</div>
                      </div>
                      {u.id === currentUser.id && (
                        <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full py-1.5 px-2 rounded-lg text-center text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                  >
                    + Registrar Nuevo Asesor (OTP)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#e94560] to-[#a855f7] shadow-[0_0_12px_rgba(233,69,96,0.35)] hover:opacity-90 transition-all"
          >
            Iniciar Sesión / Registro
          </button>
        )}
      </div>
    </header>
  );
}
