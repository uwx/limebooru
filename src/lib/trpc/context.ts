import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

export async function createContext(event: RequestEvent) {
    return {
        ...event
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;