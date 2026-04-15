import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

interface SimStep {
  class: string
  text: string
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const { data, error } = await supabase
    .from('simulations')
    .select('title, steps_json')
    .eq('key', key)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 })
  }

  const steps: SimStep[] = JSON.parse(data.steps_json || '[]')

  return NextResponse.json({ title: data.title, steps })
}
