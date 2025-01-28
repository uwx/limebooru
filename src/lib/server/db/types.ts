import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type AiTagStatus = {
    postId: number;
    /**
     * @kyselyType(0 | 1)
     */
    isAiTagged: Generated<0 | 1>;
};
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
    ratingAiConfidence: number | null;
    sourceUrl: string | null;
    pixivId: number | null;
    fileSize: Generated<number>;
};
export type PostTag = {
    postId: number;
    tagId: number;
    aiConfidence: number | null;
};
export type Tag = {
    id: Generated<number>;
    name: string;
    description: string | null;
    /**
     * @kyselyType('artist' | 'character' | 'copyright' | 'general' | 'meta')
     */
    category: Generated<'artist' | 'character' | 'copyright' | 'general' | 'meta'>;
    createdAt: Generated<string>;
    updatedAt: Generated<string>;
    /**
     * @kyselyType('user' | 'bot' | 'ai')
     */
    tagger: Generated<'user' | 'bot' | 'ai'>;
};
export type Thumbnail = {
    postId: number;
    thumbnail: Buffer;
};
export type DB = {
    AiTagStatus: AiTagStatus;
    Config: Config;
    Post: Post;
    PostTag: PostTag;
    Tag: Tag;
    Thumbnail: Thumbnail;
};
