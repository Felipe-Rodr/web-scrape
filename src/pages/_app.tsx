import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next';
import { AppRouter } from '../server/routers/appRouter';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    if(typeof window !== 'undefined'){
      return {
        url:'/api/trpc'
      }
    }
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const ONE_DAY_SECONDS = 60 * 60 * 24;
    ctx?.res?.setHeader(
      'Cache-Control',
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`,
    )
    const url = process.env.VERCEL_URL ?
      `https://${process.env.VERCEL_URL}/api/trpc` :
      'http://localhost:3000/api/trpc'; 
    return {
      url: url,
      headers:{
        'x-ssr':'1',
      }
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
