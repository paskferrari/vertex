# Vertex Backend - Deployment su Vercel

## 🚀 Deploy del Backend su Vercel

### Prerequisiti
- Account Vercel
- Repository GitHub connesso
- Credenziali Supabase

### Passi per il Deployment

1. **Vai su [vercel.com](https://vercel.com)** e accedi

2. **Nuovo Progetto:**
   - Clicca "New Project"
   - Seleziona il repository `vertex`
   - **IMPORTANTE:** Cambia la "Root Directory" a `backend`

3. **Configurazione:**
   - **Project Name:** `vertex-backend-[tuo-nome]`
   - **Framework Preset:** Other
   - **Root Directory:** `backend`

4. **Variabili d'Ambiente:**
   Aggiungi queste variabili nella sezione Environment Variables:
   ```
   NODE_ENV=production
   SUPABASE_URL=https://rxbqovatkcezvuzntdeg.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YnFvdmF0a2NlenZ1em50ZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTUyNDUsImV4cCI6MjA2NzEzMTI0NX0.yfqeMPp7FNcaZZ74WauAw2sgvs7y3of9Vr-nC8mV52A
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3001
   ```

5. **Deploy:** Clicca "Deploy"

### Dopo il Deployment

1. **Testa l'API:**
   ```bash
   curl https://vertex-backend-[tuo-nome].vercel.app/api/health
   ```

2. **Aggiorna Frontend:**
   - Modifica `.env.production` con il nuovo URL
   - Redeploy su Vercel

### Vantaggi Vercel + Supabase

✅ **Stesso Provider:** Frontend e backend su Vercel  
✅ **Database Gestito:** Supabase per i dati  
✅ **Deploy Automatico:** Git push → deploy automatico  
✅ **Scalabilità:** Serverless functions  
✅ **SSL Gratuito:** HTTPS automatico  
✅ **CDN Globale:** Performance ottimali  

### Struttura Files

```
backend/
├── server.js          # Entry point
├── package.json       # Dipendenze
├── vercel.json        # Configurazione Vercel
├── .env               # Variabili locali
└── README-VERCEL.md   # Questa guida
```

### Troubleshooting

**Errore 404:** Verifica che Root Directory sia `backend`  
**Errore 500:** Controlla le variabili d'ambiente  
**CORS:** Già configurato per domini Vercel  

### URL Finali

- **Backend:** `https://vertex-backend-[tuo-nome].vercel.app`
- **Frontend:** `https://vertex-gamma-puce.vercel.app`
- **Database:** Supabase (già configurato)