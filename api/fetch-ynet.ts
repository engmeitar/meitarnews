import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { parseStringPromise } from "xml2js";

const YNET_RSS_URL = "https://www.ynet.co.il/Integration/StoryRss2.xml";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(YNET_RSS_URL);
    const xml = await response.text();

    const parsed = await parseStringPromise(xml);
    const items = parsed?.rss?.channel?.[0]?.item || [];

    const articles = await Promise.all(
      items.map(async (item: any) => {
        const title = item.title[0];
        const link = item.link[0];
        const pubDate = item.pubDate[0];
        const description = item.description?.[0] || null;

        // Fetch the article page to extract the main image
        let image = null;
        try {
          const articleResponse = await fetch(link);
          const articleHtml = await articleResponse.text();
          const $ = cheerio.load(articleHtml);

          // Attempt to find the Open Graph image
          const ogImage = $('meta[property="og:image"]').attr("content");
          if (ogImage) {
            image = ogImage;
          } else {
            // Fallback: find the first image in the article content
            const firstImg = $("article img").first().attr("src");
            if (firstImg) {
              image = firstImg.startsWith("http")
                ? firstImg
                : `https://www.ynet.co.il${firstImg}`;
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch image for ${link}:`, err);
        }

        return { title, link, pubDate, description, image };
      })
    );

    res.status(200).json({ source: "ynet", articles });
  } catch (err) {
    console.error("Error fetching Ynet RSS:", err);
    res.status(500).json({ error: "Failed to fetch Ynet articles." });
  }
}
