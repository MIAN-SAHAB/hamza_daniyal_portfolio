"use client";

import { useActionState, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sendBrief, type ContactState } from "@/app/contact/actions";
import { PaperPlane } from "@/components/draw/art";

const TYPES = [
  { value: "Creative Web & 3D", blurb: "WebGL, motion, award-chasing sites" },
  { value: "Full-Stack Platform", blurb: "Apps, dashboards, APIs, SaaS" },
  { value: "Headless Commerce", blurb: "Shopify / custom storefronts" },
  { value: "WordPress / Plugin", blurb: "Custom themes, blocks & plugins" },
  { value: "Something else", blurb: "Surprise me" },
];
const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $40k", "$40k +"];
const STEPS = ["Project", "Budget", "Details", "You"] as const;
const PROMPTS = ["Timeline: ", "Designs are ready / not yet. ", "Current stack: ", "Must launch by: ", "Inspired by: "];
const MSG_MIN = 10;
const MSG_MAX = 5000;

type Field = "name" | "email" | "message";
const STEP_OF: Record<Field, number> = { message: 2, name: 3, email: 3 };

const INITIAL: ContactState = { status: "idle" };

/** Step-by-step brief form. Submits through a Server Action that emails the brief via Resend. */
export default function ContactForm() {
  const root = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(sendBrief, INITIAL);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [localErrors, setLocalErrors] = useState<Partial<Record<Field, string>>>({});
  const [dismissed, setDismissed] = useState(false);
  const [seenState, setSeenState] = useState(state);
  const userNavigated = useRef(false);

  // When the server answers with field errors, jump back to the step that owns the first one.
  if (state !== seenState) {
    setSeenState(state);
    setLocalErrors({});
    const first = (Object.keys(state.errors ?? {}) as Field[]).sort((a, b) => STEP_OF[a] - STEP_OF[b])[0];
    if (first) setStep(STEP_OF[first]);
  }

  const errors = { ...state.errors, ...localErrors };
  const showSuccess = state.status === "success" && !dismissed;

  const go = (next: number) => {
    userNavigated.current = true;
    setStep(next);
    setReached((r) => Math.max(r, next));
  };

  const validate = (s: number) => {
    const e: Partial<Record<Field, string>> = {};
    if (s === 2) {
      if (message.trim().length < MSG_MIN) e.message = "A sentence or two about the project, please.";
      if (message.length > MSG_MAX) e.message = "Let's keep the first message under 5,000 characters.";
    }
    if (s === 3) {
      if (!name.trim()) e.name = "Tell me who you are.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "That email doesn't look right.";
    }
    setLocalErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) go(Math.min(step + 1, STEPS.length - 1));
  };

  const pick = (setter: (v: string) => void, value: string) => {
    setter(value);
    // Small beat so the selection registers visually before we move on.
    window.setTimeout(() => go(step + 1), 280);
  };

  // Entrance for the whole shell, then a crossfade each time the step changes.
  useGSAP(
    () => {
      if (showSuccess) return;
      gsap.from("[data-shell]", { autoAlpha: 0, y: 30, duration: 0.9, ease: "expo.out" });
    },
    { scope: root, dependencies: [showSuccess] },
  );
  useGSAP(
    () => {
      if (showSuccess) return;
      // opacity, not autoAlpha: visibility:hidden would steal focus from the field we focus below.
      gsap.fromTo(
        `[data-step="${step}"] [data-reveal]`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, ease: "expo.out" },
      );
      if (userNavigated.current)
        root.current?.querySelector<HTMLElement>(`[data-step="${step}"] [data-focus]`)?.focus({ preventScroll: true });
    },
    { scope: root, dependencies: [step, showSuccess] },
  );

  if (showSuccess) {
    return (
      <div role="status" className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent to-aqua p-8 text-white md:p-12">
        <PaperPlane mode="intro" duration={1.8} strokeWidth={4} className="w-full max-w-md text-white/90" />
        <p className="mt-6 font-display text-[clamp(2rem,4vw,3.5rem)] uppercase leading-none">Brief received.</p>
        <p className="mt-4 max-w-md text-lede text-white/90">{state.message}</p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            setStep(0);
            setReached(0);
            setType("");
            setBudget("");
            setMessage("");
          }}
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime"
        >
          Send another
        </button>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const heading = "font-display text-[clamp(1.75rem,3.2vw,3rem)] uppercase leading-none text-ink outline-none";
  const input =
    "w-full rounded-2xl border border-ink/15 bg-white/60 px-5 py-4 text-lede text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-graphite/60 focus:border-accent focus:shadow-[0_0_0_4px_rgba(122,60,255,0.15)] aria-[invalid=true]:border-pink";
  const choice = (active: boolean) =>
    `group relative flex h-full w-full cursor-pointer flex-col justify-between gap-6 rounded-2xl border p-5 text-left transition-all duration-500 ease-expo hover:-translate-y-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
      active
        ? "border-ink bg-ink text-white shadow-[0_24px_48px_-24px_rgba(27,20,70,0.8)]"
        : "border-ink/15 bg-white/50 text-ink hover:border-ink/40"
    }`;

  return (
    <form
      ref={root}
      action={(fd) => {
        if (!validate(3)) return;
        setDismissed(false);
        formAction(fd);
      }}
      noValidate
      aria-describedby="form-note"
      aria-busy={pending}
    >
      {/* honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div data-shell className="rounded-[2rem] border border-ink/10 bg-paper/70 p-6 shadow-[0_40px_80px_-50px_rgba(27,20,70,0.45)] backdrop-blur md:p-10">
        {/* progress rail */}
        <ol className="mb-3 grid grid-cols-4 gap-2" aria-label="Brief steps">
          {STEPS.map((label, i) => {
            const canJump = i <= reached && i !== step;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!canJump}
                  onClick={() => go(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={`flex w-full items-baseline gap-2 text-left text-micro uppercase tracking-[0.18em] transition-colors ${
                    i === step ? "text-accent" : i <= reached ? "text-ink hover:text-accent" : "text-graphite/50"
                  } disabled:cursor-default`}
                >
                  <span className="tabular-nums">0{i + 1}</span>
                  <span className="hidden sm:inline">{label}</span>
                  {i < step && <span aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mb-10 h-1 overflow-hidden rounded-full bg-ink/10" aria-hidden>
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-aqua transition-[width] duration-700 ease-expo" style={{ width: `${progress}%` }} />
        </div>

        <div className="md:min-h-[24rem]">
        {/* 01 — project type */}
        <fieldset data-step={0} hidden={step !== 0}>
          <legend data-reveal data-focus tabIndex={-1} className={heading}>
            What are we building?
          </legend>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TYPES.map((t, i) => (
              <label key={t.value} data-reveal className={i === TYPES.length - 1 ? "sm:col-span-2" : undefined}>
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={type === t.value}
                  onChange={() => pick(setType, t.value)}
                  className="peer sr-only"
                />
                <span className={choice(type === t.value)}>
                  <span className="flex items-center justify-between text-micro uppercase tracking-[0.2em] opacity-60">
                    <span>0{i + 1}</span>
                    <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:-rotate-45">
                      →
                    </span>
                  </span>
                  <span>
                    <span className="block font-display text-[clamp(1.25rem,1.7vw,1.6rem)] uppercase leading-none">{t.value}</span>
                    <span className="mt-2 block text-sm opacity-70">{t.blurb}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 02 — budget */}
        <fieldset data-step={1} hidden={step !== 1}>
          <legend data-reveal data-focus tabIndex={-1} className={heading}>
            Rough budget?
          </legend>
          <p data-reveal className="mt-3 text-sm text-graphite">
            No commitment — it just helps me suggest the right scope.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {BUDGETS.map((b, i) => (
              <label key={b} data-reveal>
                <input
                  type="radio"
                  name="budget"
                  value={b}
                  checked={budget === b}
                  onChange={() => pick(setBudget, b)}
                  className="peer sr-only"
                />
                <span className={choice(budget === b)}>
                  {/* rising bars read as "more" without needing words */}
                  <span aria-hidden className="flex h-12 items-end gap-1">
                    {BUDGETS.map((_, j) => (
                      <span
                        key={j}
                        className={`w-2 rounded-full transition-colors duration-500 ${
                          j <= i ? (budget === b ? "bg-lime" : "bg-accent") : budget === b ? "bg-white/20" : "bg-ink/10"
                        }`}
                        style={{ height: `${(j + 1) * 25}%` }}
                      />
                    ))}
                  </span>
                  <span className="font-display text-[clamp(1.25rem,1.7vw,1.6rem)] uppercase leading-none">{b}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 03 — details */}
        <div data-step={2} hidden={step !== 2}>
          <label htmlFor="message" data-reveal className={`block ${heading}`}>
            Tell me about it
          </label>
          <div data-reveal className="mt-6 flex flex-wrap gap-2" aria-label="Quick prompts">
            {PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setMessage((m) => (m && !m.endsWith("\n") ? `${m}\n${p}` : `${m}${p}`));
                  document.getElementById("message")?.focus();
                }}
                className="rounded-full border border-dashed border-ink/25 px-3 py-1.5 text-xs text-graphite transition-colors hover:border-accent hover:text-accent"
              >
                + {p.replace(/[:.]\s*$/, "")}
              </button>
            ))}
          </div>
          <div data-reveal className="relative mt-4">
            <textarea
              id="message"
              name="message"
              data-focus
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Goals, timeline, links you love, what's already in place…"
              maxLength={MSG_MAX}
              required
              className={`${input} resize-none pb-10`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-err" : "message-count"}
            />
            <span
              id="message-count"
              className={`absolute bottom-3 right-4 text-xs tabular-nums ${message.trim().length >= MSG_MIN ? "text-accent" : "text-graphite/70"}`}
            >
              {message.trim().length < MSG_MIN ? `${MSG_MIN - message.trim().length} more to go` : `${message.length} / ${MSG_MAX}`}
            </span>
          </div>
          {errors.message && (
            <p id="message-err" className="mt-2 text-sm text-pink">
              {errors.message}
            </p>
          )}
        </div>

        {/* 04 — contact details + summary */}
        <div data-step={3} hidden={step !== 3}>
          <h3 data-reveal className={heading}>
            Who&rsquo;s asking?
          </h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div data-reveal>
              <label htmlFor="name" className="mb-2 block text-micro uppercase tracking-[0.2em]">
                Your name
              </label>
              <input
                id="name"
                name="name"
                data-focus
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className={input}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-err" : undefined}
              />
              {errors.name && (
                <p id="name-err" className="mt-2 text-sm text-pink">
                  {errors.name}
                </p>
              )}
            </div>
            <div data-reveal>
              <label htmlFor="email" className="mb-2 block text-micro uppercase tracking-[0.2em]">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@studio.com"
                required
                className={input}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-err" : undefined}
              />
              {errors.email && (
                <p id="email-err" className="mt-2 text-sm text-pink">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <dl data-reveal className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 text-sm sm:grid-cols-3">
            {[
              { k: "Project", v: type || "Unspecified", to: 0 },
              { k: "Budget", v: budget || "Unspecified", to: 1 },
              { k: "Brief", v: message.trim() || "—", to: 2 },
            ].map((row) => (
              <div key={row.k} className="bg-paper p-4">
                <dt className="flex items-center justify-between text-micro uppercase tracking-[0.2em] text-graphite">
                  {row.k}
                  <button type="button" onClick={() => go(row.to)} className="text-accent underline-offset-4 hover:underline">
                    Edit
                  </button>
                </dt>
                <dd className="mt-2 line-clamp-2 text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        </div>

        {/* nav */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="text-sm uppercase tracking-[0.16em] text-graphite transition-colors hover:text-ink"
            >
              ← Back
            </button>
          ) : (
            <p id="form-note" className="max-w-xs text-sm text-graphite">
              Four quick steps. Goes straight to my inbox.
            </p>
          )}

          {step < STEPS.length - 1 ? (
            // Distinct keys: if React reused this node as the submit button, the click that
            // advances to the last step would also submit the form.
            <button
              key="next"
              type="button"
              onClick={next}
              className="group inline-flex items-center gap-3 rounded-full border border-ink py-3 pl-6 pr-3 text-sm uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-ink hover:text-white"
            >
              {step < 2 && !(step === 0 ? type : budget) ? "Skip" : "Next"}
              <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:bg-white group-hover:text-ink">
                →
              </span>
            </button>
          ) : (
            <button
              key="submit"
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
          )}
        </div>

        <p role="status" aria-live="polite" className="mt-4 text-sm text-pink empty:hidden">
          {state.status === "error" && state.message ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
