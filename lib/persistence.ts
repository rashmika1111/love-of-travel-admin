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
    
    postsArray.forEach((post: any) => {
      // Convert date strings back to Date objects
      postsMap.set(post.id, {
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
      });
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
    
    // Truncate extremely large featured images to prevent file size issues
    const processedPosts = postsArray.map(post => ({
      ...post,
      featuredImage: post.featuredImage && post.featuredImage.length > 100000 
        ? post.featuredImage.substring(0, 1000) + '...' // Only truncate very large base64 strings
        : post.featuredImage
    }));
    
    await fs.writeFile(POSTS_FILE, JSON.stringify(processedPosts, null, 2));
  } catch (error) {
    console.error('Error saving posts:', error);
  }
}

// Load media assets from file
export async function loadMediaAssets(): Promise<Map<string, MediaAsset>> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(MEDIA_FILE, 'utf-8');
    const mediaArray = JSON.parse(data);
    const mediaMap = new Map<string, MediaAsset>();
    
    mediaArray.forEach((asset: any) => {
      mediaMap.set(asset.id, {
        ...asset,
        uploadedAt: new Date(asset.uploadedAt),
      });
    });
    
    return mediaMap;
  } catch (error) {
    // File doesn't exist or is empty, return empty map
    return new Map();
  }
}

// Save media assets to file
export async function saveMediaAssets(media: Map<string, MediaAsset>): Promise<void> {
  try {
    await ensureDataDir();
    const mediaArray = Array.from(media.values());
    await fs.writeFile(MEDIA_FILE, JSON.stringify(mediaArray, null, 2));
  } catch (error) {
    console.error('Error saving media assets:', error);
  }
}
