import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { building } from '$app/environment';

if (!building) {
    await import('$lib/server/init');
}

export const handle: Handle = createTRPCHandle({ router, createContext });
