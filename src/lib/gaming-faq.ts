import { site } from "./site";
import type { GenreSlice } from "./gaming";
import type { SteamData } from "./steam";

export type FaqTopic = "player" | "games" | "stream" | "squad";

export type GamingFaq = {
  id: string;
  topic: FaqTopic;
  q: string;
  /** Plain text — reused verbatim as the FAQPage JSON-LD answer. */
  a: string;
  link?: { href: string; label: string; external?: boolean };
};

export const FAQ_TOPICS: { id: FaqTopic | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "player", label: "The player" },
  { id: "games", label: "Games" },
  { id: "stream", label: "Stream" },
  { id: "squad", label: "Squad up" },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const social = (label: string) => site.socials.find((s) => s.label === label)!;

/** Questions people search about Tommy Vercetti, with answers built from live Steam data. */
export function gamingFaqs(steam: SteamData, genres: GenreSlice[]): GamingFaq[] {
  const main = steam.topGames[0];
  const twitch = social("Twitch");
  const discord = social("Discord");
  const others = genres.map((g) => g.label.toLowerCase());

  return [
    {
      id: "who-is-tommy-vercetti",
      topic: "player",
      q: "Who is Tommy Vercetti?",
      a: `Tommy Vercetti is the gaming alias of ${site.shortName}, a senior full-stack developer from ${site.location}. In game he plays competitive Counter-Strike 2 and streams live on Twitch as ${twitch.handle}.`,
    },
    {
      id: "same-person",
      topic: "player",
      q: `Is Tommy Vercetti the same person as developer ${site.shortName}?`,
      a: `Yes. Tommy Vercetti is ${site.shortName} off the clock — the same person who builds Next.js, headless commerce and WebGL platforms for clients.`,
      link: { href: "/work", label: "See the dev work" },
    },
    {
      id: "esports-team",
      topic: "player",
      q: "What esports team does Tommy Vercetti play for?",
      a: "Tommy Vercetti plays competitive Counter-Strike 2 with Raptors Esports.",
    },
    {
      id: "main-game",
      topic: "games",
      q: "What is Tommy Vercetti's main game?",
      a: main
        ? `${main.name} — with ${fmt(main.hours)} hours on record it is by far the most-played title on his Steam account.`
        : "Counter-Strike 2 — it is by far the most-played title on his Steam account.",
    },
    {
      id: "other-games",
      topic: "games",
      q: "What other games does Tommy Vercetti play?",
      a: others.length
        ? `Beyond CS2 the library spans ${new Intl.ListFormat("en", { type: "conjunction" }).format(others)} games${
            steam.gamesOwned ? ` — ${fmt(steam.gamesOwned)} titles in total` : ""
          }.`
        : "Beyond CS2 the library covers tactical shooters, open-world, racing, co-op horror and fighting games.",
    },
    {
      id: "hours-played",
      topic: "games",
      q: "How many hours has Tommy Vercetti played on Steam?",
      a: steam.totalHours
        ? `${fmt(steam.totalHours)} hours across the whole Steam library, on an account active since ${steam.memberYear}.`
        : `Thousands — the account has been active since ${steam.memberYear}${main ? `, with ${fmt(main.hours)} hours in ${main.name} alone` : ""}.`,
    },
    {
      id: "twitch",
      topic: "stream",
      q: "Where can I watch Tommy Vercetti stream?",
      a: `Live on Twitch at twitch.tv/${twitch.handle} — mostly competitive Counter-Strike 2. Follow the channel to get notified when a stream goes live.`,
      link: { href: twitch.href, label: "Open Twitch", external: true },
    },
    {
      id: "stream-content",
      topic: "stream",
      q: "What does Tommy Vercetti stream?",
      a: "Mostly competitive Counter-Strike 2, with other games from the Steam library mixed in when the squad wants a change of pace.",
    },
    {
      id: "steam",
      topic: "squad",
      q: "What is Tommy Vercetti's Steam ID?",
      a: `His Steam custom URL is ${social("Steam").handle} — steamcommunity.com/id/${social("Steam").handle}. Send a friend request there.`,
      link: { href: steam.profileUrl, label: "Add on Steam", external: true },
    },
    {
      id: "play-together",
      topic: "squad",
      q: "Can I play CS2 with Tommy Vercetti?",
      a: "Yes — the easiest way is to add him on Discord and ask for a lobby invite. Friend requests on Steam work too.",
      link: { href: discord.href, label: "Add on Discord", external: true },
    },
  ];
}
