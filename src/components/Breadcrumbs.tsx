import Link from "@/components/AppLink";

/** Visible breadcrumb trail for nested routes (pairs with the BreadcrumbList schema). */
export default function Breadcrumbs({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-micro uppercase tracking-[0.2em] text-graphite">
        {[{ name: "Home", href: "/" }, ...trail].map((c, i, all) => (
          <li key={c.href} className="flex items-center gap-2">
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-ink">
                {c.name}
              </span>
            ) : (
              <>
                <Link href={c.href} className="link-underline hover:text-ink">
                  {c.name}
                </Link>
                <span aria-hidden>/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
