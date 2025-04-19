export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    const url = "https://feeds.reuters.com/Reuters/worldNews";

    const rssRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // trick to bypass bot filters
      },
    });

    const xml = await rssRes.text();

    return new Response(JSON.stringify({ rawXml: xml }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Edge fetch failed:", err);
    return new Response(JSON.stringify({ error: "Reuters fetch failed" }), {
      status: 500,
    });
  }
}
