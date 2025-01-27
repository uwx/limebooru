import { Kysely, SqliteDialect, sql } from 'kysely';
import SQLite from 'better-sqlite3';
import type { DB } from './types.js';

export const db = new Kysely<DB>({
    dialect: new SqliteDialect({
        database: new SQLite('./main.db'),
    }),
    log(event) {
        if (event.level === 'error') {
            console.error(
                {
                    error: event.error,
                    sql: event.query.sql,
                    params: event.query.parameters,
                },
                `Query failed in ${event.queryDurationMillis.toFixed(2)}ms`,
            );
        } else {
            // 'query'
            // console.trace({
            //     sql: event.query.sql,
            //     params: event.query.parameters,
            // }, `Query executed in ${event.queryDurationMillis.toFixed(2)}ms`);
        }
    },
});

await sql`PRAGMA journal_mode = WAL`.execute(db);
