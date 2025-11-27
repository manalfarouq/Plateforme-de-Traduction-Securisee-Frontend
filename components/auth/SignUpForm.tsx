"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";

export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    // VALIDATION
    if (!username.trim() || !role.trim() ||!password.trim() || !confirm.trim()) {
      setError("Tous les champs sont requis");
      setIsLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (password.length < 4) {
      setError("Le mot de passe doit contenir au moins 4 caractères");
      setIsLoading(false);
      return;
    }

    if (role !== "user" && role !== "admin") {
      setError("Le role doit être user/admin");
      setIsLoading(false);
      return;
    }


    try {
      // CONFIGURATION API
      const API_URL = 'http://localhost:8000';

      console.log("URL appelée:", `${API_URL}/register/register`);
      console.log("Données envoyées:", { username: username.trim(), password: "[HIDDEN]" , role: role.trim()});

      // APPEL API
      const response = await fetch(`${API_URL}/register/register`, {
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


      // Lire la réponse en tant que texte d'abord
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      // PARSING RÉPONSE
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Réponse JSON:", data);
      } catch (parseError) {
        console.error("Impossible de parser JSON:", parseError);
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      // VÉRIFIER STATUS
      if (!response.ok) {
        const errorMsg = data.detail 
          ? (Array.isArray(data.detail) 
              ? JSON.stringify(data.detail, null, 2) 
              : data.detail)
          : data.message || "Erreur lors de l'inscription";
        console.error("Erreur API détaillée:", errorMsg);
        throw new Error(errorMsg);
      }

      // SUCCÈS - SAUVEGARDER TOKEN (si l'API retourne un token)
      if (data.token || data.access_token) {
        localStorage.setItem("token", data.token || data.access_token);
      }
      localStorage.setItem("username", username);
      localStorage.setItem("user_session", JSON.stringify({ username }));

      setSuccess(true);

      // REDIRECTION
      setTimeout(() => {
        router.push("/translator");
      }, 1500);
    } catch (err) {
      // GESTION ERREUR
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Erreur signup:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="terminal-form">
        <div className="terminal-line" style={{ color: "var(--color-primary)" }}>
          {MESSAGES.SIGNUP.SUCCESS}
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-form">
      <div className="terminal-line">{MESSAGES.SIGNUP.TITLE}</div>

      <form onSubmit={handleSubmit} className="terminal-form">
        <div style={{ marginTop: "20px" }}>
          <div className="terminal-form-group">
            <label>{MESSAGES.SIGNUP.USERNAME}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: user_1337"
              disabled={isLoading}
            />
          </div>

          <div className="terminal-form-group">
            <label>{MESSAGES.SIGNUP.PASSWORD}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          

          <div className="terminal-form-group">
            <label>{MESSAGES.SIGNUP.CONFIRM}</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <div className="terminal-form-group">
            <label>{MESSAGES.SIGNUP.ROLE}</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ex : user/admin"
              disabled={isLoading}
            />
          </div>

          {error && <div className="terminal-error">{error}</div>}

          <button
            type="submit"
            className="terminal-button"
            disabled={isLoading}
          >
            {isLoading ? "CRÉATION..." : MESSAGES.SIGNUP.BUTTON}
          </button>

          <div style={{ marginTop: "15px", fontSize: "12px" }}>
            <a
              href="/login"
              style={{
                color: "var(--color-primary)",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              jai déjà un compte
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}