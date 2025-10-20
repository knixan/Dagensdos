# News Gamma — projektöversikt

Detta repository innehåller en Next.js-applikation (App Router) skriven i TypeScript. Projektet använder Prisma som ORM och PostgreSQL som enda databas. Autentisering hanteras av Better Auth tillsammans med Pris­ma‑adaptern.

I korthet:

- Frontend: Next.js (App Router) + React
- Backend/data: Prisma + PostgreSQL
- Autentisering: Better Auth (Prisma-adapter)

## Viktiga filer och platser

- `prisma/schema.prisma` — Prisma schema och modeller. Provider är `postgresql` och `url` hämtas från `DATABASE_URL`.
- `src/lib/prisma.ts` — Prisma Client-instans som används i appen.
- `src/lib/auth.ts` — Better Auth-konfiguration (använder `prismaAdapter(prisma, { provider: 'postgresql' })`).
- `src/app/api/auth/[...all]/route.ts` — Next.js route som exponerar Better Auth endpoints via `toNextJsHandler`.
- `src/lib/auth-client.ts` — Better Auth client för use i React-komponenter.
- `src/lib/server-auth.ts` — Serverhjälpare för att läsa session och kräva admin/user.

## Miljövariabler (.env)

Skapa en `.env` i projektets rot (lägg inte upp den i git). Minimikonfiguration för lokal utveckling:

```
DATABASE_URL="postgresql://<dbuser>:<password>@<host>:<port>/<database>"
BETTER_AUTH_SECRET="en-lång-slumpmässig-och-hemlig-sträng"
```

Exempel som redan finns i repo (byt lösenord i praktiken):

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/news-gamma"
BETTER_AUTH_SECRET="1Rl3uIlNjwFA0WbNt48gMGDfMU9LSLHk"
```

Förklaring:

- `DATABASE_URL` — Anslutningssträngen till din PostgreSQL-databas.
- `BETTER_AUTH_SECRET` — Secret som Better Auth använder för signering av tokens och sessionsdata. Håll den hemlig i produktion.

Obs: Om du kör i en molnplattform eller CI, använd plattformens secure env/secret storage.

## Installation och vanliga kommandon (PowerShell)

Installera beroenden:

```powershell
npm install
```

Generera Prisma Client (behövs efter schemaändringar):

```powershell
npx prisma generate
```

Skapa och kör migrationer mot din PostgreSQL-databas (dev):

```powershell
npx prisma migrate dev --name init-better-auth
```

Starta utvecklingsservern:

```powershell
npm run dev
```

Bygg för produktion:

```powershell
npm run build
npm start
```

## Snabb verifiering

- Besök `http://localhost:3000/registrera` för att skapa en användare.
- Besök `http://localhost:3000/logga-in` för att logga in.
- Kontrollera i din PostgreSQL-databas att tabellerna för `User`, `Session`, `Account`, `Verification` med flera har skapats.
- Auth-api är tillgängligt på `/api/auth/*`.

## Vanliga tips och felsökning

- Om du uppdaterar Prisma-schemat: kör `npx prisma migrate dev` och därefter `npx prisma generate`.
- Om auth-routes ger problem kan du prova att använda `toNextJsHandler(auth.handler)` i `src/app/api/auth/[...all]/route.ts` istället för `toNextJsHandler(auth)`.
- Säkerställ att `BETTER_AUTH_SECRET` är inställt i alla miljöer (dev, staging, prod).
- Anslutningen till PostgreSQL måste tillåta inloggning från din utvecklingsmiljö (brandvägg/host).

## Nästa förbättringar (valfritt)

- Konfigurera en riktig e-postleverantör för lösenordsåterställning och e-postverifiering i `src/lib/auth.ts`.
- Skapa en admin-UI som använder `requireAdmin()` från `src/lib/server-auth.ts`.
- Lägg till integrationstester för auth-flödet.

---

