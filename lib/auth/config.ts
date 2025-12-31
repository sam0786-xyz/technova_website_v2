import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

import { getRoleFromEmail, isEmailAllowed } from "@/lib/auth/role-utils"

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
      if (account?.provider === "google") {
        const email = user.email
        if (!email) {
          return false
        }

        const allowed = isEmailAllowed(email)
        return allowed
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = getRoleFromEmail(user.email || "")
        // @ts-ignore
        token.system_id = user.system_id
      }

      // If updating the session (e.g. after onboarding)
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id ?? token.sub) as string
        session.user.role = (token.role ?? 'student') as 'student' | 'admin' | 'super_admin'
        session.user.system_id = token.system_id as string | undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error', // Error code passed in query string as ?error=
  }
} satisfies NextAuthConfig
