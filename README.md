This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Opslag: Neon (projectdata) en Vercel Blob (documenten)

De app slaat projecten op in een Neon Postgres-database en geüploade documenten in Vercel Blob.
Zonder configuratie valt de app automatisch terug op opslag in de browser (localStorage); de topbar toont welke modus actief is.

1. Maak in Vercel een **Neon**-database en een **Blob**-store aan (Storage-tab) en koppel ze aan dit project;
   Vercel zet dan `DATABASE_URL` en `BLOB_READ_WRITE_TOKEN` als omgevingsvariabelen.
2. Lokaal: kopieer `.env.example` naar `.env.local` en vul beide waarden in.
3. De tabel `projects` wordt bij het eerste API-verzoek automatisch aangemaakt (`src/lib/db.ts`); het schema staat ook in `db/schema.sql`.
4. Bij een lege database worden de drie demoprojecten automatisch geladen. "Demo herstellen" in de topbar wist alle projecten en laadt ze opnieuw.

API-routes: `GET/POST /api/projects`, `PUT/DELETE /api/projects/[id]`, `POST/DELETE /api/documents`.
