import type { AppProps } from 'next/app';

import '@/styles/globals.css';

// eslint-disable-next-line react/jsx-props-no-spreading
const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

export default MyApp;
