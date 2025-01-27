import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Config = {
    key: string;
    value: string | null;
};
export type Post = {
    id: Generated<number>;
    location: string;
    md5: string;
    sha1: string | null;
    sha256: string | null;
    /**
     * @kyselyType('g' | 's' | 'q' | 'e')
     */
    rating: Generated<'g' | 's' | 'q' | 'e'>;
    sourceUrl: string | null;
    pixivId: number | null;
    fileSize: Generated<number>;
};
export type PostTag = {
    postId: number;
    tagId: number;
};
export type Tag = {
    id: Generated<number>;
    name: string;
    description: string | null;
    category: Generated<string>;
    createdAt: Generated<string>;
    updatedAt: Generated<string>;
};
export type DB = {
    Config: Config;
    Post: Post;
    PostTag: PostTag;
    Tag: Tag;
};
