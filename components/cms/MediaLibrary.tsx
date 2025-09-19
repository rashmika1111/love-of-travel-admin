'use client';

import * as React from 'react';
import { Image, Video, File, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MediaAsset } from '@/lib/api';

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  selectedAssetId?: string;
}

export function MediaLibrary({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedAssetId 
}: MediaLibraryProps) {
  const [mediaAssets, setMediaAssets] = React.useState<MediaAsset[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  // Load media assets
  React.useEffect(() => {
    if (isOpen) {
      loadMediaAssets();
    }
  }, [isOpen]);

  const loadMediaAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media');
      const data = await response.json();
      setMediaAssets(data);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload JPG, PNG, GIF, MP4, or WebM files.');
      return;
    }

    // Validate file size (25MB max)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 25MB.');
      return;
    }

    setUploading(true);
    try {
      // Create data URL for immediate preview
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      // Create new asset
      const newAsset: MediaAsset = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        sizeKB: Math.round(file.size / 1024),
        filename: file.name,
        uploadedAt: new Date(),
      };

      console.log('Created new asset:', newAsset);
      console.log('Data URL preview:', url.substring(0, 100) + '...');

      // Add to local state
      setMediaAssets(prev => [newAsset, ...prev]);

      // Also save to API for persistence
      try {
        const formData = new FormData();
        formData.append('file', file);
        await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });
      } catch (error) {
        console.warn('Failed to save to API, but file is available locally:', error);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        
        {/* Upload Section */}
        <div className="px-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                id="media-upload"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <label htmlFor="media-upload">
                <Button
                  asChild
                  disabled={uploading}
                  className="w-full"
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload New Media'}
                  </span>
                </Button>
              </label>
            </div>
            <Button
              onClick={loadMediaAssets}
              variant="outline"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading media...</div>
            </div>
          ) : mediaAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <File className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No media files
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload some files to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaAssets.map((asset) => {
                const isSelected = selectedAssetId === asset.id;
                const Icon = asset.type === 'image' ? Image : Video;

                return (
                  <Card
                    key={asset.id}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:shadow-md group',
                      isSelected 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'hover:shadow-md'
                    )}
                    onClick={() => onSelect(asset)}
                  >
                    <CardContent className="p-0">
                      {/* Preview */}
                      <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center overflow-hidden relative">
                        {asset.type === 'image' ? (
                          <img
                            src={asset.url}
                            alt={asset.filename}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onLoad={() => console.log('Image loaded successfully:', asset.filename)}
                            onError={(e) => {
                              console.error('Image failed to load:', asset.filename, asset.url);
                              // Fallback for broken images
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex flex-col items-center justify-center text-muted-foreground">
                                    <svg class="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="text-xs">Image</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Video className="h-8 w-8 mb-2" />
                            <span className="text-xs">Video</span>
                          </div>
                        )}
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-medium truncate" title={asset.filename}>
                            {asset.filename}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(asset.sizeKB / 1024).toFixed(1)} MB
                        </p>
                        {isSelected && (
                          <Badge variant="default" className="text-xs w-fit">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
