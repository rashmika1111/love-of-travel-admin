import { z } from 'zod';

// Base post schema for drafts
export const PostDraftSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters'),
  body: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  jsonLd: z.boolean().default(false),
});

// Extended schema for publishing (requires body and tags)
export const PostPublishSchema = PostDraftSchema.extend({
  body: z.string().min(1, 'Body is required for publishing'),
  tags: z.array(z.string()).min(1, 'At least one tag is required for publishing'),
  status: z.enum(['review', 'scheduled', 'published']),
  scheduledAt: z.date().optional(),
}).refine(
  (data) => {
    // If status is scheduled, scheduledAt must be provided and in the future
    if (data.status === 'scheduled') {
      return data.scheduledAt && data.scheduledAt > new Date();
    }
    return true;
  },
  {
    message: 'Scheduled date must be in the future',
    path: ['scheduledAt'],
  }
);

// Media upload validation
export const MediaUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'video']),
  sizeKB: z.number().max(25000, 'File size must be less than 25MB'),
});

// Search and filter schemas
export const PostSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'draft', 'review', 'scheduled', 'published']).default('all'),
  author: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Bulk action schema
export const BulkActionSchema = z.object({
  action: z.enum(['changeStatus', 'delete']),
  postIds: z.array(z.string()).min(1, 'Select at least one post'),
  status: z.enum(['draft', 'review', 'published']).optional(),
});

export type PostDraft = z.infer<typeof PostDraftSchema>;
export type PostPublish = z.infer<typeof PostPublishSchema>;
export type MediaUpload = z.infer<typeof MediaUploadSchema>;
export type PostSearch = z.infer<typeof PostSearchSchema>;
export type BulkAction = z.infer<typeof BulkActionSchema>;
