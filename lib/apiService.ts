// ===== API SERVICE =====
// CORRECTION: Centraliser tous les appels API pour éviter la répétition

// ✅ MODIFIÉ: Utiliser la variable d'environnement avec fallback vers Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://zorohack.onrender.com";

export const apiService = {
  // ✅ LOGIN
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

  // ✅ SIGNUP - CORRIGÉ: Accepte maintenant admin_code
  async signup(username: string, password: string, role: string, adminCode?: string) {
    try {
      const endpoint = `${API_URL}/register/register`;

      console.log("API: Appel signup");
      console.log("URL:", endpoint);
      console.log("Données envoyées:", { 
        username: username.trim(), 
        password: "[HIDDEN]", 
        role: role.trim(),
        admin_code: adminCode ? "[HIDDEN]" : "[NON FOURNI]"
      });
      
      interface SignupBody {
        username: string;
        password: string;
        role: string;
        admin_code?: string;
      }
      
      const body: SignupBody = {
        username: username.trim(),
        password: password.trim(),
        role: role.trim(),
      };

      // ✅ AJOUTER le code admin si fourni
      if (adminCode) {
        body.admin_code = adminCode;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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

  // ✅ TRANSLATE
  async translate(text: string, dir: "FR->EN" | "EN->FR") {
    try {
      const token = localStorage.getItem("token");

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

      const result = data.translated_text || data.translated || data.translation || data.result || text;
      console.log("Traduction réussie:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("Erreur traduction:", err);
      throw new Error(errorMessage);
    }
  },

   // ✅ GET ALL USERS (ADMIN ONLY)
  async getAllUsers() {
    try {
      const token = localStorage.getItem("token");
      const endpoint = `${API_URL}/admin/users`;

      console.log("API: Appel getAllUsers");
      console.log("URL:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token || "",
        },
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
        const errorMsg = data.detail || data.message || "Erreur lors de la récupération des users";
        console.error("Erreur API:", errorMsg);
        throw new Error(errorMsg);
      }

      return data.users || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("Erreur getAllUsers:", err);
      throw new Error(errorMessage);
    }
  } 
};