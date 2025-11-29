"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import TrapPage from "@/components/ui/TrapPage";
import Alert from "@/components/ui/Alert";
import HackSequence from "@/components/ui/HackSequence";
import { useHackSequence } from "@/hooks/useHackSequence";

export default function Home() {
  const router = useRouter();
  const { isHacking, startHack, completeHack } = useHackSequence();
  const [showAlert, setShowAlert] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleTrapPageStart = useCallback(() => {
    setShowAlert(true);
  }, []);

  const handleAlertReject = useCallback(() => {
    setShowAlert(false);
  }, []);

  const handleAlertAccept = useCallback(() => {
    setShowAlert(false);
    startHack();
  }, [startHack]);

  const handleHackComplete = useCallback(() => {
    completeHack();
    setIsRedirecting(true);

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }, [completeHack, router]);

  return (
    <>
      {/* PAGE PIÈGE */}
      {!isHacking && !showAlert && !isRedirecting && (
        <TrapPage onStart={handleTrapPageStart} />
      )}

      {/* ALERTE */}
      <Alert
        isOpen={showAlert}
        onAccept={handleAlertAccept}
        onReject={handleAlertReject}
      />

      {/* SÉQUENCE DE HACK */}
      {isHacking && (
        <HackSequence 
          isActive={isHacking} 
          onComplete={handleHackComplete}
        />
      )}

      {/* ÉCRAN NOIR */}
      {isRedirecting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
}