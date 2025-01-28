import { buildQuery, pageToOffset, RESULTS_PER_PAGE } from "$lib";
import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (page) => {
    const resultsPage = page.url.searchParams.has('page') ? +(page.url.searchParams.get('page')!) : 1;

    return await trpc(page).search.query({
        offset: pageToOffset(resultsPage),
        limit: RESULTS_PER_PAGE,
        orderBy: {
            field: 'id',
            direction: 'desc',
        },
    });
};