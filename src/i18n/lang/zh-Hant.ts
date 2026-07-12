import type { UIStrings } from "../types";

export default {
  nav: {
    home: "首頁",
    blog: "文集",
    portfolio: "作品集",
    journal: "隨筆",
    faith: "靈修分享",
    about: "關於",
    search: "搜尋",
  },
  post: {
    publishedAt: "發佈於",
    updatedAt: "更新於",
    sharePostIntro: "分享這篇文章：",
    sharePostOn: "分享到 {{platform}}",
    sharePostViaEmail: "以電子郵件分享",
    backToTop: "回到頂端",
    goBack: "返回",
    editPage: "編輯此頁",
    previousPost: "上一篇",
    nextPost: "下一篇",
  },
  pagination: {
    prev: "上一頁",
    next: "下一頁",
    page: "第",
  },
  home: {
    socialLinks: "社群連結",
    intro:
      "這裡收著一些作品、文字與思考的痕跡——關於軟體、關於生活，也關於信仰。歡迎慢慢翻閱。",
    featured: "精選",
    recentPosts: "最新文章",
    allPosts: "所有文章",
    categoryPortfolio: "詩",
    categoryPortfolioDesc: "作品集",
    categoryBlog: "記",
    categoryBlogDesc: "文集",
    categoryJournal: "思",
    categoryJournalDesc: "隨筆",
    categoryFaith: "靈",
    categoryFaithDesc: "靈修分享",
  },
  footer: {
    copyright: "版權所有",
    allRightsReserved: "保留一切權利。",
  },
  pages: {
    blogTitle: "文集",
    blogDesc: "關於技術與思考的長篇文章。",

    portfolioTitle: "作品集",
    portfolioDesc: "一些做過的作品與side project。",

    journalTitle: "隨筆",
    journalDesc: "生活中的隨手記錄。",

    faithTitle: "靈修分享",
    faithDesc: "屬靈書報與讀書心得分享。",

    searchTitle: "搜尋",
    searchDesc: "搜尋任何文章……",
  },
  a11y: {
    skipToContent: "跳到主要內容",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
    toggleTheme: "切換深色/淺色模式",
    searchPlaceholder: "搜尋文章……",
    noResults: "找不到相關結果",
    goToPreviousPage: "上一頁",
    goToNextPage: "下一頁",
  },
  notFound: {
    title: "404 找不到頁面",
    message: "這個頁面不存在",
    goHome: "回到首頁",
  },
} satisfies UIStrings;
