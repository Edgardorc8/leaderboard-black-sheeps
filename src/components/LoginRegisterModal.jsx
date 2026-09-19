// ============================================================
// LoginRegisterModal.jsx — Formulario de Registro, OTP de 6 Dígitos & Discord
// ============================================================
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginRegisterModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('register'); // 'register' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discord_tag: '',
    country: '🇻🇪 Venezuela',
  });
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputsRef = useRef([]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = 'Ingresa tu nombre y apellido (mínimo 3 letras).';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name.trim())) {
      errs.name = 'El nombre no debe contener números ni símbolos.';
    }

    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es requerido.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Formato de correo no válido.';
    }

    if (!formData.discord_tag.trim()) {
      errs.discord_tag = 'Ingresa tu tag de Discord (ej: @usuario).';
    } else if (!formData.discord_tag.startsWith('@')) {
      errs.discord_tag = 'El tag de Discord debe comenzar con @.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep('otp');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus al siguiente input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = otpCode.join('');
    if (entered.length !== 6) {
      setErrors({ otp: 'Ingresa los 6 dígitos del código de verificación.' });
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        id: 'new-user-' + Date.now(),
        name: formData.name,
        email: formData.email,
        discord_tag: formData.discord_tag,
        country: formData.country,
        role: 'sales_agent',
        character_id: null, // Pasa a selección obligatoria de personaje
        total_sales: 0,
        daily_sales: 0,
        weekly_sales: 0,
        monthly_sales: 0,
        sales_count: 0,
      });
      onClose();
    }, 800);
  };

  const handleDiscordOAuth = () => {
    // Simulación de Discord OAuth 1 clic
    onLoginSuccess({
      id: 'discord-user-' + Date.now(),
      name: 'Asesor Discord',
      email: 'discord_asesor@dtodosales.com',
      discord_id: '999888777666555444',
      discord_tag: '@discord_closer',
      country: '🇻🇪 Venezuela',
      role: 'sales_agent',
      character_id: null,
      total_sales: 0,
      sales_count: 0,
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
          className="relative w-full max-w-md bg-[#120e24] border border-[#2d2255] rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#2d2255] bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/20 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#e94560] to-[#a855f7] p-0.5 shadow-[0_0_20px_rgba(233,69,96,0.35)] flex items-center justify-center mb-3">
              <div className="w-full h-full bg-[#120e24] rounded-[14px] flex items-center justify-center text-xl">
                🐑
              </div>
            </div>

            <h2 className="text-lg font-bold text-white">
              {step === 'register' ? 'Acceso al Enterprise Hub' : 'Verifica tu Correo'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {step === 'register'
                ? 'Ingresa tus datos de asesor para entrar al Leaderboard'
                : `Código enviado a ${formData.email}`}
            </p>
          </div>

          <div className="p-6">
            {step === 'register' ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                {/* Botón Discord 1 clic */}
                <button
                  type="button"
                  onClick={handleDiscordOAuth}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(88,101,242,0.3)] mb-4"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
                  </svg>
                  Continuar con Discord (1 Clic)
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-[#2d2255] w-full" />
                  <span className="bg-[#120e24] px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    O con Correo Corporativo
                  </span>
                  <div className="border-t border-[#2d2255] w-full" />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Edgardo Alfonso Rangel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg bg-[#141026] border text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.name ? 'border-red-500/60' : 'border-[#2d2255] focus:border-purple-400'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="edgardo@dtodosales.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg bg-[#141026] border text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.email ? 'border-red-500/60' : 'border-[#2d2255] focus:border-purple-400'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Discord Tag</label>
                    <input
                      type="text"
                      placeholder="@edgardorc8"
                      value={formData.discord_tag}
                      onChange={(e) => setFormData({ ...formData, discord_tag: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg bg-[#141026] border text-xs text-white placeholder-slate-500 focus:outline-none ${
                        errors.discord_tag ? 'border-red-500/60' : 'border-[#2d2255] focus:border-purple-400'
                      }`}
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
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#e94560] to-[#a855f7] hover:opacity-95 transition-all shadow-[0_0_15px_rgba(233,69,96,0.35)] flex items-center justify-center gap-2"
                >
                  Continuar y Recibir Código OTP
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Pantalla de código OTP */
              <div className="space-y-5 text-center">
                <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-purple-200">
                  Ingresa el código de 6 dígitos que enviamos a tu correo corporativo.
                </div>

                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-[#141026] border border-[#2d2255] text-white focus:outline-none focus:border-purple-400 focus:shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all"
                    />
                  ))}
                </div>

                {errors.otp && <p className="text-xs text-red-400">{errors.otp}</p>}

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#22c55e] to-[#10b981] hover:opacity-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.35)] flex items-center justify-center gap-2"
                  >
                    {isVerifying ? 'Verificando...' : 'Confirmar Código y Entrar'}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setStep('register')}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Corregir datos de registro
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
