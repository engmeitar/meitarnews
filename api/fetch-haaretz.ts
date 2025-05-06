import { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0", // helps bypass some blocks
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("Fetching Haaretz RSS...");
    const feed = await parser.parseURL("https://www.haaretz.co.il/rss.xml");

    console.log("Feed fetched:", feed?.items?.length);

    const articles = feed.items.map((item) => ({
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
