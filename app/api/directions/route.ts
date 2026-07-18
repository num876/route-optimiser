import { getRouteGeometry } from '@/lib/ors-client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { orderedStops } = await req.json() as { orderedStops: { lat: number; lng: number }[] }
    
    if (!orderedStops || orderedStops.length < 2) {
      return NextResponse.json({ error: 'At least 2 stops are required' }, { status: 400 })
    }

    const geometry = await getRouteGeometry(orderedStops)
    return NextResponse.json({ geometry })
  } catch (error) {
    console.error('Directions processing error:', error)
    return NextResponse.json({ error: 'Failed to get route geometry' }, { status: 500 })
  }
}
