export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing." });
  }
  try {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from NewsAPI: ${response.status}`);
    }
    const data = await response.json();
    const articles = data.articles.map((article) => ({
      title: article.title,
      image: article.urlToImage || "https://via.placeholder.com/400x200",
      link: article.url,
      source: article.source.name,
      time: new Date(article.publishedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    return res.status(200).json({ articles });
  } catch (err) {
    console.error("Error fetching top headlines:", err);
    return res.status(500).json({ error: "Failed to fetch top headlines." });
  }
}
