import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../server/routers/appRouter';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}