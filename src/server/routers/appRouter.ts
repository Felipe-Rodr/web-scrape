import { createRouter } from '../createRouter'
import { pichauRouter } from './pichauRouter';
import { terabyteRouter } from './terabyteRouter';


export const appRouter = createRouter()
    .merge('terabyte.', terabyteRouter)
    .merge('pichau.', pichauRouter)
;
// export type definition of API
export type AppRouter = typeof appRouter;