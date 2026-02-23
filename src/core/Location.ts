// Direct port of Java's Location record
export interface Location {
  readonly x: number;
  readonly y: number;
}

// Factory function mirrors Location.at(x, y) static method
export function at(x: number, y: number): Location {
  return { x, y };
}

// String key for Map usage — critical because JS Map uses reference equality
// for object keys. Java Location record provides equals()/hashCode() automatically.
export function locationKey(loc: Location): string {
  return `${loc.x},${loc.y}`;
}

// Mirrors Location.allWorldLocations(width, height)
export function allWorldLocations(width: number, height: number): Location[] {
  const locations: Location[] = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      locations.push(at(x, y));
    }
  }
  return locations;
}

// Mirrors Location.allNeighbours(worldWidth, worldHeight)
// Clamps to grid edges; does NOT wrap around. Excludes self.
export function allNeighbours(
  loc: Location,
  worldWidth: number,
  worldHeight: number
): Location[] {
  const neighbours: Location[] = [];
  const lowerX = Math.max(0, loc.x - 1);
  const upperX = Math.min(worldWidth - 1, loc.x + 1);
  const lowerY = Math.max(0, loc.y - 1);
  const upperY = Math.min(worldHeight - 1, loc.y + 1);

  for (let i = lowerX; i <= upperX; i++) {
    for (let j = lowerY; j <= upperY; j++) {
      if (i !== loc.x || j !== loc.y) {
        neighbours.push(at(i, j));
      }
    }
  }
  return neighbours;
}
