import { DistanceMatrix } from './types'

export interface StopCoordinates {
  lat: number
  lng: number
}

// K-Medoids clustering using true driving matrix durations
function clusterStops(stops: StopCoordinates[], depotIndex: number, k: number, matrix: DistanceMatrix): number[][] {
  const n = stops.length
  if (k <= 1 || n <= k + 1) return [Array.from({ length: n }, (_, i) => i)]

  const nonDepotIndices = Array.from({ length: n }, (_, i) => i).filter(i => i !== depotIndex)
  
  // Initialize medoids by picking k random non-depot stops
  let centroidIndices = [...nonDepotIndices].sort(() => 0.5 - Math.random()).slice(0, k)
  let clusters: number[][] = Array.from({ length: k }, () => [])
  
  let changed = true
  let iterations = 0
  
  while (changed && iterations < 100) {
    changed = false
    const newClusters: number[][] = Array.from({ length: k }, () => [])
    
    // Assign each point to the closest medoid based on driving duration
    for (const idx of nonDepotIndices) {
      let minDist = Infinity
      let closestK = 0
      for (let i = 0; i < k; i++) {
        const dist = matrix.durations[idx][centroidIndices[i]]
        if (dist < minDist) {
          minDist = dist
          closestK = i
        }
      }
      newClusters[closestK].push(idx)
    }
    
    // Check if clusters changed
    if (JSON.stringify(clusters) !== JSON.stringify(newClusters)) {
      changed = true
      clusters = newClusters
      
      // Update medoids: find the point in each cluster that minimizes the sum of durations to all other points
      for (let i = 0; i < k; i++) {
        if (clusters[i].length === 0) continue
        
        let bestMedoid = clusters[i][0]
        let minSum = Infinity
        
        for (const candidate of clusters[i]) {
          let sum = 0
          for (const other of clusters[i]) {
             sum += matrix.durations[candidate][other]
          }
          if (sum < minSum) {
             minSum = sum
             bestMedoid = candidate
          }
        }
        centroidIndices[i] = bestMedoid
      }
    }
    iterations++
  }

  // Ensure all clusters have the depot at the start
  return clusters.map(cluster => [depotIndex, ...cluster]).filter(c => c.length > 1)
}

function routeDuration(route: number[], matrix: DistanceMatrix, isRoundTrip: boolean): number {
  let total = 0
  for (let i = 0; i < route.length - 1; i++) {
    total += matrix.durations[route[i]][route[i + 1]]
  }
  if (isRoundTrip && route.length > 1) {
    total += matrix.durations[route[route.length - 1]][route[0]]
  }
  return total
}

function nearestNeighbour(cluster: number[], matrix: DistanceMatrix): number[] {
  const n = cluster.length
  const visited = new Set<number>([cluster[0]])
  const route = [cluster[0]]
  let current = cluster[0]

  while (route.length < n) {
    let nearest = -1
    let nearestDuration = Infinity
    for (const candidate of cluster) {
      if (!visited.has(candidate) && matrix.durations[current][candidate] < nearestDuration) {
        nearest = candidate
        nearestDuration = matrix.durations[current][candidate]
      }
    }
    route.push(nearest)
    visited.add(nearest)
    current = nearest
  }
  return route
}

// Simulated Annealing meta-heuristic to replace standard 2-opt
function simulatedAnnealing(initialRoute: number[], matrix: DistanceMatrix, isRoundTrip: boolean): number[] {
  if (initialRoute.length <= 3) return initialRoute

  let currentRoute = [...initialRoute]
  let currentCost = routeDuration(currentRoute, matrix, isRoundTrip)
  
  let bestRoute = [...currentRoute]
  let bestCost = currentCost

  let temperature = 10000
  const coolingRate = 0.999
  const absoluteTemperature = 0.001

  while (temperature > absoluteTemperature) {
    // Generate neighbor via 2-opt segment reversal
    const i = Math.floor(Math.random() * (currentRoute.length - 2)) + 1 // > 0 to preserve depot
    const j = Math.floor(Math.random() * (currentRoute.length - 1 - i)) + i + 1
    
    const newRoute = [
      ...currentRoute.slice(0, i),
      ...currentRoute.slice(i, j + 1).reverse(),
      ...currentRoute.slice(j + 1)
    ]

    const newCost = routeDuration(newRoute, matrix, isRoundTrip)

    if (newCost < currentCost) {
      currentRoute = newRoute
      currentCost = newCost
      if (newCost < bestCost) {
        bestRoute = [...newRoute]
        bestCost = newCost
      }
    } else {
      // Accept worse solution probabilistically
      if (Math.exp((currentCost - newCost) / temperature) > Math.random()) {
        currentRoute = newRoute
        currentCost = newCost
      }
    }

    temperature *= coolingRate
  }

  // Run a quick deterministic 2-opt pass at the end just to ensure local minimum is hit perfectly
  return twoOptImprove(bestRoute, matrix, isRoundTrip)
}

function twoOptImprove(initialRoute: number[], matrix: DistanceMatrix, isRoundTrip: boolean): number[] {
  let route = [...initialRoute]
  let improved = true
  while (improved) {
    improved = false
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        const newRoute = [
          ...route.slice(0, i),
          ...route.slice(i, j + 1).reverse(),
          ...route.slice(j + 1)
        ]
        if (routeDuration(newRoute, matrix, isRoundTrip) < routeDuration(route, matrix, isRoundTrip)) {
          route = newRoute
          improved = true
        }
      }
    }
  }
  return route
}

export function solveFleetRoutes(
  stops: StopCoordinates[],
  matrix: DistanceMatrix,
  numVehicles: number = 1,
  startIndex: number = 0,
  isRoundTrip: boolean = false
): number[][] {
  const clusters = clusterStops(stops, startIndex, numVehicles, matrix)
  
  return clusters.map(cluster => {
    const nnRoute = nearestNeighbour(cluster, matrix)
    return simulatedAnnealing(nnRoute, matrix, isRoundTrip)
  })
}

export function calculateFleetImprovement(
  stops: StopCoordinates[],
  fleetRoutes: number[][],
  matrix: DistanceMatrix,
  isRoundTrip: boolean = false
) {
  // Naive single-vehicle duration (just visiting them in order)
  const naiveOrder = stops.map((_, i) => i)
  const naiveDuration = routeDuration(naiveOrder, matrix, isRoundTrip)
  
  // Total duration of all fleet routes
  const optimisedDuration = fleetRoutes.reduce((total, route) => total + routeDuration(route, matrix, isRoundTrip), 0)
  
  const percentImprovement = naiveDuration > 0
    ? Math.round(((naiveDuration - optimisedDuration) / naiveDuration) * 100)
    : 0

  return { naiveDuration, optimisedDuration, percentImprovement }
}
