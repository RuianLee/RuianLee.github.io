import { defineCollection } from "astro:content";
import type { BaseSchema, SchemaContext } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/blog";

/** Most categories share this shape; pass it straight to `collection()` or `.extend()` it. */
const basePostSchema = (_context: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    draft: z.boolean().optional(),
    author: z.string().default(config.site.author),
    /** Ref into `src/assets/covers/<ref>.<ext>`, resolved via `getCoverImage()`. */
    coverImage: z.string().optional(),
  });

function collection<S extends BaseSchema>(
  basePath: string,
  schema: S | ((context: SchemaContext) => S)
) {
  return defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: basePath }),
    schema,
  });
}

const blog = collection(`./${BLOG_PATH}`, ctx =>
  basePostSchema(ctx).extend({
    featured: z.boolean().optional(),
    ogImage: ctx.image().or(z.string()).optional(),
    canonicalURL: z.string().optional(),
    hideEditPost: z.boolean().optional(),
    timezone: z.string().optional(),
  })
);

const portfolio = collection("./src/content/portfolio", ctx =>
  basePostSchema(ctx).extend({
    tags: z.array(z.string()).default([]),
    url: z.string().optional(),
  })
);

const journal = collection("./src/content/journal", basePostSchema);

const faith = collection("./src/content/faith", ctx =>
  basePostSchema(ctx).extend({
    bookTitle: z.string(),
    bookAuthor: z.string(),
  })
);

const morningRevivalLife = collection(
  "./src/content/morning-revival",
  basePostSchema
);

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
