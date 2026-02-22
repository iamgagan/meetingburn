import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly',
                },
            },
        }),
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                (session.user as Record<string, unknown>).id = token.sub;
            }
            // Pass Google access token to session for Calendar API
            if (token.accessToken) {
                (session as unknown as Record<string, unknown>).accessToken = token.accessToken as string;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
