// ============================================================
// deploy-commands.js — Registra el Slash Command /venta en Discord
// ============================================================
require('dotenv').config({ path: '../.env' });
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('venta')
    .setDescription('Registra un cierre de venta en el leaderboard')
    .addNumberOption((option) =>
      option
        .setName('monto')
        .setDescription('Monto de la venta en USD (ej. 5000)')
        .setRequired(true)
        .setMinValue(1)
    )
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🚀 Registrando slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Slash command /venta registrado exitosamente.');
  } catch (error) {
    console.error('❌ Error registrando commands:', error);
  }
})();
