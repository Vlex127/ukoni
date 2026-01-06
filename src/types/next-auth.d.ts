import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;  // Built-in NextAuth expects 'name' not 'fullName'
      username: string;
      isAdmin?: boolean;
    }
  }

  interface User {
    username?: string;
    isAdmin?: boolean;
    name: string | null;  // Built-in NextAuth expects 'name' not 'fullName'
  }
  
  interface AdapterUser {
    id: string;
    email: string;
    username?: string;
    name?: string | null;  // Built-in NextAuth expects 'name' not 'fullName'
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    isAdmin?: boolean;
    name: string | null;  // Built-in NextAuth expects 'name' not 'fullName'
  }
}
