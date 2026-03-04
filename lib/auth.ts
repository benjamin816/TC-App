import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Fallback for NEXTAUTH_URL in AI Studio environment
if (!process.env.NEXTAUTH_URL && process.env.APP_URL) {
  process.env.NEXTAUTH_URL = process.env.APP_URL;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email',
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      // Simple role logic for MVP: first user or specific email can be admin
      // In a real app, we'd check a 'Users' tab in the sheet
      session.user.role = 'Admin'; 
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
};
