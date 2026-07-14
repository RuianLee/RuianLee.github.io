import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const portfolio = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/portfolio",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    tags: z.array(z.string()).default([]),
    url: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const journal = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/journal",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    draft: z.boolean().optional(),
  }),
});

const faith = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/faith",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    bookTitle: z.string(),
    bookAuthor: z.string(),
    draft: z.boolean().optional(),
  }),
});

const morningRevivalLife = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/morning-revival",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    draft: z.boolean().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = {
  blog,
  portfolio,
  journal,
  faith,
  "morning-revival": morningRevivalLife,
  pages,
};
