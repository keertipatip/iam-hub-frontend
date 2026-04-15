import { langDataMap } from '@/lib/langData'
import { NextResponse } from 'next/server'

export async function GET() {
  const langs = Object.values(langDataMap).map(({ id, name, ext, runLabel }) => ({
    id,
    name,
    ext,
    runLabel,
  }))
  return NextResponse.json(langs)
}
