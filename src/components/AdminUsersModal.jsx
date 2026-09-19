// ============================================================
// AdminUsersModal.jsx — Panel de Control y Gestión de Usuarios
// (Solo accesible para Administradores / Super Admin: edgardorc8@gmail.com)
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield, UserCheck, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '../lib/tiers';

export default function AdminUsersModal({
  isOpen,
  onClose,
  users,
  characters,
  onAddUser,
  onToggleAdmin,
  currentUser,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discord_tag: '',
    country: '🇻🇪 Venezuela',
    role: 'sales_agent',
    character_id: '',
    initial_sales: 0,
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  // Solo ovejas libres
  const availableCharacters = characters.filter((c) => !c.is_assigned);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = 'El nombre debe tener al menos 3 letras.';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Correo electrónico no válido.';
    }
    if (!formData.discord_tag.trim() || !formData.discord_tag.startsWith('@')) {
      errs.discord_tag = 'El tag de Discord debe empezar con @ (ej: @usuario).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddUser({
      ...formData,
      initial_sales: Number(formData.initial_sales) || 0,
    });

    setFormData({
      name: '',
      email: '',
      discord_tag: '',
      country: '🇻🇪 Venezuela',
      role: 'sales_agent',
      character_id: '',
      initial_sales: 0,
    });
    setShowAddForm(false);
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
          className="relative w-full max-w-4xl bg-[#120e24] border border-[#2d2255] rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#2d2255] bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Panel de Control & Gestión de Usuarios
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300">
                    SUPER ADMIN
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Crea asesores directos sin verificación de correo y promueve administradores en 1 clic.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#e94560] to-[#a855f7] text-white hover:opacity-90 transition-all shadow-[0_0_12px_rgba(233,69,96,0.35)]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {showAddForm ? 'Cancelar' : 'Añadir Usuario Directo'}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Formulario desplegable para alta directa */}
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreate}
              className="p-6 border-b border-[#2d2255] bg-black/40 space-y-4"
            >
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Alta Inmediata (Bypass de Verificación Automático)
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej: Mariana Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                  {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="mariana@dtodosales.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                  {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Discord Tag</label>
                  <input
                    type="text"
                    placeholder="@mariana_closer"
                    value={formData.discord_tag}
                    onChange={(e) => setFormData({ ...formData, discord_tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                  {errors.discord_tag && <p className="text-[10px] text-red-400 mt-1">{errors.discord_tag}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">País</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="🇻🇪 Venezuela">🇻🇪 Venezuela</option>
                    <option value="🇲🇽 México">🇲🇽 México</option>
                    <option value="🇦🇷 Argentina">🇦🇷 Argentina</option>
                    <option value="🇨🇱 Chile">🇨🇱 Chile</option>
                    <option value="🇵🇪 Perú">🇵🇪 Perú</option>
                    <option value="🇺🇸 USA">🇺🇸 USA</option>
                    <option value="🇨🇴 Colombia">🇨🇴 Colombia</option>
                    <option value="🇪🇸 España">🇪🇸 España</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Rol Inicial</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="sales_agent">Asesor Comercial</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Asignar Oveja Guerrera</label>
                  <select
                    value={formData.character_id}
                    onChange={(e) => setFormData({ ...formData, character_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141026] border border-[#2d2255] text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="">Dejar que el asesor elija en Onboarding</option>
                    {availableCharacters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Registrar Asesor Directo
                </button>
              </div>
            </motion.form>
          )}

          {/* Lista de usuarios */}
          <div className="p-6 flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2d2255] text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Asesor & Avatar</th>
                  <th className="pb-3 font-semibold">Correo</th>
                  <th className="pb-3 font-semibold">Discord</th>
                  <th className="pb-3 font-semibold">Rol</th>
                  <th className="pb-3 font-semibold">Total Ventas</th>
                  <th className="pb-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2255]/50">
                {users.map((u) => {
                  const char = characters.find((c) => c.id === u.character_id);
                  const isSelf = u.id === currentUser?.id;
                  const isSuper = u.role === 'super_admin';

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/40 bg-black/40 shrink-0">
                          <img
                            src={char?.avatar_url || '/characters/01_sheep_alex/avatar.png'}
                            alt={u.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {u.name}
                            <span className="text-[10px]">{u.country?.split(' ')[0]}</span>
                          </div>
                          <div className="text-[10px] text-purple-300">
                            {u.custom_character_name || char?.name || 'Sin oveja'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-slate-300">{u.email}</td>

                      <td className="py-3 text-purple-300 font-mono text-[11px]">{u.discord_tag}</td>

                      <td className="py-3">
                        {u.role === 'super_admin' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300">
                            SUPER ADMIN
                          </span>
                        ) : u.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 border border-purple-400/40 text-purple-300">
                            ADMIN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-500/10 border border-slate-500/20 text-slate-300">
                            ASESOR
                          </span>
                        )}
                      </td>

                      <td className="py-3 font-semibold text-emerald-400">
                        {formatCurrency(u.total_sales || 0)}
                      </td>

                      <td className="py-3 text-right">
                        {isSuper ? (
                          <span className="text-[10px] text-slate-500 italic">Dueño del Sistema</span>
                        ) : (
                          <button
                            onClick={() => onToggleAdmin(u.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                              u.role === 'admin'
                                ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                                : 'bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/40'
                            }`}
                          >
                            {u.role === 'admin' ? 'Degradar a Asesor' : 'Promover a Admin'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
