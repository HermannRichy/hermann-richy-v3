# hermannrichy.dev

Portfolio de Hermann Richy : Next.js 16 (App Router), Tailwind CSS 4, GSAP, avec un blog et un dashboard d'administration.

## Installation

```bash
cp .env.example .env     # ou : vercel env pull .env
pnpm install
pnpm db:migrate          # prisma migrate deploy
pnpm db:seed             # compte admin, import des projets, article « Prélude »
pnpm dev
```

## Contenu

- **Projets** : en base (Neon), gérés depuis le dashboard (ordre, mise en avant, visibilité, image, tags). Repli automatique sur `src/data/projects.ts` si la base est absente ou vide.
- **Blog** : éditeur riche Tiptap (titres, gras / italique / souligné / barré / surligné, liens, alignement, listes, listes de tâches, citations, code coloré par langage, tableaux, images, vidéos YouTube, annuler / rétablir, compteur de mots). Le HTML est nettoyé par liste blanche à l'enregistrement et à l'affichage. Brouillon / publié / programmé, tags, temps de lecture, flux RSS (`/blog/rss.xml`).
- **Images** : envoi direct du navigateur vers Cloudinary avec une signature générée côté serveur (le secret ne quitte jamais le serveur), diffusion optimisée (`f_auto,q_auto`). Coller ou déposer une image dans l'éditeur l'envoie automatiquement.
- **SEO** : métadonnées complètes par page (canonical, Open Graph, Twitter), images de partage générées dynamiquement (accueil, projets, blog, chaque article, chaque thème), favicon et icônes générés, manifeste, `robots.txt`, `sitemap.xml`, données structurées (Person, WebSite, BlogPosting).
- **Contact** : chaque message est enregistré en base puis notifié par e-mail (Resend). Validation zod, champ piège, délai minimal, limitation par IP, vérification d'origine, HTML échappé.

Les pages publiques sont régénérées toutes les 5 minutes, et immédiatement après chaque modification dans le dashboard.

## Dashboard

- Adresse secrète : `https://hermannrichy.dev/<ADMIN_PATH>`. `/admin` sans session répond 404.
- Connexion : e-mail + mot de passe, puis double authentification obligatoire (QR code à la première connexion).
- Première connexion : « Première connexion : activer mon compte » sur la page de connexion (lien par e-mail), ou `pnpm admin:link` qui affiche directement un lien d'activation (1 h, usage unique).
- Repartir de zéro (mot de passe, 2FA, sessions) : `pnpm admin:reset`.
- Sections : tableau de bord, articles (éditeur riche, image de couverture, SEO, Ctrl/⌘ + S), projets (aperçu de la carte en direct), messages (lu / archivé / réponse), sécurité.

## Déploiement (Vercel)

1. Créer la base Neon et renseigner les variables de `.env.example` sur Vercel.
2. Cloudinary → Settings → API Keys : renseigner `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET` (envoi d'images depuis le dashboard).
3. Resend : vérifier le domaine `hermannrichy.dev` et définir `EMAIL_FROM`.
4. `vercel env pull .env`, puis `pnpm db:migrate` et `pnpm db:seed` (une fois).
5. Déployer, puis activer le compte admin.

La migration initiale (`prisma/migrations`) a été écrite à la main : la vérifier une fois avec `pnpm prisma migrate dev --create-only` sur une base vide.
