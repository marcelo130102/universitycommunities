import ResponsiveNavbar from '@/components/ResponsiveNavbar'
import { UserProvider } from '@/context/UserContext'
import theme from '@/utils/theme'
import { ThemeProvider } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
    return (
        <>
            <SessionProvider session={session}>
                <UserProvider>
                <ThemeProvider theme={theme}>
                    <ResponsiveNavbar>
                        <Component {...pageProps} />
                    </ResponsiveNavbar>
                </ThemeProvider>
                </UserProvider>
            </SessionProvider>
        </>
    )
}