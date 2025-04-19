import { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const feed = await parser.parseURL(
      "https://www.haaretz.co.il/cmlink/1.1477373"
    );

    const articles = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
      image: item.enclosure?.url || null,
    }));

    res.status(200).json({ source: "haaretz", articles });
  } catch (error: any) {
    console.error("🔴 Failed to fetch Haaretz articles:", error);
    res.status(500).json({ error: "Failed to fetch Haaretz articles" });
  }
}
