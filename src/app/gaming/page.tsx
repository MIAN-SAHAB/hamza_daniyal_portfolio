import type { Metadata } from "next";
import GamingHero from "@/components/gaming/GamingHero";
import MainGame from "@/components/gaming/MainGame";
import GameShelf from "@/components/gaming/GameShelf";
import GameLibrary from "@/components/gaming/GameLibrary";
import SquadUp from "@/components/gaming/SquadUp";
import GamepadToy from "@/components/gaming/GamepadToy";
import CtaBand from "@/components/CtaBand";
import { getSteamData } from "@/lib/steam";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Gaming",
  description:
    "Off the clock, on the server — Hamza Daniyal's gaming profile: Counter-Strike 2 hours, most-played games live from Steam, plus Twitch and Discord.",
  path: "/gaming",
});

export default async function GamingPage() {
  const steam = await getSteamData();
  const main = steam.topGames[0];
  const discord = site.socials.find((s) => s.label === "Discord")!;

  return (
    <main id="main">
      <GamingHero steam={steam} />
      {main && <MainGame game={main} />}
      <GameShelf steam={steam} />
      <GameLibrary games={steam.library} />
      <SquadUp />
      <CtaBand
        id="gaming-cta"
        tone="lime"
        eyebrow="GG — what's next?"
        title={
          <>
            Team up — in code
            <br />
            or in game.
          </>
        }
        art={<GamepadToy className="text-ink" />}
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: discord.href, label: "Ping me on Discord", external: true }}
      />
    </main>
  );
}
