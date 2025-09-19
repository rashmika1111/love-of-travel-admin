import { NextRequest, NextResponse } from 'next/server';
import { PostDraftSchema, PostPublishSchema } from '@/lib/validation';
import { getPost, updatePost, deletePost } from '@/lib/api';
import { getSessionRole, can } from '@/lib/rbac';

// GET /api/admin/posts/[id] - Get post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const role = getSessionRole();
    
    if (!can(role, 'post:edit')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const post = await getPost(resolvedParams.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const role = getSessionRole();
    
    if (!can(role, 'post:edit')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    console.log('API received data:', body);
    console.log('Featured image in request:', body.featuredImage);
    
    // Determine which schema to use based on status
    const status = body.status;
    let validatedData;
    
    if (status && ['review', 'scheduled', 'published'].includes(status)) {
      // Use publish schema for publishing actions
      if (!can(role, 'post:publish')) {
        return NextResponse.json(
          { error: 'Insufficient permissions to publish' },
          { status: 403 }
        );
      }
      validatedData = PostPublishSchema.parse(body);
    } else {
      // Use draft schema for draft updates
      validatedData = PostDraftSchema.parse(body);
    }

    const resolvedParams = await params;
    const updatedPost = await updatePost(resolvedParams.id, validatedData);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const role = getSessionRole();
    
    if (!can(role, 'post:delete')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const success = await deletePost(resolvedParams.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
