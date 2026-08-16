import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const memoryStore: Record<string, any[]> = {};

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const userId = new URL(request.url).searchParams.get('userId') ?? 'demo-user';
  const client = getSupabaseServerClient();

  if (!client) {
    memoryStore[userId] = (memoryStore[userId] ?? []).filter((p) => p.id !== params.id);
    return NextResponse.json({ ok: true });
  }

  const { error } = await client.from('projects').delete().eq('id', params.id).eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
