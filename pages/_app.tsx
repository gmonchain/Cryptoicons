import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <html lang="en" itemScope itemType="https://schema.org/WebSite">
      <Head>
        <meta name="description" content="Browse and download a comprehensive collection of cryptocurrency icons." />
        <title itemProp="name">Cryptoicons - Free Cryptocurrency Icons</title>
        <link rel="canonical" href="https://www.cryptoicons.app/" itemProp="url"/>
        <meta property="og:title" content="Cryptoicons - Free Cryptocurrency Icons" />
        <meta property="og:description" content="Browse and download a comprehensive collection of cryptocurrency icons." />
        <meta property="og:image" content="https://www.cryptoicons.app/og-image.jpg" /> {/* Placeholder image */}
        <meta property="og:url" content="https://www.cryptoicons.app/" />
        <meta property="og:type" content="website" />
      </Head>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Component {...pageProps} />
    </html>
  );
}
