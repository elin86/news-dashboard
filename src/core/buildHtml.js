export function buildHtml(summaryData) {
  const now = new Date().toLocaleString("zh-TW");

  const totalHigh = summaryData.reduce((sum, c) => sum + c.highCount, 0);
  const totalMedium = summaryData.reduce((sum, c) => sum + c.mediumCount, 0);
  const totalLow = summaryData.reduce((sum, c) => sum + c.lowCount, 0);

  const badgeClassMap = {
    high: "badge badge-high",
    medium: "badge badge-medium",
    low: "badge badge-low"
  };

  function renderBadge(level) {
    return `<span class="${badgeClassMap[level]}">${level.toUpperCase()}</span>`;
  }

  function escapeHtml(text = "") {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function makeAnchorId(companyName) {
    return `company-${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  }

  function renderNewsItem(item) {
    return `
      <article class="news-item">
        <div class="news-item-top">
          <a
            class="news-link"
            href="${escapeHtml(item.link)}"
            target="_blank"
            rel="noreferrer"
          >
            ${escapeHtml(item.title)}
          </a>
          ${renderBadge(item.importance)}
        </div>

        <div class="news-meta">
          <span>${escapeHtml(item.source || "Unknown Source")}</span>
          <span>${escapeHtml(item.pubDate || "")}</span>
        </div>
      </article>
    `;
  }

  function renderCompanyCard(company) {
    const anchorId = makeAnchorId(company.company);

    const visibleItems = company.topNews.slice(0, 3);
    const hiddenItems = company.topNews.slice(3);

    const visibleHtml = visibleItems.map(renderNewsItem).join("");
    const hiddenHtml = hiddenItems.map(renderNewsItem).join("");

    const detailsBlock =
      hiddenItems.length > 0
        ? `
        <details class="mobile-expand desktop-hidden">
          <summary>
            Show more (${hiddenItems.length})
          </summary>
          <div class="expanded-news">
            ${hiddenHtml}
          </div>
        </details>
      `
        : "";

    const desktopHtml =
      hiddenItems.length > 0
        ? `
        <div class="desktop-only">
          ${hiddenHtml}
        </div>
      `
        : "";

    return `
      <section class="company-card" id="${anchorId}">
        <div class="company-card-topline">
          <a class="jump-top" href="#top">↑ Jump to top</a>
        </div>

        <div class="company-header">
          <div>
            <h2 class="company-title">${escapeHtml(company.company)}</h2>
            <div class="company-subtitle">
              Top ${company.topNews.length} selected stories
            </div>
          </div>

          <div class="company-total">
            <div class="company-total-label">Total</div>
            <div class="company-total-value">${company.totalCount}</div>
          </div>
        </div>

        <div class="company-stats">
          <div class="stat-pill stat-pill-high">High: <b>${company.highCount}</b></div>
          <div class="stat-pill stat-pill-medium">Medium: <b>${company.mediumCount}</b></div>
          <div class="stat-pill stat-pill-low">Low: <b>${company.lowCount}</b></div>
        </div>

        <div class="news-list">
          ${visibleHtml}
          ${desktopHtml}
          ${detailsBlock}
        </div>
      </section>
    `;
  }

  function renderCompanyChips(companies) {
    return companies
      .map((company) => {
        const anchorId = makeAnchorId(company.company);
        return `
          <a class="company-chip" href="#${anchorId}">
            ${escapeHtml(company.company)}
          </a>
        `;
      })
      .join("");
  }

  const chips = renderCompanyChips(summaryData);
  const cards = summaryData.map(renderCompanyCard).join("");

  return `
  <!DOCTYPE html>
  <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>24H News Dashboard</title>
      <style>
        :root {
          --bg-1: #060816;
          --bg-2: #0b1020;
          --bg-3: #111827;
          --card-bg: linear-gradient(180deg, rgba(22, 28, 58, 0.92) 0%, rgba(15, 20, 40, 0.92) 100%);
          --card-border: rgba(255, 255, 255, 0.08);
          --soft-border: rgba(255, 255, 255, 0.06);
          --text-main: #f8fafc;
          --text-body: #e5e7eb;
          --text-muted: #94a3b8;
          --link: #dbeafe;
          --high-bg: rgba(239, 68, 68, 0.18);
          --high-text: #f87171;
          --medium-bg: rgba(245, 158, 11, 0.18);
          --medium-text: #fbbf24;
          --low-bg: rgba(148, 163, 184, 0.16);
          --low-text: #cbd5e1;
          --chip-bg: rgba(255, 255, 255, 0.06);
          --chip-border: rgba(255, 255, 255, 0.09);
          --chip-hover: rgba(147, 197, 253, 0.14);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        html, body {
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text-body);
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(56, 189, 248, 0.10), transparent 28%),
            radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 24%),
            linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 55%, var(--bg-3) 100%);
        }

        .page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 36px 28px 48px;
        }

        .header {
          margin-bottom: 22px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
        }

        .eyebrow {
          font-size: 13px;
          color: #93c5fd;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .page-title {
          margin: 0 0 10px 0;
          font-size: 52px;
          line-height: 1.08;
          color: var(--text-main);
        }

        .updated-time {
          font-size: 16px;
          color: var(--text-muted);
        }

        .kpi-row {
          display: flex;
          gap: 12px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .kpi-row::-webkit-scrollbar {
          display: none;
        }

        .kpi-card {
          flex: 0 0 auto;
          min-width: 120px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--card-border);
          padding: 12px 16px;
          border-radius: 16px;
          color: #e2e8f0;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.20);
        }

        .kpi-label {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .kpi-value {
          font-size: 26px;
          font-weight: 700;
        }

        .kpi-high {
          color: var(--high-text);
        }

        .kpi-medium {
          color: var(--medium-text);
        }

        .kpi-low {
          color: var(--low-text);
        }

        .chip-row {
          display: flex;
          gap: 10px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding: 6px 0 4px;
          margin-bottom: 26px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .chip-row::-webkit-scrollbar {
          display: none;
        }

        .company-chip {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 999px;
          text-decoration: none;
          color: #dbeafe;
          background: var(--chip-bg);
          border: 1px solid var(--chip-border);
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }

        .company-chip:hover {
          background: var(--chip-hover);
          border-color: rgba(147, 197, 253, 0.22);
          transform: translateY(-1px);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 22px;
          align-items: start;
        }

        .company-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(10px);
          scroll-margin-top: 24px;
        }

        .company-card-topline {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }

        .jump-top {
          font-size: 12px;
          color: #93c5fd;
          text-decoration: none;
          background: rgba(147, 197, 253, 0.08);
          border: 1px solid rgba(147, 197, 253, 0.14);
          padding: 6px 10px;
          border-radius: 999px;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .jump-top:hover {
          background: rgba(147, 197, 253, 0.16);
          transform: translateY(-1px);
        }

        .company-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
        }

        .company-title {
          margin: 0 0 8px 0;
          font-size: 32px;
          color: var(--text-main);
          letter-spacing: 0.2px;
        }

        .company-subtitle {
          color: var(--text-muted);
          font-size: 14px;
        }

        .company-total {
          min-width: 92px;
          text-align: right;
          color: var(--low-text);
          font-size: 13px;
        }

        .company-total-label {
          opacity: 0.75;
        }

        .company-total-value {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
        }

        .company-stats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .stat-pill {
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          border: 1px solid transparent;
        }

        .stat-pill-high {
          background: rgba(239, 68, 68, 0.12);
          color: #fecaca;
          border-color: rgba(239, 68, 68, 0.15);
        }

        .stat-pill-medium {
          background: rgba(245, 158, 11, 0.12);
          color: #fde68a;
          border-color: rgba(245, 158, 11, 0.15);
        }

        .stat-pill-low {
          background: rgba(148, 163, 184, 0.12);
          color: #e2e8f0;
          border-color: rgba(148, 163, 184, 0.15);
        }

        .news-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .news-item {
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(9, 14, 32, 0.72);
          border: 1px solid var(--soft-border);
        }

        .news-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .news-link {
          color: var(--link);
          text-decoration: none;
          font-size: 15px;
          line-height: 1.6;
          font-weight: 500;
          flex: 1;
          word-break: break-word;
        }

        .news-link:hover {
          text-decoration: underline;
        }

        .news-meta {
          margin-top: 10px;
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        .badge-high {
          background: var(--high-bg);
          color: var(--high-text);
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .badge-medium {
          background: var(--medium-bg);
          color: var(--medium-text);
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .badge-low {
          background: var(--low-bg);
          color: var(--low-text);
          border: 1px solid rgba(148, 163, 184, 0.22);
        }

        .desktop-only {
          display: block;
        }

        .desktop-hidden {
          display: none;
        }

        .mobile-expand {
          margin-top: 2px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .mobile-expand summary {
          list-style: none;
          cursor: pointer;
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #cbd5e1;
          user-select: none;
        }

        .mobile-expand summary::-webkit-details-marker {
          display: none;
        }

        .mobile-expand summary::after {
          content: "▾";
          float: right;
          color: #94a3b8;
          transition: transform 0.2s ease;
        }

        .mobile-expand[open] summary::after {
          transform: rotate(180deg);
        }

        .expanded-news {
          padding: 0 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .page {
            padding: 28px 18px 36px;
          }

          .page-title {
            font-size: 44px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .page {
            padding: 20px 14px 28px;
          }

          .header {
            margin-bottom: 18px;
          }

          .header-top {
            flex-direction: column;
            align-items: stretch;
            gap: 18px;
          }

          .page-title {
            font-size: 36px;
            line-height: 1.1;
            margin-bottom: 8px;
          }

          .updated-time {
            font-size: 14px;
          }

          .kpi-card {
            min-width: 112px;
            padding: 12px 14px;
            border-radius: 14px;
          }

          .chip-row {
            margin-bottom: 20px;
            gap: 8px;
          }

          .company-chip {
            padding: 9px 12px;
            font-size: 13px;
          }

          .company-card {
            padding: 16px;
            border-radius: 18px;
          }

          .company-card-topline {
            margin-bottom: 8px;
          }

          .jump-top {
            font-size: 11px;
            padding: 5px 9px;
          }

          .company-header {
            margin-bottom: 14px;
          }

          .company-title {
            font-size: 24px;
            margin-bottom: 6px;
          }

          .company-subtitle {
            font-size: 13px;
          }

          .company-total {
            min-width: auto;
          }

          .company-total-value {
            font-size: 24px;
          }

          .company-stats {
            gap: 8px;
            margin-bottom: 14px;
          }

          .stat-pill {
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 12px;
          }

          .news-item {
            padding: 12px;
            border-radius: 12px;
          }

          .news-item-top {
            flex-direction: column;
            gap: 10px;
          }

          .news-link {
            font-size: 15px;
            line-height: 1.5;
          }

          .news-meta {
            margin-top: 8px;
            font-size: 11px;
            gap: 8px;
          }

          .badge {
            align-self: flex-start;
            font-size: 11px;
            padding: 4px 9px;
          }

          .desktop-only {
            display: none;
          }

          .desktop-hidden {
            display: block;
          }
        }
      </style>
    </head>

    <body id="top">
      <div class="page">
        <header class="header">
          <div class="header-top">
            <div>
              <div class="eyebrow">24-hour market news monitor</div>
              <h1 class="page-title">24H News Summary</h1>
              <div class="updated-time">Updated: ${now}</div>
            </div>

            <div class="kpi-row">
              <div class="kpi-card">
                <div class="kpi-label">High</div>
                <div class="kpi-value kpi-high">${totalHigh}</div>
              </div>

              <div class="kpi-card">
                <div class="kpi-label">Medium</div>
                <div class="kpi-value kpi-medium">${totalMedium}</div>
              </div>

              <div class="kpi-card">
                <div class="kpi-label">Low</div>
                <div class="kpi-value kpi-low">${totalLow}</div>
              </div>
            </div>
          </div>
        </header>

        <nav class="chip-row">
          ${chips}
        </nav>

        <main class="dashboard-grid">
          ${cards}
        </main>
      </div>
    </body>
  </html>
  `;
}