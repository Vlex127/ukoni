import NextAuth, { type AuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { users } from './db/schema';
import { type JWT } from 'next-auth/jwt';
import { type Session } from 'next-auth';

if (!process.env.AUTH_SECRET) {
  throw new Error('Missing required environment variable: AUTH_SECRET');
}

const authOptions: AuthOptions = {
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
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.AUTH_SECRET,
};

export const { signIn, signOut } = NextAuth(authOptions);
export const auth = () => getServerSession(authOptions);
export { authOptions };