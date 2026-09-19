// ============================================================
// DiscordSimulator.jsx — Simulador de ventas en vivo
// ============================================================
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

function formatMoney(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' USD';
}

export default function DiscordSimulator({ leaderboard, onSaleSimulated }) {
  const handleSimulateSale = async (user, amount) => {
    if (isSupabaseConfigured && supabase) {
      // ---- Modo Supabase ----
      // 1. Insertar venta
      const { error: saleError } = await supabase
        .from('sales')
        .insert({ user_id: user.id, amount });
      if (saleError) {
        alert('Error insertando venta: ' + saleError.message);
        return;
      }
      // 2. Actualizar totales del usuario
      const { error: updateError } = await supabase
        .from('users')
        .update({
          total_sales: user.total_sales + amount,
          sales_count: user.sales_count + 1,
        })
        .eq('id', user.id);
      if (updateError) {
        alert('Error actualizando usuario: ' + updateError.message);
        return;
      }
    }
    // Callback para actualizar estado local
    onSaleSimulated(user.id, amount);
  };

  // Mostrar los primeros 6 asesores
  const simulatorUsers = leaderboard.slice(0, 6);

  return (
    <section className="mt-8">
      {/* ---- Header ---- */}
      <div className="mb-5">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-neon-gold" />
          Simulador en Vivo de Ventas de Discord
        </h2>
        <p className="text-xs text-white/40 mt-1">
          Presiona los botones para inyectar ventas reales y mira cómo rotan los puestos y cambian los trofeos al instante.
        </p>
      </div>

      {/* ---- Grid de Asesores ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {simulatorUsers.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-white/90">{user.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{formatMoney(user.total_sales)}</p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-dtodo-purple/30 bg-white/10">
                <img
                  src={user.character_avatar_url || user.user_avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSimulateSale(user, 5000)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-neon-green/20 border border-neon-green/30
                           text-neon-green hover:bg-neon-green/30 transition-all duration-200"
              >
                +$5K
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSimulateSale(user, 25000)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-dtodo-purple/20 border border-dtodo-purple/30
                           text-dtodo-purple hover:bg-dtodo-purple/30 transition-all duration-200"
              >
                +$25K
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
