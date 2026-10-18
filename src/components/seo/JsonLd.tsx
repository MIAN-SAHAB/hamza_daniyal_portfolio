type Props = {
  /** One Schema.org node or graph. `@context` is added when missing. */
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
};

/**
 * Renders structured data as a native <script type="application/ld+json">.
 * `<` is escaped so no string in the payload can close the tag (XSS-safe).
 */
export default function JsonLd({ data, id }: Props) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}
