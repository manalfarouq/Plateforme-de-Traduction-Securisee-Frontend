"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TrapPage from "@/components/ui/TrapPage";
import Alert from "@/components/ui/Alert";
import HackSequence from "@/components/ui/HackSequence";
import { useHackSequence } from "@/hooks/useHackSequence";

export default function Home() {
  const router = useRouter();
  const { isHacking, startHack, completeHack } = useHackSequence();
  const [showAlert, setShowAlert] = useState(false);

  const handleTrapPageStart = () => {
    setShowAlert(true);
  };

  const handleAlertReject = () => {
    setShowAlert(false);
  };

  const handleAlertAccept = () => {
    setShowAlert(false);
    startHack();
  };

  const handleHackComplete = () => {
    completeHack();

    // Rediriger vers login après 1.5 secondes
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <>
      <TrapPage onStart={handleTrapPageStart} />
      <Alert
        isOpen={showAlert}
        onAccept={handleAlertAccept}
        onReject={handleAlertReject}
      />
      <HackSequence isActive={isHacking} onComplete={handleHackComplete} />
    </>
  );
}