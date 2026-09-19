// ============================================================
// CharacterModal.jsx — Selección de Personaje Oficial con Exclusividad
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';

export default function CharacterModal({
  isOpen,
  onClose,
  characters,
  currentUser,
  targetUser,
  onAssignCharacter,
}) {
  const [battleName, setBattleName] = useState('');
  const [battleCry, setBattleCry] = useState('');
  const [selectedCharId, setSelectedCharId] = useState(null);

  if (!isOpen) return null;

  const activeUser = targetUser || currentUser;

  const handleSelect = (character) => {
    if (character.is_assigned && character.assigned_to_user_id !== activeUser?.id) {
      return;
    }
    setSelectedCharId(character.id);
  };

  const handleConfirmAssignment = () => {
    if (!selectedCharId) return;
    onAssignCharacter(activeUser?.id, selectedCharId, {
      custom_character_name: battleName.trim() || undefined,
      battle_cry: battleCry.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#120e24] border border-[#2d2255] rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#2d2255] bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/20 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">
                  Selecciona tu Personaje Oficial
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Asignando avatar para:{' '}
                <span className="text-white font-bold">{activeUser?.name}</span>{' '}
                <span className="text-purple-300 font-mono">({activeUser?.discord_tag})</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid de 10 Personajes */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {characters.map((char) => {
                const isCurrent = char.id === activeUser?.character_id;
                const isOccupiedByOther =
                  char.is_assigned && char.assigned_to_user_id !== activeUser?.id;
                const isSelected = selectedCharId === char.id;

                return (
                  <motion.div
                    key={char.id}
                    whileHover={!isOccupiedByOther ? { scale: 1.02, y: -2 } : {}}
                    onClick={() => !isOccupiedByOther && handleSelect(char)}
                    className={`relative p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                      isCurrent || isSelected
                        ? 'bg-gradient-to-b from-purple-900/40 to-purple-950/20 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                        : isOccupiedByOther
                        ? 'bg-black/40 border-[#2d2255]/40 opacity-50 cursor-not-allowed'
                        : 'bg-[#141026] border-[#2d2255] hover:border-purple-500/60'
                    }`}
                  >
                    {/* Badge de estado */}
                    <div className="flex items-center justify-end mb-2">
                      {isCurrent ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-sm">
                          <CheckCircle className="w-3 h-3" /> Actual
                        </span>
                      ) : isSelected ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                          <CheckCircle className="w-3 h-3" /> Elegido
                        </span>
                      ) : isOccupiedByOther ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/40 text-red-300 border border-red-500/20">
                          <Lock className="w-3 h-3" /> Ocupado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
                          Disponible
                        </span>
                      )}
                    </div>

                    {/* Imagen del Busto (card_url) */}
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center p-2 mb-2">
                      <img
                        src={char.card_url || char.avatar_url}
                        alt={char.name}
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>

                    {/* Nombre y datos */}
                    <div className="text-center">
                      <h4 className="text-xs font-bold text-white truncate">
                        {char.name}
                      </h4>
                      <p className="text-[10px] text-purple-300 truncate">
                        {char.archetype || 'Oveja Guerrera'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Inputs de personalización si seleccionó uno */}
            {selectedCharId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-black/40 border border-[#2d2255] space-y-3"
              >
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bautiza tu Personaje y Grito de Cierre (Opcional)
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Nombre de Batalla de tu Oveja
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: El Titán Rangel"
                      value={battleName}
                      onChange={(e) => setBattleName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Grito de Cierre (Frase para Discord)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: ¡Trato cerrado, la manada no perdona!"
                      value={battleCry}
                      onChange={(e) => setBattleCry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 px-6 border-t border-[#2d2255] bg-black/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Regla de exclusividad activa: Cada personaje solo puede pertenecer a un asesor del equipo.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmAssignment}
                disabled={!selectedCharId}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#e94560] to-[#a855f7] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(233,69,96,0.35)] transition-all"
              >
                Confirmar y Asignar Personaje
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
