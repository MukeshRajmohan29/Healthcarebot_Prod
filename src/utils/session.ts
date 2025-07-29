// session.ts

// Deterministic session ID based on first, last, dob (no random hash)
export function generateSessionId(firstName: string, lastName: string, dob: string): string {
    // Remove spaces, lowercase, and join with |
    const clean = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
    return `session_${clean(firstName)}_${clean(lastName)}_${dob.replace(/[^0-9]/g, '')}`;
}