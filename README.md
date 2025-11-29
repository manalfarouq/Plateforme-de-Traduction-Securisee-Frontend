# Plateforme de Traduction Sécurisée - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.0.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://reactjs.org/)

## Description

Interface web moderne développée avec Next.js 16 pour la plateforme de traduction sécurisée de TalAIt. Interface terminal stylisée avec animations typewriter et gestion complète de l'authentification JWT.

**Backend associé :** [Plateforme de Traduction Sécurisée - Backend](https://github.com/manalfarouq/Plateforme-de-Traduction-Securisee-Backend.git)

## Fonctionnalités

- ✅ **Interface Terminal** - Design rétro cyberpunk avec animations
- ✅ **Authentification** - Système complet signup/login avec JWT
- ✅ **Traduction temps réel** - FR↔EN avec feedback instantané
- ✅ **Gestion de session** - LocalStorage + validation automatique
- ✅ **Panel Admin** - Liste des utilisateurs avec animations
- ✅ **Commandes terminal** - `/swap`, `/clear`, `/users`, `/help`
- ✅ **Responsive** - Design adaptatif desktop/mobile
- ✅ **TypeScript** - Code typé et sécurisé

## Technologies

- **Framework** : Next.js 16.0.4 (App Router)
- **Langage** : TypeScript
- **Styling** : CSS Modules + Variables CSS
- **State Management** : React Hooks
- **API Client** : Fetch API
- **Déploiement** : Vercel

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Backend API déployé

### 1. Cloner le repository

```bash
git clone https://github.com/manalfarouq/Plateforme-de-Traduction-Securisee-Frontend.git
cd Plateforme-de-Traduction-Securisee-Frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=https://zorohack.onrender.com
```

Pour le développement local :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx       # Page de connexion
│   │   └── signup/
│   │       └── page.tsx       # Page d'inscription
│   ├── translator/
│   │   └── page.tsx           # Interface de traduction
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Page d'accueil
│   └── globals.css            # Styles globaux
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx      # Formulaire de connexion
│   │   └── SignUpForm.tsx     # Formulaire d'inscription
│   └── ui/
│       ├── TypewriterLine.tsx # Composant animation texte
│       ├── Alert.tsx          # Modal d'alerte
│       ├── HackSequence.tsx   # Animation de hack
│       └── TrapPage.tsx       # Page piège
├── hooks/
│   ├── useAuth.tsx            # Hook d'authentification
│   └── useHackSequence.tsx    # Hook séquence de hack
├── lib/
│   ├── apiService.ts          # Service API centralisé
│   └── constants.ts           # Messages et constantes
├── styles/
│   ├── globals.css            # Styles globaux
│   ├── terminal.css           # Styles terminal
│   ├── alert.css              # Styles modal
│   ├── hack-sequence.css      # Styles animation hack
│   └── trap.css               # Styles page piège
├── public/                    # Assets statiques
├── .env.local                 # Variables d'environnement
├── next.config.js             # Configuration Next.js
├── package.json
├── tsconfig.json
└── README.md
```

## Pages et Routes

### Page d'accueil - `/`
- Page piège avec formulaire de traduction "innocent"
- Effets de glitch subtils (dead pixel)
- Modal d'alerte mystérieux
- Séquence d'animation de "hack"
- Redirection automatique vers `/login`

### Inscription - `/signup`
- Formulaire avec validation
- Animation typewriter sur les titres
- Choix de rôle (user/admin)
- Code admin requis pour rôle admin (2480)
- Redirection automatique après inscription

### Connexion - `/login`
- Animation typewriter sur les titres
- Authentification par username/password
- Stockage sécurisé du JWT et du rôle
- Redirection vers le traducteur

### Traducteur - `/translator`
- Interface principale de traduction
- Tutorial interactif avec ZORO
- Système de messages en queue
- Affichage du rôle (badge [ADMIN])
- Commandes disponibles :
  - `/swap` - Inverser la direction FR↔EN
  - `/clear` - Effacer l'historique
  - `/help` - Afficher l'aide
  - `/users` - Liste utilisateurs (admin seulement)
- Animations typewriter pour toutes les réponses
- Indicateur de direction et statut
- Bouton de déconnexion

### Liste des utilisateurs (Intégré dans `/translator`)
- Accessible uniquement aux admins via commande `/users`
- Affichage animé style terminal
- Bordure dessinée progressivement
- Titre avec animation typewriter
- Lignes utilisateurs avec effet typewriter
- Tableau formaté avec ID, Username, Role, Date de création
- Coloration spéciale pour les admins (magenta)
- Bouton retour au traducteur

## Fonctionnalités détaillées

### Authentification

```typescript
// Stockage du token après login/signup
localStorage.setItem("token", data.token);
localStorage.setItem("username", username);
localStorage.setItem("user_session", JSON.stringify({ username, role }));
localStorage.setItem("isAuthenticated", "true");
```

### Protection des routes

Le hook `useAuth` vérifie automatiquement :
- Présence du token
- Validité de la session
- Redirection vers `/login` si non authentifié

```typescript
const { username, isChecking, isAuthenticated } = useAuth();

useEffect(() => {
  if (isChecking) return;
  
  if (!isAuthenticated) {
    router.push("/login");
    return;
  }
}, [isChecking, isAuthenticated, router]);
```

### Appels API

Service API centralisé dans `lib/apiService.ts` :

```typescript
// Traduction
const translation = await apiService.translate(text, direction);

// Liste des utilisateurs (Admin only)
const users = await apiService.getAllUsers();

// Login
const data = await apiService.login(username, password);

// Signup avec rôle admin
const data = await apiService.signup(username, password, "admin", "2480");
```

### Système de messages en queue

Le traducteur utilise un système de queue pour gérer l'affichage séquentiel des messages avec animations typewriter :

```typescript
// Ajouter un message à la queue
enqueueMessage({ type: "user", text: `> ${username}: ${message}` });
enqueueMessage({ type: "zoro", text: `>>> ZORO: ${response}` });

// Les messages sont affichés un par un avec animation
```

## Personnalisation

### Thème

Les couleurs sont définies dans `globals.css` :

```css
:root {
  /* Couleurs */
  --color-primary: #00ff00;
  --color-primary-dark: #00cc00;
  --color-bg-dark: #000000;
  --color-bg-light: #ffffff;
  --color-text-dark: #00ff00;
  --color-border: #00ff00;
  --color-glitch-1: #ff00ff;
  --color-glitch-2: #00ffff;

  /* Shadows & Glows */
  --glow-green: 0 0 10px rgba(0, 255, 0, 0.5);
  --glow-green-intense: 0 0 20px rgba(0, 255, 0, 0.8);

  /* Fonts */
  --font-mono: "Courier New", Courier, monospace;
}
```

### Messages

Tous les messages sont centralisés dans `lib/constants.ts` :

```typescript
export const MESSAGES = {
  TRAP_PAGE: {
    TITLE: "Traducteur Français-Anglais",
    SUBTITLE: "Traduisez vos textes rapidement",
    // ...
  },
  ALERT: {
    TITLE: ">>> SIGNAL DÉTECTÉ",
    TEXT1: ">>> Source: [INCONNU]",
    // ...
  },
  TERMINAL: {
    SYSTEM_V1: ">>> SYSTÈME DE TRADUCTION SECURISE v2.47",
    SYSTEM_V2: ">>> Alimenté par M A N A L",
    // ...
  },
  ZORO_TUTORIAL: [
    ">>> ZORO: Première fois ici ? Laisse-moi t'expliquer.",
    ">>> ZORO: J'intercepte tes mots en français et les transforme en anglais.",
    // ...
  ],
  // ...
}
```

### Animations

Toutes les animations sont définies dans les fichiers CSS correspondants :

- **Typewriter** : `terminal.css` - Effet machine à écrire
- **Glitch** : `alert.css` - Effet de distorsion
- **Hack Sequence** : `hack-sequence.css` - Animation de piratage
- **Blink** : `globals.css` - Curseur clignotant

## Tests

### Test manuel des fonctionnalités

1. **Page d'accueil**
   - Vérifier l'effet de dead pixel
   - Tester le glitch aléatoire
   - Cliquer sur "Commencer" → Modal apparaît

2. **Modal d'alerte**
   - Cliquer sur "Non" → Modal se ferme
   - Cliquer sur "Oui" → Animation de glitch intense → Hack sequence

3. **Séquence de hack**
   - Vérifier les phases (shake, glitch, black, code, scanlines, zoom)
   - Vérifier la barre de progression
   - Vérifier l'affichage des données (IP, GPS, fingerprint)
   - Vérifier la redirection vers `/login`

4. **Inscription**
   - Créer un compte user
   - Créer un compte admin avec code 2480
   - Vérifier la redirection automatique

5. **Connexion**
   - Login avec user créé
   - Vérifier le token dans localStorage
   - Vérifier la redirection vers `/translator`

6. **Traduction**
   - Attendre la fin du tutorial ZORO
   - Taper "bonjour" → doit traduire en "hello"
   - `/swap` → changer direction (EN→FR)
   - Taper "hello" → doit traduire en "bonjour"
   - `/clear` → effacer la conversation
   - `/help` → afficher l'aide

7. **Commandes admin**
   - Se connecter en admin
   - Vérifier le badge [ADMIN] en magenta
   - Taper `/users`
   - Vérifier l'animation du titre
   - Vérifier l'animation des lignes utilisateurs
   - Vérifier la coloration des admins
   - Cliquer sur "Retour au traducteur"


## Debugging

### Logs console

Les appels API sont loggés en détail dans la console :

```javascript
console.log("API: Appel login");
console.log("URL:", endpoint);
console.log("Status:", response.status);
console.log("Réponse JSON:", data);
```

### Vérifier l'authentification

Dans la console du navigateur :

```javascript
// Vérifier le token
localStorage.getItem("token")

// Vérifier la session
JSON.parse(localStorage.getItem("user_session"))

// Vérifier le statut
localStorage.getItem("isAuthenticated")
```

### Vérifier l'état du composant

Ajouter des logs temporaires :

```typescript
console.log("Current message:", currentMessage);
console.log("Messages queue:", messagesQueue);
console.log("User role:", userRole);
```

## Build & Déploiement

### Build de production

```bash
# Build optimisé
npm run build

# Lancer en mode production
npm run start
```

### Déploiement sur Vercel

1. **Connecter le repository**
   - Aller sur [Vercel](https://vercel.com)
   - Importer le repository GitHub
   - Sélectionner "Next.js" comme framework

2. **Configurer les variables d'environnement**
   
   Dans **Settings → Environment Variables** :
   
   | Key | Value | Environments |
   |-----|-------|--------------|
   | `NEXT_PUBLIC_API_URL` | `https://zorohack.onrender.com` | Production, Preview, Development |

3. **Déploiement automatique**
   - Chaque push sur `main` déclenche un build
   - Preview automatique pour les PRs
   - URL de production : `https://zorohack.vercel.app`

### Variables d'environnement

```env
# Production
NEXT_PUBLIC_API_URL=https://zorohack.onrender.com

# Development
NEXT_PUBLIC_API_URL=http://localhost:8000

# NODE_ENV est géré automatiquement par Vercel
```

## Performance

### Optimisations Next.js 16

- **Turbopack** activé en développement (10x plus rapide que Webpack)
- **Server Components** par défaut
- **Automatic Code Splitting**
- **Image Optimization** automatique
- **Font Optimization** avec `next/font`

### Optimisations personnalisées

- **Lazy loading** des composants lourds
- **Debouncing** sur les animations
- **Memoization** avec `useMemo` et `useCallback`
- **useLayoutEffect** pour éviter les flashes

```typescript
// Exemple d'optimisation
const currentUserLineToAnimate = useMemo(() => {
  if (!showUserList || users.length === 0) return null;
  return formatUserLine(users[animatedUserIndex - 1]);
}, [animatedUserIndex, showUserList, users]);
```

## Sécurité

### Bonnes pratiques implémentées

- ✅ Tokens JWT stockés en localStorage (HTTPS obligatoire en prod)
- ✅ Validation des inputs côté client
- ✅ Sanitization des messages utilisateurs
- ✅ Protection CORS configurée
- ✅ Pas de logs sensibles en production
- ✅ Vérification du rôle pour les endpoints admin
- ✅ Redirection automatique si non authentifié


## Documentation des composants

### TypewriterLine

Composant d'animation texte avec effet typewriter :

```typescript
<TypewriterLine
  text="Texte à animer"
  delay={0}              // Délai avant l'animation (ms)
  className="zoro"       // Classe CSS optionnelle
  onComplete={() => {}}  // Callback après animation
/>
```

**Props :**
- `text` (string) : Le texte à afficher
- `delay` (number) : Délai avant le début de l'animation
- `className` (string, optionnel) : Classes CSS supplémentaires
- `onComplete` (function, optionnel) : Fonction appelée après l'animation

### useAuth Hook

Hook personnalisé pour la gestion d'authentification :

```typescript
const { username, isChecking, isAuthenticated } = useAuth();
```

**Retourne :**
- `username` (string) : Nom de l'utilisateur connecté
- `isChecking` (boolean) : True pendant la vérification
- `isAuthenticated` (boolean) : True si l'utilisateur est authentifié

### useHackSequence Hook

Hook pour gérer la séquence d'animation de hack :

```typescript
const { isHacking, hackComplete, startHack, completeHack, resetHack } = useHackSequence();
```

**Retourne :**
- `isHacking` (boolean) : True pendant l'animation
- `hackComplete` (boolean) : True quand l'animation est terminée
- `startHack` (function) : Démarre l'animation
- `completeHack` (function) : Termine l'animation
- `resetHack` (function) : Réinitialise l'état

## Guide de développement

### Ajouter une nouvelle commande

1. Ajouter la commande dans `constants.ts` :
```typescript
COMMANDS: {
  SWAP: "/swap",
  CLEAR: "/clear",
  HELP: "/help",
  MYNEWCOMMAND: "/mynewcommand"  // ← Nouvelle commande
}
```

2. Implémenter dans `translator/page.tsx` :
```typescript
if (userMessage === "/mynewcommand") {
  enqueueMessage({
    type: "zoro",
    text: ">>> ZORO: Nouvelle fonctionnalité !"
  });
  return;
}
```

### Ajouter une nouvelle animation

1. Créer le fichier CSS dans `styles/` :
```css
/* styles/myanimation.css */
@keyframes myAnimation {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.my-animation {
  animation: myAnimation 1s ease;
}
```

2. Importer dans le composant :
```typescript
import "@/styles/myanimation.css";
```

### Modifier les couleurs du thème

Éditer `globals.css` :
```css
:root {
  --color-primary: #00ff00;  /* Vert terminal */
  --color-primary: #00ffff;  /* Changez en cyan par exemple */
}
```

## Remerciements

- Design inspiré par les interfaces terminal rétro et cyberpunk
- [Next.js](https://nextjs.org/) pour le framework performant
- [Vercel](https://vercel.com/) pour l'hébergement gratuit
- [Helsinki-NLP](https://huggingface.co/Helsinki-NLP) pour les modèles de traduction
- Communauté open source pour les retours et suggestions

## Liens utiles

- **Backend du projet** : [GitHub Backend](https://github.com/manalfarouq/Plateforme-de-Traduction-Securisee-Backend.git)
- **API Documentation** : [https://zorohack.onrender.com/docs](https://zorohack.onrender.com/docs)
- **Frontend Production** : [https://zorohack.vercel.app](https://zorohack.vercel.app)
- **Repository Frontend** : [GitHub Frontend](https://github.com/manalfarouq/Plateforme-de-Traduction-Securisee-Frontend.git)

---