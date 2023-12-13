import '@/styles/globals.scss';
import { ConfigProvider } from 'antd';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
  const theme = {
    token: {
      fontSize: 16,
      colorPrimary: '#08793F',
    },
  };
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
          <ConfigProvider theme={theme}>
            <Component {...pageProps} />
          </ConfigProvider>
        </>
      </>
    </>
  );
}
