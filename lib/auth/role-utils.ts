
// Helper to determine role from email
export function getRoleFromEmail(email: string): 'student' | 'admin' | 'super_admin' {
    // technova@sharda.ac.in is super_admin
    if (email === 'technova@sharda.ac.in') {
        return 'super_admin'
    }

    // Club accounts: *.technova@gmail.com → admin
    if (email.endsWith('.technova@gmail.com')) {
        return 'admin'
    }

    // Students: @ug.sharda.ac.in or @pg.sharda.ac.in
    return 'student'
}

// Helper to check if email is allowed
export function isEmailAllowed(email: string): boolean {
    // Exact match for main technova account
    if (email === 'technova@sharda.ac.in') return true

    // Student domains
    if (email.endsWith('@ug.sharda.ac.in')) return true
    if (email.endsWith('@pg.sharda.ac.in')) return true

    // Club accounts (e.g., clubcyberpirates.technova@gmail.com)
    if (email.endsWith('.technova@gmail.com')) return true

    return false
}
