import NextAuth, { Account } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    token: JWT
  }

  interface User {
    provider: string
  }
}