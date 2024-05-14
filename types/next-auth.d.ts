import NextAuth, { Account } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {} & DefaultSession["user"],    
    token: JWT,
  }

  interface User {
    account: Account | null,
  }
}