import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <html lang="en">
      <Head>
        <meta name="description" content="Browse and download a comprehensive collection of cryptocurrency icons." />
        <title>Cryptoicons - Free Cryptocurrency Icons</title>
        <link rel="canonical" href="https://www.cryptoicons.app/" />
      </Head>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Component {...pageProps} />
    </html>
  );
}
