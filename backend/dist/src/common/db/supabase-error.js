"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwSupabaseError = throwSupabaseError;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('SupabaseError');
const CLIENT_ERROR_CODES = {
    '22P02': (d) => new common_1.BadRequestException(d),
    '23502': (d) => new common_1.BadRequestException(d),
    '23503': (d) => new common_1.BadRequestException(d),
    '23505': (d) => new common_1.ConflictException(d),
    '23514': (d) => new common_1.BadRequestException(d),
    '22001': (d) => new common_1.BadRequestException(d),
    '22003': (d) => new common_1.BadRequestException(d),
};
function humanise(error) {
    const message = String(error?.message ?? '');
    const enumMatch = message.match(/invalid input value for enum (\w+): "([^"]*)"/i);
    if (enumMatch) {
        return `"${enumMatch[2]}" is not a valid ${enumMatch[1].replace(/_/g, ' ')}.`;
    }
    if (String(error?.code) === '23505') {
        return 'That record already exists.';
    }
    if (String(error?.code) === '23503') {
        return 'That request references something that does not exist.';
    }
    if (String(error?.code) === '23502') {
        const column = message.match(/column "([^"]+)"/i)?.[1];
        return column ? `${column} is required.` : 'A required field is missing.';
    }
    return message || 'The request could not be processed.';
}
function throwSupabaseError(error, context) {
    const code = String(error?.code ?? '');
    const build = CLIENT_ERROR_CODES[code];
    if (build) {
        logger.warn(`${context}: [${code}] ${error?.message}`);
        throw build(humanise(error));
    }
    logger.error(`${context}: [${code || 'no code'}] ${error?.message}`);
    throw new common_1.InternalServerErrorException('Something went wrong on our end. Please try again.');
}
//# sourceMappingURL=supabase-error.js.map