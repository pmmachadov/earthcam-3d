import * as THREE from 'three';

/**
 * Converts geographic coordinates (latitude, longitude)
 * into a 3D vector (x, y, z) on a sphere with a given radius.
 *
 * @param lat Latitude in decimal degrees (-90 to 90)
 * @param lon Longitude in decimal degrees (-180 to 180)
 * @param radius Radius of the globe sphere
 * @returns THREE.Vector3 with (x, y, z) coordinates
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): THREE.Vector3 {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Spherical to Cartesian coordinate projection (x, y, z)
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}
