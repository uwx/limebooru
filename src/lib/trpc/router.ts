import type { Context } from '$lib/trpc/context';
import { initTRPC, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import z from 'zod';
import { db } from '$lib/server/db';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import type { ExpressionBuilder } from 'kysely';
import type { DB } from '$lib/server/db/types';
import { unlink } from 'node:fs/promises';
import { getRealImagePath } from '$lib/server';

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

            if (input.rating) {
                query = query.where('rating', '==', input.rating);
            }

            if (input.positiveTags?.length || input.negativeTags?.length) {
                // omit posts that have tags that are not in the positiveTags list
                let query1 = query;

                if (input.positiveTags?.length)
                    query1 = query1.where('Post.id', 'in', db
                        .selectFrom('Tag')
                        .where('Tag.name', 'in', input.negativeTags!)
                        .innerJoin('PostTag', 'Tag.id', 'PostTag.tagId')
                        .select('PostTag.postId'));
                if (input.negativeTags?.length)
                    query1 = query1.where('Post.id', 'not in', db
                        .selectFrom('Tag')
                        .where('Tag.name', 'in', input.negativeTags!)
                        .innerJoin('PostTag', 'Tag.id', 'PostTag.tagId')
                        .select('PostTag.postId')
                    );
                
                query = query1;
            }

            const count = await query
                .select(eb => eb.fn.countAll<number>().over().as('total'))
                .executeTakeFirst();

            const results = await query
                .orderBy(input.orderBy.field, input.orderBy.direction)
                .offset(input.offset)
                .limit(input.limit)
                .selectAll('Post')
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
                tagPostCounts,
                total: count?.total,
            };
        }),
    deletePost: t.procedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const result = await db
                .deleteFrom('Post')
                .where('id', '==', input)
                .returning('Post.location')
                .executeTakeFirst();
            
            if (result?.location) {
                await unlink(getRealImagePath(result.location));
                return true;
            }

            return false;
        }),
});

export type Router = typeof router;

export type RouterOutputs = inferRouterOutputs<Router>;
export type RouterInputs = inferRouterInputs<Router>;