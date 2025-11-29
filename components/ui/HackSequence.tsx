"use client";

import { useEffect, useState, useRef } from "react";
import "@/styles/hack-sequence.css";

interface HackSequenceProps {
  isActive: boolean;
  onComplete: () => void;
}

type HackPhase = "idle" | "shake" | "glitch" | "black" | "code" | "scanlines" | "complete";

// ✅ Générer les valeurs aléatoires
const generateRandomIP = () =>
  `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

const generateRandomHash = () =>
  Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const generateRandomGPS = () => {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lon = (Math.random() * 360 - 180).toFixed(4);
  return `${lat}, ${lon}`;
};

// ✅ GLOBAL: Clé unique pour chaque session de hack
let currentHackSessionId = 0;

export default function HackSequence({ isActive, onComplete }: HackSequenceProps) {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<HackPhase>("idle");
  const [progress, setProgress] = useState(0);
  
  const onCompleteRef = useRef(onComplete);
  const sequenceRef = useRef<string[] | null>(null);
  const currentSessionRef = useRef<number>(-1);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      // ✅ Réinitialisation asynchrone
      const id = setTimeout(() => {
        setDisplayText("");
        setPhase("idle");
        setProgress(0);
      }, 0);
      return () => clearTimeout(id);
    }

    // ✅ Créer une nouvelle session à chaque fois que isActive devient true
    const newSessionId = ++currentHackSessionId;
    currentSessionRef.current = newSessionId;
    
    console.log(`▶️ Starting hack sequence (session ${newSessionId})`);

    // ✅ Créer la séquence
    sequenceRef.current = [
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

    let textIndex = 0;
    let timeoutId: NodeJS.Timeout;

    interface PhaseTimeline {
      phase: HackPhase;
      duration: number;
    }

    const phaseTimeline: PhaseTimeline[] = [
      { phase: "shake", duration: 200 },
      { phase: "glitch", duration: 300 },
      { phase: "black", duration: 200 },
      { phase: "code", duration: 3000 },
      { phase: "scanlines", duration: 1000 },
      { phase: "complete", duration: 1500 },
    ];

    let currentTime = 0;

    const executePhase = (phaseInfo: PhaseTimeline) => {
      timeoutId = setTimeout(() => {
        // ✅ Vérifier que c'est toujours la bonne session
        if (currentSessionRef.current !== newSessionId) {
          console.log(`⏭️ Session ${newSessionId} cancelled, skipping phase`);
          return;
        }

        setPhase(phaseInfo.phase);

        if (phaseInfo.phase === "code") {
          const addText = () => {
            // ✅ Vérifier encore avant d'ajouter du texte
            if (currentSessionRef.current !== newSessionId) return;

            if (textIndex < sequenceRef.current!.length) {
              setDisplayText((prev) => prev + sequenceRef.current![textIndex] + "\n");
              textIndex += 1;
              const progressPercent = (textIndex / sequenceRef.current!.length) * 100;
              setProgress(progressPercent);
              timeoutId = setTimeout(addText, 300);
            }
          };
          addText();
        } else if (phaseInfo.phase === "complete") {
          setProgress(100);
          timeoutId = setTimeout(() => {
            // ✅ Appeler onComplete seulement si c'est la bonne session
            if (currentSessionRef.current === newSessionId) {
              console.log(`✅ Hack complete (session ${newSessionId}) - calling onComplete`);
              onCompleteRef.current();
            }
          }, 1000);
        }
      }, currentTime);

      currentTime += phaseInfo.duration;
    };

    phaseTimeline.forEach(executePhase);

    return () => {
      console.log(`🧹 Cleanup (session ${newSessionId})`);
      clearTimeout(timeoutId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={`hack-sequence hack-phase-${phase}`}>
      <div className="scanlines" />

      {phase === "code" && (
        <div className="hack-content">
          <pre className="hack-text">{displayText}</pre>
          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
            <span className="loading-percentage">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {phase === "complete" && <div className="tunnel-zoom" />}
    </div>
  );
}