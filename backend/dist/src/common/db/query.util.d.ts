export declare const PAGE_SIZE = 1000;
export declare const ID_CHUNK_SIZE = 100;
type QueryResult<T> = {
    data: T[] | null;
    error: any;
};
export declare function chunk<T>(items: readonly T[], size?: number): T[][];
export declare function fetchAll<T>(buildQuery: () => PromiseLike<QueryResult<T>> & {
    range(from: number, to: number): any;
}, options?: {
    pageSize?: number;
    maxRows?: number;
}): Promise<T[]>;
export declare function fetchAllIn<T>(ids: readonly string[], buildQuery: (idChunk: string[]) => PromiseLike<QueryResult<T>> & {
    range(from: number, to: number): any;
}, options?: {
    chunkSize?: number;
    pageSize?: number;
    maxRows?: number;
}): Promise<T[]>;
export declare function runInChunks(ids: readonly string[], run: (idChunk: string[]) => PromiseLike<{
    error: any;
}>, chunkSize?: number): Promise<void>;
export declare function insertInBatches<T>(rows: readonly T[], run: (batch: T[]) => PromiseLike<{
    error: any;
}>, batchSize?: number): Promise<number>;
export {};
