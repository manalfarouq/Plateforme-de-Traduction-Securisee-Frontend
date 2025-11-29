"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES, TIMINGS } from "@/lib/constants";
import { apiService } from "@/lib/apiService"; // ✅ CORRECTION: Utiliser le service centralisé
import { useAuth } from "@/hooks/useAuth"; // ✅ CORRECTION: Utiliser le hook centralisé

interface Message {
  type: "user" | "zoro";
  text: string;
}

export default function TranslatorPage() {
  const router = useRouter();
  
  // ✅ CORRECTION: Utiliser le hook useAuth au lieu de faire la vérif ici
  const { username, isChecking, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState<"FR->EN" | "EN->FR">("FR->EN");
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ CORRECTION: Vérifier l'authentification et rediriger si nécessaire
  useEffect(() => {
    if (isChecking) return; // Attendre la fin de la vérification

    if (!isAuthenticated) {
      router.push("/login"); // Rediriger si pas authentifié
      return;
    }

    setIsInitialized(true); // On peut afficher le contenu
  }, [isChecking, isAuthenticated, router]);

  // Afficher le tutoriel quand initialisé
  useEffect(() => {
    if (!isInitialized) return;

    const tutorial = async () => {
      for (const msg of MESSAGES.ZORO_TUTORIAL) {
        await new Promise((r) => setTimeout(r, TIMINGS.MESSAGE_DELAY));
        setMessages((prev) => [...prev, { type: "zoro", text: msg }]);
      }
    };

    tutorial();
  }, [isInitialized]);

  // ✅ CORRECTION: Utiliser le service API centralisé
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Ajouter le message utilisateur
    setMessages((prev) => [...prev, { type: "user", text: `> user: ${userMessage}` }]);

    // Gestion des commandes spéciales
    if (userMessage === "/swap") {
      const newDirection = direction === "FR->EN" ? "EN->FR" : "FR->EN";
      setDirection(newDirection);
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: `[MODE INVERSÉ: ${newDirection}]`,
        },
      ]);
      return;
    }

    if (userMessage === "/clear") {
      setMessages([]);
      return;
    }

    if (userMessage === "/help") {
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: "Commandes: /swap (inverser) | /clear (effacer) | /help (aide)",
        },
      ]);
      return;
    }

    // Appeler la traduction
    setIsLoading(true);

    // Afficher "Analyse sémantique"
    setMessages((prev) => [
      ...prev,
      { type: "zoro", text: "zoro: [ANALYSE SÉMANTIQUE...]" },
    ]);

    await new Promise((r) => setTimeout(r, 500));

    try {
      // ✅ CORRECTION: Utiliser le service API centralisé
      const translation = await apiService.translate(userMessage, direction);

      if (translation && translation !== userMessage) {
        // Afficher la traduction
        const result = `zoro: ${translation}`;
        setMessages((prev) => [...prev, { type: "zoro", text: result }]);
      } else if (translation === userMessage) {
        // Texte identique (pas de traduction)
        setMessages((prev) => [
          ...prev,
          {
            type: "zoro",
            text: `zoro: [Aucune traduction nécessaire]`,
          },
        ]);
      }
    } catch (err) {
      // Erreur
      const errorMsg = err instanceof Error ? err.message : "Impossible de traduire";
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: `zoro: [ERREUR] ${errorMsg}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    const confirmed = window.confirm(MESSAGES.TRANSLATOR.CONFIRM_LOGOUT);
    if (confirmed) {
      localStorage.removeItem("user_session");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isAuthenticated");
      router.push("/");
    }
  };

  // ✅ CORRECTION: Afficher loading screen pendant la vérification
  if (isChecking) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="terminal-line" style={{ animation: "blink 1s infinite" }}>
          INITIALISATION...
        </div>
      </div>
    );
  }

  // Si pas authentifié, ne pas afficher (la redirection est en cours)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="terminal-line">
        zoro v2.47 | {direction} | User: {username}
      </div>

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ff6b6b",
            borderRadius: "3px",
            fontSize: "12px",
          }}
        >
          Erreur: {error}
        </div>
      )}

      <div style={{ marginTop: "20px", flexGrow: 1, overflow: "auto" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`terminal-line ${msg.type === "zoro" ? "zoro" : ""}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="terminal-input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Entrez votre texte..."
          disabled={isLoading}
          autoFocus
        />
      </form>

      <div style={{ fontSize: "12px", marginTop: "10px", opacity: 0.7 }}>
        Commandes: /swap /clear /help | Status: {isLoading ? "Traduction..." : "Prêt"}
      </div>

      <button className="disconnect-btn" onClick={handleDisconnect}>
        {MESSAGES.TRANSLATOR.DISCONNECT}
      </button>
    </>
  );
}