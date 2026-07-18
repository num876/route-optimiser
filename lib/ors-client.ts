const ORS_BASE_URL = 'https://api.openrouteservice.org'

export async function geocodeAddress(address: string): Promise<Array<{ address: string, lat: number; lng: number }>> {
  const response = await fetch(
    `${ORS_BASE_URL}/geocode/search?api_key=${process.env.ORS_API_KEY}&text=${encodeURIComponent(address)}&size=5`
  )
  const data = await response.json()
  if (!response.ok || !data.features) {
    console.error('ORS Geocoding Error Response:', data)
    throw new Error(data?.error?.message || 'Invalid response from ORS geocoding service')
  }
  return data.features.map((feature: any) => {
    const [lng, lat] = feature.geometry.coordinates
    return {
      address: feature.properties.label,
      lat,
      lng
    }
  })
}

export async function getDistanceMatrix(stops: { lat: number; lng: number }[]) {
  const response = await fetch(`${ORS_BASE_URL}/v2/matrix/driving-car`, {
    method: 'POST',
    headers: {
      'Authorization': process.env.ORS_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      locations: stops.map(s => [s.lng, s.lat]), // ORS expects [lng, lat] order
      metrics: ['distance', 'duration']
    })
  })
  return response.json()
}

export async function getRouteGeometry(orderedStops: { lat: number; lng: number }[]) {
  const response = await fetch(`${ORS_BASE_URL}/v2/directions/driving-car/geojson`, {
    method: 'POST',
    headers: {
      'Authorization': process.env.ORS_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coordinates: orderedStops.map(s => [s.lng, s.lat])
    })
  })
  const data = await response.json()
  return data.features[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]])
}
