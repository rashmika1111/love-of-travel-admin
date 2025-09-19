import { Post, MediaAsset } from './api';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const MEDIA_FILE = path.join(DATA_DIR, 'media.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Load posts from file
export async function loadPosts(): Promise<Map<string, Post>> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    
    // Check if file is empty or contains invalid JSON
    if (!data || data.trim() === '' || data.trim() === '[]') {
      return new Map();
    }
    
    const postsArray = JSON.parse(data);
    const postsMap = new Map<string, Post>();
    
    postsArray.forEach((post: Record<string, unknown>) => {
      // Convert date strings back to Date objects
      postsMap.set(post.id as string, {
        ...post,
        createdAt: new Date(post.createdAt as string),
        updatedAt: new Date(post.updatedAt as string),
        scheduledAt: post.scheduledAt ? new Date(post.scheduledAt as string) : undefined,
        publishedAt: post.publishedAt ? new Date(post.publishedAt as string) : undefined,
      } as Post);
    });
    
    return postsMap;
  } catch (error) {
    console.error('Error loading posts:', error);
    // File doesn't exist or is corrupted, return empty map
    return new Map();
  }
}

// Save posts to file
export async function savePosts(posts: Map<string, Post>): Promise<void> {
  try {
    await ensureDataDir();
    const postsArray = Array.from(posts.values());
    
    await fs.writeFile(POSTS_FILE, JSON.stringify(postsArray, null, 2));
  } catch (error) {
    console.error('Error saving posts:', error);
  }
}

// Load media assets from file
export async function loadMediaAssets(): Promise<Map<string, MediaAsset>> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(MEDIA_FILE, 'utf-8');
    
    // Check if file is empty or contains invalid JSON
    if (!data || data.trim() === '' || data.trim() === '[]') {
      return new Map();
    }
    
    const mediaArray = JSON.parse(data);
    const mediaMap = new Map<string, MediaAsset>();
    
    mediaArray.forEach((asset: Record<string, unknown>) => {
      mediaMap.set(asset.id as string, {
        ...asset,
        uploadedAt: new Date(asset.uploadedAt as string),
      } as MediaAsset);
    });
    
    return mediaMap;
  } catch (error) {
    console.error('Error loading media assets:', error);
    // File doesn't exist or is corrupted, return empty map
    return new Map();
  }
}

// Save media assets to file
export async function saveMediaAssets(media: Map<string, MediaAsset>): Promise<void> {
  try {
    console.log('saveMediaAssets - starting save, media count:', media.size);
    await ensureDataDir();
    const mediaArray = Array.from(media.values());
    console.log('saveMediaAssets - media array created, length:', mediaArray.length);
    
    // Check if any media has extremely large data URLs that might cause issues
    const hasLargeDataUrls = mediaArray.some(asset => 
      asset.url && asset.url.length > 1000000 // 1MB
    );
    
    if (hasLargeDataUrls) {
      console.warn('saveMediaAssets - warning: some media assets have very large data URLs');
    }
    
    const jsonString = JSON.stringify(mediaArray, null, 2);
    console.log('saveMediaAssets - JSON string length:', jsonString.length);
    
    // Check if any URLs are being truncated
    mediaArray.forEach((asset, index) => {
      if (asset.url && asset.url.length > 1000) {
        console.log(`saveMediaAssets - asset ${index} URL length:`, asset.url.length);
        console.log(`saveMediaAssets - asset ${index} URL preview:`, asset.url.substring(0, 100) + '...');
      }
    });
    
    await fs.writeFile(MEDIA_FILE, jsonString);
    console.log('saveMediaAssets - file written successfully');
  } catch (error) {
    console.error('Error saving media assets:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as any)?.code
    });
    throw error; // Re-throw to let the calling function handle it
  }
}
