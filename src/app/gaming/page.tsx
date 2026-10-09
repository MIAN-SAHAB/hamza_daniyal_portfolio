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
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const steam = await getSteamData();
  const main = steam.topGames[0];
  const hours = main ? `${main.hours.toLocaleString("en-US")}+ hours in ${main.name}` : "Counter-Strike 2";
  return {
    ...pageMetadata({
      title: "Gaming",
      description: `Hamza Daniyal's gaming profile — ${hours}, ${steam.library.length} games played on Steam. Senior full-stack developer from Pakistan who streams on Twitch and squads up on Discord.`,
      path: "/gaming",
    }),
    keywords: [
      "Hamza Daniyal gaming",
      "Counter-Strike 2 player Pakistan",
      "developer who games",
      "Steam profile",
      "Twitch streamer Pakistan",
      ...steam.topGames.slice(0, 5).map((g) => g.name),
    ],
  };
}

export default async function GamingPage() {
  const steam = await getSteamData();
  const genres = genreBreakdown(steam.library);
  const main = steam.topGames[0];
  const discord = site.socials.find((s) => s.label === "Discord")!;
  const gamingProfiles = site.socials.filter((s) => ["Steam", "Twitch", "Discord"].includes(s.label)).map((s) => s.href);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.url}/gaming`,
    name: `${site.shortName} — Gaming profile`,
    mainEntity: {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: steam.persona,
      sameAs: gamingProfiles,
      knowsAbout: [...genres.map((g) => g.label), ...steam.topGames.slice(0, 6).map((g) => g.name)],
      ...(main
        ? {
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/PlayAction",
              name: `Hours played in ${main.name}`,
              userInteractionCount: Math.round(main.hours),
            },
          }
        : {}),
    },
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <GamingHero steam={steam} genres={genres} />
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
