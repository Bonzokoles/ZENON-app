export interface WorkLocation {
    id: string
    name: string
    latitude: number
    longitude: number
    radius: number // meters
    user_id: string
    created_at: string
}

export interface Reminder {
    id: string
    user_id: string
    time: string // HH:MM format
    sound: string
    message: string
    enabled: boolean
    days: number[] // 0-6 (Sunday-Saturday)
    created_at: string
}

export interface GeofenceSettings {
    enabled: boolean
    auto_start: boolean
    auto_stop: boolean
    notification_enabled: boolean
}
