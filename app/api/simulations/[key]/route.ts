import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

interface SimConfigField {
  label: string
  type: string
  opts?: string[]
  val?: string
}

interface SimStep {
  class: string
  text: string
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('key', key)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 })
  }

  const config: SimConfigField[] = JSON.parse(data.config_json || '[]')
  const attacks: string[] = JSON.parse(data.attacks_json || '[]')
  const steps: SimStep[] = JSON.parse(data.steps_json || '[]')

  return NextResponse.json({
    key: data.key,
    title: data.title,
    protocol: data.protocol,
    config,
    attacks,
    steps,
  })
}
