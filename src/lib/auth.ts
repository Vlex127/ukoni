import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db, users } from './db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Helper functions that will be used in the CredentialsProvider
async function getUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user[0] || null;
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
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

        const user = await getUserByEmail(credentials.email as string);

        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(credentials.password as string, user.password);

        if (isValid) {
          // Return user object without the password
          const { password, ...userWithoutPassword } = user;
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