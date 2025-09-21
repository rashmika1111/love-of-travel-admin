'use client';

import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, GripVertical, Eye, Trash2, Edit3, Image, Type, Layout, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ContentSection, HeroSection, TextSection, ImageSection, GallerySection, PopularPostsSection, BreadcrumbSection } from '@/lib/validation';
import { HeroSectionEditor } from './HeroSectionEditor';
import { TextSectionEditor } from './TextSectionEditor';
import { ImageSectionEditor } from './ImageSectionEditor';
import { GallerySectionEditor } from './GallerySectionEditor';
import { PopularPostsSectionEditor } from './PopularPostsSectionEditor';
import { BreadcrumbSectionEditor } from './BreadcrumbSectionEditor';

interface ContentBuilderProps {
  sections: ContentSection[];
  onChange: (sections: ContentSection[]) => void;
  className?: string;
}

const SECTION_TYPES = [
  {
    type: 'hero',
    label: 'Hero Section',
    description: 'Full-screen hero with background image and overlay',
    icon: Image,
    color: 'bg-blue-500'
  },
  {
    type: 'breadcrumb',
    label: 'Breadcrumb',
    description: 'Navigation breadcrumb trail',
    icon: ChevronRight,
    color: 'bg-gray-500'
  },
  {
    type: 'text',
    label: 'Text Block',
    description: 'Rich text content with formatting options',
    icon: Type,
    color: 'bg-green-500'
  },
  {
    type: 'image',
    label: 'Single Image',
    description: 'Single image with caption and styling',
    icon: Image,
    color: 'bg-purple-500'
  },
  {
    type: 'gallery',
    label: 'Image Gallery',
    description: 'Multiple images in grid or masonry layout',
    icon: Layout,
    color: 'bg-orange-500'
  },
  {
    type: 'popular-posts',
    label: 'Popular Posts',
    description: 'Featured and side posts section',
    icon: Users,
    color: 'bg-pink-500'
  }
] as const;

export function ContentBuilder({ sections, onChange, className }: ContentBuilderProps) {
  const [editingSection, setEditingSection] = React.useState<number | null>(null);
  const [previewMode, setPreviewMode] = React.useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedItem] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedItem);

    onChange(newSections);
  };

  const addSection = (type: string) => {
    let newSection: ContentSection;

    switch (type) {
      case 'hero':
        newSection = {
          type: 'hero',
          backgroundImage: '',
          title: '',
          subtitle: '',
          author: '',
          publishDate: '',
          readTime: '',
          overlayOpacity: 0.3,
          height: { mobile: '70vh', tablet: '80vh', desktop: '90vh' },
          titleSize: { mobile: 'text-3xl', tablet: 'text-5xl', desktop: 'text-6xl' },
          parallaxEnabled: true,
          parallaxSpeed: 0.5,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          animation: { enabled: true, type: 'fadeIn', duration: 0.8, delay: 0 },
          socialSharing: {
            enabled: true,
            platforms: ['facebook', 'twitter', 'linkedin', 'copy'],
            position: 'bottom-right',
            style: 'glass'
          }
        } as HeroSection;
        break;
      case 'breadcrumb':
        newSection = {
          type: 'breadcrumb',
          enabled: true,
          items: [
            { label: 'Home', href: '/' },
            { label: 'Destinations', href: '#destinations' }
          ],
          style: {
            separator: '>',
            textSize: 'sm',
            showHomeIcon: false,
            color: 'gray'
          }
        } as BreadcrumbSection;
        break;
      case 'text':
        newSection = {
          type: 'text',
          content: '',
          hasDropCap: false,
          alignment: 'left',
          fontSize: 'base'
        } as TextSection;
        break;
      case 'image':
        newSection = {
          type: 'image',
          imageUrl: '',
          altText: '',
          caption: '',
          alignment: 'center',
          rounded: true,
          shadow: true
        } as ImageSection;
        break;
      case 'gallery':
        newSection = {
          type: 'gallery',
          images: [],
          layout: 'grid',
          columns: 3,
          spacing: 'md'
        } as GallerySection;
        break;
      case 'popular-posts':
        newSection = {
          type: 'popular-posts',
          title: 'Popular Posts',
          description: '',
          featuredPost: undefined,
          sidePosts: []
        } as PopularPostsSection;
        break;
      default:
        return;
    }

    onChange([...sections, newSection]);
  };

  const updateSection = (index: number, updatedSection: ContentSection) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    onChange(newSections);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    onChange(newSections);
  };

  const renderSectionEditor = (section: ContentSection, index: number) => {
    switch (section.type) {
      case 'hero':
        return (
          <HeroSectionEditor
            section={section as HeroSection}
            onChange={(updated) => updateSection(index, updated)}
            onClose={() => setEditingSection(null)}
          />
        );
      case 'text':
        return (
          <TextSectionEditor
            section={section as TextSection}
            onChange={(updated) => updateSection(index, updated)}
            onClose={() => setEditingSection(null)}
          />
        );
      case 'image':
        return (
          <ImageSectionEditor
            section={section as ImageSection}
            onChange={(updated) => updateSection(index, updated)}
            onClose={() => setEditingSection(null)}
          />
        );
      case 'gallery':
        return (
          <GallerySectionEditor
            section={section as GallerySection}
            onChange={(updated) => updateSection(index, updated)}
            onClose={() => setEditingSection(null)}
          />
        );
      case 'popular-posts':
        return (
          <PopularPostsSectionEditor
            section={section as PopularPostsSection}
            onChange={(updated) => updateSection(index, updated)}
            onClose={() => setEditingSection(null)}
          />
        );
      case 'breadcrumb':
        return (
          <BreadcrumbSectionEditor
            section={section as BreadcrumbSection}
            onChange={(updated) => updateSection(index, updated)}
            onClose={() => setEditingSection(null)}
          />
        );
      default:
        return null;
    }
  };

  const renderSectionPreview = (section: ContentSection, index: number) => {
    const sectionType = SECTION_TYPES.find(t => t.type === section.type);
    const Icon = sectionType?.icon || Type;

    return (
      <Card className="group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', sectionType?.color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-medium leading-tight">
                  {sectionType?.label}
                </CardTitle>
                <p className="text-xs text-muted-foreground leading-relaxed break-words">
                  {sectionType?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingSection(index)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSection(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground">
            {section.type === 'hero' && (section as HeroSection).title && (
              <p>Title: {(section as HeroSection).title}</p>
            )}
            {section.type === 'text' && (section as TextSection).content && (
              <p>Content: {(section as TextSection).content.substring(0, 100)}...</p>
            )}
            {section.type === 'image' && (section as ImageSection).imageUrl && (
              <p>Image: {(section as ImageSection).imageUrl}</p>
            )}
            {section.type === 'gallery' && (section as GallerySection).images.length > 0 && (
              <p>Images: {(section as GallerySection).images.length} items</p>
            )}
            {section.type === 'popular-posts' && (section as PopularPostsSection).title && (
              <p>Title: {(section as PopularPostsSection).title}</p>
            )}
            {section.type === 'breadcrumb' && (section as BreadcrumbSection).items.length > 0 && (
              <p>Items: {(section as BreadcrumbSection).items.map(item => item.label).join(' > ')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (editingSection !== null) {
    return (
      <div className={cn('space-y-4', className)}>
        {renderSectionEditor(sections[editingSection], editingSection)}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Content Sections</h3>
          <p className="text-sm text-muted-foreground">
            Build your content with drag-and-drop sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Add Section Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {SECTION_TYPES.map((sectionType) => {
          const Icon = sectionType.icon;
          return (
            <div
              key={sectionType.type}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted min-h-[120px] border border-input bg-background rounded-md cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => addSection(sectionType.type)}
            >
              <div className={cn('p-2 rounded-lg', sectionType.color)}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="w-full space-y-1">
                <div className="text-sm font-medium leading-tight text-center">{sectionType.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed whitespace-normal break-words text-center">
                  {sectionType.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections List */}
      {sections.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {sections.map((section, index) => (
                  <Draggable
                    key={`${section.type}-${index}`}
                    draggableId={`${section.type}-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          'transition-all',
                          snapshot.isDragging && 'shadow-lg scale-105'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-6 p-1 hover:bg-muted rounded cursor-grab"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            {previewMode ? (
                              <div className="p-4 border rounded-lg bg-muted/50">
                                <Badge variant="secondary" className="mb-2">
                                  {SECTION_TYPES.find(t => t.type === section.type)?.label}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  Preview mode - section content would be rendered here
                                </div>
                              </div>
                            ) : (
                              renderSectionPreview(section, index)
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No sections added yet. Click a section type above to get started.</p>
        </div>
      )}
    </div>
  );
}
