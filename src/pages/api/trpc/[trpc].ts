import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/appRouter';
import { createContext } from '../../../server/context';


// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({error}){
    if(error.code === 'INTERNAL_SERVER_ERROR'){
        console.error('Algo errado', error);
    }
  },
});