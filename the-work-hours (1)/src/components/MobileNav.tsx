import { useState } from 'react'

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-card border shadow-lg sm:hidden touch-manipulation"
                aria-label="Toggle menu"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                    <nav className="fixed top-0 right-0 h-full w-64 bg-card border-l shadow-xl z-50 sm:hidden p-6">
                        <div className="flex flex-col gap-4 mt-12">
                            <a
                                href="/"
                                className="p-3 rounded-lg hover:bg-accent touch-manipulation"
                                onClick={() => setIsOpen(false)}
                            >
                                🏠 Home
                            </a>
                            <a
                                href="/employer"
                                className="p-3 rounded-lg hover:bg-accent touch-manipulation"
                                onClick={() => setIsOpen(false)}
                            >
                                👔 Employer
                            </a>
                            <a
                                href="/admin"
                                className="p-3 rounded-lg hover:bg-accent touch-manipulation"
                                onClick={() => setIsOpen(false)}
                            >
                                ⚙️ Admin
                            </a>
                            <a
                                href="/super-admin"
                                className="p-3 rounded-lg hover:bg-accent touch-manipulation"
                                onClick={() => setIsOpen(false)}
                            >
                                👑 Super Admin
                            </a>
                        </div>
                    </nav>
                </>
            )}
        </>
    )
}
