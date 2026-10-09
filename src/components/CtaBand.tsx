import Link from "@/components/AppLink";
import { CurvedArrow, Sparkle } from "./draw/art";

type Action = { href: string; label: string; external?: boolean };

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  primary: Action;
  secondary?: Action;
  tone?: "gradient" | "lime";
  id: string;
};

/** Mid-page call to action: a colour panel with a self-drawing arrow pointing at the buttons. */
export default function CtaBand({ eyebrow, title, primary, secondary, tone = "gradient", id }: Props) {
  const panel =
    tone === "lime"
      ? "bg-lime text-ink"
      : "bg-gradient-to-br from-accent via-[#8b4dff] to-aqua text-white";
  const btnPrimary = tone === "lime" ? "bg-ink text-white hover:bg-accent" : "bg-white text-ink hover:bg-lime";
  const btnSecondary = tone === "lime" ? "border-ink/30 hover:bg-ink hover:text-white" : "border-white/50 hover:bg-white hover:text-ink";

  const linkProps = (a: Action) => (a.external ? { target: "_blank", rel: "noopener noreferrer" } : {});

  return (
    <section aria-labelledby={id} className="relative px-4 py-16 md:px-10 md:py-24">
      <div className={`relative overflow-hidden rounded-[2.5rem] px-6 py-14 md:px-16 md:py-20 ${panel}`}>
        <span aria-hidden className="blob -right-[8vw] -top-[10vw] h-[30vw] w-[30vw] bg-white opacity-20" />
        <Sparkle strokeWidth={3} className="absolute right-[8%] top-[18%] w-12 opacity-80 md:w-16" />
        <Sparkle strokeWidth={3} className="absolute bottom-[16%] right-[30%] hidden w-8 opacity-70 md:block" />

        <div className="relative grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="text-micro uppercase tracking-[0.2em] opacity-80">{eyebrow}</p>
            <h2 id={id} className="mt-5 font-display text-[clamp(2.25rem,5.4vw,5.5rem)] uppercase leading-[0.92]">
              {title}
            </h2>
          </div>
          <div className="relative flex flex-wrap items-center gap-3 md:col-span-4 md:justify-end">
            <CurvedArrow strokeWidth={3} start="top 85%" end="top 45%" className="absolute -left-28 -top-24 hidden w-24 -rotate-12 md:block" />
            <Link
              href={primary.href}
              {...linkProps(primary)}
              className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm uppercase tracking-[0.14em] transition-colors duration-300 ${btnPrimary}`}
            >
              {primary.label}
              <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1">→</span>
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                {...linkProps(secondary)}
                className={`inline-flex items-center rounded-full border px-6 py-4 text-sm uppercase tracking-[0.14em] transition-colors duration-300 ${btnSecondary}`}
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
