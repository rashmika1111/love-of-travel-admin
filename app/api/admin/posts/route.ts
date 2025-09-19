import { NextRequest, NextResponse } from 'next/server';
import { PostDraftSchema, PostSearchSchema } from '@/lib/validation';
import { createPost, getPosts } from '@/lib/api';
import { getSessionRole, can } from '@/lib/rbac';

// POST /api/admin/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const role = getSessionRole();
    
    if (!can(role, 'post:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = PostDraftSchema.parse(body);

    const result = await createPost(validatedData);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    
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

// GET /api/admin/posts - List posts with filters
export async function GET(request: NextRequest) {
  try {
    const role = getSessionRole();
    
    if (!can(role, 'post:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || 'all';
    const author = searchParams.get('author') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const searchParams_ = {
      search,
      status: status as any,
      author,
      dateFrom,
      dateTo,
      page,
      limit,
    };

    const validatedParams = PostSearchSchema.parse(searchParams_);
    const result = await getPosts(validatedParams);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
