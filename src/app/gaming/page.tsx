import type { Metadata } from "next";
import GamingHero from "@/components/gaming/GamingHero";
import MainGame from "@/components/gaming/MainGame";
import GameShelf from "@/components/gaming/GameShelf";
import GameLibrary from "@/components/gaming/GameLibrary";
import SquadUp from "@/components/gaming/SquadUp";
import GamepadToy from "@/components/gaming/GamepadToy";
import CtaBand from "@/components/CtaBand";
import { getSteamData } from "@/lib/steam";
import { genreBreakdown } from "@/lib/gaming";
import { constructMetadata, gamingKeywords } from "@/lib/seo-config";
import { gamingGraph } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import PlayerFaq from "@/components/gaming/PlayerFaq";
import { gamingFaqs } from "@/lib/gaming-faq";
import { site } from "@/lib/site";

export const metadata: Metadata = constructMetadata({
  title: "Tommy Vercetti (Hamza Daniyal) — CS2 Competitive Player, Raptors Esports & Twitch Stream",
  description:
    "Off the clock with Hamza Daniyal (Tommy Vercetti). Counter-Strike 2 (CS2) competitive player with Raptors Esports, live Steam stats and game library, Twitch streams (tommyvercetti__455) and where to squad up.",
  path: "/gaming",
  type: "profile",
  keywords: gamingKeywords,
});

export default async function GamingPage() {
  const steam = await getSteamData();
  const genres = genreBreakdown(steam.library);
  const main = steam.topGames[0];
  const faqs = gamingFaqs(steam, genres);
  const discord = site.socials.find((s) => s.label === "Discord")!;
  return (
    <main id="main">
      <JsonLd
        id="ld-gaming"
        data={gamingGraph({
          persona: steam.persona,
          avatar: steam.avatar,
          mainGame: main,
          games: [...genres.map((g) => g.label), ...steam.topGames.slice(0, 6).map((g) => g.name)],
          faqs,
        })}
      />
      <GamingHero steam={steam} genres={genres} />
      {main && <MainGame game={main} totalHours={steam.totalHours} memberYear={steam.memberYear} gamesPlayed={steam.library.length} />}
      <GameShelf steam={steam} />
      <GameLibrary games={steam.library} />
      <PlayerFaq faqs={faqs} />
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
