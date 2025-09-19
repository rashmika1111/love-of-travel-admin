import { PostDraft, PostPublish, PostSearch, BulkAction, MediaUpload } from './validation';

export type Post = PostDraft & {
  id: string;
  author: string;
  status: 'draft' | 'review' | 'scheduled' | 'published';
  createdAt: Date;
  updatedAt: Date;
  scheduledAt?: Date;
  publishedAt?: Date;
};

export type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video';
  sizeKB: number;
  filename: string;
  uploadedAt: Date;
};

// Mock data store
const posts = new Map<string, Post>();
const mediaAssets = new Map<string, MediaAsset>();

// Initialize with some mock data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to Love of Travel',
    slug: 'welcome-to-love-of-travel',
    body: 'This is our first blog post about travel adventures...',
    tags: ['travel', 'welcome'],
    categories: ['general'],
    status: 'published',
    author: 'John Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Top 10 Destinations for 2024',
    slug: 'top-10-destinations-2024',
    body: 'Discover the most amazing places to visit this year...',
    tags: ['destinations', '2024', 'travel'],
    categories: ['destinations'],
    status: 'draft',
    author: 'Jane Smith',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Travel Tips for Beginners',
    slug: 'travel-tips-beginners',
    body: 'Essential advice for first-time travelers...',
    tags: ['tips', 'beginners'],
    categories: ['tips'],
    status: 'review',
    author: 'Mike Johnson',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

const mockMedia: MediaAsset[] = [
  // No preloaded media - start with empty library
];

// Initialize mock data
mockPosts.forEach(post => posts.set(post.id, post));
mockMedia.forEach(asset => mediaAssets.set(asset.id, asset));

// Posts API
export async function createPost(data: PostDraft): Promise<{ id: string }> {
  const id = Math.random().toString(36).substr(2, 9);
  const post: Post = {
    ...data,
    id,
    author: 'Current User', // In real app, get from auth
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  posts.set(id, post);
  return { id };
}

export async function getPosts(searchParams: PostSearch): Promise<{ rows: Post[]; total: number }> {
  let filteredPosts = Array.from(posts.values());
  
  // Apply filters
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(search) ||
      post.body?.toLowerCase().includes(search) ||
      post.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }
  
  if (searchParams.status !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.status === searchParams.status);
  }
  
  if (searchParams.author) {
    filteredPosts = filteredPosts.filter(post => 
      post.author.toLowerCase().includes(searchParams.author.toLowerCase())
    );
  }
  
  if (searchParams.dateFrom) {
    const fromDate = new Date(searchParams.dateFrom);
    filteredPosts = filteredPosts.filter(post => post.createdAt >= fromDate);
  }
  
  if (searchParams.dateTo) {
    const toDate = new Date(searchParams.dateTo);
    filteredPosts = filteredPosts.filter(post => post.createdAt <= toDate);
  }
  
  // Sort by updated date (newest first)
  filteredPosts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  
  // Pagination
  const total = filteredPosts.length;
  const start = (searchParams.page - 1) * searchParams.limit;
  const end = start + searchParams.limit;
  const rows = filteredPosts.slice(start, end);
  
  return { rows, total };
}

export async function getPost(id: string): Promise<Post | null> {
  return posts.get(id) || null;
}

export async function updatePost(id: string, data: Partial<PostPublish>): Promise<Post | null> {
  const existing = posts.get(id);
  if (!existing) return null;
  
  const updated: Post = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };
  
  posts.set(id, updated);
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  return posts.delete(id);
}

export async function bulkUpdatePosts(action: BulkAction): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  
  for (const id of action.postIds) {
    try {
      if (action.action === 'delete') {
        if (posts.delete(id)) {
          success++;
        } else {
          failed++;
        }
      } else if (action.action === 'changeStatus' && action.status) {
        const post = posts.get(id);
        if (post) {
          posts.set(id, { ...post, status: action.status, updatedAt: new Date() });
          success++;
        } else {
          failed++;
        }
      }
    } catch {
      failed++;
    }
  }
  
  return { success, failed };
}

export async function generatePreviewUrl(id: string): Promise<{ previewUrl: string }> {
  // Mock implementation - in real app, generate signed URL
  const token = Math.random().toString(36).substr(2, 16);
  return { previewUrl: `/preview/post/${id}?token=${token}` };
}

// Media API
export async function getMediaAssets(): Promise<MediaAsset[]> {
  return Array.from(mediaAssets.values()).sort((a, b) => 
    b.uploadedAt.getTime() - a.uploadedAt.getTime()
  );
}

export async function uploadMedia(file: File): Promise<{ id: string; url: string }> {
  // Mock implementation - in real app, upload to storage service
  const id = Math.random().toString(36).substr(2, 9);
  
  // Create a data URL for immediate preview
  const url = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
  
  const asset: MediaAsset = {
    id,
    url,
    type: file.type.startsWith('video/') ? 'video' : 'image',
    sizeKB: Math.round(file.size / 1024),
    filename: file.name,
    uploadedAt: new Date(),
  };
  
  mediaAssets.set(id, asset);
  return { id, url };
}

export async function checkSlugAvailability(slug: string, excludeId?: string): Promise<boolean> {
  const existing = Array.from(posts.values()).find(post => 
    post.slug === slug && post.id !== excludeId
  );
  return !existing;
}
