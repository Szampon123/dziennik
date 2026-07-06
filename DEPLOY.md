# Wdrożenie na Vercel (darmowo, dostępne 24/7)

Aplikacja jest przystosowana do darmowego hostingu:

- **Vercel** (Hobby) — serwuje Next.js, zawsze online.
- **Neon** — darmowy PostgreSQL (zastępuje lokalny SQLite; serverless nie utrzymuje pliku bazy).
- **Vercel Blob** — przechowywanie zdjęć-dowodów (serverless ma ulotny dysk).

> **Model:** jedna baza Neon używana i lokalnie, i przez Vercel — seedujesz raz, dane masz wszędzie. (Zaawansowani mogą użyć osobnej gałęzi Neon „dev" do pracy lokalnej.)

Wszystkie konta zakłada właściciel (wymagają logowania). Poniżej klik-po-kliku.

---

## Krok 1 — Baza danych: Neon

1. Wejdź na **https://neon.tech** → **Sign up** (najprościej „Continue with GitHub").
2. **Create project**: nazwa `dziennik`, region blisko Ciebie (np. *Europe (Frankfurt)*). Postgres w domyślnej wersji.
3. Po utworzeniu otwórz **Connection Details / Connect**. Skopiuj **dwa** connection stringi:
   - **Pooled** (host ma sufiks `-pooler`) → to będzie `DATABASE_URL`.
   - **Direct** (odznacz „Pooled connection" / „Connection pooling") → to będzie `DIRECT_URL`.
   - Oba muszą kończyć się na `?sslmode=require`.

Trzymaj je pod ręką — użyjesz w kroku 2 i 3.

---

## Krok 2 — Przełącz lokalną pracę na Neon

Po przejściu na Postgres lokalny SQLite już nie działa. Jednorazowo:

1. W pliku **`.env`** (lokalny, gitignorowany) wpisz oba URL-e z Neona:
   ```
   DATABASE_URL="postgresql://...-pooler...neon.tech/dziennik?sslmode=require"
   DIRECT_URL="postgresql://...neon.tech/dziennik?sslmode=require"
   ```
   (Lokalnie oba mogą być tym samym *direct* URL — pula nie jest potrzebna.)
2. Utwórz schemat i wgraj bazę aktywności:
   ```bash
   npx prisma migrate deploy   # tworzy tabele w Neon (migracja 0_init)
   npx prisma db seed          # 138 aktywności × poziomy 1–99 + zasoby
   ```
3. Sprawdź lokalnie: `npm run dev` → http://localhost:3000 (zdjęcia lokalnie nadal zapisują się na dysk — Blob włącza się dopiero na Vercelu).

---

## Krok 3 — Aplikacja: Vercel

1. Wejdź na **https://vercel.com** → **Sign up** („Continue with GitHub").
2. **Add New… → Project** → **Import** repozytorium `Szampon123/dziennik`.
   - Jeśli repo się nie pokazuje: **Adjust GitHub App Permissions** i daj Vercelowi dostęp do tego prywatnego repo.
3. Framework wykryje się jako **Next.js** — nie zmieniaj build settings (projekt ma skrypt `vercel-build`, który sam odpali migracje).
4. Rozwiń **Environment Variables** i dodaj (Production; możesz też zaznaczyć Preview):

   | Zmienna | Wartość |
   |---|---|
   | `DATABASE_URL` | pooled URL z Neona |
   | `DIRECT_URL` | direct URL z Neona |
   | `AUTH_SECRET` | wygeneruj: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
   | `AUTH_URL` | na razie zostaw puste — uzupełnisz w kroku 5 |
   | `GOOGLE_CLIENT_ID` | z Google Cloud (jak w `.env.local`) |
   | `GOOGLE_CLIENT_SECRET` | jw. |
   | `GOOGLE_REDIRECT_URI` | na razie puste — uzupełnisz w kroku 5 |

   **Nie ustawiaj** `DEV_LOGIN` (albo `0`) — dev-login ma być wyłączony w produkcji.
5. **Deploy**. Po chwili dostaniesz adres, np. `https://dziennik-xxxx.vercel.app`.

---

## Krok 4 — Zdjęcia: Vercel Blob

1. W projekcie na Vercelu: **Storage → Create Database → Blob** → nazwa np. `dziennik-photos` → **Create**.
2. **Connect to Project** (ten projekt) → Vercel automatycznie doda zmienną **`BLOB_READ_WRITE_TOKEN`**.
3. Gdy token jest obecny, aplikacja zapisuje nowe zdjęcia do Blob (kod wykrywa to sam). Zdjęcia serwowane są dalej tylko przez autoryzowaną trasę — URL bloba nie wychodzi na zewnątrz.

---

## Krok 5 — Domknij logowanie Google

Teraz znasz już adres z kroku 3. W **Vercel → Settings → Environment Variables** ustaw:

- `AUTH_URL` = `https://TWÓJ-ADRES.vercel.app`
- `GOOGLE_REDIRECT_URI` = `https://TWÓJ-ADRES.vercel.app/api/auth/google/callback`

Następnie w **Google Cloud Console** (ten sam projekt OAuth co lokalnie):

1. **APIs & Services → Credentials →** Twój **OAuth 2.0 Client**.
2. W **Authorized redirect URIs** dodaj: `https://TWÓJ-ADRES.vercel.app/api/auth/google/callback` (obok istniejącego localhost).
3. Zapisz. Jeśli ekran zgody jest w trybie **Testing**, upewnij się, że jesteś na liście **Test users** (Twój adres Gmail) — dla użytku osobistego weryfikacja Google nie jest potrzebna.

Na końcu w Vercelu **Deployments → … → Redeploy** (żeby złapał nowe zmienne).

---

## Krok 6 — Gotowe

Wejdź na `https://TWÓJ-ADRES.vercel.app` → zaloguj się przez Google → korzystasz z telefonu i komputera z tych samych danych (jedna baza Neon).

## Aktualizacje w przyszłości

Każdy `git push` na gałąź `main` **automatycznie** buduje i wdraża nową wersję (Vercel podpięty pod repo). Migracje bazy odpalają się same przy deployu (`vercel-build` → `prisma migrate deploy`). Robiąc zmianę schematu lokalnie użyj `npx prisma migrate dev --name opis` — powstały plik migracji commitujesz, a Vercel go zastosuje.

## Gdyby coś nie działało

| Objaw | Przyczyna / rozwiązanie |
|---|---|
| Deploy pada na migracji | Sprawdź `DIRECT_URL` (musi być **direct**, bez `-pooler`) i `?sslmode=require`. |
| „redirect_uri_mismatch" przy logowaniu | `GOOGLE_REDIRECT_URI` na Vercelu i w Google Cloud muszą być **identyczne** (dokładny adres Vercela). |
| Zalogowanie nie działa / błąd sesji | Ustaw `AUTH_URL` na dokładny adres Vercela i zrób Redeploy. |
| Prod świeci pustą listą aktywności | Baza nieza-seedowana — uruchom lokalnie `npx prisma db seed` na tym samym `DATABASE_URL` (ta sama baza Neon). |
| Zdjęcia znikają po deployu | Brak `BLOB_READ_WRITE_TOKEN` — dokończ krok 4 (Storage → Blob → Connect). |

## Limity darmowych tierów (orientacyjnie)

- **Vercel Hobby**: do użytku niekomercyjnego, zawsze online.
- **Neon free**: ~0,5 GB — dla tej aplikacji z zapasem.
- **Vercel Blob free**: kilka GB transferu/miejsca — zdjęcia-dowody mieszczą się spokojnie.
