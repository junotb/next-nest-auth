import NextAuth from "next-auth"
import { User } from "./user"

declare module "next-auth" {
  interface Session {
    user: User,
    token: JWT,
    expires: Date
  }
}