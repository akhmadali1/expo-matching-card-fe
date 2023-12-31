import '@/styles/globals.scss';
import Head from 'next/head';
import "../../node_modules/primereact/resources/themes/lara-light-teal/theme.css";
import "../../node_modules/primeflex/primeflex.css"
import { PrimeReactProvider } from 'primereact/api';
export default function App({ Component, pageProps }) {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <>
        <>
          <PrimeReactProvider value={{ ripple: true }}>
            <Component {...pageProps} />
          </PrimeReactProvider>
        </>
      </>
    </>
  );
}
