# Deployment Guide: Vercel + Railway

## Quick Setup (5 minutes)

### 1. Deploy Python FastAPI to Railway

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `resumeai` repository
4. Railway will auto-detect the Python app
5. Click **"Deploy Now"**
6. Once deployed, click **"Settings"** → **"Networking"** → **"Generate Domain"**
7. Copy the Railway URL (e.g., `https://your-app.railway.app`)

### 2. Deploy Next.js to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"** → Select your `resumeai` repository
3. Vercel will auto-detect Next.js
4. **Add Environment Variables:**
   - `OPENAI_API_KEY` = your OpenAI API key
   - `PDF_PARSER_URL` = your Railway URL from step 1
5. Click **"Deploy"**

### 3. Done! 🎉

Your app is now live at:
- **Next.js:** `https://your-app.vercel.app`
- **Python API:** `https://your-app.railway.app`

---

## Environment Variables

### Vercel (Next.js)
```
OPENAI_API_KEY=sk-your-key-here
PDF_PARSER_URL=https://your-railway-app.railway.app
```

### Railway (Python)
No environment variables needed for basic setup.

---

## Cost

- **Vercel:** Free tier (sufficient for most use cases)
- **Railway:** $5/month (includes 500 hours of runtime)

---

## Troubleshooting

### Railway not starting?
- Check logs in Railway dashboard
- Ensure `requirements.txt` is in `pdf-parser/` directory
- Verify Python version in `runtime.txt`

### Vercel build failing?
- Check build logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### CORS errors?
- Update `allow_origins` in `pdf-parser/main.py` to include your Vercel domain:
  ```python
  allow_origins=["https://your-app.vercel.app"]
  ```

---

## Optional: Custom Domain

### Vercel
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Railway
1. Go to Settings → Networking → Custom Domain
2. Add your domain and update DNS

---

## Commands

### Local Development
```bash
# Terminal 1: Python API
cd pdf-parser && uvicorn main:app --reload --port 8000

# Terminal 2: Next.js
npm run dev
```

### Deploy Updates
```bash
git add .
git commit -m "your message"
git push
```
Both Vercel and Railway will auto-deploy on push to `main` branch.
