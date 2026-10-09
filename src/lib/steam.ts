import { cacheLife } from "next/cache";
import { playedGames, steamProfile } from "./site";

/*
 * Steam data for the /gaming page.
 *
 * 1. Always: the public community profile XML (no key needed) — persona,
 *    avatar, status, member-since and most-played games.
 * 2. Optionally: if STEAM_API_KEY is set (server-only, never sent to the
 *    browser), the Steam Web API adds owned-game count, total playtime,
 *    recently played games and Steam level.
 * 3. If Steam is unreachable, a snapshot keeps the page rendering.
 *
 * Results are cached for an hour via `use cache` + cacheLife("hours").
 */

export type SteamGame = {
  appid: number;
  name: string;
  hours: number;
  hours2wk?: number;
  /** Unix seconds of the last session (Web API only). */
  lastPlayed?: number;
  header: string;
  hero: string;
  capsule: string;
  link: string;
};

export type SteamData = {
  persona: string;
  avatar: string;
  status: string;
  memberSince: string;
  memberYear: number;
  profileUrl: string;
  level?: number;
  gamesOwned?: number;
  totalHours?: number;
  topGames: SteamGame[];
  recent: SteamGame[];
  /** Every game with recorded playtime, most-played first. */
  library: SteamGame[];
  source: "api" | "profile" | "snapshot";
};

const art = (appid: number) => ({
  header: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
  hero: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`,
  capsule: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
  link: `https://store.steampowered.com/app/${appid}/`,
});

const game = (appid: number, name: string, hours: number, hours2wk?: number, lastPlayed?: number): SteamGame => ({
  appid,
  name,
  hours,
  hours2wk,
  lastPlayed,
  ...art(appid),
});

/** Merge hand-listed games (site.ts `playedGames`) into a library, skipping duplicates. */
const withExtras = (games: SteamGame[]) => {
  const seen = new Set(games.map((g) => g.appid));
  const extras = playedGames.filter((g) => !seen.has(g.appid)).map((g) => game(g.appid, g.name, g.hours ?? 0));
  return [...games, ...extras];
};

/** Snapshot taken from the public profile, used only if Steam can't be reached. */
const SNAPSHOT: SteamData = {
  persona: "TOMMY VERCETT!",
  avatar: "https://avatars.fastly.steamstatic.com/ec015843a7640f1ff0abcf3ed5ceed14b6f472a7_full.jpg",
  status: "offline",
  memberSince: "December 4, 2019",
  memberYear: 2019,
  profileUrl: steamProfile.url,
  topGames: [game(730, "Counter-Strike 2", 3561), game(1938090, "Call of Duty®", 1.6)],
  recent: [],
  library: [game(730, "Counter-Strike 2", 3561), game(1938090, "Call of Duty®", 1.6)],
  source: "snapshot",
};

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`));
  return m?.[1]?.trim() ?? "";
};
const num = (s: string) => Number(s.replace(/,/g, "")) || 0;

async function fromProfile(): Promise<{ data: SteamData; steamId: string }> {
  const res = await fetch(`https://steamcommunity.com/id/${steamProfile.vanity}/?xml=1`, {
    headers: { "User-Agent": "hamzadaniyal.com portfolio" },
  });
  if (!res.ok) throw new Error(`Steam profile ${res.status}`);
  const xml = await res.text();
  if (!xml.includes("<steamID64>")) throw new Error("Steam profile unavailable");

  const memberSince = tag(xml, "memberSince");
  const topGames = Array.from(xml.matchAll(/<mostPlayedGame>([\s\S]*?)<\/mostPlayedGame>/g)).map(([, g]) => {
    const appid = num(tag(g, "gameLink").match(/app\/(\d+)/)?.[1] ?? "0");
    return game(appid, tag(g, "gameName"), num(tag(g, "hoursOnRecord")), num(tag(g, "hoursPlayed")));
  });

  return {
    steamId: tag(xml, "steamID64"),
    data: {
      persona: tag(xml, "steamID") || SNAPSHOT.persona,
      avatar: tag(xml, "avatarFull") || SNAPSHOT.avatar,
      status: tag(xml, "onlineState") || "offline",
      memberSince,
      memberYear: Number(memberSince.match(/\d{4}/)?.[0]) || SNAPSHOT.memberYear,
      profileUrl: steamProfile.url,
      topGames: topGames.length ? topGames : SNAPSHOT.topGames,
      recent: [],
      library: withExtras(topGames.length ? topGames : SNAPSHOT.topGames),
      source: "profile",
    },
  };
}

type OwnedGame = { appid: number; name: string; playtime_forever: number; playtime_2weeks?: number; rtime_last_played?: number };

async function withWebApi(base: SteamData, steamId: string, key: string): Promise<SteamData> {
  if (!steamId) return base;
  const api = (path: string, params: string) =>
    fetch(`https://api.steampowered.com/${path}/?key=${key}&steamid=${steamId}&format=json${params}`).then((r) =>
      r.ok ? r.json() : null,
    );

  const [owned, recent, level] = await Promise.all([
    api("IPlayerService/GetOwnedGames/v1", "&include_appinfo=1&include_played_free_games=1"),
    api("IPlayerService/GetRecentlyPlayedGames/v1", "&count=6"),
    api("IPlayerService/GetSteamLevel/v1", ""),
  ]);

  const ownedGames: OwnedGame[] = owned?.response?.games ?? [];
  const recentGames: OwnedGame[] = recent?.response?.games ?? [];
  const toGame = (g: OwnedGame) =>
    game(
      g.appid,
      g.name,
      Math.round((g.playtime_forever / 60) * 10) / 10,
      g.playtime_2weeks ? Math.round((g.playtime_2weeks / 60) * 10) / 10 : undefined,
      g.rtime_last_played || undefined,
    );
  const played = ownedGames.filter((g) => g.playtime_forever > 0).sort((a, b) => b.playtime_forever - a.playtime_forever);

  return {
    ...base,
    level: level?.response?.player_level,
    gamesOwned: owned?.response?.game_count,
    totalHours: ownedGames.length ? Math.round(ownedGames.reduce((s, g) => s + g.playtime_forever, 0) / 60) : undefined,
    topGames: played.length ? played.slice(0, 6).map(toGame) : base.topGames,
    recent: recentGames.map(toGame),
    library: played.length ? withExtras(played.map(toGame)) : base.library,
    source: "api",
  };
}

export async function getSteamData(): Promise<SteamData> {
  "use cache";
  cacheLife("hours");

  try {
    const { data, steamId } = await fromProfile();
    const key = process.env.STEAM_API_KEY;
    return key ? await withWebApi(data, steamId, key).catch(() => data) : data;
  } catch {
    return SNAPSHOT;
  }
}
