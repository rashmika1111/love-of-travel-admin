'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Save, Eye, Image as ImageIcon, Trash2 } from 'lucide-react';
import { PostDraftSchema } from '@/lib/validation';
import { getCurrentUserPermissions } from '@/lib/rbac';
import { Post } from '@/lib/api';
import { MediaLibrary } from '@/components/cms/MediaLibrary';
import { MediaAsset } from '@/lib/api';

type PostFormData = z.infer<typeof PostDraftSchema>;

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<MediaAsset | null>(null);
  
  const permissions = getCurrentUserPermissions();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(PostDraftSchema),
    defaultValues: {
      title: '',
      slug: '',
      body: '',
      tags: [],
      categories: [],
      featuredImage: '',
      seoTitle: '',
      metaDescription: '',
      jsonLd: false,
    },
  });

  const watchedValues = watch();

  // Fetch post data
  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`);
        if (response.ok) {
          const postData = await response.json();
          setPost(postData);
          
          // Populate form with existing data
          setValue('title', postData.title);
          setValue('slug', postData.slug);
          setValue('body', postData.body || '');
          setValue('tags', postData.tags || []);
          setValue('categories', postData.categories || []);
          setValue('featuredImage', postData.featuredImage || '');
          setValue('seoTitle', postData.seoTitle || '');
          setValue('metaDescription', postData.metaDescription || '');
          setValue('jsonLd', postData.jsonLd || false);
          
          // Set featured image if exists
          if (postData.featuredImage) {
            setSelectedImage({
              id: 'existing',
              url: postData.featuredImage,
              type: 'image',
              sizeKB: 0,
              filename: 'Featured Image',
              uploadedAt: new Date(),
            });
          }
        } else {
          console.error('Failed to fetch post');
          router.push('/layout-1/blog/posts');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/layout-1/blog/posts');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, setValue, router]);

  const onSubmit = async (data: PostFormData) => {
    if (!permissions.includes('post:edit')) {
      alert('You do not have permission to edit posts');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/layout-1/blog/posts');
      } else {
        const errorData = await response.json();
        console.error('Error updating post:', errorData.error);
        alert('Failed to update post. Please try again.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (asset: MediaAsset) => {
    setSelectedImage(asset);
    setValue('featuredImage', asset.url);
    setShowMediaLibrary(false);
  };

  const handlePreview = () => {
    if (post) {
      window.open(`/preview/post/${post.id}`, '_blank');
    }
  };

  const canPublish = permissions.includes('post:publish');
  const canDelete = permissions.includes('post:delete');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Post not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ml-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">
            Update your blog post or article
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => router.push('/layout-1/blog/posts')}>
            Back to Posts
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <Card>
              <CardHeader>
                <CardTitle>Title & Slug</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter post title..."
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="post-slug"
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="body">Body</Label>
                  <RichTextEditor
                    content={watchedValues.body}
                    onChange={(content) => setValue('body', content)}
                    placeholder="Write your post content here..."
                    className={`min-h-[300px] ${errors.body ? 'border-red-500' : ''}`}
                  />
                  {errors.body && (
                    <p className="text-sm text-red-500 mt-1">{errors.body.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    defaultValue={post.status} 
                    onValueChange={(value) => setValue('status', value)}
                    disabled={!canPublish}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      {canPublish && (
                        <>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                </div>
                <div className="space-y-2">
                  <Button type="submit" disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Update Post'}
                  </Button>
                  
                  {canDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={saving}
                      className="w-full"
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                          try {
                            const response = await fetch(`/api/admin/posts/${postId}`, {
                              method: 'DELETE',
                            });
                            
                            if (response.ok) {
                              router.push('/layout-1/blog/posts');
                            } else {
                              alert('Failed to delete post. Please try again.');
                            }
                          } catch (error) {
                            console.error('Error deleting post:', error);
                            alert('Failed to delete post. Please try again.');
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags & Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Tags & Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch('tags')?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const currentTags = watch('tags') || [];
                            setValue('tags', currentTags.filter((_, i) => i !== index));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          const currentTags = watch('tags') || [];
                          if (!currentTags.includes(value)) {
                            setValue('tags', [...currentTags, value]);
                          }
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch('categories')?.map((category, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {category}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const currentCategories = watch('categories') || [];
                            setValue('categories', currentCategories.filter((_, i) => i !== index));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add category and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          const currentCategories = watch('categories') || [];
                          if (!currentCategories.includes(value)) {
                            setValue('categories', [...currentCategories, value]);
                          }
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.filename}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setValue('featuredImage', '');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{selectedImage.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedImage.sizeKB / 1024).toFixed(1)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMediaLibrary(true)}
                        className="w-full"
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      No featured image selected
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMediaLibrary(true)}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    {...register('seoTitle')}
                    placeholder="SEO optimized title..."
                    className={errors.seoTitle ? 'border-red-500' : ''}
                  />
                  {errors.seoTitle && (
                    <p className="text-sm text-red-500 mt-1">{errors.seoTitle.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    {...register('metaDescription')}
                    placeholder="Brief description for search engines..."
                    rows={3}
                    className={errors.metaDescription ? 'border-red-500' : ''}
                  />
                  {errors.metaDescription && (
                    <p className="text-sm text-red-500 mt-1">{errors.metaDescription.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="jsonLd"
                    checked={watch('jsonLd')}
                    onCheckedChange={(checked) => setValue('jsonLd', checked)}
                  />
                  <Label htmlFor="jsonLd">Enable JSON-LD structured data</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleImageSelect}
        selectedAssetId={selectedImage?.id}
      />
    </div>
  );
}
