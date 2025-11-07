import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

interface Reminder {
    id: string
    time: string
    message: string
    sound: string
    enabled: boolean
    days: number[]
}

const SOUNDS = [
    { value: 'bell', label: '🔔 Dzwonek' },
    { value: 'chime', label: '🎵 Melodia' },
    { value: 'beep', label: '📢 Sygnał' },
    { value: 'notification', label: '📱 Powiadomienie' },
]

const DAYS = [
    { value: 0, label: 'Nd' },
    { value: 1, label: 'Pn' },
    { value: 2, label: 'Wt' },
    { value: 3, label: 'Śr' },
    { value: 4, label: 'Cz' },
    { value: 5, label: 'Pt' },
    { value: 6, label: 'So' },
]

export function ReminderSetup() {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [newReminder, setNewReminder] = useState({
        time: '09:00',
        message: '',
        sound: 'bell',
        days: [1, 2, 3, 4, 5], // Pn-Pt domyślnie
    })

    // Check reminders every minute
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date()
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
            const currentDay = now.getDay()

            reminders.forEach((reminder) => {
                if (
                    reminder.enabled &&
                    reminder.time === currentTime &&
                    reminder.days.includes(currentDay)
                ) {
                    playSound(reminder.sound)
                    showNotification(reminder.message)
                }
            })
        }

        const interval = setInterval(checkReminders, 60000) // Check every minute
        return () => clearInterval(interval)
    }, [reminders])

    const playSound = (soundType: string) => {
        // Play notification sound
        const audio = new Audio(`/sounds/${soundType}.mp3`)
        audio.play().catch((e) => console.log('Sound play failed:', e))
    }

    const showNotification = (message: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Work Timer Przypomnienie', {
                body: message,
                icon: '/icon-192.png',
            })
        }
    }

    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission()
        }
    }

    const addReminder = () => {
        const reminder: Reminder = {
            id: Date.now().toString(),
            ...newReminder,
            enabled: true,
        }
        setReminders([...reminders, reminder])
        setNewReminder({
            time: '09:00',
            message: '',
            sound: 'bell',
            days: [1, 2, 3, 4, 5],
        })
        setShowAddForm(false)
    }

    const toggleReminder = (id: string) => {
        setReminders(
            reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
        )
    }

    const deleteReminder = (id: string) => {
        setReminders(reminders.filter((r) => r.id !== id))
    }

    const toggleDay = (day: number) => {
        const days = newReminder.days.includes(day)
            ? newReminder.days.filter((d) => d !== day)
            : [...newReminder.days, day].sort()
        setNewReminder({ ...newReminder, days })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>Przypomnienia dźwiękowe</span>
                    </span>
                    <Button
                        size="sm"
                        onClick={() => {
                            setShowAddForm(!showAddForm)
                            requestNotificationPermission()
                        }}
                    >
                        {showAddForm ? '✕ Anuluj' : '➕ Dodaj'}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {showAddForm && (
                    <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                        <div>
                            <label className="block text-sm font-medium mb-2">Godzina</label>
                            <input
                                type="time"
                                value={newReminder.time}
                                onChange={(e) =>
                                    setNewReminder({ ...newReminder, time: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Wiadomość</label>
                            <input
                                type="text"
                                value={newReminder.message}
                                onChange={(e) =>
                                    setNewReminder({ ...newReminder, message: e.target.value })
                                }
                                placeholder="np. Czas zacząć pracę!"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Dźwięk</label>
                            <select
                                value={newReminder.sound}
                                onChange={(e) =>
                                    setNewReminder({ ...newReminder, sound: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                {SOUNDS.map((sound) => (
                                    <option key={sound.value} value={sound.value}>
                                        {sound.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Dni tygodnia</label>
                            <div className="flex gap-2 flex-wrap">
                                {DAYS.map((day) => (
                                    <button
                                        key={day.value}
                                        onClick={() => toggleDay(day.value)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${newReminder.days.includes(day.value)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                            }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={addReminder} className="w-full" disabled={!newReminder.message}>
                            💾 Zapisz przypomnienie
                        </Button>
                    </div>
                )}

                <div className="space-y-2">
                    {reminders.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Brak przypomień. Kliknij "➕ Dodaj" aby utworzyć.
                        </p>
                    ) : (
                        reminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="p-3 border rounded-lg flex items-center justify-between gap-3"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg">{reminder.time}</span>
                                        <span className="text-xs bg-muted px-2 py-1 rounded">
                                            {SOUNDS.find((s) => s.value === reminder.sound)?.label}
                                        </span>
                                    </div>
                                    <p className="text-sm">{reminder.message}</p>
                                    <div className="flex gap-1 mt-2">
                                        {reminder.days.map((day) => (
                                            <span
                                                key={day}
                                                className="text-xs px-1.5 py-0.5 bg-primary/10 rounded"
                                            >
                                                {DAYS.find((d) => d.value === day)?.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleReminder(reminder.id)}
                                        className={`px-3 py-1 rounded-lg text-sm ${reminder.enabled
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-300 text-gray-600'
                                            }`}
                                    >
                                        {reminder.enabled ? '✓ Włączone' : '✕ Wyłączone'}
                                    </button>
                                    <button
                                        onClick={() => deleteReminder(reminder.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
