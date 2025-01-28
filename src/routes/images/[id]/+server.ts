import { getRealImagePath } from "$lib/server";
import { db } from "$lib/server/db";
import type { RequestHandler } from "@sveltejs/kit";
import { createReadableStream } from "@sveltejs/kit/node";
import mime from 'mime';
import { readFile } from "node:fs/promises";

export const GET: RequestHandler = async ({ params: { id: imageId }}) => {
    const { location } = await db
        .selectFrom('Post')
        .where('id', '==', +imageId!)
        .select('location')
        .executeTakeFirstOrThrow();
    
    return new Response(createReadableStream(getRealImagePath(location)), {
        headers: {
            'Content-Type': mime.getType(location) ?? 'image/jpeg',
        }
    });
}