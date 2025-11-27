"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES, TIMINGS } from "@/lib/constants";

interface Message {
  type: "user" | "zoro";
  text: string;
}

export default function TranslatorPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [direction, setDirection] = useState<"FR->EN" | "EN->FR">("FR->EN");
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le username depuis localStorage
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        const user = JSON.parse(session);
        setUsername(user.username);
      } catch {
        router.push("/login");
        return;
      }
    } else {
      router.push("/login");
      return;
    }

    setIsInitialized(true);
  }, [router]);

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

  // FONCTION: Appeler l'API de traduction
  const translateText = async (text: string, dir: "FR->EN" | "EN->FR") => {
    try {
      setError(null);

      // CONFIGURATION API
      const API_URL = "http://localhost:8000";
      const token = localStorage.getItem("token");

      // CONSTRUIRE L'URL SELON LA DIRECTION
      const urlPath = dir === "FR->EN" ? "fr-en" : "en-fr";
      const endpoint = `${API_URL}/traduction/traduire/${urlPath}`;

      console.log("URL appelée:", endpoint);
      console.log("Token:", token ? "✓ présent" : "✗ manquant");
      console.log("Texte envoyé:", text.trim());

      // APPEL API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token || "",
        },
        body: JSON.stringify({
          text: text.trim(),
          source_language: dir === "FR->EN" ? "fr" : "en",
          target_language: dir === "FR->EN" ? "en" : "fr"
        }),
      });

      console.log("Status:", response.status);
      console.log("Headers:", response.headers);

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

      // VÉRIFIER STATUS
      if (!response.ok) {
        const errorMsg = data.detail 
          ? (Array.isArray(data.detail) 
              ? JSON.stringify(data.detail, null, 2) 
              : data.detail)
          : data.message || JSON.stringify(data);
        console.error("Erreur API détaillée:", errorMsg);
        throw new Error(errorMsg);
      }

      // RETOURNER LE TEXTE TRADUIT
      const result = data.translated_text || data.translated || data.translation || data.result || text;
      console.log("Traduction réussie:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      setError(errorMessage);
      console.error("Erreur complète:", err);
      return null;
    }
  };

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

    // Appeler la vraie API de traduction
    setIsLoading(true);

    // Afficher "Analyse sémantique"
    setMessages((prev) => [
      ...prev,
      { type: "zoro", text: "zoro: [ANALYSE SÉMANTIQUE...]" },
    ]);

    await new Promise((r) => setTimeout(r, 500));

    // Appeler l'API
    const translation = await translateText(userMessage, direction);

    if (translation && translation !== userMessage) {
      // Afficher la traduction
      const result = `zoro: ${translation}`;
      setMessages((prev) => [...prev, { type: "zoro", text: result }]);
    } else if (!translation) {
      // Erreur
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: `zoro: [ERREUR] ${error || "Impossible de traduire"}`,
        },
      ]);
    } else {
      // Texte identique (pas de traduction)
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: `zoro: [Aucune traduction nécessaire]`,
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleDisconnect = () => {
    const confirmed = window.confirm(MESSAGES.TRANSLATOR.CONFIRM_LOGOUT);
    if (confirmed) {
      localStorage.removeItem("user_session");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push("/");
    }
  };

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