import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const langId = searchParams.get('lang') ?? ''
  const name = searchParams.get('name') || 'untitled'
  const shared = searchParams.get('shared') === 'true'

  let code = ''
  try {
    const body = await req.formData()
    code = (body.get('code') as string) ?? ''
  } catch {
    try {
      const body = await req.json()
      code = body.code ?? ''
    } catch {
      // leave code empty
    }
  }

  const { error } = await supabase.from('playground_snippets').insert({
    lang_id: langId,
    name,
    code,
    shared,
    stars: 0,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, name })
}
