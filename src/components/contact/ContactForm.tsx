"use client";

import { useActionState, useRef, useState } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { sendBrief, type ContactState } from "@/app/contact/actions";
import { PaperPlane } from "@/components/draw/art";

const TYPES = ["Creative Web & 3D", "Full-Stack Platform", "Headless Commerce", "WordPress / Plugin", "Something else"];
const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $40k", "$40k +"];

const INITIAL: ContactState = { status: "idle" };

/** Editorial brief form. Submits through a Server Action that emails the brief via Resend. */
export default function ContactForm() {
  const root = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(sendBrief, INITIAL);
  const [type, setType] = useState(TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [dismissed, setDismissed] = useState(false);
  const errors = state.errors ?? {};
  const v = state.values ?? {};
  const showSuccess = state.status === "success" && !dismissed;

  useGSAP(
    () => {
      if (showSuccess) return;
      gsap.fromTo(
        "[data-field]",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 35%", scrub: SCRUB },
        },
      );
    },
    { scope: root, dependencies: [showSuccess] },
  );

  if (showSuccess) {
    return (
      <div role="status" className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent to-aqua p-8 text-white md:p-12">
        <PaperPlane mode="intro" duration={1.8} strokeWidth={4} className="w-full max-w-md text-white/90" />
        <p className="mt-6 font-display text-[clamp(2rem,4vw,3.5rem)] uppercase leading-none">Brief received.</p>
        <p className="mt-4 max-w-md text-lede text-white/90">{state.message}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime"
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    "peer w-full border-0 border-b border-ink/20 bg-transparent px-0 pb-3 pt-7 text-lede text-ink outline-none transition-colors placeholder:text-transparent focus:border-accent";
  const label =
    "pointer-events-none absolute left-0 top-7 origin-left text-graphite transition-all duration-500 ease-expo peer-focus:top-0 peer-focus:scale-75 peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75";

  return (
    <form
      ref={root}
      action={(fd) => {
        setDismissed(false);
        formAction(fd);
      }}
      noValidate
      aria-describedby="form-note"
      aria-busy={pending}
      className="space-y-10"
    >
      {/* honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div data-field className="grid gap-10 md:grid-cols-2">
        <div className="relative">
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Name"
            defaultValue={v.name}
            required
            className={field}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-err" : undefined}
          />
          <label htmlFor="name" className={label}>Your name</label>
          {errors.name && <p id="name-err" className="mt-2 text-sm text-pink">{errors.name}</p>}
        </div>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            defaultValue={v.email}
            required
            className={field}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-err" : undefined}
          />
          <label htmlFor="email" className={label}>Email address</label>
          {errors.email && <p id="email-err" className="mt-2 text-sm text-pink">{errors.email}</p>}
        </div>
      </div>

      <fieldset data-field>
        <legend className="mb-4 text-micro uppercase tracking-[0.2em]">What are we building?</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="peer sr-only" />
              <span className="inline-block rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors duration-300 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset data-field>
        <legend className="mb-4 text-micro uppercase tracking-[0.2em]">Budget range</legend>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <label key={b} className="cursor-pointer">
              <input type="radio" name="budget" value={b} checked={budget === b} onChange={() => setBudget(b)} className="peer sr-only" />
              <span className="inline-block rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors duration-300 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                {b}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div data-field className="relative">
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Message"
          defaultValue={v.message}
          required
          className={`${field} resize-none`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-err" : undefined}
        />
        <label htmlFor="message" className={label}>Tell me about the project</label>
        {errors.message && <p id="message-err" className="mt-2 text-sm text-pink">{errors.message}</p>}
      </div>

      <div data-field className="flex flex-wrap items-center justify-between gap-6">
        <p id="form-note" className="max-w-xs text-sm">
          Goes straight to my inbox. Replies within one working day.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-4 rounded-full bg-ink py-4 pl-8 pr-4 text-sm uppercase tracking-[0.16em] text-white transition-colors duration-500 hover:bg-accent disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sending…" : "Send brief"}
          <span
            aria-hidden
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 ease-expo group-hover:rotate-[-45deg] ${pending ? "animate-spin" : ""}`}
          >
            {pending ? "◌" : "→"}
          </span>
        </button>
      </div>

      <p role="status" aria-live="polite" className="text-sm text-pink">
        {state.status === "error" && state.message ? state.message : ""}
      </p>
    </form>
  );
}
