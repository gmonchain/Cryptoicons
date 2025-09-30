import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <html lang="en">
      <Component {...pageProps} />
    </html>
  );
}
