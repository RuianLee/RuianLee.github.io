import { defineAstroPaperConfig } from "./src/types/config";
/**
 * defineAstroPaperConfig
 * 是 AstroPaper 博客主題的 TypeScript 設置函數
 * 用於在 astro-paper.config.ts 文件中
 * 集中設定網站元數據、分頁數量、社交鏈接與主題功能、確保配置項的類型安全。
 */
export default defineAstroPaperConfig({
  /**
   * site
   * 網站元數據配置
   * 包含網站標題、URL、描述、作者信息、語言設置等
   */
  site: {
    title: "Ruian's Blog", // 部落格標題
    avatar: "/avatar.jpg", // 頭像圖片文件名
    url: "https://RuianLee.github.io/",
    description: "作品集、文集、隨筆與靈修分享——一個安靜記錄生活與思考的角落。",
    author: "RuianLee",
    profile: "https://github.com/RuianLee",
    ogImage: "default-og.jpg",
    lang: "zh-Hant",
    timezone: "Asia/Taipei",
    dir: "ltr",
  },
  posts: {
    perPage: 5,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: false,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/RuianLee" }],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
