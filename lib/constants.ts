// ===== MESSAGES =====
export const MESSAGES = {
  TRAP_PAGE: {
    TITLE: "Traducteur Français-Anglais",
    SUBTITLE: "Traduisez vos textes rapidement",
    LABEL: "Texte à traduire :",
    PLACEHOLDER: "Entrez votre texte...",
    BUTTON: "Commencer la traduction",
    ERROR: "Veuillez entrer un texte",
  },

  ALERT: {
    TITLE: ">>> SIGNAL DÉTECTÉ",
    TEXT1: ">>> Source: [INCONNU]",
    TEXT2: '>>> "Je peux vous aider..."',
    QUESTION: ">>> Accepter la connexion ?",
    NO: "Non",
    YES: "Oui",
  },

  HACK_SEQUENCE: [
    "INITIALISATION...",
    "CONNEXION AU NŒUD PRINCIPAL...",
    "IP LOCAL: [GENERÉ]",
    "PROTOCOLE ZORO ACTIVÉ...",
    "LOCALISATION: [GÉNÉRÉ]",
    "ACCÈS ACCORDÉ",
    "SYSTÈME LANCÉ",
  ],

  TERMINAL: {
    HEADER_STATUS: "◉ zoroTranslator",
    // Fonction pour générer le header avec le username
    getHeaderUser: (username?: string) => {
      const user = username || getCurrentUsername();
      return `User: ${user.toUpperCase()} | Status: CONNECTED`;
    },
    SYSTEM_V1: ">>> SYSTÈME DE TRADUCTION SECURISE v2.47",
    SYSTEM_V2: ">>> Alimenté par M A N A L",
    ZORO_WELCOME: ">>> Bienvenue, utilisateur.",
    ZORO_AI: ">>> Je suis ZORO, une intelligence de traduction du futur.",
  },

  ZORO_TUTORIAL: [
    ">>> ZORO: Première fois ici ? Laisse-moi t'expliquer.",
    ">>> ZORO: J'intercepte tes mots en français et les transforme en anglais.",
    ">>> ZORO: Tape simplement ta phrase et appuie sur ENTER.",
    ">>> ZORO: Tu peux aussi utiliser /swap pour inverser la direction.",
    ">>> ZORO: Prêt ? Commence à écrire!",
  ],

  LOGIN: {
    TITLE: ">>> AUTHENTIFICATION REQUISE",
    USERNAME: ">>> Username :",
    PASSWORD: ">>> Password :",
    BUTTON: "CONNEXION",
    ERROR: "Identifiants incorrects",
  },

  SIGNUP: {
    TITLE: ">>> CRÉER NOUVEAU PROFIL",
    USERNAME: ">>> Nom d'utilisateur :",
    EMAIL: ">>> Email (optionnel) :",
    PASSWORD: ">>> Mot de passe :",
    CONFIRM: ">>> Confirmation :",
    ROLE: ">>> Role :",
    BUTTON: "CRÉER PROFIL",
    ERROR: "Erreur lors de la création du profil",
    SUCCESS: ">>> PROFIL CRÉÉ. CONNEXION AUTOMATIQUE...",
  },

  TRANSLATOR: {
    TITLE: ">>> ZORO v2.47 | FR→EN",
    ANALYZING: ">>> ZORO: [ANALYSE SÉMANTIQUE...]",
    TRANSLATING: ">>> ZORO: [TRADUCTION EN COURS...]",
    DISCONNECT: "◉ DÉCONNECTER",
    CONFIRM_LOGOUT: "ZORO: \"Tu es sûr de vouloir partir ?\"",
  },

  COMMANDS: {
    SWAP: "/swap",
    CLEAR: "/clear",
    HELP: "/help",
    EXIT: "/exit",
  },

  // ===== EASTER EGGS =====
  EASTER_EGGS: [
    ">>> SATELLITE 7 CONNECTÉ",
    ">>> TRADUCTIONS EFFECTUÉES: 847",
    ">>> BATTERIE IA: [████████░░] 82%",
    ">>> MODE PHANTOM ACTIVÉ",
    ">>> QUANTUM FLUX DÉTECTÉ",
    ">>> SYNC CHRONOMETRIQUE ÉTABLI",
    ">>> RÉSEAU SHADOWNET OPÉRATIONNEL",
  ],
};

// ===== TIMINGS (en ms) =====
export const TIMINGS = {
  MICRO_GLITCH: 2000,
  HACK_SEQUENCE_START: 0,
  HACK_SCREEN_SHAKE: 100,
  HACK_RGB_GLITCH: 300,
  HACK_BLACK_SCREEN: 500,
  HACK_CODE_SCROLL: 1000,
  HACK_SCANLINES: 2000,
  HACK_ACCESS_GRANTED: 3000,
  HACK_PROGRESS_BAR: 3500,
  HACK_ZOOM_TRANSITION: 4000,
  HACK_REVEAL: 5000,
  HACK_TOTAL: 5500,
  TYPING_DELAY: 50,
  MESSAGE_DELAY: 800,
};

// ===== COLORS =====
export const COLORS = {
  PRIMARY_GREEN: "#00ff00",
  DARK_GREEN: "#00cc00",
  BACKGROUND_BLACK: "#000000",
  BACKGROUND_LIGHT: "#ffffff",
  GLITCH_MAGENTA: "#ff00ff",
  GLITCH_CYAN: "#00ffff",
  BORDER_GREEN: "#00ff00",
  TEXT_GRAY: "#666666",
  TEXT_DARK: "#333333",
};

// ===== ROUTES =====
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  TRANSLATOR: "/translator",
};

// ===== STORAGE KEYS =====
export const STORAGE_KEYS = {
  USER_SESSION: "user_session",
  HACK_WATCHED: "hack_sequence_watched",
  USERNAME: "current_username",
  TOKEN: "token",
};

// ===== HELPER FUNCTIONS =====
export function getRandomEasterEgg(): string {
  return MESSAGES.EASTER_EGGS[Math.floor(Math.random() * MESSAGES.EASTER_EGGS.length)];
}

// Helper pour récupérer le username actuel
export function getCurrentUsername(): string {
  if (typeof window === "undefined") return "GUEST_1337";
  
  try {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (session) {
      const user = JSON.parse(session);
      return user.username || "GUEST_1337";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du username:", error);
  }
  
  return "GUEST_1337";
}