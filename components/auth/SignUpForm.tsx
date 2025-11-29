"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";
import { apiService } from "@/lib/apiService";

const ADMIN_CODE = "2480"; // Code admin secret

export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adminCode, setAdminCode] = useState(""); // ← Nouveau champ
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    // VALIDATION
    if (!username.trim() || !role.trim() || !password.trim() || !confirm.trim()) {
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

    // Vérifier le code admin si role === "admin"
    if (role === "admin" && adminCode !== ADMIN_CODE) {
      setError("Code admin incorrect");
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiService.signup(username, password, role, adminCode);

      // SUCCÈS - SAUVEGARDER TOKEN
      if (data.token || data.access_token) {
        localStorage.setItem("token", data.token || data.access_token);
      }
      localStorage.setItem("username", username);
      localStorage.setItem("user_session", JSON.stringify({ username, role })); // ← Sauvegarder role
      localStorage.setItem("isAuthenticated", "true");

      setSuccess(true);

      setTimeout(() => {
        router.push("/translator");
      }, 500);
    } catch (err) {
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
              onChange={(e) => setRole(e.target.value.toLowerCase())} // Force lowercase
              placeholder="ex : user/admin"
              disabled={isLoading}
            />
          </div>

          {/* Afficher le champ adminCode seulement si role === "admin" */}
          {role === "admin" && (
            <div className="terminal-form-group">
              <label>{">>>> Code Admin :"}</label>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Code 2480..."
                disabled={isLoading}
              />
            </div>
          )}

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
              j&apos;ai déjà un compte
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}