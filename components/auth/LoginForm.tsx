"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";

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
      // CONFIGURATION API
      const API_URL = "http://localhost:8000";

      // APPEL API
      const response = await fetch(`${API_URL}/login/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      // PARSING RÉPONSE
      const data = await response.json();

      // VÉRIFIER STATUS
      if (!response.ok) {
        throw new Error(data.detail || data.message || "Erreur de connexion");
      }

      // SUCCÈS - SAUVEGARDER TOKEN
      localStorage.setItem("token", data.token || data.access_token);
      localStorage.setItem("username", username);
      localStorage.setItem("user_session", JSON.stringify({ username }));

      setSuccess(true);

      // REDIRECTION
      setTimeout(() => {
        router.push("/translator");
      }, 1000);
    } catch (err) {
      // GESTION ERREUR
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