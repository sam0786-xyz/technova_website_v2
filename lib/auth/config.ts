import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Helper to determine role from email
function getRoleFromEmail(email: string): 'student' | 'admin' | 'super_admin' {
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
function isEmailAllowed(email: string): boolean {
  // Exact match for main technova account
  if (email === 'technova@sharda.ac.in') return true

  // Student domains
  if (email.endsWith('@ug.sharda.ac.in')) return true
  if (email.endsWith('@pg.sharda.ac.in')) return true

  // Club accounts (e.g., clubcyberpirates.technova@gmail.com)
  if (email.endsWith('.technova@gmail.com')) return true

  return false
}

export const config = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Remove hd restriction to allow gmail.com for clubs
        },
      },
      profile(profile) {
        const email = profile.email || ''
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Assign role based on email pattern
          role: getRoleFromEmail(email),
          xp_points: 0,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn Attempt:", { userEmail: user.email, provider: account?.provider });
      if (account?.provider === "google") {
        const email = user.email
        if (!email) {
          console.log("SignIn Error: No email provided");
          return false
        }

        const allowed = isEmailAllowed(email)
        console.log(`SignIn Check: ${email} allowed? ${allowed}`);
        return allowed
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Force role recalculation based on email policy to ensure admins have access
        // even if the database record is stale/incorrect
        const assignedRole = getRoleFromEmail(user.email)
        session.user.role = assignedRole !== 'student' ? assignedRole : (user.role as 'student' | 'admin' | 'super_admin')
        session.user.system_id = user.system_id
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error', // Error code passed in query string as ?error=
  }
} satisfies NextAuthConfig
