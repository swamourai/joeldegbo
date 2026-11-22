# Joël Degbo — site d’artiste

Site statique React + Vite, sans serveur ni base de données.

## Développement

```sh
npm install
npm run dev
```

Le serveur de développement est disponible sur [http://localhost:5174/](http://localhost:5174/).

La page d’entrée `/` lance la vidéo et ouvre la galerie. La mosaïque est accessible directement à `/paintings` et la biographie à `/about`.

## GitHub Pages

Le workflow GitHub Actions construit et publie le site à chaque push sur `main`. Dans les paramètres du dépôt, choisir **Settings → Pages → GitHub Actions** comme source de publication. Le domaine personnalisé configuré est `https://joeldegbo.com`.

Le workflow configure le chemin de base pour le domaine personnalisé et le fallback nécessaire aux routes `/paintings` et `/about`. Les anciennes routes `/peintures` et `/apropos` restent acceptées.

## Contenu

- `src/data/artworks.json` contient les légendes et les chemins des 65 images.
- `public/images/` contient les images web optimisées.
- `public/video/` contient les versions « Low » utilisées par le site.
- `references/` conserve les fichiers originaux reçus en local et reste exclu du dépôt.
