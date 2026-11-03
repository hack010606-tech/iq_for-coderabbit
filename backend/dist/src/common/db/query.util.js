"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID_CHUNK_SIZE = exports.PAGE_SIZE = void 0;
exports.chunk = chunk;
exports.fetchAll = fetchAll;
exports.fetchAllIn = fetchAllIn;
exports.runInChunks = runInChunks;
exports.insertInBatches = insertInBatches;
exports.PAGE_SIZE = 1000;
exports.ID_CHUNK_SIZE = 100;
const DEFAULT_MAX_ROWS = 200_000;
function chunk(items, size = exports.ID_CHUNK_SIZE) {
    if (size <= 0)
        throw new Error('chunk size must be positive');
    const out = [];
    for (let i = 0; i < items.length; i += size)
        out.push(items.slice(i, i + size));
    return out;
}
async function fetchAll(buildQuery, options = {}) {
    const pageSize = options.pageSize ?? exports.PAGE_SIZE;
    const maxRows = options.maxRows ?? DEFAULT_MAX_ROWS;
    const rows = [];
    for (let from = 0; from < maxRows; from += pageSize) {
        const { data, error } = await buildQuery().range(from, from + pageSize - 1);
        if (error)
            throw new Error(error.message ?? String(error));
        const page = data ?? [];
        rows.push(...page);
        if (page.length < pageSize)
            break;
    }
    return rows;
}
async function fetchAllIn(ids, buildQuery, options = {}) {
    if (!ids.length)
        return [];
    const rows = [];
    for (const idChunk of chunk(dedupe(ids), options.chunkSize)) {
        rows.push(...(await fetchAll(() => buildQuery(idChunk), options)));
    }
    return rows;
}
async function runInChunks(ids, run, chunkSize = exports.ID_CHUNK_SIZE) {
    for (const idChunk of chunk(dedupe(ids), chunkSize)) {
        const { error } = await run(idChunk);
        if (error)
            throw new Error(error.message ?? String(error));
    }
}
async function insertInBatches(rows, run, batchSize = 500) {
    let written = 0;
    for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const { error } = await run(batch);
        if (error)
            throw new Error(error.message ?? String(error));
        written += batch.length;
    }
    return written;
}
function dedupe(ids) {
    return [...new Set(ids)];
}
//# sourceMappingURL=query.util.js.map