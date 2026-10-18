import { site } from "@/lib/site";
import { Gamepad, Headset, Joystick, Meander } from "@/components/draw/art";

const CHANNELS = [
  { key: "Twitch", verb: "Watch me stream", Icon: Headset, tone: "text-accent", hover: "group-hover:bg-accent" },
  { key: "Discord", verb: "Squad up on Discord", Icon: Joystick, tone: "text-aqua", hover: "group-hover:bg-aqua" },
  { key: "Steam", verb: "Add me on Steam", Icon: Gamepad, tone: "text-pink", hover: "group-hover:bg-pink" },
] as const;

/** Where to find me in-game: big link rows with self-drawing icons. */
export default function SquadUp() {
  return (
    <section aria-labelledby="squad-title" className="relative overflow-hidden bg-paper px-4 py-28 md:px-10 md:py-40">
      <Meander strokeWidth={3} start="top 80%" end="bottom bottom" className="pointer-events-none absolute right-[8%] top-0 hidden h-full text-accent/25 md:block" />

      <p className="inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">Squad up</p>
      <h2 id="squad-title" className="mt-6 font-display text-[clamp(2.5rem,6vw,6rem)] uppercase leading-[0.9] text-ink">
        Find me <span className="text-gradient">in the lobby</span>
        <span className="sr-only"> — Tommy Vercetti on Twitch (tommyvercetti__455), Steam (IamTommyVercetti) &amp; Discord</span>
      </h2>

      <ul className="relative mt-16 border-t border-ink/15">
        {CHANNELS.map(({ key, verb, Icon, tone, hover }) => {
          const s = site.socials.find((x) => x.label === key)!;
          return (
            <li key={key} className="border-b border-ink/15">
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-6 py-8 md:gap-10 md:py-10">
                <Icon strokeWidth={5} start="top 90%" end="top 50%" className={`w-14 shrink-0 md:w-20 ${tone}`} />
                <span className="flex-1">
                  <span className="block font-display text-[clamp(2rem,5vw,4.5rem)] uppercase leading-none text-ink transition-transform duration-700 ease-expo group-hover:translate-x-3">
                    {key}
                  </span>
                  <span className="mt-2 block text-graphite">
                    {verb} · {s.handle}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink/20 text-xl text-ink transition-all duration-500 ease-expo group-hover:-rotate-45 group-hover:border-transparent group-hover:text-white ${hover}`}
                >
                  →
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
