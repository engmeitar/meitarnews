// Trigger redeploy: minor update
import React, { useState, useEffect } from "react";
import { groupArticles, Article, GroupedArticle } from "./utils/groupArticles";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    left: "",
    center: "",
    right: "",
    summary: "",
  });
  const [error, setError] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [clusters, setClusters] = useState<GroupedArticle[]>([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=e596c01e008d4bfeafdd8e3922247f93"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
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
        setRecommended(articles);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError(
          "Could not load live news articles. Please check your API key or network settings."
        );
      }
    };

    fetchRecommended();
  }, []);

  useEffect(() => {
    const loadGroupedArticles = async () => {
      try {
        const sources = ["bbc", "guardian", "fox-news"];
        const fetchFrom = async (src: string): Promise<Article[]> => {
          const res = await fetch(`/api/fetch-${src}`);
          const data = await res.json();
          return data.articles.map((a: any) => ({ ...a, source: src }));
        };
        const all = await Promise.all(sources.map(fetchFrom));
        const flat = all.flat();
        const grouped = groupArticles(flat);
        setClusters(grouped);
      } catch (err) {
        console.error("Failed to load grouped articles:", err);
      }
    };

    loadGroupedArticles();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError("");
    setResults({ left: "", center: "", right: "", summary: "" });

    try {
      const data = {
        left: `Example left-leaning headline about ${searchTerm}`,
        center: `Example center headline about ${searchTerm}`,
        right: `Example right-leaning headline about ${searchTerm}`,
        summary: `A politically neutral summary about ${searchTerm}, combining perspectives from all sides.`,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-serif">
      <header className="bg-white shadow sticky top-0 z-20 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Neutral News
          </h1>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-blue-600">
              World
            </a>
            <a href="#" className="hover:text-blue-600">
              Politics
            </a>
            <a href="#" className="hover:text-blue-600">
              Technology
            </a>
            <a href="#" className="hover:text-blue-600">
              Health
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid gap-10 bg-gray-50">
        <section className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search for a topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 w-full p-3 border border-gray-300 rounded"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 w-full md:w-auto"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </section>

        {recommended.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🗞️ Recommended Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((article, index) => (
                <a
                  key={index}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block border rounded-lg bg-white overflow-hidden hover:shadow-md transition-all duration-200 ${
                    index === 0 ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <img
                    src={article.image}
                    alt={`Cover image for ${article.title}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200";
                    }}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Source: {article.source} • {article.time}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {clusters.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🧠 Grouped Articles by Topic
            </h2>
            <div className="space-y-6">
              {clusters.map((cluster, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4 border">
                  <h3 className="text-lg font-semibold mb-1">
                    {cluster.title}
                  </h3>
                  <p className="text-sm italic text-gray-500 mb-2">
                    Common keywords: {cluster.commonKeywords.join(", ")}
                  </p>
                  <ul className="list-disc ml-5">
                    {cluster.articles.map((a, idx) => (
                      <li key={idx}>
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {a.title}
                        </a>{" "}
                        <span className="text-xs text-gray-500">
                          ({a.source})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 border border-red-300 rounded">
            {error}
          </div>
        )}

        {results.left && results.center && results.right ? (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Coverage From All Sides
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-4 border rounded">
                <h3 className="font-semibold text-red-700 mb-2">Left</h3>
                <p>{results.left}</p>
              </div>
              <div className="bg-gray-50 p-4 border rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Center</h3>
                <p>{results.center}</p>
              </div>
              <div className="bg-gray-50 p-4 border rounded">
                <h3 className="font-semibold text-blue-700 mb-2">Right</h3>
                <p>{results.right}</p>
              </div>
            </div>
          </section>
        ) : (
          !loading &&
          searchTerm && (
            <p className="text-sm text-gray-500">
              Try a different topic to see results.
            </p>
          )
        )}

        {results.summary && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Neutral Summary
            </h2>
            <div className="bg-gray-50 p-4 border rounded">
              <p className="text-base leading-relaxed text-gray-800">
                {results.summary}
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} Neutral News. All rights reserved.{" "}
        <br />
        Neutral News provides balanced summaries from various viewpoints and
        does not endorse any specific source.
      </footer>
    </div>
  );
}
