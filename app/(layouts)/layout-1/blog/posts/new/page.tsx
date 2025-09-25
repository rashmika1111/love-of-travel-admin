'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Eye, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { ContentBuilder } from '@/components/cms/ContentBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostDraftSchema } from '@/lib/validation';
import { z } from 'zod';
import { getCurrentUserPermissions } from '@/lib/rbac';
import { MediaLibrary } from '@/components/cms/MediaLibrary';
import { MediaAsset } from '@/lib/api';
import { ContentSection } from '@/lib/validation';

// Use the enhanced PostDraftSchema that includes contentSections
type PostDraft = z.infer<typeof PostDraftSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const permissions = getCurrentUserPermissions();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [postId, setPostId] = React.useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<MediaAsset | null>(null);
  const [contentSections, setContentSections] = React.useState<ContentSection[]>([]);

  const form = useForm<PostDraft>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(PostDraftSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      body: '',
      contentSections: [],
      tags: [],
      categories: [],
      featuredImage: '',
      seoTitle: '',
      metaDescription: '',
      breadcrumb: {
        enabled: true,
        items: [
          { label: 'Home', href: '/' },
          { label: 'Destinations', href: '#destinations' }
        ]
      },
      readingTime: 0,
      jsonLd: false,
    },
  });

  const { watch, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchedValues.title && !watchedValues.slug) {
      const slug = watchedValues.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [watchedValues.title, watchedValues.slug, setValue]);

  const handleSaveDraft = async (data: PostDraft) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/routes/posts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          contentSections: contentSections,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPostId(result.id);
        alert('Draft saved successfully!');
      } else {
        const error = await response.json();
        console.error('Error saving draft:', error);
        alert('Error saving draft. Please try again.');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (data: PostDraft) => {
    setIsSubmitting(true);
    try {
      const publishData = {
        ...data,
        body: data.body || '',
        contentSections: contentSections,
        tags: data.tags.length > 0 ? data.tags : ['untagged'],
        status: 'review',
      };

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishData),
      });

      if (response.ok) {
        const result = await response.json();
        setPostId(result.id);
        alert('Post submitted for review!');
        router.push('/layout-1/blog/posts');
      } else {
        const error = await response.json();
        console.error('Error publishing post:', error);
        alert('Error publishing post. Please try again.');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Error publishing post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleImageSelect = (asset: MediaAsset) => {
    console.log('Image selected:', asset);
    setSelectedImage(asset);
    setValue('featuredImage', asset.url);
    setShowMediaLibrary(false);
  };

  const canPublish = permissions.includes('post:publish');

  return (
    <div className="space-y-6 ml-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">New Post</h1>
          <p className="text-muted-foreground">
            Create a new blog post or article
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit((data) => handleSaveDraft(data as PostDraft))} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content Builder</TabsTrigger>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Builder</CardTitle>
                <CardDescription>
                  Build your content using drag-and-drop sections. Create hero sections, text blocks, galleries, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentBuilder
                  sections={contentSections}
                  onChange={setContentSections}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Slug */}
                <Card>
                  <CardHeader>
                    <CardTitle>Title & Slug</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Title <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={watchedValues.title}
                        onChange={(e) => setValue('title', e.target.value)}
                        placeholder="Enter post title"
                        className={errors.title ? 'border-destructive' : ''}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Slug <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={watchedValues.slug}
                        onChange={(e) => setValue('slug', e.target.value)}
                        placeholder="post-slug"
                        className={errors.slug ? 'border-destructive' : ''}
                      />
                      {errors.slug && (
                        <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        URL-friendly version of the title
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Rich Text Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rich Text Content</CardTitle>
                    <CardDescription>Additional rich text content (optional if using content builder)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Body</label>
                      <RichTextEditor
                        content={watchedValues.body}
                        onChange={(content) => setValue('body', content)}
                        placeholder="Start writing your post..."
                        className="min-h-[300px]"
                      />
                      {errors.body && (
                        <p className="text-sm text-destructive mt-1">{errors.body.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publish</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <Select value="draft" disabled>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Draft'}
                      </Button>
                      
                      {canPublish && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handlePublish(watchedValues)}
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit for Review
                        </Button>
                      )}
                    </div>

                    {postId && (
                      <div className="pt-2 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/preview/post/${postId}`, '_blank')}
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tags & Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags & Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2 min-h-8 p-2 border border-input rounded-md bg-background">
                        {watchedValues.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = watchedValues.tags.filter((_, i) => i !== index);
                                setValue('tags', newTags);
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <input
                          type="text"
                          placeholder="Add tags..."
                          className="flex-1 min-w-20 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const tag = input.value.trim();
                              if (tag && !watchedValues.tags.includes(tag)) {
                                setValue('tags', [...watchedValues.tags, tag]);
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Categories</label>
                      <div className="flex flex-wrap gap-2 min-h-8 p-2 border border-input rounded-md bg-background">
                        {watchedValues.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                            <button
                              type="button"
                              onClick={() => {
                                const newCategories = watchedValues.categories.filter((_, i) => i !== index);
                                setValue('categories', newCategories);
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <input
                          type="text"
                          placeholder="Add categories..."
                          className="flex-1 min-w-20 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const category = input.value.trim();
                              if (category && !watchedValues.categories.includes(category)) {
                                setValue('categories', [...watchedValues.categories, category]);
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
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
                            onLoad={() => console.log('Featured image loaded successfully:', selectedImage.filename)}
                            onError={() => {
                              console.error('Featured image failed to load:', selectedImage.filename, selectedImage.url);
                            }}
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
                        <p className="text-sm text-muted-foreground mb-2">
                          No featured image selected
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMediaLibrary(true)}
                        >
                          Open Media Library
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Search engine optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">SEO Title</label>
                  <Input
                    value={watchedValues.seoTitle}
                    onChange={(e) => setValue('seoTitle', e.target.value)}
                    placeholder="Enter SEO title (optional)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {watchedValues.seoTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Meta Description</label>
                  <Textarea
                    value={watchedValues.metaDescription}
                    onChange={(e) => setValue('metaDescription', e.target.value)}
                    placeholder="Enter meta description (optional)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {watchedValues.metaDescription?.length || 0}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Additional post configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">JSON-LD Schema</label>
                    <p className="text-xs text-muted-foreground">
                      Enable structured data for better SEO
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={watchedValues.jsonLd}
                    onChange={(e) => setValue('jsonLd', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
