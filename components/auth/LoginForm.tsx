"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";
import { apiService } from "@/lib/apiService";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    // VALIDATION
    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiService.login(username, password);

      // Sauvegarder TOKEN + USERNAME + ROLE
      localStorage.setItem("token", data.token || data.access_token);
      localStorage.setItem("username", username);
      
      // AJOUTER le role dans user_session
      localStorage.setItem("user_session", JSON.stringify({ 
        username, 
        role: data.role || "user" // ← NOUVEAU: Récupérer le role depuis l'API
      }));
      
      localStorage.setItem("isAuthenticated", "true");

      setSuccess(true);

      setTimeout(() => {
        router.push("/translator");
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Erreur login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="terminal-form">
        <div className="terminal-line" style={{ color: "var(--color-primary)" }}>
          Connexion réussie ! Redirection...
        </div>
      </div>
    );
  }

  return (
  <div className="terminal-form">
    <div className="terminal-line">{MESSAGES.LOGIN.TITLE}</div>

    <form onSubmit={handleSubmit} className="terminal-form">
      <div style={{ marginTop: "20px" }}>
        <div className="terminal-form-group">
          <label>{MESSAGES.LOGIN.USERNAME}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ex: user_1337"
            disabled={isLoading}
          />
        </div>

        <div className="terminal-form-group">
          <label>{MESSAGES.LOGIN.PASSWORD}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {error && <div className="terminal-error">{error}</div>}

        <button
          type="submit"
          className="terminal-button"
          disabled={isLoading}
        >
          {isLoading ? "CONNEXION EN COURS..." : MESSAGES.LOGIN.BUTTON}
        </button>

        <div style={{ marginTop: "15px", fontSize: "12px" }}>
          <a
            href="/signup"
            style={{
              color: "var(--color-primary)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Créer un compte
          </a>
        </div>
      </div>
    </form>
  </div>
);
}
