import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface WorkTimerProps {
    onAutoStart?: () => void
    onAutoStop?: () => void
}

export function WorkTimer({ onAutoStart, onAutoStop }: WorkTimerProps = {}) {
    const [isRunning, setIsRunning] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [autoStarted, setAutoStarted] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((s) => s + 1)
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning])

    const startTimer = async (isAutomatic = false) => {
        setIsRunning(true)
        setAutoStarted(isAutomatic)
        // Call API to start work session
        // const response = await fetch('/api/work-sessions/start', { method: 'POST' })
        // const { sessionId } = await response.json()
        // setSessionId(sessionId)

        if (isAutomatic && onAutoStart) {
            onAutoStart()
        }
    }

    const stopTimer = async (isAutomatic = false) => {
        setIsRunning(false)
        setAutoStarted(false)
        // Call API to stop work session
        // await fetch(`/api/work-sessions/${sessionId}/stop`, { method: 'POST' })
        setSeconds(0)

        if (isAutomatic && onAutoStop) {
            onAutoStop()
        }
    }

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const secs = totalSeconds % 60
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <Card className="p-4 sm:p-6 lg:p-8">
            <div className="text-center space-y-6 sm:space-y-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold">⏱️ Timer pracy</h2>
                    {autoStarted && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            🤖 Auto
                        </span>
                    )}
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tabular-nums">
                    {formatTime(seconds)}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                    {isRunning ? '⏱️ Timer running...' : '⏸️ Ready to start'}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    {!isRunning ? (
                        <Button
                            onClick={() => startTimer(false)}
                            size="lg"
                            className="w-full sm:w-auto min-h-[3rem] text-lg touch-manipulation"
                        >
                            ▶️ Start Timer
                        </Button>
                    ) : (
                        <Button
                            onClick={() => stopTimer(false)}
                            size="lg"
                            variant="destructive"
                            className="w-full sm:w-auto min-h-[3rem] text-lg touch-manipulation"
                        >
                            ⏹️ Stop Timer
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    )
}
