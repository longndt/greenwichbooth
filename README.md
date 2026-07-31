# greenwichbooth

Greenwich Vietnam themed camera booth for prospective high-school students.

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

- ✅ 15 themed frames (navy, burgundy, gold, premium decorative styles)
- ✅ 6 color filters (vivid, warm, cool, B&W, vintage)
- ✅ 8 stickers (emojis, spark effects)
- ✅ 2×2 square grid layout (full-body photo booth format)
- ✅ Direct download via data URL (works offline)
- ✅ QR code linking (requires Vercel Blob token in production)
- ✅ Countdown overlay + flash effect
- ✅ Responsive mobile UI

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
- **QR code:** Shows "Đang tạo link..." with graceful fallback
- Add `.env.local` with placeholder token to avoid errors

### No Token / Offline Mode

If token is missing:
- ✅ Users can still **download photos directly**
- ℹ️ QR code shows error message (non-critical)
- App remains fully functional
