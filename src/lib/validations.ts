import { z } from "zod";

export const createNeedSchema = z.object({
  content: z
    .string()
    .min(1, "内容を入力してください")
    .max(1000, "1000文字以内で入力してください"),
  sourceUrl: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  author: z.string().optional(),
  platform: z.enum(["threads", "manual"]).default("manual"),
});

export const searchNeedsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const createBookmarkSchema = z.object({
  needId: z.string().min(1, "ニーズIDが必要です"),
});

export type CreateNeedInput = z.infer<typeof createNeedSchema>;
export type SearchNeedsInput = z.infer<typeof searchNeedsSchema>;
export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
