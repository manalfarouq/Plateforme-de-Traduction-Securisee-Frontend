"use client";

import React, { useState, useEffect } from "react";
import "@/styles/terminal.css";

interface TypewriterLineProps {
  text: string;
  delay: number;
  onComplete?: () => void;
  className?: string;
}

const CHAR_DURATION_MS = 50;

const TypewriterLine: React.FC<TypewriterLineProps> = ({ text, delay, onComplete, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    const writeDuration = text.length * CHAR_DURATION_MS;

    const completeTimeout = setTimeout(() => {
      setIsComplete(true); // Animation terminée
      if (onComplete) onComplete();
    }, delay + writeDuration + 50);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(completeTimeout);
    };
  }, [text, delay, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`terminal-line typewriter-effect ${className}`}
      style={{ animationDuration: `${text.length * CHAR_DURATION_MS}ms` }}
    >
      {text}
      {!isComplete && <span className="cursor-blink" />}
    </div>
  );
};

export default TypewriterLine;
