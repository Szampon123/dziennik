# ETAP 1 — Middleware Auth: Globalna ochrona route'ów

## Cel

Stwórz Next.js middleware (`src/middleware.ts`) który wymusza autentykację na WSZYSTKICH route'ach aplikacji, z wyjątkiem jawnie zdefiniowanego whitelistu. Obecnie każda strona/action indywidualnie wywołuje `requireUserId()`, ale brak middleware oznacza, że każda nowa strona dodana w przyszłości bez tego wywołania będzie publicznie dostępna. Middleware jest jedyną warstwą, która to gwarantuje globalnie.

## Kontekst projektu

- **Framework**: Next.js 16.2.10 (App Router)
- **Auth**: NextAuth v5 (beta 31), `next-auth`, JWT sessions
- **Auth config**: `src/lib/auth.ts` — eksportuje `{ handlers, auth, signIn, signOut }`
- **Session helpers**: `src/lib/session.ts` — `requireUserId()` (redirect /login), `getSessionUserId()` (returns null)
- **NextAuth route**: `src/app/api/auth/[...nextauth]/route.ts` — eksportuje `{ GET, POST }` z `handlers`
- **Strona logowania**: `src/app/login/page.tsx`
- **Strona rejestracji**: `src/app/register/page.tsx`
- **Google OAuth routes**: `src/app/api/auth/google/route.ts` i `src/app/api/auth/google/callback/route.ts`

## Wymagania szczegółowe

### 1. Stwórz `src/middleware.ts`

```typescript
// Użyj NextAuth v5 middleware pattern:
// import { auth } from "@/lib/auth"
// export default auth(...)
// 
// ALBO ręczny middleware z next-auth/jwt:
// import { getToken } from "next-auth/jwt"
```

Middleware powinien:

1. **Sprawdzać obecność ważnego tokenu JWT** w każdym requeście
2. **Przepuszczać bez sprawdzania** (whitelist) te ścieżki:
   - `/login` — strona logowania
   - `/register` — strona rejestracji
   - `/api/auth/*` — wszystkie NextAuth endpointy (login, callback, session, csrf)
   - `/_next/*` — statyczne assety Next.js
   - `/favicon.ico` — ikona
   - Pliki statyczne z `public/` (np. `/file.svg`, `/globe.svg`, `/next.svg`, `/vercel.svg`, `/window.svg`)
3. **Redirect na `/login`** gdy brak ważnej sesji i ścieżka nie jest na whiteliście
4. **Przepuszczać dalej** gdy sesja jest ważna

### 2. Konfiguracja matchera

W tym samym pliku `src/middleware.ts` dodaj `export const config` z matcherem, który wyklucza statyczne assety i `_next`:

```typescript
export const config = {
  matcher: [
    // Matchuj wszystko POZA: _next/static, _next/image, pliki z rozszerzeniami (favicon.ico, *.svg, *.png itp.)
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
```

### 3. NIE modyfikuj istniejących plików

Obecne wywołania `requireUserId()` w stronach i actions **zostawiamy** — to defense-in-depth. Middleware jest pierwszą warstwą, `requireUserId()` jest drugą. Nie usuwaj żadnych istniejących sprawdzeń.

### 4. Uwagi implementacyjne

- NextAuth v5 eksportuje `auth` jako wrapper middleware. Sprawdź, czy `auth` z `src/lib/auth.ts` działa jako middleware (pattern: `export { auth as middleware }`). Jeśli nie — użyj `getToken` z `next-auth/jwt` bezpośrednio.
- **AUTH_SECRET** jest już w `.env.local` — `getToken` potrzebuje go do weryfikacji JWT.
- Middleware w Next.js App Router działa w Edge Runtime — upewnij się, że importy są kompatybilne z Edge (np. nie importuj Prisma w middleware).
- **Nie importuj `prisma`** w middleware — Prisma Client nie działa w Edge Runtime. Weryfikacja sesji powinna opierać się wyłącznie na JWT token (bez zapytań do bazy).

### 5. Testowanie

Po implementacji zweryfikuj:
1. Otwórz `/` bez zalogowania → redirect na `/login`
2. Otwórz `/activities` bez zalogowania → redirect na `/login`
3. Otwórz `/login` bez zalogowania → widoczna strona logowania (bez redirect loop)
4. Otwórz `/register` bez zalogowania → widoczna strona rejestracji
5. Zaloguj się → normalne działanie całej aplikacji
6. Sprawdź, że Google OAuth flow działa (redirect do Google → callback → powrót do app)
7. Sprawdź, że assety (CSS, JS, obrazki) ładują się na stronie logowania

## Pliki do stworzenia

- `src/middleware.ts` — NOWY

## Pliki do NIE modyfikowania

- `src/lib/auth.ts` — bez zmian
- `src/lib/session.ts` — bez zmian
- `next.config.ts` — bez zmian (matcher jest w middleware.ts)
- Żadne istniejące strony ani actions — bez zmian

## Oczekiwany rezultat

Jeden nowy plik `src/middleware.ts` (~30-50 linii), który globalnie wymusza autentykację. Zero zmian w istniejącym kodzie. Aplikacja działa identycznie jak przed zmianą dla zalogowanych użytkowników, ale niezalogowani są zawsze kierowani na `/login`.
