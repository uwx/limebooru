import type { Context } from '$lib/trpc/context';
import { initTRPC, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import z from 'zod';
import { db } from '$lib/server/db';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import type { ExpressionBuilder } from 'kysely';
import type { DB } from '$lib/server/db/types';

export const t = initTRPC.context<Context>().create();

function includeTags(eb: ExpressionBuilder<DB, 'Post'>) {
    return jsonArrayFrom(
        eb
            .selectFrom('Tag')
            .select(['Tag.name', 'Tag.id'])

            .leftJoin('PostTag', 'PostTag.tagId', 'Tag.id')
            .whereRef('PostTag.postId', '==', 'Post.id')
    );
}

export const router = t.router({
    post: t.procedure
        .input(z.object({
            id: z.number(),
        }))
        .query(async ({ ctx, input }) => {
            const result = await db
                .selectFrom('Post')
                .selectAll()
                .where('id', '==', input.id)
                .executeTakeFirstOrThrow();

            const tags = await db.selectFrom('PostTag')
                .where('PostTag.postId', '==', result.id)
                .rightJoin('Tag', 'Tag.id', 'PostTag.tagId')
                .select(['Tag.id', 'Tag.name'])
                .select(eb => eb
                    .selectFrom('PostTag')
                    .whereRef('PostTag.tagId', '==', 'Tag.id')
                    .select((eb) =>
                        eb
                            .fn.count<number>('PostTag.postId')
                            .as('postCount'))
                    .as('postCount')
                )
                .execute();

            return { result, tags };
        }),
    search: t.procedure
        .input(z.object({
            offset: z.number(),
            limit: z.number(),
            positiveTags: z.optional(z.array(z.string())),
            negativeTags: z.optional(z.array(z.string())),
            rating: z.optional(z.enum(['g', 's', 'q', 'e'])),
            orderBy: z.object({
                field: z.enum(['id']),
                direction: z.enum(['asc', 'desc']),
            }),
        }))
        .query(async ({ ctx, input }) => {
            let query = db
                .selectFrom('Post')
                .selectAll();

            if (input.rating) {
                query = query.where('rating', '==', input.rating);
            }

            // nearly completely ripped from https://github.com/p4ckysm4cky/booru/blob/main/server/query.ts
            if (input.positiveTags?.length) {
                const selectPostsByTag = db
                    .selectFrom('PostTag')
                    .leftJoin('Tag', 'Tag.id', 'PostTag.tagId')
                    .where('Tag.name', 'in', input.positiveTags)
                    .rightJoin('Post', 'Post.id', 'PostTag.postId')
                    .selectAll('Post');

                query = query.intersect(selectPostsByTag);
            }

            if (input.negativeTags?.length) {
                const selectPostsByTag = db
                    .selectFrom('PostTag')
                    .leftJoin('Tag', 'Tag.id', 'PostTag.tagId')
                    .where('Tag.name', 'in', input.negativeTags)
                    .rightJoin('Post', 'Post.id', 'PostTag.postId')
                    .selectAll('Post');

                query = query.except(selectPostsByTag);
            }

            const results = await query
                // .select(eb => eb.fn.count<number>('Post.id').as('total'))

                .orderBy(input.orderBy.field, input.orderBy.direction)
                .offset(input.offset)
                .limit(input.limit)
                .execute();
                
            // include tags
            const postTags = await db
                .selectFrom('Post')
                .where('Post.id', 'in', results.map(e => e.id))
                .select(eb => [includeTags(eb).as('tags')])
                .select('Post.id')
                .execute();

            // get post counts
            const tagIdsToFetchPostCountsFor = postTags
                .flatMap(e => e.tags.map(e => e.id));

            const tagPostCounts = await db.selectFrom('Tag')
                .where('Tag.id', 'in', tagIdsToFetchPostCountsFor)
                .select(['Tag.id', 'Tag.name'])
                .select(eb => eb
                    .selectFrom('PostTag')
                    .whereRef('PostTag.tagId', '==', 'Tag.id')
                    .select((eb) =>
                        eb
                            .fn.count<number>('PostTag.postId')
                            .as('postCount'))
                    .as('postCount')
                )
                .execute();

            return {
                pictures: results.map(result => ({
                    ...result,
                    ...postTags.find(e => e.id === result.id)!,
                })),
                tagPostCounts
            };
        })
});

export type Router = typeof router;

export type RouterOutputs = inferRouterOutputs<Router>;
export type RouterInputs = inferRouterInputs<Router>;