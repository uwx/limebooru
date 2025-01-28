import { buildQuery, pageToOffset, RESULTS_PER_PAGE } from "$lib";
import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (page) => {
    return await trpc(page).post.query({
        id: +page.params.id,
    });
};