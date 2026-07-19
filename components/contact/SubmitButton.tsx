"use client";

import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { m } from "framer-motion";
import { useEffect, useMemo } from "react";
import { C } from "./tokens";

export type SubmitButtonState = "idle" | "loading" | "success" | "error";

type BurstParticle = {
  id: number;
  x: number;
  y: number;
  color: string;
};

interface SubmitButtonProps {
  state: SubmitButtonState;
  onAutoReset?: () => void;
}

const burstColors = ["#48b8d8", "#7dd3e8", "#dce8f2", "#3a607e"];

function makeBurst(): BurstParticle[] {
  return Array.from({ length: 14 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 14 + Math.random() * 0.35;
    const distance = 50 + Math.random() * 40;
    return {
      id: index,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: burstColors[index % burstColors.length],
    };
  });
}

export function SubmitButton({ state, onAutoReset }: SubmitButtonProps) {
  const particles = useMemo(() => (state === "success" ? makeBurst() : []), [state]);

  useEffect(() => {
    if (state === "success") {
      const reset = setTimeout(() => onAutoReset?.(), 3200);
      return () => clearTimeout(reset);
    }

    if (state === "error") {
      const reset = setTimeout(() => onAutoReset?.(), 3200);
      return () => clearTimeout(reset);
    }
  }, [state, onAutoReset]);

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  const background = isSuccess
    ? "linear-gradient(135deg, #059669, #22d3a0)"
    : isError
      ? "linear-gradient(135deg, #FF4D6D, #CC2244)"
      : "linear-gradient(135deg, #1048b0 0%, #0d82c4 45%, #06aec8 100%)";

  const boxShadow = isSuccess
    ? "0 4px 24px rgba(34,211,160,0.34), inset 0 1px 0 rgba(255,255,255,0.12)"
    : isError
      ? "0 4px 24px rgba(255,77,109,0.30), inset 0 1px 0 rgba(255,255,255,0.12)"
      : "0 4px 24px rgba(13,130,196,0.40), inset 0 1px 0 rgba(255,255,255,0.12)";

  return (
    <button
      type="submit"
      disabled={isLoading || isSuccess}
      className={"send-btn group relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-[14px] border-0 px-6 py-[13px] text-[0.92rem] font-bold tracking-[0.02em] text-white transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed " + (isError ? "shake" : "")}
      style={{ background, boxShadow, opacity: isLoading ? 0.78 : 1 }}
    >
      <span className="send-shimmer pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.20)_50%,transparent_60%)] transition-transform duration-0 ease-linear group-hover:translate-x-full group-hover:duration-[550ms]" />

      {particles.map((particle) => (
        <m.span
          key={particle.id}
          className="absolute left-1/2 top-1/2 z-20 h-[3px] w-[3px] rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: particle.x, y: particle.y, opacity: 0, scale: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      ))}

      {isLoading && <span className="relative z-10 h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/25 border-t-white" />}
      {isSuccess && (
        <m.span className="relative z-10" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}>
          <CheckCircle size={18} />
        </m.span>
      )}
      {isError && <AlertCircle size={18} className="relative z-10" />}
      {state === "idle" && <Send size={18} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />}

      <span className="relative z-10">
        {state === "idle" && "Send Message"}
        {state === "loading" && "Sending..."}
        {state === "success" && "Message Sent!"}
        {state === "error" && "Failed - Try Again"}
      </span>
    </button>
  );
}
