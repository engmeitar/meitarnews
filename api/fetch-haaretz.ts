import { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch("https://www.haaretz.co.il/rss.xml", {
      headers: {
        "User-Agent": "Mozilla/5.0", // Helps bypass bot filters
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);

    const articles = feed.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
    }));

    res.status(200).json({ source: "haaretz", articles });
  } catch (error) {
    console.error("Haaretz Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch Haaretz articles" });
  }
}
