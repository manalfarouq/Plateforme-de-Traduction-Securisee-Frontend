"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";

export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      setError("Tous les champs sont requis");
      setIsLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    // Simuler la création du profil
    setTimeout(() => {
      setSuccess(true);
      localStorage.setItem("user_session", JSON.stringify({ username }));

      setTimeout(() => {
        router.push("/translator");
      }, 1500);
    }, 1000);
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

          {/* <div className="terminal-form-group">
            <label>{MESSAGES.SIGNUP.EMAIL}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              disabled={isLoading}
            />
          </div> */}

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

          {error && <div className="terminal-error"> {error}</div>}

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
                Jai déjà un compte
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}