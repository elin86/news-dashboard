import { isWithinLast24Hours } from "../utils/time.js";

export function deduplicateNews(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.title}_${item.link}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function filterLast24Hours(items) {
  return items.filter((item) => isWithinLast24Hours(item.pubDate));
}

export function groupByCompany(items, companies) {
  return companies.map((company) => {
    const matched = items.filter((item) =>
      company.keywords.some((keyword) =>
        item.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    return {
      company: company.displayName,
      count: matched.length,
      news: matched
    };
  });
}