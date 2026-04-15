import { langDataMap } from '@/lib/langData'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const lang = langDataMap[id]

  if (!lang) {
    return NextResponse.json({ error: 'Language not found' }, { status: 404 })
  }

  return NextResponse.json(lang)
}
