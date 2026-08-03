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
- ✅ Clean shareable poster with subtle Greenwich styling
- ✅ Direct download via data URL (works offline)
- ✅ Result-screen QR code linking to the uploaded poster URL
- ✅ Countdown overlay + flash effect
- ✅ Responsive mobile UI
- ✅ Browser smoke test for poster rendering and QR-free final export

## QR Code & Upload (Production Deployment)

Photos are uploaded to **Vercel Blob Storage**. The QR code appears on the result screen only, so the shared poster stays clean.

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

This checks the theme selector, poster render, and verifies the final poster does not contain an embedded QR block.

### No Token / Offline Mode

If token is missing:
- ✅ Users can still **download photos directly**
- ℹ️ QR code shows error message (non-critical)
- App remains fully functional
