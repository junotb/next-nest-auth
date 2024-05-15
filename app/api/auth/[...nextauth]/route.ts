import NextAuth, { NextAuthOptions, User } from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import NaverProvider from 'next-auth/providers/naver'
import KakaoProvider from 'next-auth/providers/kakao'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUser } from '@/firebase'

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Check if credentials are provided
        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Missing credentials');
        }

        try {
          const user: User = await getUser(credentials.username, credentials.password);

          // Check if user exists
          if (!user) {
            console.log('Invalid credentials');
            throw new Error('Invalid credentials');
          }

          return user;
        } catch (error) {
          console.error('Error during authorization:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async session ({ session, token }) {
      session.token = token;
      return session;
    },
    async jwt ({ token, user, account }) {
      if (account) {
        user.account = account;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }