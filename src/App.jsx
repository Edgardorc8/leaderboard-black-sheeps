// ============================================================
// App.jsx — Layout Principal + State Management + Realtime
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { MOCK_LEADERBOARD, MOCK_CHARACTERS, MOCK_CURRENT_USER } from './lib/mockData';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Podium from './components/Podium';
import LeaderboardTable from './components/LeaderboardTable';
import CharacterModal from './components/CharacterModal';
import DiscordSimulator from './components/DiscordSimulator';

export default function App() {
  // ---- Estado ----
  const [activeView, setActiveView] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [modalTargetUser, setModalTargetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---- Cargar datos ----
  const fetchData = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      // ---- Modo Supabase ----
      const [leaderRes, charsRes] = await Promise.all([
        supabase.from('leaderboard_view').select('*'),
        supabase.from('characters').select('*'),
      ]);
      if (leaderRes.data) {
        setLeaderboard(leaderRes.data);
        // El usuario logueado es el primero (demo)
        setCurrentUser(leaderRes.data[0] || null);
      }
      if (charsRes.data) setCharacters(charsRes.data);
    } else {
      // ---- Modo Mock (sin Supabase) ----
      setLeaderboard([...MOCK_LEADERBOARD]);
      setCharacters([...MOCK_CHARACTERS]);
      setCurrentUser({ ...MOCK_CURRENT_USER });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---- Suscripción Realtime (Supabase) ----
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sales' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  // ---- Handlers para modo Mock ----
  const handleSaleSimulated = (userId, amount) => {
    setLeaderboard((prev) => {
      const updated = prev.map((u) =>
        u.id === userId
          ? { ...u, total_sales: u.total_sales + amount, sales_count: u.sales_count + 1 }
          : u
      );
      // Re-sort y re-rank
      updated.sort((a, b) => b.total_sales - a.total_sales);
      return updated.map((u, i) => ({ ...u, rank: i + 1 }));
    });
  };

  const handleCharacterAssigned = (userId, characterId) => {
    setCharacters((prev) => {
      return prev.map((c) => {
        // Liberar personaje anterior del usuario
        if (c.assigned_to_user_id === userId && c.id !== characterId) {
          return { ...c, is_assigned: false, assigned_to_user_id: null };
        }
        // Asignar nuevo
        if (c.id === characterId) {
          return { ...c, is_assigned: true, assigned_to_user_id: userId };
        }
        return c;
      });
    });
    setLeaderboard((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const char = characters.find((c) => c.id === characterId);
          return {
            ...u,
            character_id: characterId,
            character_name: char?.name,
            character_fullbody_url: char?.fullbody_url,
            character_avatar_url: char?.avatar_url,
          };
        }
        return u;
      })
    );
    // Actualizar currentUser si es el mismo
    if (currentUser?.id === userId) {
      const char = characters.find((c) => c.id === characterId);
      setCurrentUser((prev) => ({
        ...prev,
        character_id: characterId,
        character_name: char?.name,
        character_fullbody_url: char?.fullbody_url,
        character_avatar_url: char?.avatar_url,
      }));
    }
  };

  const openCharacterModal = (user) => {
    setModalTargetUser(user || currentUser);
    setIsCharacterModalOpen(true);
  };

  // ---- Filtro de búsqueda ----
  const filteredLeaderboard = searchQuery
    ? leaderboard.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.discord_tag && u.discord_tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : leaderboard;

  // ---- Loading ----
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-dtodo-purple/30 border-t-dtodo-purple rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Cargando DTodoSales Enterprise Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ---- Sidebar ---- */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* ---- Main Content ---- */}
      <main className="flex-1 ml-[240px] min-h-screen">
        {/* Header */}
        <Header
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Area */}
        <div className="px-8 pb-8">
          {/* ---- Vista: Leaderboard ---- */}
          {activeView === 'leaderboard' && (
            <>
              <Podium data={filteredLeaderboard} />
              <LeaderboardTable
                data={filteredLeaderboard}
                onOpenCharacterModal={openCharacterModal}
              />
            </>
          )}

          {/* ---- Vista: Elegir Personaje ---- */}
          {activeView === 'characters' && (
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">🎭</span>
                Galería de Personajes
              </h2>
              <p className="text-sm text-white/40 mb-6">
                Selecciona tu avatar haciendo clic en cualquier personaje disponible.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {characters.map((char) => {
                  const isCurrent = currentUser?.character_id === char.id;
                  const isOccupied = char.is_assigned && char.assigned_to_user_id !== currentUser?.id;
                  const owner = leaderboard.find((u) => u.id === char.assigned_to_user_id);

                  return (
                    <div
                      key={char.id}
                      onClick={() => !isOccupied && openCharacterModal(currentUser)}
                      className={`
                        glass rounded-xl p-4 text-center cursor-pointer transition-all duration-200
                        ${isCurrent ? 'border-dtodo-purple shadow-neon-purple' : ''}
                        ${isOccupied ? 'opacity-50 pointer-events-none' : 'hover:border-dtodo-purple/30'}
                      `}
                    >
                      <div className="aspect-[3/5] rounded-lg overflow-hidden bg-black/20 mb-3 flex items-center justify-center">
                        <img src={char.fullbody_url} alt={char.name} className="max-h-full object-contain" />
                      </div>
                      <p className="text-xs font-bold text-white/80">{char.name}</p>
                      {isCurrent && <p className="text-[10px] text-dtodo-purple mt-1">Tu personaje</p>}
                      {isOccupied && owner && <p className="text-[10px] text-white/30 mt-1">{owner.name}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ---- Vista: Simulador Discord ---- */}
          {activeView === 'simulator' && (
            <DiscordSimulator
              leaderboard={leaderboard}
              onSaleSimulated={handleSaleSimulated}
            />
          )}
        </div>

        {/* ---- Indicador modo Mock ---- */}
        {!isSupabaseConfigured && (
          <div className="fixed bottom-4 right-4 px-4 py-2 glass rounded-xl text-xs text-neon-gold/70 flex items-center gap-2 z-50">
            <span className="w-2 h-2 rounded-full bg-neon-gold animate-pulse" />
            Modo Demo — Conecta Supabase para datos reales
          </div>
        )}
      </main>

      {/* ---- Character Modal ---- */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        characters={characters}
        currentUser={modalTargetUser || currentUser}
        leaderboard={leaderboard}
        onCharacterAssigned={handleCharacterAssigned}
      />
    </div>
  );
}
