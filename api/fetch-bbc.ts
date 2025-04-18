// /api/fetch-bbc.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const feed = await parser.parseURL("https://feeds.bbci.co.uk/news/rss.xml");

    const articles = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
      image: item.enclosure?.url || null,
    }));

    res.status(200).json({ source: "bbc", articles });
  } catch (error: any) {
    console.error("BBC RSS Fetch Error:", error?.message || error);
    res.status(500).json({ error: "Failed to fetch BBC articles" });
  }
}
