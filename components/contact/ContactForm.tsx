"use client";

import { m } from "framer-motion";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { FloatingLabelTextarea } from "./FloatingLabelTextarea";
import { SubmitButton, type SubmitButtonState } from "./SubmitButton";
import type { ContactFormValues } from "./types";

interface ContactFormProps {
  isInView: boolean;
}

export function ContactForm({ isInView }: ContactFormProps) {
  const [buttonState, setButtonState] = useState<SubmitButtonState>("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const values = useWatch({ control });

  const onSubmit = async (data: ContactFormValues) => {
    setButtonState("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject.trim(),
          message: data.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Contact API responded with " + response.status);
      }

      setButtonState("success");
      reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setButtonState("error");
    }
  };

  const onInvalid = () => {
    setShakeKey((key) => key + 1);
    setButtonState("idle");
  };

  const resetButton = useCallback(() => setButtonState("idle"), []);

  return (
    <m.div
      layout={false}
      // PERF: Entrance no longer animates filter:blur — blur animation re-rasters this large
      // backdrop-filtered card every frame (measured as a ~350ms hitch entering Contact).
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card form-card"
      style={{
        background: "rgba(8,18,45,0.55)",
        // PERF: blur(16px) reads the same as 28px over the video while shrinking the filter kernel.
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: "1px solid rgba(96,165,230,0.20)",
        borderRadius: 24,
        boxShadow: "0 4px 48px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 80px rgba(8,40,100,0.20)",
        padding: 26,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: "card-float 7s ease-in-out infinite -3.5s",
        willChange: "transform",
      }}
    >
      <div className="mb-0 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#7a90a8" }}>
        <span className="h-px flex-1" style={{ background: "rgba(96,165,230,0.18)" }} />
        Send a Transmission
        <span className="h-px flex-1" style={{ background: "rgba(96,165,230,0.18)" }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FloatingLabelInput
            name="name"
            label="Your Name"
            register={register}
            value={values?.name ?? ""}
            error={errors.name}
            shakeKey={shakeKey}
            rules={{
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            }}
          />
          <FloatingLabelInput
            name="email"
            label="Email Address"
            type="email"
            register={register}
            value={values?.email ?? ""}
            error={errors.email}
            shakeKey={shakeKey}
            rules={{
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
            }}
          />
        </div>

        <FloatingLabelInput
          name="subject"
          label="Subject (optional)"
          register={register}
          value={values?.subject ?? ""}
          error={errors.subject}
          shakeKey={shakeKey}
        />

        <FloatingLabelTextarea
          name="message"
          label="Your Message"
          register={register}
          value={values?.message ?? ""}
          error={errors.message}
          shakeKey={shakeKey}
          rules={{
            required: "Message is required",
            minLength: { value: 10, message: "Message must be at least 10 characters" },
            maxLength: { value: 500, message: "Message must be 500 characters or fewer" },
          }}
        />

        <SubmitButton state={buttonState} onAutoReset={resetButton} />
      </form>
      <style jsx global>{"@keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-7px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } } .shake { animation: shake 400ms ease both; }"}</style>
    </m.div>
  );
}
