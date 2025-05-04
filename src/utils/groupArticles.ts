type Article = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image?: string;
};

type SourceArticles = {
  source: string;
  articles: Article[];
};

export function groupArticles(
  searchTerm: string,
  allSources: SourceArticles[]
): {
  left: string;
  center: string;
  right: string;
  summary: string;
} {
  const biasMap: Record<string, "left" | "center" | "right"> = {
    guardian: "left",
    bbc: "center",
    fox: "right",
  };

  const grouped: Record<"left" | "center" | "right", string> = {
    left: "",
    center: "",
    right: "",
  };

  allSources.forEach(({ source, articles }) => {
    const bias = biasMap[source.toLowerCase()];
    if (!bias) return;

    const match = articles.find((a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (match) {
      grouped[bias] = match.title;
    }
  });

  const summary = `Neutral summary about "${searchTerm}": combining ${
    grouped.left || "left"
  }, ${grouped.center || "center"}, and ${
    grouped.right || "right"
  } perspectives.`;

  return {
    left: grouped.left,
    center: grouped.center,
    right: grouped.right,
    summary,
  };
}
