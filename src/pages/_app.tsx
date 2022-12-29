import { Header } from '../components/Header'
import { Session } from 'next-auth/'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

import '../styles/global.scss'

export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
