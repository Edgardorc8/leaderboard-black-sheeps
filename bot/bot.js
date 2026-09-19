// ============================================================
// bot.js — Bot de Discord para DTodoSales Enterprise Hub
// Escucha /venta e inserta ventas en Supabase
// ============================================================
require('dotenv').config({ path: '../.env' });
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// ---- Supabase Client ----
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// ---- Discord Client ----
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

function formatMoney(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
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
  const discordTag = interaction.user.tag;

  try {
    // 1. Buscar usuario en Supabase por discord_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
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
    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_sales: user.total_sales + monto,
        sales_count: user.sales_count + 1,
      })
      .eq('id', user.id);

    if (updateError) {
      throw new Error('Error actualizando usuario: ' + updateError.message);
    }

    // 4. Responder efímeramente al vendedor
    await interaction.reply({
      content: `✅ Venta de **${formatMoney(monto)} USD** registrada exitosamente.\nTu nuevo total: **${formatMoney(user.total_sales + monto)} USD** (${user.sales_count + 1} cierres)`,
      ephemeral: true,
    });

    // 5. Enviar embed público celebrando el cierre
    const embed = new EmbedBuilder()
      .setColor(0xa855f7) // Purple
      .setTitle('🎉 ¡NUEVO CIERRE DE VENTA!')
      .setDescription(`**${user.name}** acaba de cerrar una venta de **${formatMoney(monto)} USD**`)
      .addFields(
        { name: '💰 Monto', value: `${formatMoney(monto)} USD`, inline: true },
        { name: '📊 Total Acumulado', value: `${formatMoney(user.total_sales + monto)} USD`, inline: true },
        { name: '🔥 Cierres Totales', value: `${user.sales_count + 1}`, inline: true }
      )
      .setThumbnail(user.avatar_url || '')
      .setFooter({ text: 'DTodoSales Enterprise Hub — Leaderboard en Vivo' })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error('Error en /venta:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: `❌ Error al procesar la venta: ${error.message}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `❌ Error al procesar la venta: ${error.message}`,
        ephemeral: true,
      });
    }
  }
});

// ---- Login ----
client.login(process.env.DISCORD_TOKEN);
