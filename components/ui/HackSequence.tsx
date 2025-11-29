"use client";

import { useEffect, useState } from "react";
import "@/styles/hack-sequence.css";

interface HackSequenceProps {
  isActive: boolean;
  onComplete: () => void;
}

type HackPhase = "idle" | "shake" | "glitch" | "black" | "code" | "scanlines" | "complete";

export default function HackSequence({ isActive, onComplete }: HackSequenceProps) {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<HackPhase>("idle");
  const [progress, setProgress] = useState(0);

  // Générer une adresse IP aléatoire
  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  };

  // Générer un hash aléatoire
  const generateRandomHash = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  };

  // Générer des coordonnées GPS fictives
  const generateRandomGPS = () => {
    const lat = (Math.random() * 180 - 90).toFixed(4);
    const lon = (Math.random() * 360 - 180).toFixed(4);
    return `${lat}, ${lon}`;
  };

  useEffect(() => {
    if (!isActive) return;

    let textIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const fullSequence = [
      "INITIALISATION...",
      "CONNEXION AU NŒUD PRINCIPAL...",
      `IP LOCAL: ${generateRandomIP()}`,
      "PROTOCOLE ZERO ACTIVÉ...",
      `DATE/HEURE: ${new Date().toLocaleString("fr-FR")}`,
      `FINGERPRINT: ${generateRandomHash()}`,
      `LOCALISATION: ${generateRandomGPS()}`,
      "ACCÈS ACCORDÉ",
      "SYSTÈME LANCÉ",
    ];

    interface PhaseTimeline {
      phase: HackPhase;
      duration: number;
    }

    // J'ai rétabli ici la durée courte du glitch original (phase 2) car il n'y a plus de gros texte à lire.
    const phaseTimeline: PhaseTimeline[] = [
      { phase: "shake", duration: 200 },
      { phase: "glitch", duration: 300 }, // Raccourci car plus de texte à afficher
      { phase: "black", duration: 200 },
      { phase: "code", duration: 3000 },
      { phase: "scanlines", duration: 1000 },
      { phase: "complete", duration: 1500 },
    ];

    let currentTime = 0;

    const executePhase = (phaseInfo: PhaseTimeline) => {
      timeoutId = setTimeout(() => {
        setPhase(phaseInfo.phase);

        if (phaseInfo.phase === "code") {
          const addText = () => {
            if (textIndex < fullSequence.length) {
              setDisplayText((prev) => prev + fullSequence[textIndex] + "\n");
              textIndex += 1;
              const progressPercent = (textIndex / fullSequence.length) * 100;
              setProgress(progressPercent);
              timeoutId = setTimeout(addText, 300);
            }
          };
          addText();
        } else if (phaseInfo.phase === "complete") {
          setProgress(100);
          timeoutId = setTimeout(onComplete, 1000);
        }
      }, currentTime);

      currentTime += phaseInfo.duration;
    };

    phaseTimeline.forEach((phaseInfo) => {
      executePhase(phaseInfo);
    });

    return () => clearTimeout(timeoutId);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className={`hack-sequence hack-phase-${phase}`}>
      
      {/* SCANLINES (Toujours visible pour l'effet rétro) */}
      <div className="scanlines" />

      {/* --- PHASE 1 & 2: LE GROS GLITCH RETIRÉ --- */}
      {/* Le conteneur glitch-title-container a été supprimé ici 
        pour ne plus afficher le texte "SYSTEM FAILURE" / "GLITCH".
      */}

      {/* --- PHASE 4: LE CODE TERMINAL --- */}
      {phase === "code" && (
        <div className="hack-content">
          <pre className="hack-text">{displayText}</pre>

          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
            <span className="loading-percentage">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* --- PHASE FINALE: TUNNEL --- */}
      {phase === "complete" && <div className="tunnel-zoom" />}
    </div>
  );
}