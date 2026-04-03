  import { readJson, writeJson } from "./utils/file.js";
  import { fetchGoogleNewsByKeyword } from "./fetchers/googleNews.js";
  import {
    deduplicateNews,
   filterLast24Hours,
    groupByCompany
  } from "./core/normalize.js";
  import { attachImportance } from "./core/rank.js";
  import { summarizeGroupedNews } from "./core/summarize.js";
  import { buildHtml } from "./core/buildHtml.js";
  import fs from "fs";
  import { buildLineText } from "./core/buildLineText.js";
  import { sendLineMessage } from "./delivery/sendLine.js";

async function main() {
  console.log("Start fetching news...");

  const companies = await readJson("./config/companies.json");
  const enabledCompanies = companies.filter((company) => company.enabled);

  let allNews = [];

  for (const company of enabledCompanies) {
    console.log(`Fetching: ${company.displayName}`);

    for (const keyword of company.keywords) {
      const news = await fetchGoogleNewsByKeyword(keyword);
      allNews.push(...news);
    }
  }

  console.log(`Total fetched: ${allNews.length}`);

  const deduplicated = deduplicateNews(allNews);
  const last24HoursNews = filterLast24Hours(deduplicated);
  const rankedNews = attachImportance(last24HoursNews);
  const grouped = groupByCompany(rankedNews, enabledCompanies);
  const summary = summarizeGroupedNews(grouped);

  const output = {
    generatedAt: new Date().toISOString(),
    totalNewsCount: rankedNews.length,
    companies: grouped,
    summary
};

await writeJson("./data/output/news-grouped.json", output);

const html = buildHtml(summary);
fs.writeFileSync("./data/output/index.html", html);
const dashboardUrl = "https://你的網址/index.html";
const lineText = buildLineText(summary, dashboardUrl);
await sendLineMessage(lineText);

console.log("Done!");
console.log("Output saved to data/output/news-grouped.json");
console.log("HTML saved to data/output/index.html");
console.log("LINE message sent");
}

main().catch((err) => {
  console.error("Error:", err);
});