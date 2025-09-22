import { z } from 'zod';

// Content section schemas
export const HeroSectionSchema = z.object({
  type: z.literal('hero'),
  backgroundImage: z.string().min(1, 'Background image is required'),
  title: z.string().min(1, 'Hero title is required').max(200),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  publishDate: z.string().optional(),
  readTime: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1).default(0.3),
  // Enhanced styling options
  height: z.object({
    mobile: z.string().default('70vh'),
    tablet: z.string().default('80vh'),
    desktop: z.string().default('90vh')
  }).default({ mobile: '70vh', tablet: '80vh', desktop: '90vh' }),
  titleSize: z.object({
    mobile: z.string().default('text-3xl'),
    tablet: z.string().default('text-5xl'),
    desktop: z.string().default('text-6xl')
  }).default({ mobile: 'text-3xl', tablet: 'text-5xl', desktop: 'text-6xl' }),
  // Parallax and motion effects
  parallaxEnabled: z.boolean().default(true),
  parallaxSpeed: z.number().min(0).max(2).default(0.5),
  // Background positioning
  backgroundPosition: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
  backgroundSize: z.enum(['cover', 'contain', 'auto']).default('cover'),
  // Animation settings
  animation: z.object({
    enabled: z.boolean().default(true),
    type: z.enum(['fadeIn', 'slideUp', 'scaleIn', 'none']).default('fadeIn'),
    duration: z.number().min(0.1).max(3).default(0.8),
    delay: z.number().min(0).max(2).default(0)
  }).default({ enabled: true, type: 'fadeIn', duration: 0.8, delay: 0 }),
  socialSharing: z.object({
    enabled: z.boolean().default(true),
    platforms: z.array(z.enum(['facebook', 'twitter', 'linkedin', 'copy', 'share'])).default(['facebook', 'twitter', 'linkedin', 'copy']),
    position: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']).default('bottom-right'),
    style: z.enum(['glass', 'solid', 'outline']).default('glass')
  }).default({ 
    enabled: true, 
    platforms: ['facebook', 'twitter', 'linkedin', 'copy'], 
    position: 'bottom-right',
    style: 'glass'
  })
});

export const TextSectionSchema = z.object({
  type: z.literal('text'),
  content: z.string().min(1, 'Content is required'),
  hasDropCap: z.boolean().default(false),
  alignment: z.enum(['left', 'center', 'right', 'justify']).default('left'),
  fontSize: z.enum(['sm', 'base', 'lg', 'xl']).default('base'),
  // Enhanced typography options
  fontFamily: z.enum(['inter', 'serif', 'sans', 'mono']).default('inter'),
  lineHeight: z.enum(['tight', 'snug', 'normal', 'relaxed', 'loose']).default('relaxed'),
  // Drop cap styling
  dropCap: z.object({
    enabled: z.boolean().default(false),
    size: z.enum(['text-4xl', 'text-5xl', 'text-6xl']).default('text-4xl'),
    color: z.string().default('text-gray-900'),
    fontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),
    float: z.boolean().default(true)
  }).default({ enabled: false, size: 'text-4xl', color: 'text-gray-900', fontWeight: 'semibold', float: true }),
  // Animation settings
  animation: z.object({
    enabled: z.boolean().default(true),
    type: z.enum(['fadeIn', 'slideUp', 'slideInLeft', 'slideInRight', 'none']).default('fadeIn'),
    duration: z.number().min(0.1).max(3).default(0.3),
    delay: z.number().min(0).max(2).default(0.1)
  }).default({ enabled: true, type: 'fadeIn', duration: 0.3, delay: 0.1 })
});

export const ImageSectionSchema = z.object({
  type: z.literal('image'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  altText: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  rounded: z.boolean().default(true),
  shadow: z.boolean().default(true)
});

export const GallerySectionSchema = z.object({
  type: z.literal('gallery'),
  images: z.array(z.object({
    url: z.string().min(1, 'Image URL is required'),
    altText: z.string().optional(),
    caption: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional()
  })).min(1, 'At least one image is required'),
  layout: z.enum(['grid', 'masonry', 'carousel', 'postcard', 'complex']).default('grid'),
  columns: z.number().min(1).max(6).default(3),
  spacing: z.enum(['sm', 'md', 'lg']).default('md'),
  // Enhanced layout options
  responsive: z.object({
    mobile: z.object({
      layout: z.enum(['grid', 'carousel']).default('grid'),
      columns: z.number().min(1).max(2).default(2)
    }).default({ layout: 'grid', columns: 2 }),
    desktop: z.object({
      layout: z.enum(['grid', 'masonry', 'postcard', 'complex']).default('grid'),
      columns: z.number().min(1).max(6).default(3)
    }).default({ layout: 'grid', columns: 3 })
  }).default({ 
    mobile: { layout: 'grid', columns: 2 }, 
    desktop: { layout: 'grid', columns: 3 } 
  }),
  // Hover effects and animations
  hoverEffects: z.object({
    enabled: z.boolean().default(true),
    scale: z.number().min(1).max(1.2).default(1.03),
    shadow: z.boolean().default(true),
    overlay: z.boolean().default(true)
  }).default({ enabled: true, scale: 1.03, shadow: true, overlay: true }),
  // Animation settings
  animation: z.object({
    enabled: z.boolean().default(true),
    type: z.enum(['fadeIn', 'slideUp', 'stagger', 'none']).default('fadeIn'),
    duration: z.number().min(0.1).max(3).default(0.5),
    stagger: z.number().min(0).max(1).default(0.1)
  }).default({ enabled: true, type: 'fadeIn', duration: 0.5, stagger: 0.1 })
});

export const PopularPostsSectionSchema = z.object({
  type: z.literal('popular-posts'),
  title: z.string().default('Popular Posts'),
  description: z.string().optional(),
  featuredPost: z.object({
    title: z.string(),
    excerpt: z.string(),
    imageUrl: z.string(),
    readTime: z.string(),
    publishDate: z.string(),
    category: z.string()
  }).optional(),
  sidePosts: z.array(z.object({
    title: z.string(),
    excerpt: z.string(),
    imageUrl: z.string(),
    readTime: z.string(),
    publishDate: z.string()
  })).max(3).default([])
});

export const BreadcrumbSchema = z.object({
  enabled: z.boolean().default(true),
  items: z.array(z.object({
    label: z.string(),
    href: z.string().optional()
  })).min(1).default([
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '#destinations' }
  ])
});

// Breadcrumb section for content builder
export const BreadcrumbSectionSchema = z.object({
  type: z.literal('breadcrumb'),
  enabled: z.boolean().default(true),
  items: z.array(z.object({
    label: z.string(),
    href: z.string().optional()
  })).min(1).default([
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '#destinations' }
  ]),
  // Styling options
  style: z.object({
    separator: z.enum(['>', '→', '|', '/']).default('>'),
    textSize: z.enum(['sm', 'base', 'lg']).default('sm'),
    showHomeIcon: z.boolean().default(false),
    color: z.enum(['gray', 'blue', 'black']).default('gray')
  }).default({ separator: '>', textSize: 'sm', showHomeIcon: false, color: 'gray' })
});

// Content section union type
export const ContentSectionSchema = z.discriminatedUnion('type', [
  HeroSectionSchema,
  TextSectionSchema,
  ImageSectionSchema,
  GallerySectionSchema,
  PopularPostsSectionSchema,
  BreadcrumbSectionSchema
]);

// Base post schema for drafts
export const PostDraftSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters'),
  body: z.string().optional(),
  contentSections: z.array(ContentSectionSchema),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  breadcrumb: BreadcrumbSchema.default({ enabled: true, items: [{ label: 'Home', href: '/' }, { label: 'Destinations', href: '#destinations' }] }),
  readingTime: z.number().optional(),
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

// Content section types
export type HeroSection = z.infer<typeof HeroSectionSchema>;
export type TextSection = z.infer<typeof TextSectionSchema>;
export type ImageSection = z.infer<typeof ImageSectionSchema>;
export type GallerySection = z.infer<typeof GallerySectionSchema>;
export type PopularPostsSection = z.infer<typeof PopularPostsSectionSchema>;
export type BreadcrumbSection = z.infer<typeof BreadcrumbSectionSchema>;
export type ContentSection = z.infer<typeof ContentSectionSchema>;
export type Breadcrumb = z.infer<typeof BreadcrumbSchema>;

