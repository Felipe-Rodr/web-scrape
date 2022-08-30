import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";


// The app's context - is generated for each incoming request


export const createContext = async ({
    
  }:trpcNext.CreateNextContextOptions) => {
    return {
      
    };
  };
  
export type Context = trpc.inferAsyncReturnType<typeof createContext>;