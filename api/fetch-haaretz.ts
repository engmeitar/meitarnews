import { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ["description", "pubDate", "content", "link"],
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const feed = await parser.parseURL("https://www.haaretz.co.il/rss.xml");

    const articles = feed.items.slice(0, 10).map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
    }));

    res.status(200).json({ source: "haaretz", articles });
  } catch (error) {
    console.error("Error fetching Haaretz RSS:", error);
    res.status(500).json({ error: "Failed to fetch Haaretz articles" });
  }
}
