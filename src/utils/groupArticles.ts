// src/utils/groupArticles.ts

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image: string | null;
  source: string;
}

export interface GroupedArticle {
  clusterId: number;
  articles: Article[];
  title: string;
  commonKeywords: string[];
}

// Very basic keyword extractor from the title & description
function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4); // ignore short/common words
}

// Compute basic similarity score between two articles
function similarityScore(a: Article, b: Article): number {
  const aKeywords = new Set(extractKeywords(a.title + " " + a.description));
  const bKeywords = new Set(extractKeywords(b.title + " " + b.description));

  const intersection = [...aKeywords].filter((k) => bKeywords.has(k));
  const union = new Set([...aKeywords, ...bKeywords]);

  return intersection.length / union.size;
}

export function groupArticles(
  articles: Article[],
  threshold = 0.2
): GroupedArticle[] {
  const clusters: GroupedArticle[] = [];
  let clusterId = 0;

  for (const article of articles) {
    let placed = false;

    for (const cluster of clusters) {
      const avgScore =
        cluster.articles.reduce(
          (sum, a) => sum + similarityScore(article, a),
          0
        ) / cluster.articles.length;

      if (avgScore >= threshold) {
        cluster.articles.push(article);
        cluster.commonKeywords = Array.from(
          new Set(
            cluster.commonKeywords.concat(
              extractKeywords(article.title + " " + article.description)
            )
          )
        );
        placed = true;
        break;
      }
    }

    if (!placed) {
      clusters.push({
        clusterId: clusterId++,
        articles: [article],
        title: article.title,
        commonKeywords: extractKeywords(
          article.title + " " + article.description
        ),
      });
    }
  }

  return clusters;
}
