// ============================================================
// bot.js — Bot de Discord Oficial (Leaderboard Black Sheeps)
// ============================================================
require('dotenv').config({ path: '../.env' });
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// ---- Supabase Client ----
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// ---- Discord Client ----
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

function formatMoney(amount) {
  const rounded = Math.round(amount);
  return '$' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' USD';
}

// ---- Ready ----
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`📊 Escuchando comandos /venta en ${client.guilds.cache.size} servidores`);
});

// ---- Interaction Handler ----
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'venta') return;

  const monto = interaction.options.getNumber('monto');
  const discordId = interaction.user.id;

  try {
    // 1. Buscar usuario en Supabase con su personaje
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*, characters(*)')
      .eq('discord_id', discordId)
      .single();

    if (userError || !user) {
      await interaction.reply({
        content: `❌ No encontré tu perfil en el sistema. Tu Discord ID (${discordId}) no está registrado.\nContacta al administrador para que te agregue al leaderboard.`,
        ephemeral: true,
      });
      return;
    }

    // 2. Insertar venta en la tabla sales
    const { error: saleError } = await supabase
      .from('sales')
      .insert({ user_id: user.id, amount: monto });

    if (saleError) {
      throw new Error('Error insertando venta: ' + saleError.message);
    }

    // 3. Actualizar totales del usuario
    const newTotal = Number(user.total_sales) + monto;
    const newCount = (user.sales_count || 0) + 1;

    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_sales: newTotal,
        sales_count: newCount,
      })
      .eq('id', user.id);

    if (updateError) {
      throw new Error('Error actualizando usuario: ' + updateError.message);
    }

    // 4. Responder efímeramente al vendedor
    await interaction.reply({
      content: `✅ ¡Cierre de **${formatMoney(monto)}** registrado exitosamente!\nTu nuevo volumen acumulado: **${formatMoney(newTotal)}** (${newCount} cierres).`,
      ephemeral: true,
    });

    // 5. Enviar embed público celebrando el cierre con su oveja y grito de batalla
    const charName = user.custom_character_name || user.characters?.name || 'Black Sheep Warrior';
    const battleCry = user.battle_cry ? `«${user.battle_cry}»` : '¡La manada de Black Sheeps sigue conquistando metas!';

    const embed = new EmbedBuilder()
      .setColor(0xa855f7) // Púrpura neón
      .setTitle('🔥 ¡NUEVO CIERRE DE VENTA — BLACK SHEEPS!')
      .setDescription(`**${user.name}** (\`⚔️ ${charName}\`) acaba de cerrar un contrato de **${formatMoney(monto)}**!\n\n*${battleCry}*`)
      .addFields(
        { name: '💰 Monto del Cierre', value: formatMoney(monto), inline: true },
        { name: '📊 Volumen Acumulado', value: formatMoney(newTotal), inline: true },
        { name: '🎯 Cierres Totales', value: `${newCount} ventas`, inline: true }
      )
      .setFooter({ text: 'DTodoSales ENTERPRISE HUB · Leaderboard en Vivo' })
      .setTimestamp();

    if (user.characters?.avatar_url) {
      embed.setThumbnail(user.characters.avatar_url);
    }

    await interaction.channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('Error procesando venta:', err);
    await interaction.reply({
      content: '⚠️ Ocurrió un error al registrar la venta. Intenta nuevamente.',
      ephemeral: true,
    });
  }
});

// ---- Iniciar Sesión ----
if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN);
} else {
  console.warn('⚠️ DISCORD_TOKEN no configurado en .env. El bot no iniciará hasta configurar las credenciales.');
}
