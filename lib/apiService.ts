// ===== API SERVICE =====
// CORRECTION: Centraliser tous les appels API pour éviter la répétition
// Avantage: 
// - URL API au même endroit
// - Headers configurés une fois
// - Parsing/validation centralisée
// - Facile à modifier l'API_URL en production

const API_URL = "http://localhost:8000";

export const apiService = {
  // ✅ LOGIN - Centralisé depuis LoginForm
  async login(username: string, password: string) {
    try {
      const endpoint = `${API_URL}/login/login`;

      console.log("API: Appel login");
      console.log("URL:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      console.log("Status:", response.status);

      // Lire la réponse en tant que texte d'abord
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      // Tenter de parser en JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Réponse JSON:", data);
      } catch (parseError) {
        console.error("Impossible de parser JSON:", parseError);
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      // Vérifier le status
      if (!response.ok) {
        const errorMsg = data.detail
          ? Array.isArray(data.detail)
            ? JSON.stringify(data.detail, null, 2)
            : data.detail
          : data.message || "Erreur de connexion";
        console.error("Erreur API:", errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Erreur login:", err);
      throw new Error(errorMessage);
    }
  },

  // ✅ SIGNUP - Centralisé depuis SignupForm
  async signup(username: string, password: string, role: string) {
    try {
      const endpoint = `${API_URL}/register/register`;

      console.log("API: Appel signup");
      console.log("URL:", endpoint);
      console.log("Données envoyées:", { 
        username: username.trim(), 
        password: "[HIDDEN]", 
        role: role.trim() 
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role: role.trim(),
        }),
      });

      console.log("Status:", response.status);

      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Réponse JSON:", data);
      } catch (parseError) {
        console.error("Impossible de parser JSON:", parseError);
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMsg = data.detail
          ? Array.isArray(data.detail)
            ? JSON.stringify(data.detail, null, 2)
            : data.detail
          : data.message || "Erreur lors de l'inscription";
        console.error("Erreur API:", errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Erreur signup:", err);
      throw new Error(errorMessage);
    }
  },

  // ✅ TRANSLATE - Centralisé depuis TranslatorPage
  async translate(text: string, dir: "FR->EN" | "EN->FR") {
    try {
      const token = localStorage.getItem("token");

      // Construire l'URL selon la direction
      const urlPath = dir === "FR->EN" ? "fr-en" : "en-fr";
      const endpoint = `${API_URL}/traduction/traduire/${urlPath}`;

      console.log("API: Appel traduction");
      console.log("URL appelée:", endpoint);
      console.log("Token:", token ? "✓ présent" : "✗ manquant");
      console.log("Texte envoyé:", text.trim());

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token || "",
        },
        body: JSON.stringify({
          text: text.trim(),
          source_language: dir === "FR->EN" ? "fr" : "en",
          target_language: dir === "FR->EN" ? "en" : "fr",
        }),
      });

      console.log("Status:", response.status);
      console.log("Headers:", response.headers);

      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Réponse JSON:", data);
      } catch (parseError) {
        console.error("Impossible de parser JSON:", parseError);
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMsg = data.detail
          ? Array.isArray(data.detail)
            ? JSON.stringify(data.detail, null, 2)
            : data.detail
          : data.message || JSON.stringify(data);
        console.error("Erreur API détaillée:", errorMsg);
        throw new Error(errorMsg);
      }

      // Retourner le texte traduit
      const result = data.translated_text || data.translated || data.translation || data.result || text;
      console.log("Traduction réussie:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("Erreur traduction:", err);
      throw new Error(errorMessage);
    }
  },
};