# Olla — La fidélité sans carte

Un site web Next.js 15 moderne pour Olla, avec authentification Supabase par lien magique, design sobre et branding cohérent.

## Stack Technique

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS 4** pour le styling
- **Supabase** pour l'authentification
- **Lucide React** pour les icônes
- **React 19**

## Fonctionnalités

### Routes Publiques (SEO)
- `/` — Page d'accueil avec héro et avantages
- `/features` — Détail des fonctionnalités
- `/pricing` — Plans tarifaires
- `/faq` — Questions fréquentes
- `/contact` — Formulaire de contact

### Authentification
- `/login` — Connexion par lien magique (Supabase)
- `/pro` — Espace utilisateur protégé
  - Redirection automatique vers `/login` si non authentifié
  - Bouton de déconnexion

### Autres
- `/api/health` — Endpoint de santé (status: ok)
- `sitemap.xml` — Sitemap SEO
- `robots.txt` — Directives robots

## Design

### Palette de couleurs
```
- Primary (Bleu sombre): #1e3a8a
- Secondary (Bleu signature): #2563eb
- Success (Vert Babu): #00A699
- Error (Rouge): #EF4444
- Text (Noir-bleu): #0f172a
- Text Light (Gris-bleu): #64748b
- Border (Gris clair): #e2e8f0
- Background: #FFFFFF
```

### Typographie
- Font: Inter
- Polices: 300, 400, 500, 600, 700

### Composants
- Cards avec `rounded-2xl` et ombres douces
- Buttons primaires (#1e3a8a) et secondaires (#00A699)
- Spacing généreux
- Design mobile-first responsive

## Installation

### 1. Cloner le projet
```bash
git clone <repo-url>
cd olla-web
```

### 2. Installer les dépendances
```bash
pnpm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

Remplissez `.env.local` avec vos valeurs Supabase :
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Lancer le serveur de développement
```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Configuration Supabase

### 1. Créer un projet Supabase
- Allez sur [supabase.com](https://supabase.com)
- Créez un nouveau projet
- Notez l'URL du projet et la clé anon

### 2. Configurer l'authentification par email
Dans le dashboard Supabase :
1. Allez dans **Authentication** > **Providers**
2. Activez **Email / Magic Link**
3. Configurez les paramètres d'email si nécessaire

### 3. Configurer le callback URL
Dans **Authentication** > **URL Configuration** :
- Redirect URL: `http://localhost:3000/auth/callback`
- (Changez à votre domaine en production)

## Scripts

```bash
# Développement
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Linting
pnpm lint
```

## Structure du projet

```
olla-web/
├── app/
│   ├── (marketing)/          # Routes publiques
│   │   ├── page.tsx          # Accueil
│   │   ├── features/         # Fonctionnalités
│   │   ├── pricing/          # Tarifs
│   │   ├── faq/              # FAQ
│   │   ├── contact/          # Contact
│   │   └── layout.tsx
│   ├── login/                # Connexion
│   ├── pro/                  # Espace protégé
│   │   ├── page.tsx
│   │   └── layout.tsx        # Guard serveur
│   ├── api/
│   │   └── health/           # Endpoint santé
│   ├── layout.tsx            # Layout root
│   ├── globals.css
│   ├── sitemap.ts            # SEO sitemap
│   └── robots.ts             # SEO robots
├── components/
│   ├── header.tsx            # Navigation
│   ├── footer.tsx            # Footer
│   ├── hero.tsx              # Section héro
│   ├── feature-card.tsx      # Carte de fonctionnalité
│   └── section.tsx           # Conteneur section
├── lib/
│   ├── supabaseClient.ts     # Client Supabase
│   └── auth.ts               # Utilities auth
├── public/                   # Assets statiques
├── tailwind.config.ts        # Configuration Tailwind
├── tsconfig.json             # TypeScript config
├── next.config.ts            # Next.js config
└── package.json
```

## Déploiement sur Vercel

### 1. Préparer le projet
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Déployer sur Vercel
- Allez sur [vercel.com](https://vercel.com)
- Importez le repository GitHub
- Vercel détectera automatically Next.js

### 3. Configurer les variables d'environnement
Dans Vercel Project Settings > Environment Variables :
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Déployer
Cliquez sur "Deploy" — Vercel buildéra et déploiera automatiquement.

## Optimisations pour la production

- [ ] Configurer les images statiques avec Next.js `Image`
- [ ] Ajouter les logs d'erreurs (Sentry, LogRocket)
- [ ] Configurer les analytics (Google Analytics, Plausible)
- [ ] Mettre à jour les domaines en production
- [ ] Activer la compression Gzip
- [ ] Configurer le caching des assets

## Personnalisation

### Changer les couleurs
Modifiez `tailwind.config.ts` dans la section `colors`.

### Changer le contenu
Modifiez les fichiers dans `app/(marketing)/` pour mettre à jour le contenu.

### Ajouter des pages
1. Créez un dossier dans `app/(marketing)/`
2. Ajoutez un `page.tsx`
3. Optionnel : ajoutez des métadonnées avec `export const metadata`

## SEO

Le site inclut :
- Métadonnées OpenGraph
- Sitemap XML (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Métadonnées HTML (title, description)
- Icons/Favicon

## Dépannage

### "Supabase URL or Anon Key is missing"
- Vérifiez que `.env.local` existe
- Vérifiez les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Redémarrez le serveur (`pnpm dev`)

### Auth ne fonctionne pas
- Vérifiez les credentials Supabase
- Vérifiez le Redirect URL dans Supabase settings
- Vérifiez que l'Email provider est activé

### Design cassé sur mobile
- Vérifiez Tailwind compilation
- Videz le cache `.next/` : `rm -rf .next && pnpm dev`

## License

MIT

## Support

Pour toute question ou problème : [Contacter Olla](https://olla.app/contact)
