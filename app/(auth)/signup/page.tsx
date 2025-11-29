"use client";

import SignupForm from "@/components/auth/SignUpForm";
import TypewriterLine from "@/components/ui/TypewriterLine"; // NOUVEAU
import { MESSAGES } from "@/lib/constants";
import { useState } from "react"; // NOUVEAU

export default function SignupPage() {
  const [showForm, setShowForm] = useState(false);

  const delayLine1 = 0;
  const delayLine2 = MESSAGES.TERMINAL.SYSTEM_V1.length * 50 + 200; 

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
          <SignupForm />
        </div>
      )}
    </>
  );
}