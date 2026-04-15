import { langDataMap } from '@/lib/langData'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const langId = searchParams.get('lang') ?? ''
  const lang = langDataMap[langId]

  if (!lang) {
    return NextResponse.json({ error: 'Language not found' }, { status: 404 })
  }

  return NextResponse.json({ lines: lang.run })
}
