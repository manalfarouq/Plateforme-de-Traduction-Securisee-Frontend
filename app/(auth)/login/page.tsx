"use client";

import LoginForm from "@/components/auth/LoginForm";
import { MESSAGES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <>
      <div className="terminal-line">{MESSAGES.TERMINAL.SYSTEM_V1}</div>
      <div className="terminal-line">{MESSAGES.TERMINAL.SYSTEM_V2}</div>
      <div style={{ marginTop: "20px" }} />
      <LoginForm />
    </>
  );
}