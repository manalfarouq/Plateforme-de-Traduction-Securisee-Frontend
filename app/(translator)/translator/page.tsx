"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";
import { apiService } from "@/lib/apiService";
import { useAuth } from "@/hooks/useAuth";
import TypewriterLine from "@/components/ui/TypewriterLine";

interface Message {
  type: "user" | "zoro";
  text: string;
}

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

// Fonction utilitaire pour formater une ligne utilisateur en texte terminal
const formatUserLine = (user: User | null, isHeader: boolean = false) => {
  if (isHeader) {
    return "ID     | USERNAME               | ROLE   | DATE CRÉATION";
  }
  if (!user) return "";
  const id = String(user.id).padEnd(6, " ");
  const username = user.username.padEnd(22, " ");
  const role = user.role.toUpperCase().padEnd(6, " ");
  const createdAt = new Date(user.created_at).toLocaleString("fr-FR");
  return `${id}\u2502 ${username}\u2502 ${role}\u2502 ${createdAt}`;
};

export default function TranslatorPage() {
  const router = useRouter();
  const { username, isChecking, isAuthenticated } = useAuth();

  const [messagesQueue, setMessagesQueue] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState<"FR->EN" | "EN->FR">("FR->EN");
  const [error, setError] = useState<string | null>(null);
  const [initializedMessagesCount, setInitializedMessagesCount] = useState(0);

  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [animatedUserIndex, setAnimatedUserIndex] = useState(-1); 
  const [animatedUserLines, setAnimatedUserLines] = useState<string[]>([]); 
  const [titleAnimationFinished, setTitleAnimationFinished] = useState(false);
  const [showReturnButton, setShowReturnButton] = useState(false); // NOUVEAU

  useEffect(() => {
    if (isChecking) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      const session = localStorage.getItem("user_session");
      if (session) {
        const user = JSON.parse(session);
        setUserRole(user.role || "user");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle:", error);
    }
  }, [isChecking, isAuthenticated, router]);

  const isTutorialFinished = initializedMessagesCount >= MESSAGES.ZORO_TUTORIAL.length;

  const advanceTutorial = useCallback(() => {
    setInitializedMessagesCount((prev) => prev + 1);
  }, []);

  const enqueueMessage = (msg: Message) => {
    setMessagesQueue((prev) => [...prev, msg]);
  };

  useEffect(() => {
    if (!currentMessage && messagesQueue.length > 0) {
      const [next, ...rest] = messagesQueue;
      setCurrentMessage(next);
      setMessagesQueue(rest);
    }
  }, [currentMessage, messagesQueue]);

  const advanceUserAnimation = useCallback(() => {
    setAnimatedUserIndex((prev) => {
      const nextIndex = prev + 1;
      const totalLines = users.length + 1;
      
      // NOUVEAU: Afficher le bouton quand on arrive à la dernière ligne
      if (nextIndex >= totalLines) {
        setTimeout(() => setShowReturnButton(true), 100);
      }
      
      return nextIndex;
    });
  }, [users.length]);

  const addUserLineToDisplay = useCallback((line: string) => {
    setAnimatedUserLines((prev) => [...prev, line]);
  }, []);

  const currentUserLineToAnimate = useMemo(() => {
    if (!showUserList || users.length === 0 || animatedUserIndex < 0) return null;
    if (animatedUserIndex === 0) return formatUserLine(null, true);
    if (animatedUserIndex > 0 && animatedUserIndex <= users.length)
      return formatUserLine(users[animatedUserIndex - 1]);
    
    // Si on a fini toutes les lignes, afficher le bouton
    if (animatedUserIndex > users.length && !showReturnButton) {
      setTimeout(() => setShowReturnButton(true), 100);
    }
    
    return null;
  }, [animatedUserIndex, showUserList, users, showReturnButton]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    setShowUserList(false);
    setUsers([]);
    setAnimatedUserIndex(-1);
    setAnimatedUserLines([]);
    setTitleAnimationFinished(false);
    setShowReturnButton(false); // NOUVEAU: Réinitialiser le bouton

    enqueueMessage({ type: "user", text: `> ${username.toUpperCase()}: ${userMessage}` });

    // COMMANDE /users ou /admin
    if (userMessage === "/users" || userMessage === "/admin") {
      if (userRole !== "admin") {
        enqueueMessage({
          type: "zoro",
          text: ">>> ZORO: [ACCÈS REFUSÉ] Cette commande nécessite les privilèges administrateur.",
        });
        return;
      }

      setIsLoading(true);
      setMessagesQueue([]);
      setDisplayedMessages([]);
      setCurrentMessage(null);

      enqueueMessage({ type: "zoro", text: ">>> ZORO: [ACCÈS BASE DE DONNÉES...]" });
      await new Promise((r) => setTimeout(r, 800));

      try {
        const allUsers = await apiService.getAllUsers();
        setUsers(allUsers);
        setShowUserList(true);
        setTitleAnimationFinished(false);
        
        enqueueMessage({ 
          type: "zoro", 
          text: `>>> ZORO: ${allUsers.length} utilisateur(s) trouvé(s).` 
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Impossible d'accéder à la base";
        setError(errorMsg);
        enqueueMessage({ type: "zoro", text: `>>> ZORO: [ERREUR] ${errorMsg}` });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // COMMANDE /swap
    if (userMessage === "/swap") {
      const newDirection = direction === "FR->EN" ? "EN->FR" : "FR->EN";
      setDirection(newDirection);
      enqueueMessage({
        type: "zoro",
        text: `>>> ZORO: Direction changée vers ${newDirection}`,
      });
      return;
    }

    // COMMANDE /clear
    if (userMessage === "/clear") {
      setMessagesQueue([]);
      setDisplayedMessages([]);
      setCurrentMessage(null);
      enqueueMessage({
        type: "zoro",
        text: ">>> ZORO: Conversation effacée.",
      });
      return;
    }

    // COMMANDE /help
    if (userMessage === "/help") {
      const helpText = userRole === "admin"
        ? ">>> ZORO: Commandes: /swap (changer direction) | /clear (effacer) | /users (liste utilisateurs) | /help (aide)"
        : ">>> ZORO: Commandes: /swap (changer direction) | /clear (effacer) | /help (aide)";
      
      enqueueMessage({
        type: "zoro",
        text: helpText,
      });
      return;
    }

    // TRADUCTION
    setIsLoading(true);
    try {
      const translation = await apiService.translate(userMessage, direction);
      enqueueMessage({
        type: "zoro",
        text: `>>> ZORO: ${translation}`,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur de traduction";
      setError(errorMsg);
      enqueueMessage({
        type: "zoro",
        text: `>>> ZORO: [ERREUR] ${errorMsg}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm(MESSAGES.TRANSLATOR.CONFIRM_LOGOUT)) {
      localStorage.removeItem("user_session");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isAuthenticated");
      router.push("/");
    }
  };

  const handleReturnToTranslator = () => {
    setShowUserList(false);
    setUsers([]);
    setAnimatedUserIndex(-1);
    setAnimatedUserLines([]);
    setTitleAnimationFinished(false);
    setShowReturnButton(false);
    setMessagesQueue([]);
    setDisplayedMessages([]);
    setCurrentMessage(null);
  };

  return (
    <>
      {/* Info de direction et role */}
      <div className="terminal-line" style={{ marginBottom: "15px" }}>
        <span style={{ color: "#00ffff", fontWeight: "600" }}>
          ▸ Mode: {direction}
        </span>
        {userRole === "admin" && (
          <span style={{ color: "#ff00ff", marginLeft: "20px", fontWeight: "600" }}>
            ● ADMIN ACCESS GRANTED
          </span>
        )}
      </div>

      {error && (
        <div className="terminal-error">
          ⚠ Erreur: {error}
        </div>
      )}

      <div style={{ marginTop: "20px", flexGrow: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: showUserList ? "center" : "flex-start" }}>
        
        {!showUserList && (
          <>
            {MESSAGES.ZORO_TUTORIAL.slice(0, initializedMessagesCount).map((msg, idx) => (
              <div key={`tut-done-${idx}`} className="terminal-line zoro">
                {msg}
              </div>
            ))}

            {!isTutorialFinished && (
              <TypewriterLine
                key={`tut-${initializedMessagesCount}`}
                text={MESSAGES.ZORO_TUTORIAL[initializedMessagesCount]}
                delay={0}
                className="zoro"
                onComplete={advanceTutorial}
              />
            )}
            
            {displayedMessages.map((msg, idx) => (
              <div key={`disp-${idx}`} className={`terminal-line ${msg.type === "zoro" ? "zoro" : ""}`}>
                {msg.text}
              </div>
            ))}

            {currentMessage && (
              <TypewriterLine
                key={currentMessage.text + Math.random()}
                text={currentMessage.text}
                delay={0}
                className={currentMessage.type === "zoro" ? "zoro" : ""}
                onComplete={() => {
                  setDisplayedMessages((prev) => [...prev, currentMessage]);
                  setCurrentMessage(null);
                }}
              />
            )}
          </>
        )}

        {showUserList && users.length > 0 && (
          <div className="db-list-container">
            <div className="db-title-animated">
              <TypewriterLine
                text="┌─────────────────────────────────────────────┐"
                delay={0}
                className="db-border"
              />
              <TypewriterLine
                text="│ BASE DE DONNÉES - UTILISATEURS ENREGISTRÉS │"
                delay={800}
                className="db-title"
              />
              <TypewriterLine
                text="└─────────────────────────────────────────────┘"
                delay={1600}
                className="db-border"
                onComplete={() => {
                  setTitleAnimationFinished(true);
                  setAnimatedUserIndex(0);
                }}
              />
            </div>

            {titleAnimationFinished && (
              <div style={{ marginTop: "15px", width: "100%" }}>
                {animatedUserLines.map((line, idx) => (
                  <div
                    key={`user-line-${idx}`}
                    className="terminal-line user-data"
                    style={{
                      color: line.includes("ADMIN") ? "#ff00ff" : "#00ff00",
                      whiteSpace: "pre",
                      textAlign: "center",
                    }}
                  >
                    {line}
                  </div>
                ))}

                {currentUserLineToAnimate &&
                  !animatedUserLines.includes(currentUserLineToAnimate) && (
                    <TypewriterLine
                      key={`animate-user-${animatedUserIndex}`}
                      text={currentUserLineToAnimate}
                      delay={0}
                      className={
                        currentUserLineToAnimate.includes("ROLE") ||
                        currentUserLineToAnimate.includes("ADMIN")
                          ? "user-data admin-role"
                          : "user-data"
                      }
                      onComplete={() => {
                        addUserLineToDisplay(currentUserLineToAnimate);
                        advanceUserAnimation();
                      }}
                    />
                  )}
              </div>
            )}

            {/* NOUVEAU: Le bouton reste visible une fois affiché */}
            {showReturnButton && (
              <button
                onClick={handleReturnToTranslator}
                className="terminal-button db-return-btn"
                style={{
                  position: "relative",
                  zIndex: 100
                }}
              >
                ← RETOUR AU TRADUCTEUR
              </button>
            )}
          </div>
        )}
      </div>

      {!showUserList && (
        <>
          <form onSubmit={handleSubmit} className="terminal-input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Entrez votre texte..."
              disabled={isLoading || !isTutorialFinished}
              autoFocus
            />
          </form>

          <div className="terminal-footer-status">
            {userRole === "admin" 
              ? "Commandes: /swap /clear /users /help | Status: " 
              : "Commandes: /swap /clear /help | Status: "}
            <span style={{ color: isLoading ? "#ffff00" : "#00ffff" }}>
              {isLoading ? "⟳ Traitement..." : "✓ Prêt"}
            </span>
          </div>

          <button
            className="disconnect-btn"
            onClick={handleDisconnect}
            disabled={!isTutorialFinished}
          >
            {MESSAGES.TRANSLATOR.DISCONNECT}
          </button>
        </>
      )}
    </>
  );
}