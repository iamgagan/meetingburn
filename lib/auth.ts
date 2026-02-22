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
                    access_type: 'offline',
                    prompt: 'consent',
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
            // We no longer expose token.accessToken or token.error to the client session
            return session;
        },
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    expiresAt: account.expires_at ? account.expires_at * 1000 : 0,
                    refreshToken: account.refresh_token,
                };
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.expiresAt as number)) {
                return token;
            }

            // Access token has expired, try to update it
            try {
                const response = await fetch('https://oauth2.googleapis.com/token', {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: process.env.GOOGLE_CLIENT_ID!,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                        grant_type: 'refresh_token',
                        refresh_token: token.refreshToken as string,
                    }),
                    method: 'POST',
                });

                const tokens = await response.json();

                if (!response.ok) throw tokens;

                return {
                    ...token,
                    accessToken: tokens.access_token,
                    expiresAt: Date.now() + tokens.expires_in * 1000,
                    refreshToken: tokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
                };
            } catch (error) {
                console.error('Error refreshing access token', error);
                return { ...token, error: 'RefreshAccessTokenError' };
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
