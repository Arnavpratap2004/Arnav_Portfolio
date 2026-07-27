"use client";

/* eslint-disable react-hooks/refs -- react-hook-form register exposes a ref callback that must be forwarded. */

import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FieldError, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { C } from "./tokens";
import type { ContactFormValues } from "./types";

type FieldName = Path<ContactFormValues>;

interface FloatingLabelInputProps {
  name: FieldName;
  label: string;
  register: UseFormRegister<ContactFormValues>;
  rules?: RegisterOptions<ContactFormValues, FieldName>;
  error?: FieldError;
  type?: "text" | "email";
  value?: string;
  shakeKey?: number;
}

export function FloatingLabelInput({ name, label, register, rules, error, type = "text", value = "", shakeKey = 0 }: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const active = isFocused || value.length > 0;
  const field = register(name, rules);

  useEffect(() => {
    if (!error || shakeKey === 0) return;
    const element = wrapperRef.current;
    if (!element) return;

    element.classList.remove("shake");
    void element.offsetWidth;
    element.classList.add("shake");

    const timeout = setTimeout(() => element.classList.remove("shake"), 400);
    return () => clearTimeout(timeout);
  }, [error, shakeKey]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        id={name}
        type={type}
        name={field.name}
        ref={field.ref}
        onChange={field.onChange}
        onBlur={(event) => {
          setIsFocused(false);
          field.onBlur(event);
        }}
        onFocus={() => setIsFocused(true)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? name + "-error" : undefined}
        // 16px on mobile is deliberate: iOS Safari auto-zooms the page when a focused input's
        // font-size is under 16px, and the user is left pinch-zoomed out of the layout.
        className="h-[44px] w-full rounded-xl px-4 pb-1.5 pt-[18px] text-[16px] sm:text-[0.85rem] outline-none transition-[border-color,box-shadow,background] duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid " + (error ? "rgba(255,77,109,0.62)" : isFocused ? "rgba(72,184,216,0.60)" : "rgba(96,165,230,0.18)"),
          boxShadow: error ? "0 0 0 3px rgba(255,77,109,0.09)" : isFocused ? "0 0 0 3px rgba(72,184,216,0.12), 0 0 24px rgba(72,184,216,0.08)" : "none",
          color: "#dce8f2",
        }}
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 transition-all duration-200 ease-out"
        style={{
          top: active ? 6 : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? 10.5 : 13.5,
          letterSpacing: active ? "0.08em" : 0,
          // 0.85 rather than 0.70: at 70% the resting label measured ~3.2:1 over the card fill.
          color: active ? "#48b8d8" : "rgba(122,144,168,0.85)",
          fontWeight: active ? 700 : 600,
        }}
      >
        {label}
      </label>
      {error && (
        <p id={name + "-error"} className="mt-1.5 flex items-center gap-1 text-xs font-semibold" style={{ color: C.error }}>
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
}
