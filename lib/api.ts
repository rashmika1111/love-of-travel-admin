import { PostDraft, PostPublish, PostSearch, BulkAction } from './validation';
import { loadPosts, savePosts, loadMediaAssets, saveMediaAssets } from './persistence';

export type Post = PostDraft & {
  id: string;
  author: string;
  status: 'draft' | 'review' | 'scheduled' | 'published';
  createdAt: Date;
  updatedAt: Date;
  scheduledAt?: Date;
  publishedAt?: Date;
};

export type ContentPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  contentSections: unknown[];
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
  lastSyncedAt?: Date;
};

export type MediaAsset = {
  id: string;
  url: string;
  type: 'image' | 'video';
  sizeKB: number;
  filename: string;
  uploadedAt: Date;
};

// Data stores - will be loaded from persistence
let posts = new Map<string, Post>();
let mediaAssets = new Map<string, MediaAsset>();


// Initialize with some mock data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to Love of Travel',
    slug: 'welcome-to-love-of-travel',
    body: 'This is our first blog post about travel adventures...',
    contentSections: [],
    breadcrumb: {
      enabled: true,
      items: [
        { label: 'Home', href: '/' },
        { label: 'Destinations', href: '#destinations' }
      ]
    },
    tags: ['travel', 'welcome'],
    categories: ['general'],
    status: 'published',
    author: 'John Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15'),
    jsonLd: false,
  },
  {
    id: '2',
    title: 'Top 10 Destinations for 2024',
    slug: 'top-10-destinations-2024',
    body: 'Discover the most amazing places to visit this year...',
    contentSections: [],
    breadcrumb: {
      enabled: true,
      items: [
        { label: 'Home', href: '/' },
        { label: 'Destinations', href: '#destinations' }
      ]
    },
    tags: ['destinations', '2024', 'travel'],
    categories: ['destinations'],
    status: 'draft',
    author: 'Jane Smith',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    jsonLd: false,
  },
  {
    id: '3',
    title: 'Travel Tips for Beginners',
    slug: 'travel-tips-beginners',
    body: 'Essential advice for first-time travelers...',
    contentSections: [],
    breadcrumb: {
      enabled: true,
      items: [
        { label: 'Home', href: '/' },
        { label: 'Tips', href: '#tips' }
      ]
    },
    tags: ['tips', 'beginners'],
    categories: ['tips'],
    status: 'review',
    author: 'Mike Johnson',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    jsonLd: false,
  },
];

const mockMedia: MediaAsset[] = [
  // No preloaded media - start with empty library
];

// Initialize mock data after loading from persistence
async function initializeMockData() {
  try {
    console.log('Initializing mock data...');
    
    const loadedPosts = await loadPosts();
    const loadedMedia = await loadMediaAssets();
    
    console.log('Loaded posts:', loadedPosts.size);
    console.log('Loaded media:', loadedMedia.size);
    
    // Load existing data
    posts = loadedPosts;
    mediaAssets = loadedMedia;
    
    // Only add mock data if no data exists
    if (loadedPosts.size === 0) {
      console.log('Adding mock posts...');
      mockPosts.forEach(post => posts.set(post.id, post));
      await savePosts(posts);
    }
    
    if (loadedMedia.size === 0) {
      console.log('Adding mock media...');
      mockMedia.forEach(asset => mediaAssets.set(asset.id, asset));
      await saveMediaAssets(mediaAssets);
    }
    
    console.log('Mock data initialization completed');
  } catch (error) {
    console.error('Error initializing mock data:', error);
    // Initialize with empty data if loading fails
    posts = new Map();
    mediaAssets = new Map();
  }
}

// Track initialization state
let isInitialized = false;
let initError: Error | null = null;

const initPromise = initializeMockData().then(() => {
  isInitialized = true;
  console.log('Data initialization completed successfully');
}).catch((error) => {
  console.error('Data initialization failed:', error);
  initError = error;
  isInitialized = true; // Mark as initialized even if failed to prevent infinite waiting
});

// Wait for initialization to complete
async function ensureInitialized() {
  if (!isInitialized) {
    await initPromise;
  }
  
  if (initError) {
    console.warn('Data initialization had errors, but continuing with empty data');
  }
}

// Posts API
export async function createPost(data: PostDraft): Promise<{ id: string }> {
  try {
    console.log('Admin Panel: Creating post with data:', data);
    
    const response = await fetch('http://localhost:5000/api/admin/posts/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Admin Panel: Error creating post:', errorData);
      throw new Error(errorData.message || 'Failed to create post');
    }

    const result = await response.json();
    console.log('Admin Panel: Post created successfully:', result);
    return { id: result.data._id };
  } catch (error) {
    console.error('Admin Panel: Error creating post:', error);
    // Fallback to mock data if backend is not available
    await ensureInitialized();
    const id = Math.random().toString(36).substr(2, 9);
    const post: Post = {
      ...data,
      id,
      author: 'Current User',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    posts.set(id, post);
    await savePosts(posts);
    return { id };
  }
}

export async function getPosts(searchParams: PostSearch): Promise<{ rows: Post[]; total: number }> {
  try {
    console.log('Admin Panel: Fetching posts with params:', searchParams);
    
    const queryParams = new URLSearchParams();
    if (searchParams.search) queryParams.append('search', searchParams.search);
    if (searchParams.status && searchParams.status !== 'all') queryParams.append('status', searchParams.status);
    if (searchParams.author) queryParams.append('author', searchParams.author);
    if (searchParams.dateFrom) queryParams.append('dateFrom', searchParams.dateFrom);
    if (searchParams.dateTo) queryParams.append('dateTo', searchParams.dateTo);
    queryParams.append('page', searchParams.page.toString());
    queryParams.append('limit', searchParams.limit.toString());

    const response = await fetch(`http://localhost:5000/api/admin/posts?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Admin Panel: Error fetching posts:', errorData);
      throw new Error(errorData.message || 'Failed to fetch posts');
    }

    const result = await response.json();
    console.log('Admin Panel: Posts fetched successfully:', result);
    
    // Transform backend data to frontend format
    const transformedPosts = result.rows.map((post: Record<string, unknown>) => ({
      ...post,
      id: post._id || post.id, // Ensure we have an 'id' field
      author: post.author ? (typeof post.author === 'string' ? post.author : `${(post.author as any).firstName || ''} ${(post.author as any).lastName || ''}`.trim() || (post.author as any).email || 'Unknown') : 'Unknown',
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
    }));
    
    return { rows: transformedPosts, total: result.total };
  } catch (error) {
    console.error('Admin Panel: Error fetching posts:', error);
    // Fallback to mock data if backend is not available
    await ensureInitialized();
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
        post.author.toLowerCase().includes(searchParams.author!.toLowerCase())
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
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    console.log('Admin Panel: Fetching post with ID:', id, 'Type:', typeof id);
    
    // Use the direct GET single post endpoint
    const response = await fetch(`http://localhost:5000/api/admin/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('Admin Panel: Post not found');
        return null;
      }
      const errorData = await response.json();
      console.error('Admin Panel: Error fetching post:', errorData);
      throw new Error(errorData.message || 'Failed to fetch post');
    }

    const result = await response.json();
    console.log('Admin Panel: Post fetched successfully:', result);
    
    if (result.success && result.data) {
      // Transform backend data to frontend format
      const post = result.data;
      const transformedPost = {
        ...post,
        id: post._id || post.id,
        author: post.author ? (typeof post.author === 'string' ? post.author : `${(post.author as any).firstName || ''} ${(post.author as any).lastName || ''}`.trim() || (post.author as any).email || 'Unknown') : 'Unknown',
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
      };
      console.log('Admin Panel: Post transformed:', transformedPost);
      return transformedPost;
    }
    
    console.log('Admin Panel: Post not found in response');
    return null;
  } catch (error) {
    console.error('Admin Panel: Error fetching post:', error);
    // Fallback to mock data if backend is not available
    await ensureInitialized();
    return posts.get(id) || null;
  }
}

export async function updatePost(id: string, data: Partial<PostPublish>): Promise<Post | null> {
  try {
    console.log('Admin Panel: Updating post with ID:', id, 'data:', data);
    
    const response = await fetch(`http://localhost:5000/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Admin Panel: Error updating post:', errorData);
      throw new Error(errorData.message || 'Failed to update post');
    }

    const result = await response.json();
    console.log('Admin Panel: Post updated successfully:', result);
    
    if (result.success && result.data) {
      // Transform backend data to frontend format
      const post = {
        ...result.data,
        id: result.data._id || result.data.id,
        createdAt: new Date(result.data.createdAt),
        updatedAt: new Date(result.data.updatedAt),
        publishedAt: result.data.publishedAt ? new Date(result.data.publishedAt) : undefined,
        scheduledAt: result.data.scheduledAt ? new Date(result.data.scheduledAt) : undefined,
      };
      return post;
    }
    
    return null;
  } catch (error) {
    console.error('Admin Panel: Error updating post:', error);
    // Fallback to mock data if backend is not available
    await ensureInitialized();
    const existing = posts.get(id);
    if (!existing) return null;
    
    const updated: Post = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    
    posts.set(id, updated);
    await savePosts(posts);
    return updated;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    console.log('Admin Panel: Deleting post with ID:', id);
    
    const response = await fetch(`http://localhost:5000/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Admin Panel: Error deleting post:', errorData);
      throw new Error(errorData.message || 'Failed to delete post');
    }

    const result = await response.json();
    console.log('Admin Panel: Post deleted successfully:', result);
    return result.success || true;
  } catch (error) {
    console.error('Admin Panel: Error deleting post:', error);
    // Fallback to mock data if backend is not available
    await ensureInitialized();
    const deleted = posts.delete(id);
    if (deleted) {
      await savePosts(posts);
    }
    return deleted;
  }
}

export async function bulkUpdatePosts(action: BulkAction): Promise<{ success: number; failed: number }> {
  await ensureInitialized();
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
  
  // Save changes after bulk operations
  if (success > 0) {
    await savePosts(posts);
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
  await ensureInitialized();
  return Array.from(mediaAssets.values()).sort((a, b) => 
    b.uploadedAt.getTime() - a.uploadedAt.getTime()
  );
}

export async function uploadMedia(file: File): Promise<{ id: string; url: string }> {
  await ensureInitialized();
  console.log('uploadMedia - starting upload for file:', file.name);
  
  // Mock implementation - in real app, upload to storage service
  const id = Math.random().toString(36).substr(2, 9);
  
  // Create a data URL for immediate preview using Node.js compatible method
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const url = `data:${file.type};base64,${base64}`;
  
  console.log('uploadMedia - data URL created, length:', url.length);
  console.log('uploadMedia - data URL preview:', url.substring(0, 100) + '...');
  
  const asset: MediaAsset = {
    id,
    url,
    type: file.type.startsWith('video/') ? 'video' : 'image',
    sizeKB: Math.round(file.size / 1024),
    filename: file.name,
    uploadedAt: new Date(),
  };
  
  console.log('uploadMedia - asset created:', asset);
  
  mediaAssets.set(id, asset);
  console.log('uploadMedia - asset added to map, total assets:', mediaAssets.size);
  
  await saveMediaAssets(mediaAssets);
  console.log('uploadMedia - assets saved to file');
  
  return { id, url };
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  await ensureInitialized();
  const deleted = mediaAssets.delete(id);
  if (deleted) {
    await saveMediaAssets(mediaAssets);
  }
  return deleted;
}

export async function deleteAllMediaAssets(): Promise<number> {
  await ensureInitialized();
  const count = mediaAssets.size;
  mediaAssets.clear();
  await saveMediaAssets(mediaAssets);
  return count;
}

export async function checkSlugAvailability(slug: string, excludeId?: string): Promise<boolean> {
  const existing = Array.from(posts.values()).find(post => 
    post.slug === slug && post.id !== excludeId
  );
  return !existing;
}
