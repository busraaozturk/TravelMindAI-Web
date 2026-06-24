# TravelMind AI — Kurulum Rehberi

## 1. Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) → New Project
2. **Settings → API** bölümünden şunları kopyala:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Supabase Veritabanı Şemasını Kur

Supabase Dashboard → **SQL Editor** → `supabase-schema.sql` dosyasını yapıştırıp çalıştır.

## 3. Google OAuth Aktifleştir (İsteğe Bağlı)

1. Supabase Dashboard → **Authentication → Providers → Google**
2. Google Cloud Console'dan OAuth 2.0 Client ID oluştur
3. Redirect URL olarak: `https://<supabase-url>/auth/v1/callback`

## 4. Anthropic API Key Al

1. [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key
2. `ANTHROPIC_API_KEY` değişkenine yapıştır

## 5. .env.local Dosyasını Doldur

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-...
```

## 6. Çalıştır

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır ve doğrudan Giriş Yap sayfasına yönlendirir.

## Özellikler

- ✅ **Giriş / Kayıt** — Email+şifre ve Google OAuth
- ✅ **5 adımlı plan formu** — Destinasyon, bütçe, ilgiler, uçuş/otel, notlar
- ✅ **AI Plan Oluşturma** — Claude claude-sonnet-4-6 ile saatlik rota
- ✅ **Hava Durumu** — Open-Meteo API (16 güne kadar ücretsiz)
- ✅ **Bütçe Pasta Grafiği** — 6 kategoriye otomatik dağılım
- ✅ **Otel Önerileri** — 3 fiyat segmenti
- ✅ **Bavul Listesi** — 5 kategoride öneriler
- ✅ **Gizli Cennetler** — Yerel tavsiyeler
- ✅ **Kayıtlı Seyahatler** — Supabase'de kalıcı depolama
- ✅ **Döviz Çevirici** — 29 para birimi, anlık kur
