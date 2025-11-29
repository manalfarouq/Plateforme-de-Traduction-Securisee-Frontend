"use client";

import LoginForm from "@/components/auth/LoginForm";
import TypewriterLine from "@/components/ui/TypewriterLine"; // NOUVEAU
import { MESSAGES } from "@/lib/constants";
import { useState } from "react"; // NOUVEAU

export default function LoginPage() {
  const [showForm, setShowForm] = useState(false);

  // Le délai entre les lignes doit être le temps d'écriture de la ligne précédente + un petit gap.
  // Ligne 1: 0ms de délai
  // Ligne 2: Durée Ligne 1 (environ 25*50ms = 1250ms) + 200ms
  // Ligne 3 (Formulaire): Durée Ligne 2 (environ 25*50ms = 1250ms) + 200ms

  const delayLine1 = 0;
  const delayLine2 = MESSAGES.TERMINAL.SYSTEM_V1.length * 50 + 200; 

  // On calcule la fin de l'animation pour afficher le formulaire
  const delayForm = delayLine2 + MESSAGES.TERMINAL.SYSTEM_V2.length * 50 + 200; 
  
  return (
    <>
      {/* LIGNE 1 */}
      <TypewriterLine 
        text={MESSAGES.TERMINAL.SYSTEM_V1} 
        delay={delayLine1}
      />

      {/* LIGNE 2 */}
      <TypewriterLine 
        text={MESSAGES.TERMINAL.SYSTEM_V2} 
        delay={delayLine2}
        // Quand cette ligne est terminée, on affiche le formulaire
        onComplete={() => setTimeout(() => setShowForm(true), 200)}
      />

      <div style={{ marginTop: "20px" }} />
      
      {/* FORMULAIRE (Affiché après les lignes) */}
      {showForm && (
        <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
          <LoginForm />
        </div>
      )}
    </>
  );
}