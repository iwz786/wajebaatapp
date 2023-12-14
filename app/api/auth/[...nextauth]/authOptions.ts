import CredentialsProvider from  "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth";

import { error } from 'console';
import { User } from "@/app/models/user";


const validate = (credentials:any): User | null => {
    const stored_creds_string = process.env.LOGIN_CREDS
    if (!stored_creds_string) {
        throw error('Creds not found')
    }
    const stored_creds = JSON.parse(stored_creds_string)
    if (credentials.username in stored_creds) {
        if (stored_creds[credentials.username]['password'] === credentials.password) {
            return stored_creds[credentials.username]
        }
    }
    return null;
}


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                return validate(credentials) as any;
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token = {
                    ...token,
                    sheetId: user.sheetId,
                    jamaat: user.jamaat,
                    code: user.code
                }
            }
            return token;
          },
        async session({ session, token, user }) {
            if (token) {
                session = {
                    ...session,
                    sheetId: token.sheetId,
                    code: token.code,
                    jamaat: token.jamaat
                }
            }
            return session
        },
    }
}