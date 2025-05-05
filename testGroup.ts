import { groupArticles } from "./src/utils/groupArticles";

const allSources = [
  {
    source: "guardian",
    articles: [
      {
        title: "Corporate Power Criticized",
        link: "",
        pubDate: "",
        description: "",
      },
    ],
  },
  {
    source: "fox",
    articles: [
      {
        title: "Radical Spending Cuts",
        link: "",
        pubDate: "",
        description: "",
      },
    ],
  },
  {
    source: "bbc",
    articles: [
      {
        title: "Economic Shift",
        link: "",
        pubDate: "",
        description: "",
      },
    ],
  },
];

const result = groupArticles("power", allSources);
console.log("✅ Grouped Result:\n", JSON.stringify(result, null, 2));
