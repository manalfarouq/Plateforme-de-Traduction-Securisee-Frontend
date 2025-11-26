import { useState } from "react";

export function useHackSequence() {
  const [isHacking, setIsHacking] = useState(false);
  const [hackComplete, setHackComplete] = useState(false);

  const startHack = () => {
    setIsHacking(true);
    setHackComplete(false);
  };

  const completeHack = () => {
    setHackComplete(true);
    setIsHacking(false);
  };

  const resetHack = () => {
    setIsHacking(false);
    setHackComplete(false);
  };

  return {
    isHacking,
    hackComplete,
    startHack,
    completeHack,
    resetHack,
  };
}