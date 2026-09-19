// ============================================================
// Header.jsx — Barra superior con búsqueda y user widget
// ============================================================
import { Search, Bell } from 'lucide-react';

export default function Header({ currentUser, searchQuery, onSearchChange }) {
  return (
    <header className="flex items-center justify-between gap-6 px-8 py-4">
      {/* ---- Search Bar ---- */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Buscar asesor o @tag de Discord..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl glass text-sm text-white/80 placeholder:text-white/30 
                     focus:outline-none focus:ring-1 focus:ring-dtodo-purple/50 focus:border-dtodo-purple/30
                     transition-all duration-200"
        />
      </div>

      {/* ---- Right Section ---- */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-white/40 hover:text-white/60 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-dtodo-pink rounded-full" />
        </button>

        {/* User Widget */}
        <div className="flex items-center gap-3 pl-5 border-l border-white/10">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-dtodo-purple/40 bg-white/10">
            <img
              src={currentUser?.character_avatar_url || currentUser?.user_avatar_url}
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-white/90 leading-tight">{currentUser?.name || 'Usuario'}</p>
            <p className="text-xs text-dtodo-purple">{currentUser?.discord_tag || '@tag'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
