// ============================================================
// App.jsx — DTodoSales Enterprise Hub (Leaderboard Black Sheeps)
// ============================================================
import { useState, useMemo } from 'react';
import { MOCK_CHARACTERS, MOCK_USERS, MOCK_CURRENT_USER } from './lib/mockData';
import { formatCurrency } from './lib/tiers';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import TimeFilter from './components/TimeFilter';
import TierFilter from './components/TierFilter';
import Podium from './components/Podium';
import LeaderboardTable from './components/LeaderboardTable';
import CharacterModal from './components/CharacterModal';
import AdminUsersModal from './components/AdminUsersModal';
import UserStatsModal from './components/UserStatsModal';
import LoginRegisterModal from './components/LoginRegisterModal';
import DiscordSimulator from './components/DiscordSimulator';
import ReportsView from './components/ReportsView';

export default function App() {
  // ---- Estado Principal ----
  const [activeView, setActiveView] = useState('leaderboard');
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [users, setUsers] = useState(MOCK_USERS);
  const [characters, setCharacters] = useState(MOCK_CHARACTERS);
  const [currentUser, setCurrentUser] = useState(MOCK_CURRENT_USER);

  // ---- Modales ----
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [characterModalTarget, setCharacterModalTarget] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [statsSelectedUser, setStatsSelectedUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ---- Combinar usuarios con datos de sus personajes ----
  const usersWithCharacters = useMemo(() => {
    return users.map((u) => {
      const char = characters.find((c) => c.id === u.character_id);
      return {
        ...u,
        character_name: char?.name,
        character_avatar_url: char?.avatar_url,
        character_card_url: char?.card_url,
        character_fullbody_url: char?.fullbody_url,
      };
    });
  }, [users, characters]);

  // ---- Ordenar usuarios según periodo seleccionado ----
  const sortedUsers = useMemo(() => {
    const list = [...usersWithCharacters];
    list.sort((a, b) => {
      const salesA =
        timePeriod === 'daily'
          ? a.daily_sales || 0
          : timePeriod === 'weekly'
          ? a.weekly_sales || 0
          : a.total_sales || 0;

      const salesB =
        timePeriod === 'daily'
          ? b.daily_sales || 0
          : timePeriod === 'weekly'
          ? b.weekly_sales || 0
          : b.total_sales || 0;

      return salesB - salesA;
    });

    return list.map((u, i) => ({ ...u, rank: i + 1 }));
  }, [usersWithCharacters, timePeriod]);

  // ---- Top 3 para el Podio ----
  const top3 = useMemo(() => sortedUsers.slice(0, 3), [sortedUsers]);

  // ---- Filtrar usuarios para la Tabla (Tier + Búsqueda) ----
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((u) => {
      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesTag = u.discord_tag.toLowerCase().includes(query);
        if (!matchesName && !matchesTag) return false;
      }

      // Filtro de Tier Dinámico por Posición Relativa
      // Top 3 -> Tier S | 4-5 -> Tier A | 6-8 -> Tier B | 9-10 -> Tier C
      if (tierFilter !== 'ALL') {
        const userRank = u.rank;
        if (tierFilter === 'S' && userRank > 3) return false;
        if (tierFilter === 'A' && (userRank < 4 || userRank > 5)) return false;
        if (tierFilter === 'B' && (userRank < 6 || userRank > 8)) return false;
        if (tierFilter === 'C' && userRank < 9) return false;
      }

      return true;
    });
  }, [sortedUsers, searchQuery, tierFilter]);

  // ---- Métricas Grupales del Equipo ----
  const teamMetrics = useMemo(() => {
    const totalVolume = sortedUsers.reduce((acc, u) => {
      const s =
        timePeriod === 'daily'
          ? u.daily_sales || 0
          : timePeriod === 'weekly'
          ? u.weekly_sales || 0
          : u.total_sales || 0;
      return acc + s;
    }, 0);

    const totalClosings = sortedUsers.reduce((acc, u) => acc + (u.sales_count || 0), 0);
    const target = 500000;
    const progress = Math.min(100, Math.round((totalVolume / target) * 100));

    return {
      totalVolume,
      totalClosings,
      target,
      progress,
    };
  }, [sortedUsers, timePeriod]);

  // ---- Handlers de Lógica ----
  const handleSimulateSale = (userId, amount) => {
    const timeStr = 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            total_sales: (u.total_sales || 0) + amount,
            daily_sales: (u.daily_sales || 0) + amount,
            weekly_sales: (u.weekly_sales || 0) + amount,
            monthly_sales: (u.monthly_sales || 0) + amount,
            sales_count: (u.sales_count || 0) + 1,
            recent_sales: [{ amount, time: timeStr }, ...(u.recent_sales || [])],
          };
        }
        return u;
      })
    );
  };

  const handleAssignCharacter = (userId, characterId, customData = {}) => {
    // 1. Actualizar asignaciones en characters (regla de exclusividad)
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.assigned_to_user_id === userId && c.id !== characterId) {
          return { ...c, is_assigned: false, assigned_to_user_id: null };
        }
        if (c.id === characterId) {
          return { ...c, is_assigned: true, assigned_to_user_id: userId };
        }
        return c;
      })
    );

    // 2. Actualizar el usuario
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            character_id: characterId,
            ...(customData.custom_character_name && {
              custom_character_name: customData.custom_character_name,
            }),
            ...(customData.battle_cry && {
              battle_cry: customData.battle_cry,
            }),
          };
        }
        return u;
      })
    );

    // Si es el usuario activo, actualizar estado
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({
        ...prev,
        character_id: characterId,
        ...(customData.custom_character_name && {
          custom_character_name: customData.custom_character_name,
        }),
      }));
    }
  };

  const handleAddUserDirect = (userData) => {
    const newId = 'user-' + Date.now();
    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email,
      discord_tag: userData.discord_tag,
      discord_id: '1000' + Math.floor(Math.random() * 900000000000),
      country: userData.country,
      role: userData.role,
      is_verified: true, // Bypass de verificación
      character_id: userData.character_id || null,
      total_sales: userData.initial_sales || 0,
      daily_sales: 0,
      weekly_sales: 0,
      monthly_sales: userData.initial_sales || 0,
      sales_count: userData.initial_sales > 0 ? 1 : 0,
      recent_sales: [],
    };

    setUsers((prev) => [...prev, newUser]);

    if (userData.character_id) {
      handleAssignCharacter(newId, userData.character_id);
    }
  };

  const handleToggleAdmin = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === 'admin' ? 'sales_agent' : 'admin';
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const handleLoginSuccess = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    // Si no tiene personaje, abrir automáticamente el modal de onboarding
    setCharacterModalTarget(newUser);
    setIsCharacterModalOpen(true);
  };

  const handleOpenStats = (user) => {
    setStatsSelectedUser(user);
    setIsStatsModalOpen(true);
  };

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  return (
    <div className="flex min-h-screen bg-[#090713] text-white selection:bg-purple-600 selection:text-white font-sans">
      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeView}
        onNavigate={(view) => setActiveView(view)}
      />

      {/* Sidebar fijo a la izquierda */}
      <Sidebar
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenCharacterModal={() => {
          setCharacterModalTarget(currentUser);
          setIsCharacterModalOpen(true);
        }}
        onOpenAdminUsers={() => setIsAdminModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header superior */}
        <Header
          currentUser={currentUser}
          users={usersWithCharacters}
          onSwitchUser={(user) => setCurrentUser(user)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenStats={handleOpenStats}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6 md:space-y-8">
          {/* Barra Hero: Métricas Grupales del Equipo + Selector Temporal */}
          <section className="p-6 rounded-2xl bg-gradient-to-r from-[#141026] via-[#120e24] to-[#18132f] border border-[#2d2255] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600/30 border border-purple-400/40 text-purple-300 uppercase tracking-wider">
                  Métricas Globales del Equipo
                </span>
                <span className="text-xs text-slate-400">
                  {teamMetrics.totalClosings} cierres acumulados
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  {formatCurrency(teamMetrics.totalVolume)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / Meta: {formatCurrency(teamMetrics.target)} ({teamMetrics.progress}%)
                </span>
              </div>

              {/* Barra de progreso con resplandor neón */}
              <div className="w-full md:w-96 h-2 bg-black/60 rounded-full overflow-hidden border border-[#2d2255]">
                <div
                  className="h-full bg-gradient-to-r from-[#22c55e] via-[#a855f7] to-[#e94560] shadow-[0_0_12px_rgba(168,85,247,0.5)] transition-all duration-500 rounded-full"
                  style={{ width: `${teamMetrics.progress}%` }}
                />
              </div>
            </div>

            {/* Selector Temporal: Diario, Semanal, Mensual */}
            <TimeFilter activePeriod={timePeriod} onPeriodChange={setTimePeriod} />
          </section>

          {/* Vistas Condicionales */}
          {activeView === 'leaderboard' && (
            <>
              {/* Podio Top 3 */}
              <Podium top3={top3} onSelectUser={handleOpenStats} />

              {/* Barra de Filtros Tier y Tabla */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <TierFilter activeTier={tierFilter} onTierChange={setTierFilter} />
                </div>

                <LeaderboardTable
                  users={filteredUsers}
                  onOpenCharacterModal={(u) => {
                    setCharacterModalTarget(u);
                    setIsCharacterModalOpen(true);
                  }}
                  onSelectUser={handleOpenStats}
                />
              </div>
            </>
          )}

          {activeView === 'reports' && (
            <ReportsView
              users={sortedUsers}
              timePeriod={timePeriod}
              onPeriodChange={setTimePeriod}
            />
          )}

          {activeView === 'simulator' && (
            <DiscordSimulator
              users={usersWithCharacters}
              onSimulateSale={handleSimulateSale}
            />
          )}
        </main>
      </div>

      {/* Modales Globales */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        characters={characters}
        currentUser={currentUser}
        targetUser={characterModalTarget}
        onAssignCharacter={handleAssignCharacter}
      />

      <AdminUsersModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        users={users}
        characters={characters}
        onAddUser={handleAddUserDirect}
        onToggleAdmin={handleToggleAdmin}
        currentUser={currentUser}
      />

      <UserStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        user={statsSelectedUser}
        character={characters.find((c) => c.id === statsSelectedUser?.character_id)}
      />

      <LoginRegisterModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
