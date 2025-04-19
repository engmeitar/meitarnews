// /api/fetch-haaretz.ts

import { NextRequest, NextResponse } from "next/server";
import * as parser from "rss-parser";

const rssParser = new parser();

export async function GET(req: NextRequest) {
  try {
    const feed = await rssParser.parseURL(
      "https://www.haaretz.co.il/cmlink/1.1477373"
    );

    const articles = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
      image: item.enclosure?.url || null,
    }));

    return NextResponse.json({ source: "haaretz", articles });
  } catch (error) {
    console.error("Failed to fetch Haaretz articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch Haaretz articles" },
      { status: 500 }
    );
  }
}
