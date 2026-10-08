"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";

const TYPES = ["Creative Web & 3D", "Full-Stack Platform", "Headless Commerce", "WordPress / Plugin", "Something else"];
const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $40k", "$40k +"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Minimal editorial brief form. There is no mail backend in this repo, so a
 * valid submission composes a pre-filled email in the visitor's mail client.
 */
export default function ContactForm() {
  const root = useRef<HTMLFormElement>(null);
  const [type, setType] = useState(TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
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
    { scope: root },
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = "Tell me who you are.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That email doesn't look right.";
    if (message.length < 10) next.message = "A sentence or two about the project, please.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = `New project — ${type} (${budget})`;
    const body = `Hi Hamza,\n\n${message}\n\n— ${name}\n${email}\nProject type: ${type}\nBudget: ${budget}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "peer w-full border-0 border-b border-ink/20 bg-transparent px-0 pb-3 pt-7 text-lede text-ink outline-none transition-colors placeholder:text-transparent focus:border-vermilion";
  const label =
    "pointer-events-none absolute left-0 top-7 origin-left text-graphite transition-all duration-500 ease-expo peer-focus:top-0 peer-focus:scale-75 peer-focus:text-vermilion peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75";

  return (
    <form ref={root} onSubmit={onSubmit} noValidate aria-describedby="form-note" className="space-y-10">
      <div data-field className="grid gap-10 md:grid-cols-2">
        <div className="relative">
          <input id="name" name="name" autoComplete="name" placeholder="Name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
          <label htmlFor="name" className={label}>Your name</label>
          {errors.name && <p id="name-err" className="mt-2 text-sm text-vermilion">{errors.name}</p>}
        </div>
        <div className="relative">
          <input id="email" name="email" type="email" autoComplete="email" placeholder="Email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
          <label htmlFor="email" className={label}>Email address</label>
          {errors.email && <p id="email-err" className="mt-2 text-sm text-vermilion">{errors.email}</p>}
        </div>
      </div>

      <fieldset data-field>
        <legend className="mb-4 text-micro uppercase tracking-[0.2em]">What are we building?</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="peer sr-only" />
              <span className="inline-block rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors duration-300 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-vermilion">
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
              <span className="inline-block rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors duration-300 peer-checked:border-vermilion peer-checked:bg-vermilion peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-vermilion">
                {b}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div data-field className="relative">
        <textarea id="message" name="message" rows={4} placeholder="Message" className={`${field} resize-none`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
        <label htmlFor="message" className={label}>Tell me about the project</label>
        {errors.message && <p id="message-err" className="mt-2 text-sm text-vermilion">{errors.message}</p>}
      </div>

      <div data-field className="flex flex-wrap items-center justify-between gap-6">
        <p id="form-note" className="max-w-xs text-sm">
          Submitting opens your mail app with the brief pre-filled. Replies within one working day (PKT).
        </p>
        <button
          type="submit"
          data-cursor="Send"
          className="group inline-flex items-center gap-4 rounded-full bg-ink py-4 pl-8 pr-4 text-sm uppercase tracking-[0.16em] text-white transition-colors duration-500 hover:bg-vermilion"
        >
          Send brief
          <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 ease-expo group-hover:rotate-[-45deg]">
            →
          </span>
        </button>
      </div>
      <p role="status" className="text-sm text-vermilion">
        {sent ? "Your mail app should be open with the brief ready — hit send there and I'll be in touch." : ""}
      </p>
    </form>
  );
}
