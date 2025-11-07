import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import type { GeofenceConfig } from '../lib/geolocation'
import { getCurrentPosition, watchPosition, isInGeofence, clearWatch } from '../lib/geolocation'

interface LocationSetupProps {
    onLocationSet: (location: GeofenceConfig) => void
    currentLocation?: GeofenceConfig
}

export function LocationSetup({ onLocationSet, currentLocation }: LocationSetupProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null)
    const [radius, setRadius] = useState(currentLocation?.radius || 100)
    const [name, setName] = useState('')

    const handleGetCurrentLocation = async () => {
        setIsLoading(true)
        const position = await getCurrentPosition()
        if (position) {
            setCurrentCoords({ lat: position.latitude, lng: position.longitude })
        }
        setIsLoading(false)
    }

    const handleSaveLocation = () => {
        if (currentCoords && name) {
            onLocationSet({
                latitude: currentCoords.lat,
                longitude: currentCoords.lng,
                radius,
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Lokalizacja miejsca pracy</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Nazwa lokalizacji
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="np. Biuro, Firma XYZ"
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Promień (metry)
                    </label>
                    <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        min="10"
                        max="1000"
                        step="10"
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Obszar w którym timer włączy się automatycznie
                    </p>
                </div>

                {currentCoords ? (
                    <div className="p-3 bg-muted rounded-lg space-y-1">
                        <p className="text-sm font-medium">Aktualna lokalizacja:</p>
                        <p className="text-xs text-muted-foreground">
                            📍 {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
                        </p>
                    </div>
                ) : (
                    <Button
                        onClick={handleGetCurrentLocation}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? '⏳ Pobieranie...' : '📍 Użyj obecnej lokalizacji'}
                    </Button>
                )}

                {currentCoords && name && (
                    <Button onClick={handleSaveLocation} className="w-full" variant="default">
                        💾 Zapisz lokalizację
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
