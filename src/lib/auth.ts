import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Auth: Missing credentials')
            return null
          }

          console.log('Auth: Attempting to find user:', credentials.email)
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.hashedPassword) {
            console.log('Auth: User not found or no password:', credentials.email)
            return null
          }

          console.log('Auth: Verifying password for user:', user.email)
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          )

          if (!isPasswordValid) {
            console.log('Auth: Invalid password for user:', user.email)
            return null
          }

          console.log('Auth: Successfully authenticated user:', user.email)
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.fullName || null,
          }
        } catch (error) {
          console.error('Auth: Error during authorization:', error)
          console.error('Auth error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
          })
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.name = (user as any).fullName || null
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.name = (token as any).name as string // Changed from fullName to name
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
}
