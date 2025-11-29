"use client";

import React, { useState, useEffect } from "react";
import "@/styles/terminal.css";

interface TypewriterLineProps {
  text: string;
  delay: number; // Délai avant de commencer l'écriture (en ms)
  onComplete?: () => void; // Fonction appelée quand l'écriture est terminée
  className?: string; // Pour ajouter des classes personnalisées
}

// Durée de frappe par caractère en millisecondes (ms)
// 50ms = 20 caractères/seconde (très rapide)
// 75ms = 13.3 caractères/seconde (réaliste)
const CHAR_DURATION_MS = 50; 

const TypewriterLine: React.FC<TypewriterLineProps> = ({ text, delay, onComplete, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Délai initial avant de commencer à écrire
    const startTimeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // 2. Calcul du temps d'écriture total
    const writeDuration = text.length * CHAR_DURATION_MS; 

    let completeTimeout: NodeJS.Timeout | null = null;
    
    // 3. Appel de onComplete après l'écriture + un petit délai
    completeTimeout = setTimeout(() => {
        if (onComplete) {
            onComplete();
        }
    }, delay + writeDuration + 50); // Petit délai de 50ms pour la propreté

    return () => {
        clearTimeout(startTimeout);
        if (completeTimeout) {
            clearTimeout(completeTimeout);
        }
    };
  }, [text, delay, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`terminal-line typewriter-effect ${className}`}
      style={{
        // Définit la durée de l'animation en fonction de la longueur du texte
        animationDuration: `${text.length * CHAR_DURATION_MS}ms`, 
      }}
    >
      {text}
      {/* Le curseur clignote à la fin de la ligne uniquement grâce à l'animation CSS */}
      <span className="cursor-blink" />
    </div>
  );
};

export default TypewriterLine;