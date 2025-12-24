import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { users } from './db/schema';

if (!process.env.AUTH_SECRET) {
  throw new Error('Missing required environment variable: AUTH_SECRET');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.select().from(users).where(eq(users.email, credentials.email as string)).limit(1);

        if (!user[0] || !user[0].password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password as string, user[0].password);

        if (isValid) {
          const { password, ...userWithoutPassword } = user[0];
          return userWithoutPassword;
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
});