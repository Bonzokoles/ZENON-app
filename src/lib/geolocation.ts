// Geolocation utilities for work location tracking

export interface Coordinates {
    latitude: number
    longitude: number
}

export interface GeofenceConfig {
    latitude: number
    longitude: number
    radius: number // meters
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in meters
 */
export function calculateDistance(
    coord1: Coordinates,
    coord2: Coordinates
): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180
    const φ2 = (coord2.latitude * Math.PI) / 180
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}

/**
 * Check if current position is within geofence
 */
export function isInGeofence(
    currentPosition: Coordinates,
    geofence: GeofenceConfig
): boolean {
    const distance = calculateDistance(currentPosition, {
        latitude: geofence.latitude,
        longitude: geofence.longitude,
    })
    return distance <= geofence.radius
}

/**
 * Request geolocation permission and get current position
 */
export async function getCurrentPosition(): Promise<Coordinates | null> {
    if (!navigator.geolocation) {
        console.error('Geolocation not supported')
        return null
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (error) => {
                console.error('Geolocation error:', error)
                resolve(null)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    })
}

/**
 * Watch position changes for geofencing
 */
export function watchPosition(
    onPositionChange: (position: Coordinates) => void,
    onError?: (error: GeolocationPositionError) => void
): number {
    if (!navigator.geolocation) {
        console.error('Geolocation not supported')
        return -1
    }

    return navigator.geolocation.watchPosition(
        (position) => {
            onPositionChange({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            })
        },
        onError,
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    )
}

/**
 * Stop watching position
 */
export function clearWatch(watchId: number): void {
    if (watchId >= 0) {
        navigator.geolocation.clearWatch(watchId)
    }
}
