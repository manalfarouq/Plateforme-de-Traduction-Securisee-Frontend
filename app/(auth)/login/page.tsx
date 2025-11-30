"use client";

import LoginForm from "@/components/auth/LoginForm";
import TypewriterLine from "@/components/ui/TypewriterLine";
import { MESSAGES } from "@/lib/constants";
import { useState } from "react";

export default function LoginPage() {
  const [showForm, setShowForm] = useState(false);

  // Calcul des délais pour animation séquentielle
  const delayLine1 = 0;
  const delayLine2 = MESSAGES.TERMINAL.SYSTEM_V1.length * 50 + 200;

  return (
    <>
      {/* LIGNE 1: Message système */}
      <TypewriterLine 
        text={MESSAGES.TERMINAL.SYSTEM_V1} 
        delay={delayLine1}
        className="terminal-line"
      />

      {/* LIGNE 2: Auteur */}
      <TypewriterLine 
        text={MESSAGES.TERMINAL.SYSTEM_V2} 
        delay={delayLine2}
        className="terminal-line"
        onComplete={() => setTimeout(() => setShowForm(true), 200)}
      />

      <div style={{ marginTop: "20px" }} />
      
      {/* FORMULAIRE (Apparaît après les animations) */}
      {showForm && (
        <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
          <LoginForm />
        </div>
      )}
    </>
  );
}