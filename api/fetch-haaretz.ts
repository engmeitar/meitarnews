import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

const HAARETZ_RSS_URL = "https://www.haaretz.co.il/cmlink/1.524"; // Current Hebrew top news RSS

type Article = {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parser = new Parser();

  try {
    const feed = await parser.parseURL(HAARETZ_RSS_URL);

    const articles: Article[] = feed.items.map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      pubDate: item.pubDate,
      description: item.contentSnippet ?? "",
    }));

    res.status(200).json({ source: "haaretz", articles });
  } catch (error) {
    console.error("Haaretz RSS Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch Haaretz articles" });
  }
}
