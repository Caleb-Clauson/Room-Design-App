import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const memoryStore: Record<string, any[]> = {};

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get('userId') ?? 'demo-user';
  const client = getSupabaseServerClient();

  if (!client) {
    return NextResponse.json(memoryStore[userId] ?? []);
  }

  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const userId = payload.userId ?? 'demo-user';
  const client = getSupabaseServerClient();

  if (!client) {
    memoryStore[userId] = [payload, ...(memoryStore[userId] ?? []).filter((p) => p.id !== payload.id)];
    return NextResponse.json(payload);
  }

  const { data, error } = await client.from('projects').upsert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
