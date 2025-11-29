// ===== HOOK: useAuth =====
// CORRECTION: Centraliser la logique d'authentification
// Avant: Était dans TranslatorPage + AuthLayout (dupliqué)
// Après: Un seul endroit, réutilisable partout
// Avantage: Pas de duplication, maintenance facile

import { useEffect, useState } from "react";

export function useAuth() {
  // États pour tracker l'authentification
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(true); // Pendant la vérification
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification au montage du composant
    const verifyAuth = () => {
      const session = localStorage.getItem("user_session");
      const token = localStorage.getItem("token");

      // Si pas de session ou token, pas authentifié
      if (!session || !token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      // Essayer de parser la session
      try {
        const user = JSON.parse(session);
        setUsername(user.username);
        setIsAuthenticated(true);
      } catch {
        // Si parse échoue, pas authentifié
        setIsAuthenticated(false);
      }

      setIsChecking(false); // Fin de la vérification
    };

    verifyAuth();
  }, []);

  return {
    username,
    isChecking, // À utiliser pour afficher un loading screen
    isAuthenticated, // À utiliser pour les redirections
  };
}