export function rankNewsImportance(item) {
  const text = `${item.title} ${item.source || ""}`.toLowerCase();

  const highPriorityKeywords = [
    "earnings",
    "revenue",
    "guidance",
    "acquisition",
    "merger",
    "partnership",
    "investment",
    "funding",
    "launch",
    "announced",
    "quarter",
    "財報",
    "營收",
    "合作",
    "併購",
    "投資",
    "發布",
    "公告"
  ];

  const mediumPriorityKeywords = [
    "market",
    "industry",
    "trend",
    "analysis",
    "preview",
    "report",
    "產業",
    "市場",
    "分析",
    "報導"
  ];

  if (highPriorityKeywords.some((keyword) => text.includes(keyword))) {
    return "high";
  }

  if (mediumPriorityKeywords.some((keyword) => text.includes(keyword))) {
    return "medium";
  }

  return "low";
}

export function attachImportance(items) {
  return items.map((item) => ({
    ...item,
    importance: rankNewsImportance(item)
  }));
}