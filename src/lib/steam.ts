import { cacheLife } from "next/cache";
import { hiddenGames, playedGames, steamProfile } from "./site";

/*
 * Steam data for the /gaming page.
 *
 * 1. Always: the public community profile XML (no key) — persona, avatar,
 *    status, member-since and most-played games.
 * 2. With STEAM_API_KEY (server-only): owned games, playtime, recently played
 *    and Steam level via the Web API.
 * 3. Art: IStoreBrowseService/GetItems returns the real (often hashed) asset
 *    paths — newer titles 404 on the legacy /steam/apps/<id>/… CDN paths.
 *
 * Caching: complete results live for an hour; partial ones (API hiccup) only a
 * few minutes, so a transient failure never sticks. The cache key includes
 * whether a key is configured, so adding one takes effect immediately.
 */

export type SteamGame = {
  appid: number;
  name: string;
  hours: number;
  hours2wk?: number;
  /** Unix seconds of the last session (Web API only). */
  lastPlayed?: number;
  /** Portrait cover (600×900). */
  capsule: string;
  /** Landscape header (460×215). */
  header: string;
  /** Wide library hero. */
  hero: string;
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

const LEGACY = (appid: number, file: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${file}`;

const game = (appid: number, name: string, hours: number, hours2wk?: number, lastPlayed?: number): SteamGame => ({
  appid,
  name: name.trim(),
  hours,
  hours2wk,
  lastPlayed,
  capsule: LEGACY(appid, "library_600x900.jpg"),
  header: LEGACY(appid, "header.jpg"),
  hero: LEGACY(appid, "library_hero.jpg"),
  link: `https://store.steampowered.com/app/${appid}/`,
});

const hidden = new Set(hiddenGames);
const visible = (games: SteamGame[]) => games.filter((g) => !hidden.has(g.appid));

/** Merge hand-listed games (site.ts `playedGames`) into a library, skipping duplicates. */
const withExtras = (games: SteamGame[]) => {
  const seen = new Set(games.map((g) => g.appid));
  return [...games, ...playedGames.filter((g) => !seen.has(g.appid)).map((g) => game(g.appid, g.name, g.hours ?? 0))];
};

/** Snapshot of the public profile, used only if Steam can't be reached at all. */
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

async function getJson<T>(url: string, tries = 2): Promise<T | null> {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "hamzadaniyal.com portfolio" }, signal: AbortSignal.timeout(8000) });
      if (res.ok) return (await res.json()) as T;
    } catch {
      /* retry */
    }
  }
  return null;
}

async function fromProfile(): Promise<{ data: SteamData; steamId: string }> {
  const res = await fetch(`https://steamcommunity.com/id/${steamProfile.vanity}/?xml=1`, {
    headers: { "User-Agent": "hamzadaniyal.com portfolio" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Steam profile ${res.status}`);
  const xml = await res.text();
  if (!xml.includes("<steamID64>")) throw new Error("Steam profile unavailable");

  const memberSince = tag(xml, "memberSince");
  const topGames = Array.from(xml.matchAll(/<mostPlayedGame>([\s\S]*?)<\/mostPlayedGame>/g)).map(([, g]) => {
    const appid = num(tag(g, "gameLink").match(/app\/(\d+)/)?.[1] ?? "0");
    return game(appid, tag(g, "gameName"), num(tag(g, "hoursOnRecord")), num(tag(g, "hoursPlayed")));
  });
  const top = topGames.length ? topGames : SNAPSHOT.topGames;

  return {
    steamId: tag(xml, "steamID64"),
    data: {
      persona: tag(xml, "steamID") || SNAPSHOT.persona,
      avatar: tag(xml, "avatarFull") || SNAPSHOT.avatar,
      status: tag(xml, "onlineState") || "offline",
      memberSince,
      memberYear: Number(memberSince.match(/\d{4}/)?.[0]) || SNAPSHOT.memberYear,
      profileUrl: steamProfile.url,
      topGames: top,
      recent: [],
      library: withExtras(top),
      source: "profile",
    },
  };
}

type OwnedGame = { appid: number; name: string; playtime_forever: number; playtime_2weeks?: number; rtime_last_played?: number };
type GamesResp = { response?: { games?: OwnedGame[]; game_count?: number } };
type LevelResp = { response?: { player_level?: number } };
type StoreAssets = { asset_url_format?: string; library_capsule?: string; library_capsule_2x?: string; header?: string; library_hero?: string };
type ItemsResp = { response?: { store_items?: { appid: number; assets?: StoreAssets }[] } };

/** Returns null if the owned-games call fails, so the caller can cache briefly and retry. */
async function withWebApi(base: SteamData, steamId: string, key: string): Promise<SteamData | null> {
  const api = <T,>(path: string, params = "") =>
    getJson<T>(`https://api.steampowered.com/${path}/?key=${key}&steamid=${steamId}&format=json${params}`);

  const [owned, recent, level] = await Promise.all([
    api<GamesResp>("IPlayerService/GetOwnedGames/v1", "&include_appinfo=1&include_played_free_games=1"),
    api<GamesResp>("IPlayerService/GetRecentlyPlayedGames/v1", "&count=6"),
    api<LevelResp>("IPlayerService/GetSteamLevel/v1"),
  ]);
  const ownedGames: OwnedGame[] | undefined = owned?.response?.games;
  if (!ownedGames?.length) return null;

  const hrs = (min: number) => Math.round((min / 60) * 10) / 10;
  const toGame = (g: OwnedGame) =>
    game(g.appid, g.name, hrs(g.playtime_forever), g.playtime_2weeks ? hrs(g.playtime_2weeks) : undefined, g.rtime_last_played || undefined);

  const played = visible(
    ownedGames
      .filter((g) => g.playtime_forever > 0)
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .map(toGame),
  );

  return {
    ...base,
    level: level?.response?.player_level,
    gamesOwned: owned?.response?.game_count,
    totalHours: Math.round(ownedGames.reduce((s, g) => s + g.playtime_forever, 0) / 60),
    topGames: played.slice(0, 6),
    recent: visible((recent?.response?.games ?? []).map(toGame)),
    library: withExtras(played),
    source: "api",
  };
}

/** Swap legacy art URLs for the real store asset paths (batched, no key needed). */
async function resolveArt(data: SteamData): Promise<SteamData> {
  const ids = Array.from(new Set([...data.topGames, ...data.recent, ...data.library].map((g) => g.appid)));
  const art = new Map<number, Pick<SteamGame, "capsule" | "header" | "hero">>();

  for (let i = 0; i < ids.length; i += 50) {
    const input = {
      ids: ids.slice(i, i + 50).map((appid) => ({ appid })),
      context: { language: "english", country_code: "US" },
      data_request: { include_assets: true },
    };
    const json = await getJson<ItemsResp>(
      `https://api.steampowered.com/IStoreBrowseService/GetItems/v1/?input_json=${encodeURIComponent(JSON.stringify(input))}`,
    );
    for (const item of json?.response?.store_items ?? []) {
      const a = item?.assets;
      const fmt = a?.asset_url_format;
      if (!a || !fmt) continue;
      const url = (file?: string) =>
        file ? `https://shared.fastly.steamstatic.com/store_item_assets/${fmt.replace("${FILENAME}", file)}` : undefined;
      const capsule = url(a.library_capsule_2x ?? a.library_capsule);
      const header = url(a.header);
      const hero = url(a.library_hero);
      art.set(item.appid, {
        capsule: capsule ?? header ?? LEGACY(item.appid, "library_600x900.jpg"),
        header: header ?? capsule ?? LEGACY(item.appid, "header.jpg"),
        hero: hero ?? header ?? LEGACY(item.appid, "library_hero.jpg"),
      });
    }
  }

  const apply = (g: SteamGame) => ({ ...g, ...(art.get(g.appid) ?? {}) });
  return { ...data, topGames: data.topGames.map(apply), recent: data.recent.map(apply), library: data.library.map(apply) };
}

async function loadSteam(hasKey: boolean): Promise<SteamData> {
  "use cache";

  try {
    const { data, steamId } = await fromProfile();
    let result: SteamData = data;
    let complete = true;

    if (hasKey && steamId) {
      const api = await withWebApi(data, steamId, process.env.STEAM_API_KEY!);
      if (api) result = api;
      else complete = false;
    }

    result = await resolveArt({ ...result, topGames: visible(result.topGames), library: visible(result.library) });
    if (complete) cacheLife("hours");
    else cacheLife("minutes");
    return result;
  } catch {
    cacheLife("minutes");
    return SNAPSHOT;
  }
}

export function getSteamData(): Promise<SteamData> {
  return loadSteam(Boolean(process.env.STEAM_API_KEY));
}
