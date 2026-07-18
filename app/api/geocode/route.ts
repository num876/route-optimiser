import { geocodeAddress } from '@/lib/ors-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const address = searchParams.get('address')
  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  try {
    const coords = await geocodeAddress(address)
    return NextResponse.json(coords)
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 500 })
  }
}
