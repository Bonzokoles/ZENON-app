import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import type { GeofenceConfig } from '../lib/geolocation'
import { watchPosition, isInGeofence, clearWatch } from '../lib/geolocation'

interface GeofenceTimerProps {
    workLocation: GeofenceConfig
    onAutoStart: () => void
    onAutoStop: () => void
    enabled: boolean
}

export function GeofenceTimer({ workLocation, onAutoStart, onAutoStop, enabled }: GeofenceTimerProps) {
    const [isInWorkArea, setIsInWorkArea] = useState(false)
    const [watchId, setWatchId] = useState<number>(-1)
    const [lastCheck, setLastCheck] = useState<Date | null>(null)

    useEffect(() => {
        if (!enabled) {
            if (watchId >= 0) {
                clearWatch(watchId)
                setWatchId(-1)
            }
            return
        }

        // Start watching position
        const id = watchPosition(
            (position) => {
                const inArea = isInGeofence(position, workLocation)
                setLastCheck(new Date())

                // Auto-start when entering work area
                if (inArea && !isInWorkArea) {
                    setIsInWorkArea(true)
                    onAutoStart()
                    showNotification('📍 Dotarłeś do pracy. Timer został uruchomiony.')
                }

                // Auto-stop when leaving work area
                if (!inArea && isInWorkArea) {
                    setIsInWorkArea(false)
                    onAutoStop()
                    showNotification('🚗 Opuściłeś miejsce pracy. Timer został zatrzymany.')
                }
            },
            (error) => {
                console.error('Geofence error:', error)
            }
        )

        setWatchId(id)

        return () => {
            if (id >= 0) {
                clearWatch(id)
            }
        }
    }, [enabled, workLocation])

    const showNotification = (message: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Work Timer', {
                body: message,
                icon: '/icon-192.png',
            })
        }
    }

    const requestPermissions = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission()
        }
    }

    useEffect(() => {
        requestPermissions()
    }, [])

    return (
        <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{isInWorkArea ? '🟢' : '🔴'}</span>
                    <div>
                        <p className="font-medium text-sm">
                            {isInWorkArea ? 'W obszarze pracy' : 'Poza obszarem pracy'}
                        </p>
                        {lastCheck && (
                            <p className="text-xs text-muted-foreground">
                                Ostatnie sprawdzenie: {lastCheck.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                    {enabled ? '✓ Aktywne' : '✕ Wyłączone'}
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                📍 Lokalizacja: {workLocation.latitude.toFixed(4)}, {workLocation.longitude.toFixed(4)} ({workLocation.radius}m)
            </p>
        </div>
    )
}
