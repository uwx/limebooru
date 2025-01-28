import { getRealImagePath } from "$lib/server";
import { db } from "$lib/server/db";
import type { RequestHandler } from "@sveltejs/kit";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

// from https://github.com/p4ckysm4cky/booru/blob/main/server/post.ts
async function generateThumbnail(data: Buffer | string): Promise<Buffer> {
    const buffer = await sharp(data)
        .resize({
            // Maximum width.
            width: 384,
            // Maximum height.
            height: 384,
            // Do not exceed dimensions.
            fit: "inside",
            // Do not enlarge image.
            withoutEnlargement: true,
        })
        .webp({
            // Ensure image quality.
            quality: 80,
        })
        .toBuffer();

    return buffer;
}
export const GET: RequestHandler = async ({ params: { id: imageId } }) => {
    let result = await db
        .selectFrom('Thumbnail')
        .where('postId', '==', +imageId!)
        .select('thumbnail')
        .executeTakeFirst();

    if (!result) {
        const { location } = await db
            .selectFrom('Post')
            .where('id', '==', +imageId!)
            .select('location')
            .executeTakeFirstOrThrow();
        
        result = {
            // XXX: for some reason sharp keeps a lock on the file so we have to use readFile instead
            thumbnail: await generateThumbnail(await readFile(getRealImagePath(location))),
        };
    }

    return new Response(result.thumbnail, {
        headers: {
            'Content-Type': 'image/webp',
        }
    });
}