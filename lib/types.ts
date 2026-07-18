export interface Stop {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface DistanceMatrix {
  durations: number[][];
  distances: number[][];
}

export interface FleetRoute {
  stopOrder: string[];
  geometry: [number, number][];
}

export interface OptimisedFleet {
  routes: FleetRoute[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  naiveDistanceMeters: number;
  naiveDurationSeconds: number;
  percentImprovement: number;
  naiveGeometry: [number, number][];
}
