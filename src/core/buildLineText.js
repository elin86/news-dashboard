export function buildLineText(summaryData, dashboardUrl) {
  const lines = [];
  lines.push("📰 24H News Summary");

  for (const company of summaryData) {
    lines.push("");
    lines.push(`🏢 ${company.company}`);
    lines.push(
      `High ${company.highCount} | Medium ${company.mediumCount} | Low ${company.lowCount}`
    );

    const topItems = company.topNews.slice(0, 3);
    for (const item of topItems) {
      lines.push(`- [${item.importance}] ${item.title}`);
    }
  }

  if (dashboardUrl) {
    lines.push("");
    lines.push("🔗 查看完整面板");
    lines.push(dashboardUrl);
  }

  return lines.join("\n").slice(0, 4500);
}