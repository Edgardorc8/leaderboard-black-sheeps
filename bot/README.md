# Guía Rápida para Configurar y Probar el Bot de Discord v14

El bot de Discord permite a los asesores comerciales registrar sus ventas directamente desde el chat usando el comando `/venta monto:5000` y celebra cada cierre con un mensaje público con la foto de su Oveja Guerrera.

---

## 🚀 Paso 1: Crear tu Aplicación en Discord Developer Portal (2 Minutos)

1. Entra a **[Discord Developer Portal](https://discord.com/developers/applications)** e inicia sesión con tu cuenta de Discord.
2. Haz clic en **"New Application"** (arriba a la derecha).
3. Nómbralo: `DTodoSales Hub` o `Black Sheeps Bot`.
4. Ve a la pestaña **"Bot"** (menú izquierdo):
   - Haz clic en **"Add Bot"** (o "Reset Token" para copiar tu Token secreto).
   - En **"Privileged Gateway Intents"**, activa:
     - ✅ **Server Members Intent**
     - ✅ **Message Content Intent**
5. Ve a la pestaña **"OAuth2"** > **"URL Generator"**:
   - En **SCOPES**, marca:
     - ✅ `bot`
     - ✅ `applications.commands`
   - En **BOT PERMISSIONS**, marca:
     - ✅ `Send Messages`
     - ✅ `Embed Links`
     - ✅ `Attach Files`
     - ✅ `Use Slash Commands`
   - Copia la URL generada al final y pégala en tu navegador para **invitar el bot a tu servidor de Discord**.

---

## ⚙️ Paso 2: Configurar el archivo `.env`

En la raíz del proyecto (`dtodosales-enterprise-hub/`), edita tu `.env`:

```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Discord Bot
DISCORD_TOKEN=tu_token_de_bot_aqui
DISCORD_CLIENT_ID=tu_application_client_id_aqui
DISCORD_GUILD_ID=id_de_tu_servidor_de_discord_para_pruebas_inmediatas
```

> **¿Cómo obtener el `DISCORD_GUILD_ID`?**
> En Discord, ve a *Ajustes de Usuario > Avanzado > Modo Desarrollador* (Actívalo). Luego, haz clic derecho sobre el ícono de tu servidor de Discord y pulsa **"Copiar ID de servidor"**.

---

## ⚡ Paso 3: Registrar los Comandos Slash y Levantar el Bot

Abre una terminal en la carpeta `bot`:

```bash
cd bot
npm install
node deploy-commands.js
```

Verás en la terminal:
`✅ Comando slash /venta registrado exitosamente en el servidor!`

Luego, arranca el bot:

```bash
node bot.js
```

Verás:
`✅ Bot conectado como DTodoSales Hub#1234`  
`📊 Escuchando comandos /venta en 1 servidores`

---

## 🎮 Paso 4: Probar el Cierre de Ventas en Discord

1. Ve a cualquier canal de texto en tu servidor de Discord.
2. Escribe:
   ```
   /venta monto:15000
   ```
3. El bot:
   - Te enviará un mensaje privado confirmando el cierre y tu nuevo total.
   - Publicará un **Embed Púrpura Neón** en el canal con la foto de tu Oveja Guerrera, tu apodo de combate y tu grito de victoria.
4. Si tienes el dashboard abierto en `http://localhost:5173/`, ¡verás cómo tu barra de ventas sube inmediatamente en tiempo real!
