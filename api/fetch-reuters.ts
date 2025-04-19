// /api/fetch-reuters.ts
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const proxyUrl =
      "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/Reuters/worldNews";

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`Status ${response.status}`);

    const data = await response.json();

    const articles = data.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.description || item.content,
      image: item.thumbnail || null,
    }));

    res.status(200).json({ source: "reuters", articles });
  } catch (error: any) {
    console.error("Reuters proxy fetch error:", error);
    res.status(500).json({ error: "Failed to fetch Reuters articles" });
  }
}
