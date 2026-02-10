// parsers/index.js

import { parsePocketOption } from "./pocketoption.js";
import { parseBinance } from "./binance.js";
import { parseCoinbase } from "./coinbase.js";

/**
 * rawPayload:
 * {
 *   data: WS message
 *   timestamp: number
 *   url: string
 * }
 */
export function parseTick(rawPayload) {
return (
    parsePocketOption(rawPayload) ||
    parseBinance(rawPayload) ||
    parseCoinbase(rawPayload) ||
    null
);
}
