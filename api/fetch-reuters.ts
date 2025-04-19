import { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const feed = await parser.parseURL(
      "http://feeds.reuters.com/reuters/topNews"
    );

    const articles = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
      image: item.enclosure?.url || null,
    }));

    res.status(200).json({ source: "reuters", articles });
  } catch (error) {
    console.error("Reuters RSS Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch Reuters articles" });
  }
}
