/*
 * EOHE Lab content entry point.
 *
 * Add new news records at the top of `news`. The homepage sorts them by date,
 * so the newest item is always displayed first. Keep both Chinese and English
 * text in each record and place detail pages in the project root.
 */
window.EOHE_CONTENT = {
  news: [
    {
      date: "2026-07-15",
      displayDate: "07 / 2026",
      href: "news-jrs-arctic-greening-2026.html",
      zh: {
        tag: "论文发表",
        title: "课题组最新研究成果发表于 Journal of Remote Sensing",
        ariaLabel: "阅读新闻详情",
      },
      en: {
        tag: "PUBLICATION",
        title: "New research published in Journal of Remote Sensing",
        ariaLabel: "Read news story",
      },
    },
    {
      date: "2026-06-16",
      displayDate: "06 / 2026",
      href: "news-brics-2026.html",
      zh: {
        tag: "学术交流 · 深圳",
        title: "课题组受邀参加 2026 金砖国家未来网络创新论坛边会",
        ariaLabel: "阅读新闻详情",
      },
      en: {
        tag: "ACADEMIC EXCHANGE · SHENZHEN",
        title:
          "Lab invited to the 2026 BRICS Forum on Future Networks Innovation side event",
        ariaLabel: "Read news story",
      },
    },
    {
      date: "2026-05-08",
      displayDate: "05 / 2026",
      href: "news-egu-2026.html",
      zh: {
        tag: "学术交流 · 维也纳",
        title: "课题组成员参加 EGU 2026 并作口头报告",
        ariaLabel: "阅读新闻详情",
      },
      en: {
        tag: "ACADEMIC EXCHANGE · VIENNA",
        title: "Lab member presents at EGU 2026",
        ariaLabel: "Read news story",
      },
    },
  ],
};
