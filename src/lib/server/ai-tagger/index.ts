import { readFile } from "node:fs/promises";
import { db } from "../db";
import { getRealImagePath } from "$lib/server";
import { analyze } from "./inference";

export async function aiTagImage(image: { id: number, location: string }) {
    if (await db
            .selectFrom('AiTagStatus')
            .select('postId')
            .where('postId', '==', image.id)
            .executeTakeFirst()) {
        return;
    }

    // XXX: for some reason sharp keeps a lock on the file so we have to use readFile instead
    const { tags, rating: [rating, ratingAiConfidence] } = await analyze(await readFile(getRealImagePath(image.location)));

    // find existing tags
    const existingTags = await db
        .selectFrom('Tag')
        .select(['name', 'id'])
        .where('name', 'in', tags.map(([tag]) => tag))
        .execute();
    
    const newTags = tags
        .filter(([tag]) => !existingTags.find(e => e.name === tag))
        .map(([tag]) => tag);
    
    console.log(existingTags, newTags);

    await db
        .transaction()
        .execute(async trx => {
            // set rating
            await trx
                .updateTable('Post')
                .set({ rating, ratingAiConfidence })
                .where('id', '==', image.id)
                .execute();

            const newRows = await trx
                .insertInto('Tag')
                .values(newTags.map(tag => ({ name: tag })))
                .returningAll()
                .execute();

            console.log(newRows);

            const allTags = existingTags.concat(newRows);

            await trx.insertInto('PostTag')
                .values(
                    tags.map(([tag, prob]) => ({
                        postId: image.id,
                        tagId: allTags.find(e => e.name === tag)!.id,
                        aiConfidence: prob,
                    }))
                )
                .onConflict(oc => oc.doNothing())
                .execute();

            await trx
                .insertInto('AiTagStatus')
                .values({ postId: image.id, isAiTagged: 1 })
                .execute();
        });
}