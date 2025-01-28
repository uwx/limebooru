import { relative, resolve } from 'node:path';
import chokidar from 'chokidar';
import { db } from './db';
import { createHash, type BinaryLike } from 'node:crypto';
import { createReadStream } from 'node:fs';
import type { InsertObject } from 'kysely';
import type { DB, Post } from './db/types';
import { aiTagImage } from './ai-tagger';

// This file is called on server init.
function normalizeImageLocation(location: string) {
    return relative('./images', location).replace(/\\/g, '/');
}

async function hashFile(location: string) {
    const sha256 = createHash('sha256');
    const sha1 = createHash('sha1');
    const md5 = createHash('md5');

    const input = createReadStream(location);

    return new Promise<{ sha256: string; sha1: string; md5: string }>((resolve, reject) => {
        input.on('error', reject);

        input.on('readable', () => {
            let chunk: BinaryLike;
            while ((chunk = input.read()) !== null) {
                sha256.update(chunk);
                sha1.update(chunk);
                md5.update(chunk);
            }
        });

        input.on('end', () => {
            resolve({
                sha256: sha256.digest('hex'),
                sha1: sha1.digest('hex'),
                md5: md5.digest('hex'),
            });
        });
    });
}

chokidar
    .watch('./images', {
    })
    .on('add', async (path) => {
        console.log('File', path, 'has been added');

        const location = normalizeImageLocation(path);

        let postEntry = await db
            .selectFrom('Post')
            .select('id')
            .where('location', '==', location)
            .executeTakeFirst();

        if (!postEntry) {
            const value: InsertObject<DB, 'Post'> = {
                location,
                ...await hashFile(path),
            };

            const insertId = await db.insertInto('Post')
                .values(value)
                .onConflict(oc => oc
                    .column('id')
                    .doUpdateSet(value))
                .executeTakeFirst()
                .then(e => e.insertId);
            
            postEntry = { id: Number(insertId) };
        }

        await aiTagImage({ ...postEntry, location });
    })
    // .on('change', (path) => {
    //     console.log('File', path, 'has been changed');
    // })
    .on('unlink', async (path) => {
        console.log('File', path, 'has been removed');
        await db
            .deleteFrom('Post')
            .where('location', '==', normalizeImageLocation(path))
            .execute();
    })
    .on('error', (error) => {
        console.error('Error happened', error);
    });

console.log(`Watching for new images in ${resolve('./images')}`);