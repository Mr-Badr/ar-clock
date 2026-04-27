interface JsonLdProps {
  data?: object | object[] | null;
}

export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : data ? [data] : [];

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item, index) => (
        <script
          key={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item, null, 0) }}
        />
      ))}
    </>
  );
}
