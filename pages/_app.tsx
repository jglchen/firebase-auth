import '@/styles/globals.css';
import { SWRConfig } from 'swr';
import fetcher from '@/lib/fetchJson';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        onError: (err) => {
          console.error(err)
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
