import type { SteamGame } from "./steam";

/**
 * Genre buckets for the titles in Hamza's Steam library (by app id).
 * Unlisted games simply don't count toward the breakdown — add ids as the library grows.
 */
const GENRES: { id: string; label: string; ids: number[] }[] = [
  {
    id: "tactical",
    label: "Tactical shooters",
    ids: [730, 10, 240, 4465480, 359550, 1144200, 581320, 2073850, 578080, 1172470, 1938090, 2000950, 3595230, 312660],
  },
  { id: "open-world", label: "Open world", ids: [271590, 3240220, 552520, 298110, 243470, 447040, 2239550, 2231380, 863550] },
  { id: "racing", label: "Racing", ids: [1293830, 1222680, 1815780] },
  { id: "horror", label: "Co-op & horror", ids: [739630, 967050, 550, 500, 952060, 466240, 2064870, 218620, 207610] },
  { id: "fighting", label: "Fighting", ids: [976310, 389730, 291550] },
];

export type GenreSlice = { id: string; label: string; hours: number; share: number; games: string[] };

/** Hours per genre across the played library, largest first, with share of the categorised total. */
export function genreBreakdown(library: SteamGame[]): GenreSlice[] {
  const slices = GENRES.map((g) => {
    const games = library.filter((x) => g.ids.includes(x.appid));
    return { id: g.id, label: g.label, hours: Math.round(games.reduce((s, x) => s + x.hours, 0)), games: games.map((x) => x.name) };
  }).filter((s) => s.hours > 0);
  const total = slices.reduce((s, x) => s + x.hours, 0) || 1;
  return slices.map((s) => ({ ...s, share: Math.round((s.hours / total) * 100) })).sort((a, b) => b.hours - a.hours);
}
