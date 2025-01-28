import type { RouterInputs } from "./trpc/router";

export const RESULTS_PER_PAGE = 30;

export function pageToOffset(page: number) {
    return (page - 1) * RESULTS_PER_PAGE;
}

export function buildQuery(queryString: string): {
    positiveTags?: string[];
    negativeTags?: string[];
    orderBy: RouterInputs['search']['orderBy'];
} {
    const tags = queryString.split(' ');

    let orderByField: RouterInputs['search']['orderBy']['field'] | undefined;
    let orderByDirection: 'asc' | 'desc' | undefined;

    let orderIndex: number;
    do {
        orderIndex = tags.findIndex(e => e.startsWith('order:'));
        if (orderIndex === -1) break;
        
        const orderTag = tags[orderIndex];
        if (orderTag === 'order:id_asc') {
            orderByField = 'id';
            orderByDirection = 'asc';
        } else if (orderTag === 'order:id') {
            orderByField = 'id';
            orderByDirection = 'desc';
        }
        
        tags.splice(orderIndex, 1);
    } while (orderIndex !== -1);

    const positiveTags = tags.filter(e => !e.startsWith('-'));
    const negativeTags = tags.filter(e => e.startsWith('-'));

    return {
        positiveTags: positiveTags.map(e => e),
        negativeTags: negativeTags.map(e => e.slice(1)),
        orderBy: {
            field: orderByField ?? 'id',
            direction: orderByDirection ?? 'desc',
        },
    };
}