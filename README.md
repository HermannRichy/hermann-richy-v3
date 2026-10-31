# hermannrichy.dev

Portfolio de Hermann Richy : Next.js 16 (App Router), Tailwind CSS 4, GSAP, avec un blog et un dashboard d'administration.

## Installation

Paquets à ajouter (une fois) :

```bash
pnpm add zod react-markdown remark-gfm rehype-slug rehype-highlight @vercel/blob qrcode sonner tailwind-merge
pnpm add -D prisma@7.8.0 tsx @types/qrcode
```

Puis :

```bash
cp .env.example .env     # ou : vercel env pull .env
pnpm install
pnpm db:migrate          # prisma migrate deploy
pnpm db:seed             # compte admin, import des projets, article « Prélude »
pnpm dev
```

## Contenu

- **Projets** : en base (Neon), gérés depuis le dashboard (ordre, mise en avant, visibilité, image, tags). Repli automatique sur `src/data/projects.ts` si la base est absente ou vide.
- **Blog** : articles en Markdown (GFM, coloration du code), brouillon / publié / programmé, tags, temps de lecture, image de partage générée, flux RSS (`/blog/rss.xml`), sitemap.
- **Contact** : chaque message est enregistré en base puis notifié par e-mail (Resend). Validation zod, champ piège, délai minimal, limitation par IP, vérification d'origine, HTML échappé.

Les pages publiques sont régénérées toutes les 5 minutes, et immédiatement après chaque modification dans le dashboard.

## Dashboard

- Adresse secrète : `https://hermannrichy.dev/<ADMIN_PATH>`. `/admin` sans session répond 404.
- Connexion : e-mail + mot de passe, puis double authentification obligatoire (QR code à la première connexion).
- Première connexion : « Première connexion : activer mon compte » sur la page de connexion (lien par e-mail), ou `pnpm admin:link` qui affiche directement un lien d'activation (1 h, usage unique).
- Repartir de zéro (mot de passe, 2FA, sessions) : `pnpm admin:reset`.
- Sections : tableau de bord, articles (éditeur Markdown avec aperçu, envoi d'images, SEO, Ctrl/⌘ + S), projets (aperçu de la carte en direct), messages (lu / archivé / réponse), sécurité.

## Déploiement (Vercel)

1. Créer la base Neon et renseigner les variables de `.env.example` sur Vercel.
2. Vercel → Storage → **Blob** → créer un store et le lier au projet (`BLOB_READ_WRITE_TOKEN`), pour l'envoi d'images depuis le dashboard.
3. Resend : vérifier le domaine `hermannrichy.dev` et définir `EMAIL_FROM`.
4. `vercel env pull .env`, puis `pnpm db:migrate` et `pnpm db:seed` (une fois).
5. Déployer, puis activer le compte admin.

La migration initiale (`prisma/migrations`) a été écrite à la main : la vérifier une fois avec `pnpm prisma migrate dev --create-only` sur une base vide.
