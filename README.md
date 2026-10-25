# Registre national des délégués médicaux – DPML (démonstration)

Site statique (HTML, CSS, JavaScript), sans compilation ni dépendance externe. Le générateur de QR code (qrcode-generator, licence MIT) est inclus dans `assets/qrcode.js`.

## Contenu
- `index.html` : application (trois espaces : Vérification, Espace délégué, Espace DPML)
- `assets/` : styles, logique, générateur de QR code
- `vercel.json` : en-têtes de sécurité (CSP, anti-framing, etc.)

## Déploiement sur Vercel

### Option A – Interface web (la plus simple, sans installation)
1. Créer un compte gratuit sur https://vercel.com/signup
2. Déposer le dossier sur un dépôt GitHub (nouveau dépôt, envoyer ces fichiers à la racine).
3. Sur Vercel : **Add New → Project**, importer le dépôt.
4. Framework Preset : **Other**. Build Command, Output Directory : laisser vides. Cliquer **Deploy**.
5. L’adresse `https://<nom-du-projet>.vercel.app` est générée. Les QR codes s’adaptent automatiquement à cette adresse.

### Option B – Ligne de commande
```
npm i -g vercel
cd registre-dpml
vercel login
vercel --prod
```
Répondre par défaut aux questions (projet nouveau, répertoire courant).

Documentation officielle : https://vercel.com/docs/cli · https://vercel.com/docs/projects/project-configuration

## À savoir sur cette démonstration
- Les données (10 délégués fictifs) sont enregistrées dans le navigateur de chaque visiteur (`localStorage`). Une suspension faite sur un appareil n’est donc pas visible sur un autre : c’est la limite principale d’une démonstration statique.
- Le bouton « Réinitialiser la démonstration » (Espace DPML) rétablit les données de départ.
- Les QR codes pointent vers l’adresse du site ; imprimés puis scannés avec un téléphone, ils ouvrent la fiche de vérification (utiliser l’adresse définitive `.vercel.app` ou un domaine propre).
- L’expiration est calculée automatiquement à partir de la date de validité.
- Aucune authentification : les espaces délégué et DPML sont ouverts pour la démonstration.

## Passage à la version de production
1. Base de données partagée (PostgreSQL, par exemple via Supabase ou Vercel Postgres) à la place de `localStorage`.
2. Authentification des délégués et des agents (comptes individuels, double authentification pour les administrateurs, rôles).
3. Jeton QR généré côté serveur, révocable, avec statut lu en direct.
4. Journal d’audit horodaté côté serveur, sauvegardes, hébergement validé.
5. Conformité à la loi togolaise n° 2019-014 du 29 octobre 2019 relative à la protection des données à caractère personnel (formalités auprès de l’IPDCP).
