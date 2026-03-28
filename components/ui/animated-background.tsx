'use client'

import { cn } from '@/lib/utils'

interface AnimatedBackgroundProps {
    variant?: 'default' | 'purple' | 'emerald' | 'amber'
    intensity?: 'low' | 'medium' | 'high'
    className?: string
}

const variantStyles = {
    default: {
        orb1: 'bg-blue-500/[0.12]',
        orb2: 'bg-purple-500/[0.08]',
        orb3: 'bg-cyan-500/[0.06]',
    },
    purple: {
        orb1: 'bg-purple-500/[0.12]',
        orb2: 'bg-pink-500/[0.08]',
        orb3: 'bg-blue-500/[0.06]',
    },
    emerald: {
        orb1: 'bg-emerald-500/[0.12]',
        orb2: 'bg-teal-500/[0.08]',
        orb3: 'bg-green-500/[0.06]',
    },
    amber: {
        orb1: 'bg-amber-500/[0.12]',
        orb2: 'bg-orange-500/[0.08]',
        orb3: 'bg-yellow-500/[0.06]',
    },
}

export function AnimatedBackground({
    variant = 'default',
    intensity = 'medium',
    className = ''
}: AnimatedBackgroundProps) {
    const colors = variantStyles[variant]

    const sizeMultiplier = { low: 0.7, medium: 1, high: 1.3 }[intensity]
    const baseSize = 500 * sizeMultiplier

    return (
        <div className={cn('fixed inset-0 pointer-events-none z-0 overflow-hidden', className)}>
            {/* Orb 1 — top left, slow drift */}
            <div
                className={cn(
                    'absolute rounded-full blur-[120px] will-change-transform',
                    colors.orb1
                )}
                style={{
                    width: baseSize,
                    height: baseSize,
                    top: '10%',
                    left: '15%',
                    animation: 'orb-drift-1 25s ease-in-out infinite',
                }}
            />

            {/* Orb 2 — center right, opposite drift */}
            <div
                className={cn(
                    'absolute rounded-full blur-[120px] will-change-transform',
                    colors.orb2
                )}
                style={{
                    width: baseSize * 0.85,
                    height: baseSize * 0.85,
                    top: '45%',
                    right: '10%',
                    animation: 'orb-drift-2 30s ease-in-out infinite',
                }}
            />

            {/* Orb 3 — bottom center, gentle float */}
            <div
                className={cn(
                    'absolute rounded-full blur-[100px] will-change-transform',
                    colors.orb3
                )}
                style={{
                    width: baseSize * 0.75,
                    height: baseSize * 0.75,
                    bottom: '5%',
                    left: '40%',
                    animation: 'orb-drift-3 20s ease-in-out infinite',
                }}
            />

            {/* Global keyframes injected via style tag */}
            <style jsx>{`
                @keyframes orb-drift-1 {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(60px, 40px); }
                    66% { transform: translate(-30px, 20px); }
                }
                @keyframes orb-drift-2 {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(-50px, -30px); }
                    66% { transform: translate(40px, -20px); }
                }
                @keyframes orb-drift-3 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -25px); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .will-change-transform {
                        animation: none !important;
                    }
                }
            `}</style>
        </div>
    )
}
