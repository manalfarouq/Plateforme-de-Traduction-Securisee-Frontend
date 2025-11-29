"use client";

import { useState } from "react";
import { MESSAGES } from "@/lib/constants";
import "@/styles/alert.css";

interface AlertProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export default function Alert({ isOpen, onAccept, onReject }: AlertProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleAccept = () => {
    // 1. On active l'effet de glitch
    setIsGlitching(true);

    // 2. On attend la fin de l'animation (1.5s) avant de lancer la suite du hack
    setTimeout(() => {
      onAccept();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className={`alert-overlay ${isGlitching ? "glitch-overlay-active" : ""}`}>
      {/* On ajoute la classe conditionnelle 'glitching' si le bouton est cliqué */}
      <div className={`alert-modal ${isGlitching ? "glitching" : ""}`}>
        
        {/* Le Header (TITRE) */}
        <div className="alert-header">
          <h2 className={isGlitching ? "glitch-text" : ""} data-text={MESSAGES.ALERT.TITLE}>
            {MESSAGES.ALERT.TITLE}
          </h2>
        </div>

        {/* Le Corps du texte */}
        <div className="alert-body">
          <p className={isGlitching ? "glitch-text-sm" : ""}>
            {MESSAGES.ALERT.TEXT1}
          </p>
          <p className={isGlitching ? "glitch-text-sm" : ""}>
            {MESSAGES.ALERT.TEXT2}
          </p>
        </div>

        <div className="alert-question">
          <p className={isGlitching ? "glitch-text-sm" : ""}>
            {MESSAGES.ALERT.QUESTION}
          </p>
        </div>

        <div className="alert-buttons">
          <button 
            className="alert-btn alert-btn-reject" 
            onClick={onReject}
            disabled={isGlitching}
          >
            {MESSAGES.ALERT.NO}
          </button>
          
          <button 
            className={`alert-btn alert-btn-accept ${isGlitching ? "btn-glitch-active" : ""}`}
            onClick={handleAccept}
          >
            {isGlitching ? "ERREUR..." : MESSAGES.ALERT.YES}
          </button>
        </div>
      </div>
    </div>
  );
}