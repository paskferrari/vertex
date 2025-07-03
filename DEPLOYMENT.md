# Deployment Guide per Vertex

## 🚀 Deploy del Backend su Render

### 1. Preparazione
- Assicurati che il codice sia pushato su GitHub
- Il backend è già configurato con `render.yaml`

### 2. Deploy su Render
1. Vai su [render.com](https://render.com) e crea un account
2. Clicca su "New" → "Web Service"
3. Connetti il tuo repository GitHub
4. Seleziona la cartella `backend` come root directory
5. Configura le seguenti impostazioni:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free

### 3. Variabili d'Ambiente su Render
Aggiungi queste variabili d'ambiente nel dashboard di Render:
```
SUPABASE_URL=https://rxbqovatkcezvuzntdeg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YnFvdmF0a2NlenZ1em50ZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTUyNDUsImV4cCI6MjA2NzEzMTI0NX0.yfqeMPp7FNcaZZ74WauAw2sgvs7y3of9Vr-nC8mV52A
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=10000
NODE_ENV=production
```

### 4. Aggiorna l'URL del Backend
Dopo il deploy, Render ti darà un URL come `https://vertex-backend-xxx.onrender.com`

**Aggiorna il file `.env.production`** con l'URL corretto:
```
VITE_API_BASE_URL=https://il-tuo-url-render.onrender.com/api
```

## 🌐 Deploy del Frontend su Vercel

### 1. Preparazione
- Il file `vercel.json` è già configurato
- Il file `.env.production` deve essere aggiornato con l'URL del backend

### 2. Deploy su Vercel
1. Vai su [vercel.com](https://vercel.com) e crea un account
2. Clicca su "New Project"
3. Importa il repository GitHub
4. Configura le impostazioni:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Variabili d'Ambiente su Vercel
Nel dashboard di Vercel, aggiungi:
```
VITE_API_BASE_URL=https://il-tuo-url-render.onrender.com/api
```

### 4. Deploy
Clicca su "Deploy" e attendi il completamento.

## ✅ Verifica del Deploy

### Backend
1. Visita `https://il-tuo-url-render.onrender.com/api/health`
2. Dovresti vedere: `{"status":"OK","message":"Server is running"}`

### Frontend
1. Visita il tuo URL Vercel
2. Prova il login con:
   - Email: `admin@vertex.com`
   - Password: `admin123`

## 🔧 Troubleshooting

### Problemi Comuni
1. **Login non funziona**: Verifica che `VITE_API_BASE_URL` sia corretto
2. **CORS errors**: Il backend ha già CORS configurato
3. **500 errors**: Controlla i logs su Render

### Logs
- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Project → Functions → View Logs

## 📝 Note Importanti

- Il piano gratuito di Render può andare in "sleep" dopo 15 minuti di inattività
- Il primo caricamento potrebbe essere lento (cold start)
- Supabase è già configurato e funzionante
- Le credenziali di default sono: `admin@vertex.com` / `admin123`