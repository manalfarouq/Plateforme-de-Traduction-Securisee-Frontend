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
      "PROTOCOLE zoro ACTIVÉ...",
      `DATE/HEURE: ${new Date().toLocaleString("fr-FR")}`,
      `FINGERPRINT: ${generateRandomHash()}`,
      `LOCALISATION: ${generateRandomGPS()}`,
      "ACCÈS ACCORDÉ",
      "SYSTÈME LANCÉ",
      "INITIALISATION SYSTÈME: [████████████] 100%",
    ];

    interface PhaseTimeline {
      phase: HackPhase;
      duration: number;
    }

    const phaseTimeline: PhaseTimeline[] = [
      { phase: "shake", duration: 100 },
      { phase: "glitch", duration: 300 },
      { phase: "black", duration: 500 },
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

              timeoutId = setTimeout(addText, 400);
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
      {/* EFFECT SHAKE */}
      {phase === "shake" && <div className="hack-shake-effect" />}

      {/* EFFECT GLITCH RGB */}
      {phase === "glitch" && (
        <div className="hack-glitch-container">
          <div className="glitch-layer glitch-red" />
          <div className="glitch-layer glitch-green" />
          <div className="glitch-layer glitch-blue" />
        </div>
      )}

      {/* SCANLINES */}
      <div className="scanlines" />

      {/* CONTENT */}
      <div className="hack-content">
        <pre className="hack-text">{displayText}</pre>

        {/* LOADING BAR */}
        {phase === "code" && (
          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
            <span className="loading-percentage">{Math.round(progress)}%</span>
          </div>
        )}

        {/* ACCESS GRANTED MESSAGE */}
        {(phase === "scanlines" || phase === "complete") && (
          <div className="access-granted-message">
            <span className="blink">▶ ACCÈS ACCORDÉ ▶</span>
          </div>
        )}
      </div>

      {/* TUNNEL EFFECT FOR TRANSITION */}
      {phase === "complete" && <div className="tunnel-zoom" />}
    </div>
  );
}