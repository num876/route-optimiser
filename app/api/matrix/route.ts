import { getDistanceMatrix } from '@/lib/ors-client'
import { solveFleetRoutes, calculateFleetImprovement } from '@/lib/route-optimiser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { stops, isRoundTrip, numVehicles = 1 } = await req.json() as { stops: { lat: number; lng: number }[], isRoundTrip?: boolean, numVehicles?: number }

    if (!stops || stops.length < 2) {
      return NextResponse.json({ error: 'At least 2 stops are required' }, { status: 400 })
    }

    const matrixResponse = await getDistanceMatrix(stops)
    
    if (matrixResponse.error) {
      console.error('ORS Matrix Error:', matrixResponse.error)
      return NextResponse.json({ error: 'Failed to get distance matrix from OpenRouteService' }, { status: 500 })
    }

    const matrix = {
      durations: matrixResponse.durations,
      distances: matrixResponse.distances
    }

    // Call the new fleet clustering and simulated annealing engine
    const fleetRoutes = solveFleetRoutes(stops, matrix, numVehicles, 0, isRoundTrip)
    const improvement = calculateFleetImprovement(stops, fleetRoutes, matrix, isRoundTrip)

    // Calculate total distance and duration across all fleets
    let totalDistanceMeters = 0
    let totalDurationSeconds = 0
    
    for (const route of fleetRoutes) {
      for (let i = 0; i < route.length - 1; i++) {
        totalDistanceMeters += matrix.distances[route[i]][route[i + 1]]
        totalDurationSeconds += matrix.durations[route[i]][route[i + 1]]
      }
      if (isRoundTrip && route.length > 1) {
        totalDistanceMeters += matrix.distances[route[route.length - 1]][route[0]]
        totalDurationSeconds += matrix.durations[route[route.length - 1]][route[0]]
      }
    }

    return NextResponse.json({
      fleetRoutes,
      naiveOrder: stops.map((_, i) => i),
      ...improvement,
      totalDistanceMeters,
      totalDurationSeconds
    })
  } catch (error) {
    console.error('Matrix processing error:', error)
    return NextResponse.json({ error: 'Failed to process matrix request' }, { status: 500 })
  }
}
