"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FieldError, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { C } from "./tokens";
import type { ContactFormValues } from "./types";

type FieldName = Path<ContactFormValues>;

interface FloatingLabelTextareaProps {
  name: FieldName;
  label: string;
  register: UseFormRegister<ContactFormValues>;
  rules?: RegisterOptions<ContactFormValues, FieldName>;
  error?: FieldError;
  value?: string;
  shakeKey?: number;
}

export function FloatingLabelTextarea({ name, label, register, rules, error, value = "", shakeKey = 0 }: FloatingLabelTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const active = isFocused || value.length > 0;
  const field = register(name, rules);
  const countColor = value.length > 500 ? C.error : value.length > 420 ? "#48b8d8" : "rgba(122,144,168,0.60)";

  useEffect(() => {
    const mirror = mirrorRef.current;
    const textarea = textareaRef.current;
    if (!mirror || !textarea) return;
    mirror.textContent = (value || "") + "\n";
    const nextHeight = Math.min(152, Math.max(104, mirror.scrollHeight));
    textarea.style.height = nextHeight + "px";
  }, [value]);

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
      <textarea
        id={name}
        name={field.name}
        ref={(element) => {
          textareaRef.current = element;
          field.ref(element);
        }}
        onChange={field.onChange}
        onBlur={(event) => {
          setIsFocused(false);
          field.onBlur(event);
        }}
        onFocus={() => setIsFocused(true)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? name + "-error" : undefined}
        // 16px on mobile prevents iOS Safari's focus auto-zoom. The mirror below must keep
        // identical font metrics or the auto-grow height calculation drifts.
        className="min-h-[104px] max-h-[152px] w-full resize-none overflow-y-auto rounded-xl px-4 pb-7 pt-6 text-[16px] sm:text-[0.85rem] leading-5 outline-none transition-[border-color,box-shadow,background] duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid " + (error ? "rgba(255,77,109,0.62)" : isFocused ? "rgba(72,184,216,0.60)" : "rgba(96,165,230,0.18)"),
          boxShadow: error ? "0 0 0 3px rgba(255,77,109,0.09)" : isFocused ? "0 0 0 3px rgba(72,184,216,0.12), 0 0 24px rgba(72,184,216,0.08)" : "none",
          color: "#dce8f2",
        }}
      />
      <div ref={mirrorRef} className="invisible absolute left-0 top-0 -z-10 min-h-[104px] max-h-[152px] w-full whitespace-pre-wrap break-words rounded-xl px-4 pb-7 pt-6 text-[16px] sm:text-[0.85rem] leading-5" aria-hidden="true" />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 transition-all duration-200 ease-out"
        style={{
          top: active ? 9 : 22,
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? 10.5 : 13.5,
          letterSpacing: active ? "0.08em" : 0,
          color: active ? "#48b8d8" : "rgba(122,144,168,0.70)",
          fontWeight: active ? 700 : 600,
        }}
      >
        {label}
      </label>
      <span className="pointer-events-none absolute bottom-2.5 right-3.5 text-[10.5px] tabular-nums" style={{ color: countColor }}>
        {value.length} / 500
      </span>
      {error && (
        <p id={name + "-error"} className="mt-1.5 flex items-center gap-1 text-xs font-semibold" style={{ color: C.error }}>
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
}
