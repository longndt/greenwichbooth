# greenwichbooth

Interactive photo booth for prospective high-school students at Greenwich.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Features

- ✅ 3 curated poster themes with a live selector
- ✅ 2×2 capture grid during shooting, then a hero-style final poster
- ✅ Greenwich brand system with premium green/gold styling
- ✅ Direct download via data URL (works offline)
- ✅ QR code linking to the uploaded poster URL
- ✅ Countdown overlay + flash effect
- ✅ Responsive mobile UI
- ✅ Browser smoke test for poster/QR rendering

## QR Code & Upload (Production Deployment)

Photos are uploaded to **Vercel Blob Storage**. QR codes on photos link to the hosted image.

### Setup Production Deployment

1. **Get Vercel Blob Token:**
   - Log in to https://vercel.com/account/tokens
   - Create token with **Blob read/write** scope
   - Copy the token value

2. **Add to Project:**
   - Open your Vercel project dashboard → Settings → Environment Variables
   - Add variable: `BLOB_READ_WRITE_TOKEN` = `<your-token>`
   - Set scope to **Production** (or all environments)
   - Save & redeploy

3. **Deploy:**
   ```bash
   git push origin main
   ```

### Local Development

- **Download button:** Always works via data URL (no upload)
- **QR code:** Appears after upload; falls back gracefully if upload fails
- Add `BLOB_READ_WRITE_TOKEN` for production upload + QR flow

### Smoke Test

```bash
npm run test:smoke
```

This checks the theme selector, poster render, and QR area in a real browser.

### No Token / Offline Mode

If token is missing:
- ✅ Users can still **download photos directly**
- ℹ️ QR code shows error message (non-critical)
- App remains fully functional
