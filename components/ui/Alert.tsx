"use client";

import { MESSAGES } from "@/lib/constants";
import "@/styles/alert.css";

interface AlertProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export default function Alert({ isOpen, onAccept, onReject }: AlertProps) {
  if (!isOpen) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-modal">
        <div className="alert-header">
          <h2>{MESSAGES.ALERT.TITLE}</h2>
        </div>

        <div className="alert-body">
          <p>{MESSAGES.ALERT.TEXT1}</p>
          <p>{MESSAGES.ALERT.TEXT2}</p>
        </div>

        <div className="alert-question">
          <p>{MESSAGES.ALERT.QUESTION}</p>
        </div>

        <div className="alert-buttons">
          <button 
            className="alert-btn alert-btn-reject" 
            onClick={onReject}
          >
            {MESSAGES.ALERT.NO}
          </button>
          <button 
            className="alert-btn alert-btn-accept" 
            onClick={onAccept}
          >
            {MESSAGES.ALERT.YES}
          </button>
        </div>
      </div>
    </div>
  );
}