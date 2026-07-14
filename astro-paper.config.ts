import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://RuianLee.github.io/",
    title: "Ruian's Life",
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
