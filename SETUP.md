# Uruchomienie projektu od zera

Krótka instrukcja postawienia Dziennika na nowej maszynie (po `git clone`).
Szczegóły konfiguracji Google i Notion → zobacz [README.md](README.md).

## Wymagania

- **Node.js 20+** — sprawdź `node -v`. Instalacja: `winget install OpenJS.NodeJS.LTS` (Windows).
- **git** — do sklonowania repo.

## Kroki

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/Szampon123/dziennik.git
cd dziennik

# 2. Zainstaluj zależności
npm install

# 3. Utwórz pliki środowiskowe z szablonów
cp .env.example .env               # DATABASE_URL + DIRECT_URL (PostgreSQL / Neon)
cp .env.local.example .env.local   # sekrety: AUTH_SECRET, klucze Google

# 4. Uzupełnij .env — wklej connection stringi z darmowej bazy Neon
#    (jak założyć: DEPLOY.md, Krok 1). Wygeneruj też AUTH_SECRET do .env.local:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 5. Utwórz schemat i wypełnij bazę (aktywności, poziomy 1–99)
npx prisma migrate deploy
npx prisma db seed

# 6. Uruchom aplikację
npm run dev                        # http://localhost:3000
```

> Baza to **PostgreSQL** (nie plik SQLite). Załóż darmową bazę Neon i wklej jej
> connection stringi do `.env` — pełna instrukcja w **[DEPLOY.md](DEPLOY.md)**.

## Szybki start bez kluczy Google (tryb deweloperski)

Zanim skonfigurujesz Google, w `.env.local` ustaw:

```
DEV_LOGIN=1
```

Na stronie logowania pojawi się formularz **„Dev login"** — tworzy użytkownika testowego po samym adresie e-mail. Działa **wyłącznie** w `npm run dev`. Przy normalnym użyciu ustaw `DEV_LOGIN=0` i skonfiguruj logowanie Google.

## Logowanie Google + Kalendarz (opcjonalne)

Pełna instrukcja krok po kroku (utworzenie projektu w Google Cloud, OAuth consent screen, redirect URIs) jest w [README.md](README.md), sekcja **„Konfiguracja Google"**. Uzupełnij w `.env.local`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`. Notion konfiguruje się per użytkownik **w aplikacji** (Ustawienia), nie w env.

## Co NIE jest w repo (i dlaczego)

Te rzeczy są celowo w `.gitignore` — na nowej maszynie tworzysz je od nowa (kroki wyżej):

| Pominięte | Powód | Jak odtworzyć |
|---|---|---|
| `.env`, `.env.local` | sekrety (klucze, `AUTH_SECRET`, URL bazy) | `cp` z `.example` + uzupełnij |
| baza (Neon/Postgres) | Twoje prywatne dane | `prisma migrate deploy` + `db seed` |
| `uploads/` | zdjęcia-dowody (lokalnie; w chmurze → Blob) | tworzone przy pierwszym uploadzie |
| `node_modules/`, `.next/` | zależności / build | `npm install` / `npm run dev` |

## Przydatne komendy

```bash
npm run dev            # serwer deweloperski
npm run build          # produkcyjny build
npm run lint           # ESLint
npx prisma studio      # podgląd bazy w przeglądarce
```

Reset danych: w Neon utwórz nową bazę (lub wyczyść), zaktualizuj `.env`, potem `npx prisma migrate deploy` (+ `npx prisma db seed`).
