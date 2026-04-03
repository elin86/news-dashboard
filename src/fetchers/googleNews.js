import Parser from "rss-parser";

const parser = new Parser();

function buildGoogleNewsRssUrl(keyword) {
  const encoded = encodeURIComponent(keyword);
  return `https://news.google.com/rss/search?q=${encoded}&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`;
}

export async function fetchGoogleNewsByKeyword(keyword) {
  const url = buildGoogleNewsRssUrl(keyword);

  try {
    const feed = await parser.parseURL(url);

    return (feed.items || []).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      source: item.source?.title || "Google News",
      keyword
    }));
  } catch (error) {
    console.error(`Fetch failed: ${keyword}`, error.message);
    return [];
  }
}