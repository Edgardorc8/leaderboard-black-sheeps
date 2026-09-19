// ============================================================
// CharacterModal.jsx — Selección de Personajes con Exclusividad
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function CharacterModal({
  isOpen,
  onClose,
  characters,
  currentUser,
  leaderboard,
  onCharacterAssigned,
}) {
  if (!isOpen) return null;

  const handleSelect = async (character) => {
    if (isSupabaseConfigured && supabase) {
      // ---- Modo Supabase: llamar RPC ----
      const { error } = await supabase.rpc('assign_character', {
        p_user_id: currentUser.id,
        p_character_id: character.id,
      });
      if (error) {
        alert('Error al asignar personaje: ' + error.message);
        return;
      }
    }
    // Callback para actualizar estado local (funciona en modo mock también)
    onCharacterAssigned(currentUser.id, character.id);
    onClose();
  };

  const getCharacterStatus = (character) => {
    // ¿Es el personaje actual del usuario?
    if (currentUser.character_id === character.id) return 'current';
    // ¿Está ocupado por otro?
    if (character.is_assigned && character.assigned_to_user_id !== currentUser.id) return 'occupied';
    // Disponible
    return 'available';
  };

  const getOccupiedByName = (character) => {
    const owner = leaderboard.find((u) => u.id === character.assigned_to_user_id);
    return owner?.name || 'Otro asesor';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl w-full max-w-3xl mx-4 overflow-hidden"
          >
            {/* ---- Header ---- */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-dtodo-purple" />
                  Selecciona tu Personaje Oficial
                </h2>
                <p className="text-sm text-white/40 mt-1">
                  Asignando avatar para: <span className="text-white font-medium">{currentUser.name}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            {/* ---- Grid de Personajes ---- */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
              {characters.map((character) => {
                const status = getCharacterStatus(character);

                return (
                  <motion.div
                    key={character.id}
                    whileHover={status === 'available' ? { scale: 1.03 } : {}}
                    className={`
                      relative rounded-xl p-3 border transition-all duration-200
                      ${status === 'current'
                        ? 'border-dtodo-purple bg-dtodo-purple/10 shadow-neon-purple ring-1 ring-dtodo-purple/50'
                        : status === 'occupied'
                        ? 'border-white/5 bg-white/[0.02] opacity-50 pointer-events-none'
                        : 'border-white/10 bg-white/[0.03] hover:border-dtodo-purple/30 hover:bg-dtodo-purple/5 cursor-pointer'
                      }
                    `}
                  >
                    {/* Badge de Estado */}
                    {status === 'current' && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-dtodo-purple/20 border border-dtodo-purple/40 text-dtodo-purple text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
                        <CheckCircle className="w-3 h-3" />
                        Actual
                      </div>
                    )}
                    {status === 'occupied' && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/50 text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
                        <Lock className="w-3 h-3" />
                        Ocupado
                      </div>
                    )}

                    {/* Imagen del Personaje */}
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black/20 mb-3 mt-2 flex items-center justify-center">
                      <img
                        src={character.fullbody_url}
                        alt={character.name}
                        className="max-h-full w-auto object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Nombre */}
                    <p className="text-xs font-bold text-center text-white/80 leading-tight">
                      {character.name}
                    </p>

                    {/* Info Ocupado */}
                    {status === 'occupied' && (
                      <p className="text-[10px] text-white/30 text-center mt-1">
                        {getOccupiedByName(character)}
                      </p>
                    )}

                    {/* Info Owner Actual */}
                    {status === 'current' && (
                      <p className="text-[10px] text-dtodo-purple text-center mt-1">
                        {currentUser.name}
                      </p>
                    )}

                    {/* Botón Seleccionar */}
                    {status === 'available' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelect(character)}
                        className="w-full mt-2 py-1.5 text-[11px] font-semibold rounded-lg
                                   bg-dtodo-purple/20 border border-dtodo-purple/30 text-dtodo-purple
                                   hover:bg-dtodo-purple/30 transition-all duration-200"
                      >
                        Seleccionar
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ---- Footer: Regla de Exclusividad ---- */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Lock className="w-3.5 h-3.5 text-neon-gold flex-shrink-0" />
                <span>
                  <span className="font-semibold text-white/50">Regla de exclusividad activa:</span>{' '}
                  Cada personaje solo puede pertenecer a un asesor del equipo.
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
