import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    blog: "Blog",
    portfolio: "Portfolio",
    journal: "Journal",
    faith: "Faith",
    morningRevival: "Morning Revival",
    about: "About",
    search: "Search",
  },
  post: {
    publishedAt: "Published at",
    updatedAt: "Updated",
    sharePostIntro: "Share this post:",
    sharePostOn: "Share this post on {{platform}}",
    sharePostViaEmail: "Share this post via email",
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
  },
  home: {
    socialLinks: "Social Links",
    intro:
      "A quiet corner for work, writing, and reflection — on software, life, and faith.",
    recentPosts: "Recent Posts",
    allPosts: "All Posts",
    categoryPortfolioDesc: "Portfolio",
    categoryBlogDesc: "Blog",
    categoryJournalDesc: "Journal",
    categoryFaithDesc: "Faith",
    categoryMorningRevivalDesc: "Morning Revival",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  pages: {
    blogTitle: "Blog",
    blogDesc: "Long-form articles on tech and thinking.",

    portfolioTitle: "Portfolio",
    portfolioDesc: "A few things I've built.",

    journalTitle: "Journal",
    journalDesc: "Notes from everyday life.",

    faithTitle: "Faith",
    faithDesc: "Spiritual reading and reflections.",

    morningRevivalTitle: "Morning Revival",
    morningRevivalDesc: "Enjoyment and notes from the morning revival of the Word.",

    searchTitle: "Search",
    searchDesc: "Search any article ...",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
} satisfies UIStrings;
