import type { ComponentProps } from "react";

/**
 * Site-wide internal link. Renders a plain <a>, so every navigation is a full
 * document load (by request — each page arrives as fresh, complete HTML).
 *
 * To switch back to instant client-side navigation, replace the body with:
 *   import NextLink from "next/link";  …  return <NextLink {...props} />;
 */
export default function AppLink(props: ComponentProps<"a"> & { href: string }) {
  return <a {...props} />;
}
