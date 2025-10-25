import { NextRequest, NextResponse } from 'next/server'
import { createSOSEvent, findNearbyMechanics } from '../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, latitude, longitude } = await request.json()
    
    const sosEvent = await createSOSEvent(userId, latitude, longitude)
    const mechanics = await findNearbyMechanics(latitude, longitude)
    
    return NextResponse.json({
      success: true,
      sosEvent,
      nearbyMechanics: mechanics
    })
  } catch (error) {
    return NextResponse.json({ error: 'SOS creation failed' }, { status: 500 })
  }
}