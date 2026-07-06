# Dziennik

Dziennik dnia dla wielu użytkowników — każdy loguje się przez Google i ma **własny, prywatny** dziennik oraz własne połączenia z Google Calendar i Notion. Codzienny rytm:

1. **Rano** — widok „Dziś": wydarzenia z Twojego Google Calendar + intencja dnia i 1–3 priorytety.
2. **W ciągu dnia** — szybkie notatki z timestampem (log / rozproszenie / pomysł).
3. **Wieczorem** — refleksja (co poszło dobrze / co poprawić), ocena dnia 1–5, poziom energii 1–5, zamknięcie dnia.
4. Każdy zamknięty dzień jest publikowany do **Twojego Notion** jako podstrona dziennego briefu.

Dane są trzymane **lokalnie w SQLite** — Notion to kopia/publikacja, nie źródło prawdy. Wydarzenia z kalendarza są pobierane na żywo (cache 5 min per użytkownik) i nigdy nie zapisywane do bazy.

**Stack:** Next.js (App Router) + TypeScript · Auth.js (NextAuth v5, logowanie Google) · Prisma + SQLite · Tailwind CSS (tryb ciemny) · googleapis · @notionhq/client · Recharts.

## Instalacja i uruchomienie

> Zwięzła instrukcja od zera (po `git clone`) jest w [SETUP.md](SETUP.md).

Wymagany Node.js 20+ (instalowany np. przez `winget install OpenJS.NodeJS.LTS`).

```bash
npm install
cp .env.example .env               # DATABASE_URL (ścieżka do bazy) — potrzebne dla Prisma
cp .env.local.example .env.local   # sekrety: AUTH_SECRET, klucze Google (patrz niżej)
npx prisma migrate dev   # tworzy lokalną bazę prisma/dev.db
npx prisma db seed       # ładuje bazę aktywności (poziomy 1-99)
npm run dev              # aplikacja pod http://localhost:3000
```

W `.env.local` od razu ustaw `AUTH_SECRET` (sekret sesji):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> `.env.local` oraz baza `prisma/dev.db` są w `.gitignore` — sekrety nigdy nie trafiają do repo. Tokeny kalendarza i Notion użytkowników są przechowywane lokalnie w bazie SQLite.

### Tryb deweloperski bez kluczy Google

Zanim skonfigurujesz Google, możesz ustawić `DEV_LOGIN=1` w `.env.local` — na stronie logowania pojawi się formularz „Dev login" tworzący użytkowników testowych po adresie e-mail. Działa **wyłącznie** w `npm run dev`; przy normalnym użyciu ustaw `DEV_LOGIN=0`.

## Konfiguracja Google (logowanie + kalendarz)

Jedna aplikacja OAuth w Google Cloud obsługuje logowanie wszystkich użytkowników i odczyt ich kalendarzy — każdy użytkownik autoryzuje **swoje** konto.

1. Wejdź na [Google Cloud Console](https://console.cloud.google.com/) i utwórz nowy projekt (np. „Dziennik").
2. W **APIs & Services → Library** włącz **Google Calendar API**.
3. W **APIs & Services → OAuth consent screen**:
   - typ użytkownika: **External**,
   - nazwa aplikacji, e-maile kontaktowe — dowolne,
   - w **Audience → Test users** dodaj adresy Gmail wszystkich osób, które mają się logować (w trybie „Testing" limit to 100 test users; publikacja aplikacji dla szerszego grona wymaga weryfikacji Google, bo `calendar.readonly` to scope wrażliwy).
4. W **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - typ: **Web application**,
   - **Authorized redirect URIs** — dodaj **oba**:
     - `http://localhost:3000/api/auth/callback/google` (logowanie Auth.js),
     - `http://localhost:3000/api/auth/google/callback` (połączenie kalendarza).
5. Skopiuj **Client ID** i **Client Secret** do `.env.local`:

   ```
   GOOGLE_CLIENT_ID=...apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-...
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   ```

6. Zrestartuj `npm run dev`. Logowanie: przycisk **„Zaloguj się przez Google"**. Kalendarz: **Ustawienia → Połącz z Google** (osobna, dobrowolna zgoda na `calendar.readonly` — dziennik działa też bez kalendarza).

## Konfiguracja Notion (per użytkownik, w aplikacji)

Każdy użytkownik podpina **własną** integrację Notion w **Ustawieniach** (nie w `.env.local`):

1. Wejdź na [notion.so/my-integrations](https://www.notion.so/my-integrations) → **New integration** (swój workspace; uprawnienia Read/Insert/Update content).
2. Skopiuj **Internal Integration Secret**.
3. Wybierz (lub utwórz) stronę-rodzica dla briefów, np. „Daily Briefs"; na stronie `⋯` → **Connections** → dodaj integrację.
4. Skopiuj ID strony z adresu (końcowe 32 znaki hex, z myślnikami lub bez).
5. W aplikacji: **Ustawienia → Notion** → wklej token i ID → **„Zapisz i przetestuj"** (zapis udaje się tylko przy działającym połączeniu).

### Jak działa synchronizacja

- Zamknięcie dnia najpierw **zawsze zapisuje lokalnie**, potem próbuje synchronizacji — błąd Notion (rate limit, brak internetu, unieważniony token) nigdy nie blokuje zapisu.
- Strona w Notion: tytuł z datą oraz sekcje **Intencja / Priorytety (checklista) / Notatki z dnia / Refleksja / Oceny**.
- Ponowne zamknięcie dnia **aktualizuje** istniejącą stronę (po `notionPageId`) zamiast tworzyć duplikat; jeśli strona zniknęła z Notion, tworzona jest nowa.
- Status synchronizacji (✓ / błąd) widać przy zamkniętym dniu na „Dziś", w Historii i podglądzie dnia; przy błędzie jest przycisk **„Ponów synchronizację"**.

## Widoki

- **Logowanie** (`/login`) — Google (+ dev-login w trybie deweloperskim).
- **Dziś** (`/`) — na górze karta **Przegląd dnia**: łączony postęp zadań dnia (checkpointy z kalendarza **+ priorytety**, N/M + pasek postępu z rozbiciem), ocena dnia (★), poziom energii (⚡), **seria zamkniętych dni z rzędu** (🔥) oraz **trend 7 dni** (mini-wykres % wykonanych zadań z kalendarza dzień po dniu — wydarzenia wsteczne przez `?past=6`); dalej pasek TERAZ/NASTĘPNIE, oś czasu dzisiejszych wydarzeń z checkboxami-checkpointami (`CalendarEventCheck`), zwijana lista na 7 dni, wpis poranny z **checkboxami przy priorytetach** (flagi w `prioritiesDoneJson`, przetrwają edycję tekstów — podążają za treścią), strumień notatek, panel zamknięcia dnia. Przy zamknięciu dnia zapisywany jest **snapshot postępu** (`tasksDone/tasksTotal`), a daily brief w Notion dostaje sekcję „Postęp dnia" (zadania kalendarza + priorytety) i odhaczone to-do priorytetów. W karcie **Kalendarz** jest **nawigator tygodnia** (siatka pon–ndz z kropką na dniach z wydarzeniami, strzałki ◄ ► przeskakujące o tydzień, przycisk „Dziś →") — klik w dzień pokazuje wydarzenia Google z tego dnia (dziś: interaktywnie z checkpointami; inne dni: podgląd tylko do odczytu). Okno danych to ~3 tyg. wstecz i ~4 tyg. w przód (`?days=28&past=21`).
- **Personalizacja Dziś** — przycisk **„Dostosuj widok"** (w nagłówku Dziś) otwiera edytor, w którym każdą sekcję-widżet (Cytat, Przegląd/kalendarz, Poranek, Notatki, Zamknięcie dnia) można **pokazać/ukryć** i **zmienić kolejność** (strzałki ↑↓). Zapis per użytkownik w bazie (`User.dashboardJson`), odczytywany po stronie serwera → bez migania. Domyślnie wszystkie widżety widoczne — personalizacja jest w pełni opcjonalna, a „Domyślny układ" przywraca stan wyjściowy.
- **Historia** (`/history`) — wykres 30 dni z trzema seriami: ocena dnia (fiolet), energia (lazur) i **% wykonanych zadań z kalendarza** (zielona przerywana, druga oś 0–100% po prawej); pojawia się już od 1 ocenionego dnia) oraz lista dni; każdy wiersz i nagłówek szczegółów pokazuje badge **☑ wykonanych zadań z kalendarza** (snapshot z zamknięcia dnia) obok ★ oceny i ⚡ energii, a szczegóły dnia dodatkowo listują odhaczone priorytety (☑/☐). **Podgląd dnia jest w pełni edytowalny** — te same panele co na „Dziś" (poranek, notatki, refleksja, oceny; dla zamkniętego dnia po „Otwórz dzień ponownie"), plus karta **Zadania z kalendarza**. Jeśli Google jest połączony, ta karta **wczytuje realne wydarzenia z kalendarza tego dnia** (pobierane po stronie serwera dla dokładnej daty — działa dla dowolnie dawnego dnia) i pokazuje je z checkboxami, tak jak ekran „Dziś", żebyś widział ile zadań było i mógł zweryfikować, co wykonałeś; odhaczenie zapisuje checkpoint i przelicza snapshot `tasksDone/tasksTotal` (badge w nagłówku i wykres w Historii aktualizują się). Gdy kalendarz jest niepołączony lub tego dnia nie ma wydarzeń, karta pokazuje **ręczną korektę liczby** `wykonane / wszystkie` (przy zamkniętym dniu zapis ponawia synchronizację z Notion). Zamknięcie ponownie otwartego dnia **nie kasuje** ręcznie ustawionej liczby zadań, gdy kalendarz nie może jej policzyć (poza oknem/odłączony).
- **Towarzysz „Dudu"** — na szerokich ekranach (xl+) w lewym marginesie przypięty jest prosty doodle-avatar, który **ewoluuje wraz z postępem aktywności**. XP = liczba zaliczonych poziomów (milestone'ów) we wszystkich aktywnościach; 8 form (Iskra → Kiełek → Dudu → Śmiałek → Wprawny → Mistrz → Bohater → Legenda) z krzywą szybko-na-starcie. Postać zdobywa kolejno kiełek, rumieńce, opaskę, pelerynę, koronę i iskry. Klik → Aktywności. Ukryty na węższych ekranach; szanuje `prefers-reduced-motion`.
- **Cytat na dziś** — na ekranie Dziś panel z inspirującym cytatem z różnych dziedzin (miłość, dobroć, produktywność, mądrość…). Stały cytat dnia (deterministyczny wg daty) + przycisk „Nowy cytat"; każdy w **oryginalnym języku** z autorem, **tłumaczeniem PL na klik** i etykietą dziedziny. Sercem zapisujesz do ulubionych (per użytkownik). Biblioteka jest wbudowana (`src/lib/quotes.ts`, **~450 cytatów** w 7 językach i 21 dziedzinach) — offline i z pewną atrybucją.
- **Cytaty** (`/cytaty`) — przeglądarka **całej biblioteki** (~450 cytatów) z filtrami: wyszukiwanie (treść / autor / tłumaczenie), **dziedzina**, **język**, sortowanie (domyślnie / dziedzina / autor / język) oraz przełącznik **„Tylko ulubione"**. Każdy cytat ma serce do zapisu i tłumaczenie na klik; wyniki stronicowane („Pokaż więcej"). Link „★ Ulubione" z panelu Dziś otwiera stronę od razu z filtrem ulubionych (`?fav=1`).
- **Nawyki** (`/nawyki`) — miesięczny habit tracker w formie **siatki kwadratów**. Najpierw definiujesz swoje nawyki (stałe — wracają w każdym miesiącu; można je zmieniać nazwę, przenosić ▲▼, archiwizować z zachowaniem historii lub usuwać), potem odklikujesz kwadrat na każdy dzień. Wiersze = nawyki, kolumny = dni pogrupowane w tygodnie (Pon–Nd); obecność kwadratu = wykonane. Postęp per-nawyk (np. `14/31` + pasek) i **pierścień ogólnego %**. Miesiące przełączasz strzałkami — **każdy miesiąc ma własne odhaczenia** (cel = liczba dni miesiąca). Dni przyszłe są nieaktywne, „dziś" podświetlone; weekendy delikatnie wygaszone, dni tygodnia 2-literowe (Pn/Wt/Śr…), a odhaczone kwadraty mają ✓ (stan nie tylko kolorem). Na desktopie **cały miesiąc mieści się bez przewijania** (elastyczne kolumny `1fr`); na telefonie siatka przewija się poziomo z przyklejoną kolumną nazw. U góry karta **„Dzisiaj"** — duże, dotykalne przełączniki tylko na dziś (najszybsza droga do odhaczenia) z **serią 🔥** przy każdym nawyku. Na dole **wykres obszarowy „Aktywność w miesiącu"** (azure = dane) z paskiem statystyk (najlepsza seria, łącznie, top nawyk); pierścień w nagłówku pokazuje średnią z minionych dni, a podtytuł — postęp bieżącego tygodnia. Zarchiwizowane nawyki można przywrócić w panelu „Zarządzaj nawykami". Model: `Habit` (per użytkownik) + `HabitCheck` (jeden wiersz = nawyk-dzień) — wzorzec jak checkpointy kalendarza.
- **Aktywności** (`/activities`) — system poziomów sportowych 1–99 (patrz niżej).
- **Ustawienia** (`/settings`) — konto, połączenie Google Calendar, konfiguracja Notion oraz **Wygląd**: motyw **Jasny / Ciemny / System / Kolorowy** (żywa paleta) / **Custom** (własne kolory poszczególnych elementów — tło, karty, obramowania, tekst, akcenty, dane, ukończenie — z podglądem na żywo i resetem). Wybór trzyma `localStorage` i stosuje go skrypt inline przed pierwszym paintem (bez mignięcia).

## Aktywności — poziomy 1–99

Każda aktywność ma drabinkę 99 mierzalnych milestone'ów do odhaczania — od pierwszych kroków (np. bieganie lvl 1: „Przebiegnij 1 minutę bez zatrzymania") po dojrzały szczyt zaangażowanego amatora (lvl 99). Progi są oparte na danych o realnych wynikach amatorów (m.in. mediana 5 km ≈ 30 min, sub-20 ≈ 2% biegaczy); poziomy 1–10 podążają za progresją Couch-to-5K. Aktywności kreatywne (rysowanie, malarstwo, animacja, pisanie, gitara itd.) są skalibrowane pod realną progresję osoby uczącej się — od fundamentów, przez budowanie dorobku i godzin praktyki, po wystawy, zlecenia i mistrzostwo.

- **Widoki i statystyki**: lista `/activities` ma u góry **dashboard** (łączne zaliczone poziomy z ogólnym paskiem, zdobyte w tym tygodniu, rozpoczęte/ukończone, ostatnio aktywna). Strona pojedynczej aktywności ma **nagłówek statystyk** — pierścień % ukończenia, rozbicie na 6 etapów (ile poziomów zaliczone w każdym), 3 następne cele oraz — dla aktywności dystansowych — **serię treningową** (kolejne tygodnie z treningiem) i km w tym tygodniu; dodatkowo **wykres objętości** (12 tygodni km/tydz.) i rekordy (łącznie, najdłuższy, najlepsze tempo). Drabinka poziomów ma przełącznik widoku **Wszystkie / Nieukończone / Kolejne cele** oraz pasek postępu przy każdym etapie.
- **Materiały do nauki (zasoby)**: poziomy-techniki mogą mieć podpięte **zweryfikowane materiały** — filmy **lub** strony (kursy, artykuły, dokumentacja). Renderują się jako klikalne chipy z ikoną wg typu, pod danym krokiem drabinki. Model: `Milestone.resourcesJson` (tablica `{kind, url, title}`, `kind` = video/article/course/reference/tool), dokładany w seed-data przez `resourcesByLevel`. Sztuki wizualne (rysowanie, malarstwo, akwarela, kaligrafia) mają ~51 dobranych zasobów (Proko, Marco Bucci, Drawabox, Ctrl+Paint, Louise De Masi, Maria Montes…), Sztuki cyfrowe (grafika cyfrowa, fotografia, montaż wideo, animacja, modelowanie 3D) — **55 zasobów** (Blender: Ryan King Art, CG Cookie, SouthernShotty; montaż: DaVinci/After Effects; animacja: seria „12 zasad” Alana Beckera, Sir Wade), Rękodzieło (garncarstwo, dzianie, szydełkowanie, szycie, stolarstwo, biżuteria, origami) — **78 zasobów** (Florian Gadsby, Sheep & Stitch, Bella Coco, The Woobles, Made to Sew, Paul Sellers, Beadaholique, Jo Nakashima), a Artyzm (pisanie, produkcja muzyczna) — **25 zasobów** (Reedsy, Abbie Emmons, Alexa Donne, Brandon McNulty; produkcja: JustinGuitar, Cubase, Produce Like A Pro), każdy sprawdzony pod kątem działającego linku. Łącznie **~209 zweryfikowanych materiałów** na 18 aktywnościach kreatywnych. Poziomy liczbowe/godzinowe/wystawowe świadomie nie mają materiałów. (Instrumenty korzystają z osobnego `videoJson` — patrz niżej.)
- **Twój poziom** = najwyższy poziom, dla którego odhaczone są wszystkie niższe (umiejętności są kumulatywne); odhaczenie wyższego poziomu proponuje automatyczne zaliczenie niższych.
- **Dziennik treningów + automat („tylko udowodnione")**: na stronie aktywności wpisujesz trening (data, dystans, czas, opcjonalnie „zawody"), a silnik odhacza wyłącznie poziomy, które trening i historia **faktycznie udowadniają** — dystanse, czasy (progi czasowe liczone średnim tempem: dłuższy bieg zalicza krótszy dystans tylko przy wystarczającym średnim tempie), sumy tygodniowe/miesięczne/łączne i regularność (kolejne tygodnie kalendarzowe). Poziomy „auto" są zablokowane do ręcznej edycji — cofa je usunięcie treningu (pełna rekalkulacja). Ręczne odhaczanie pozostaje dla wszystkiego, czego nie logujesz.
- Odhaczenia są **per użytkownik**; definicje poziomów są wspólne i ładowane przez `npx prisma db seed` (seed jest idempotentny — można go uruchamiać wielokrotnie).
- Nowe aktywności dodaje się plikiem w `prisma/seed-data/` (wzór: `bieganie.ts`) i wpisem w `prisma/seed.ts` — bez zmian w schemacie.
- **Dostępne aktywności: 138 × 99 poziomów** — 80 sportów + 38 dyscyplin kreatywnych + 20 kuchni świata — pogrupowane w 18 kategorii:
  - z dziennikiem treningów km/min i pełnym auto-zaliczaniem (logKind „distance"): bieganie, chodzenie, jazda na rowerze, pływanie, wioślarstwo (ergometr), rolki i łyżwy, turystyka górska, kajakarstwo, narciarstwo biegowe, SUP;
  - drabinki odhaczane ręcznie z torami progresji `prog` (siła, technika, mecze, elementy, ranking — z kaskadą implikacji w obrębie toru, np. „1600 Elo" zalicza niższe progi Elo, ale nigdy tytułów; „20 pompek" zalicza „10 pompek", ale nigdy podciągnięć): pozostałe 90 dyscyplin, m.in. trening siłowy, joga, kalistenika, pilates, gimnastyka, crossfit, spinning, skakanka, aerobik, piłka nożna/ręczna/wodna, koszykówka, siatkówka, rugby, hokej (lód/trawa), krykiet, baseball, futbol amerykański, lacrosse, ultimate frisbee, tenis, tenis stołowy, badminton, squash, padel, pickleball, taniec, taniec towarzyski, sztuki walki, boks, judo, zapasy, wspinaczka, narciarstwo, snowboard, skoki narciarskie, łyżwiarstwo (figurowe/szybkie), biathlon, curling, golf, łucznictwo, bilard, snooker, kręgle, dart, petanka, strzelectwo, żeglarstwo, windsurfing, kitesurfing, surfing, nurkowanie, triathlon, sprint, podnoszenie ciężarów, trójbój, strongman, jeździectwo, paralotniarstwo, bieg na orientację, parkour, karting, motocross, żużel, szachy, e-sport, poker;
  - **branża kreatywna (18)** — drabinki ręczne z torami progresji `prog` (umiejętności, dorobek prac/godzin): rysowanie, malarstwo, akwarela, kaligrafia, garncarstwo, dzianie, szydełkowanie, szycie, stolarstwo, biżuteria, origami, grafika cyfrowa, fotografia, montaż wideo, animacja, modelowanie 3D, pisanie, produkcja muzyczna (Artyzm);
  - **filmy pomocnicze (wszystkie 20 instrumentów)** — poziomy mają materiały YouTube: **utwory** → kanoniczne wykonanie („▶ Wykonanie”, np. „Dla Elizy” → Lang Lang, „Recuerdos de la Alhambra” → Ana Vidović, „Nessun dorma” → Pavarotti) + „🎓 Jak zagrać/zaśpiewać” (wyszukiwarka tutoriali); **techniki** (legato/staccato, pedał, gamy, arpeggia, akordy, tremolo, bendy, oddech, rejestry…) → lekcja („▶ Lekcja”) + „🎓 Więcej ćwiczeń”. Poziomy godzinowe/ogólne nie mają filmów. Dane: `Milestone.videoJson` = `{yt, tut, kind}` (kind: „piece” | „technika”). Każdy instrument ma **~22 filmy** (16 utworów + ~6 technik); pianino ma ich 29. Łącznie **ponad 440 zweryfikowanych filmów** — każdy link znaleziony przez realne wyszukiwanie (profesjonalne wykonania) i sprawdzony na żywo przez YouTube oEmbed;
  - **instrumenty (20)** — drabinki ręczne budowane wspólną fabryką `buildInstrument` (tory `prog`: umiejętności techniczne, repertuar utworów, godziny ćwiczeń + regularność `freq`). Każdy instrument ma **16 nazwanych utworów jako poziomy** (od najłatwiejszego do najtrudniejszego), które pokazują uczniowi, co realnie zagrać na danym etapie — np. dla pianina „Dla Elizy” (temat) wieńczy etap początkujący, a „Ballada g-moll” Chopina to repertuarowy szczyt. Utwory są **sugestiami** (każdy z notką: kontekst poziomu, zamiennik, zgoda na wersję uproszczoną) i zaznaczane niezależnie, więc można je opanowywać w dowolnej kolejności. Milestone'y liczbowe („N utworów na pamięć”) są celowo rzadkie (5 na drabinkę). Instrumenty: gra na gitarze, śpiew, pianino, skrzypce, perkusja, gitara basowa, ukulele, saksofon, flet poprzeczny, trąbka, klarnet, wiolonczela, harmonijka ustna, akordeon, banjo, mandolina, keyboard, puzon, harfa, organy;
  - **kuchnie świata (20)** — drabinki z **konkretnymi daniami jako poziomami** (podstawy → klasyki → dania zaawansowane → pełne wielodaniowe menu), tory `prog` techniki + liczba ugotowanych dań: włoska, francuska, japońska, chińska, meksykańska, indyjska, tajska, hiszpańska, grecka, polska, turecka, wietnamska, koreańska, amerykańska, libańska, marokańska, brazylijska, niemiecka, węgierska, peruwiańska.
- **18 kategorii** (chipy filtra): Wytrzymałościowe, Górskie i outdoor, Wodne, Zimowe, Siła i ciało, Fitness i cardio, Drużynowe, Rakietowe, Precyzyjne, Motorowe, Umysłowe, Taniec i sztuki walki, Sztuki wizualne, Rękodzieło, Sztuki cyfrowe, Artyzm, Instrumenty, Kuchnie świata.
- **Poziomy realistyczne**: wszystkie 138 drabinek 1–99 to realnie osiągalne kroki dla zaangażowanego amatora/kucharza domowego — bez wymagań rzędu 10–15 tys. godzin, tytułów mistrza świata, kadry narodowej czy kontraktu zawodowego na szczycie. Poziom 99 to zawsze „dojrzały, wieloletni warsztat" (np. bieganie: 10 km < 31 min lub półmaraton < 1:10), a nie kariera olimpijska. Realne, spektakularne wyczyny (mistrzostwa świata, igrzyska, rekordy) zostały świadomie zdjęte z wymogów i mają zostać osobnymi, przyszłymi certyfikatami nakładanymi na tę bazę.
- Progi ugruntowane w realnych danych/skalach: StrengthLevel/kg (siłownia, trójbój, sztanga olimpijska), rankingi Concept2 (ergometr), NTRP/WPT (tenis/padel), skale wspinaczkowe, handicapy (golf), runda WA 720 (łucznictwo), gra 300 (kręgle), break 147 (snooker), średnia/checkout (dart), Elo FIDE (szachy), FTP W/kg (spinning), stopnie dan i pas (judo), licencje/patenty i mile (żeglarstwo, nurkowanie, paralotnia), czasy zawodnicze (sprint, łyżwiarstwo szybkie, triathlon), odległość skoku (skoki narciarskie).
- **Filtrowanie listy**: szukajka po nazwie, chipy 18 kategorii, przełącznik „Tylko ulubione" (gwiazdka na karcie, zapis per użytkownik), status (rozpoczęte/nierozpoczęte/ukończone) oraz sortowanie (poziom rosnąco/malejąco, postęp %, nazwa, ostatnia aktywność). Filtry działają natychmiast po stronie klienta; ulubione są trwałe w bazie.
- **Własna wersja poziomu (edytowalny cel)**: w rozwijanym edytorze każdego poziomu możesz nadpisać jego nazwę i opis swoim celem (np. podmienić sugerowany utwór na własny). **Oryginał (seedowany) zostaje zachowany** i widnieje pod polami jako „Oryginał (zachowany)”; przycisk „Przywróć oryginał” cofa zmianę. Twoja wersja wyświetla się w drabince z odznaką „zmodyfikowany”; nadpisanie jest **per użytkownik** (pole `customTitle`/`customDetail` na `MilestoneEntry`) i niezależne od odhaczenia, notatki oraz zdjęcia. Wartość zgodna z oryginałem nie tworzy nadpisania (zapis = brak zmian ⇒ przywrócenie).
- **Notatka i zdjęcie-dowód na każdym poziomie**: każdy wiersz drabinki rozwija się (chevron) w edytor — krótka notatka (maks. 500 znaków) i zdjęcie (np. screen z aplikacji biegowej; JPG/PNG/WEBP/GIF, maks. 6 MB). Wpis (`MilestoneEntry`) jest **niezależny od odhaczenia** — odznaczenie poziomu ani rekalkulacja automatu nie kasują notatki/zdjęcia. Pliki trafiają do `uploads/` (poza `public/`, gitignored) i są serwowane wyłącznie przez autoryzowane API `/api/milestone-photo/[id]` — każdy użytkownik widzi tylko swoje zdjęcia. **Data zaliczenia** poziomu wyświetla się na wierszu drabinki („✓ Zaliczono 3 lipca 2026"), w nagłówku aktywności i na karcie w spisie aktywności.
- Nowe pliki seed korzystają z helpera `ladderC([[tytuł, opis?, kryterium?], …])` w `prisma/seed-data/helpers.ts` — kryteria są kolokowane przy milestone'ach, więc poziomy nie mogą się rozjechać.

## Hosting (na później)

Aplikacja działa dziś na `localhost`; żeby inni logowali się zdalnie, potrzebujesz publicznego adresu. Wtedy: ustaw `AUTH_URL` i `GOOGLE_REDIRECT_URI` na publiczną domenę, dodaj oba produkcyjne redirect URIs w Google Cloud, opublikuj OAuth consent screen (weryfikacja Google przy >100 użytkownikach) i rozważ Postgres zamiast SQLite (w Prisma to zmiana `datasource` + migracja).

## Rozwiązywanie problemów

| Problem | Rozwiązanie |
| --- | --- |
| `Error 403: access_denied` przy logowaniu Google | Dodaj adres logującej się osoby jako **Test user** w OAuth consent screen. |
| `redirect_uri_mismatch` | W Google Cloud muszą być **oba** redirect URIs (logowanie i kalendarz) — dokładnie jak wyżej. |
| Google połączony, ale brak wydarzeń | Czytany jest kalendarz **primary** konta, które autoryzowano (e-mail widać w Ustawieniach). |
| Notion: „Nie znaleziono strony" | Sprawdź ID strony-rodzica i czy strona ma dodaną integrację w **Connections**. |
| Notion: „Nieprawidłowy token" | Wygeneruj token ponownie i zapisz go w Ustawieniach. |
| Zmieniłem `.env.local`, ale nic się nie zmieniło | Zrestartuj `npm run dev` — zmienne czytane są przy starcie. |
| Chcę zresetować bazę | Usuń `prisma/dev.db` i uruchom `npx prisma migrate dev`. |

## Struktura projektu

```
prisma/schema.prisma        # User/Account/Session (Auth.js) + DayEntry, Note, OAuthToken
src/app/                    # /login, / (Dziś), /history, /settings + API routes
src/actions/                # server actions (wpisy, notatki, ustawienia) — scoped do sesji
src/lib/                    # auth (Auth.js), session, prisma, google, notion, cache, daty
src/components/             # komponenty UI
```

Każde zapytanie i akcja przechodzi przez `requireUserId()` / `getSessionUserId()` ([src/lib/session.ts](src/lib/session.ts)) — dane są zawsze odseparowane per użytkownik. Schemat jest przygotowany na rozszerzenia (tagi, podsumowania tygodniowe) przez dodawanie nowych tabel — bez łamiących migracji.
