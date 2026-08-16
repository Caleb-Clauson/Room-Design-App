import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'demo-user';

  // Return simulated projects stored in database
  const mockProjects = [
    {
      id: 'proj-1',
      userId,
      name: 'Modern Penthouse Kitchen & Living',
      room_type: 'kitchen',
      room_bounds: { width: 10, depth: 8, height: 3 },
      created_at: new Date().toISOString(),
    }
  ];

  return NextResponse.json(mockProjects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In production, save body to Supabase projects table
    return NextResponse.json({ success: true, project: body });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save project' }, { status: 500 });
  }
}