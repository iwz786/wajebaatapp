'use client';

import {SessionProvider} from 'next-auth/react'

export const AuthProvider = ({children}: {[key:string]: any}) => {
    return <SessionProvider>{children}</SessionProvider>
}