"use client";

import SignupForm from "@/components/auth/SignUpForm";
import { MESSAGES } from "@/lib/constants";

export default function SignupPage() {
  return (
    <>
      <div className="terminal-line">{MESSAGES.TERMINAL.SYSTEM_V1}</div>
      <div className="terminal-line">{MESSAGES.TERMINAL.SYSTEM_V2}</div>
      <div style={{ marginTop: "20px" }} />
      <SignupForm />
    </>
  );
}