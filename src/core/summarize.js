export function summarizeGroupedNews(groupedCompanies) {
  return groupedCompanies.map((companyGroup) => {
    const high = companyGroup.news.filter((item) => item.importance === "high");
    const medium = companyGroup.news.filter((item) => item.importance === "medium");
    const low = companyGroup.news.filter((item) => item.importance === "low");

    return {
      company: companyGroup.company,
      totalCount: companyGroup.news.length,
      highCount: high.length,
      mediumCount: medium.length,
      lowCount: low.length,
      topNews: [...high, ...medium, ...low].slice(0, 10)
    };
  });
}