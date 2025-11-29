// ===== API SERVICE =====

const API_URL = "http://localhost:8000";

type SignupBody = {
  username: string;
  password: string;
  role: string;
  admin_code?: string;
};

export const apiService = {
  // LOGIN
  async login(username: string, password: string) {
    try {
      const endpoint = `${API_URL}/login/login`;

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

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMsg =
          data.detail ||
          data.message ||
          "Erreur de connexion";

        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  },

  // SIGNUP corrigé
  async signup(username: string, password: string, role: string, adminCode?: string) {
    try {
      const endpoint = `${API_URL}/register/register`;

      const body: SignupBody = {
        username: username.trim(),
        password: password.trim(),
        role: role.trim(),
      };

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

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMsg =
          data.detail ||
          data.message ||
          "Erreur lors de l'inscription";

        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  },

  // TRANSLATE
  async translate(text: string, dir: "FR->EN" | "EN->FR") {
    try {
      const token = localStorage.getItem("token");

      const urlPath = dir === "FR->EN" ? "fr-en" : "en-fr";
      const endpoint = `${API_URL}/traduction/traduire/${urlPath}`;

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

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMsg =
          data.detail ||
          data.message ||
          JSON.stringify(data);

        throw new Error(errorMsg);
      }

      return data.translated_text || data.translation || data.result || text;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  },
};
