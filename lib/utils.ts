import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Date/Time formatting utilities - India timezone (Asia/Kolkata)
const TIMEZONE = 'Asia/Kolkata'
const LOCALE = 'en-IN'

/**
 * Format date as DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(LOCALE, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: TIMEZONE
    })
}

/**
 * Format date as "28 Dec 2025" (short format for display)
 */
export function formatDateShort(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(LOCALE, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: TIMEZONE
    })
}

/**
 * Format date as "28 Dec" (without year)
 */
export function formatDateCompact(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(LOCALE, {
        day: 'numeric',
        month: 'short',
        timeZone: TIMEZONE
    })
}

/**
 * Format time as 12-hour format (e.g., "10:30 AM")
 */
export function formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleTimeString(LOCALE, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: TIMEZONE
    })
}

/**
 * Format date and time together
 */
export function formatDateTime(date: Date | string): string {
    return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * Format date range (e.g., "28 Dec - 3 Jan 2025")
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
    return `${formatDateCompact(startDate)} - ${formatDateShort(endDate)}`
}
