import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

interface CanvasSaveBody {
  id?: number
  name?: string
  data?: string
}

export async function POST(req: Request) {
  let body: CanvasSaveBody = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const name = body.name || 'Untitled Canvas'
  const dataJson = body.data ?? ''

  if (body.id) {
    // Update existing diagram
    const { data, error } = await supabase
      .from('canvas_diagrams')
      .update({ name, data_json: dataJson, updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, id: data.id })
  }

  // Insert new diagram
  const { data, error } = await supabase
    .from('canvas_diagrams')
    .insert({ name, data_json: dataJson })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id })
}
