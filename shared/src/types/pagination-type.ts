import { z } from "zod";

/**
 * CursorPayload the actual data inside a cursor.
 * Depending on the route, use different fields:
 *
 * Messages/Users by createdAt   { createdAt, id }
 * Chats by updatedAt            { updatedAt, id }
 * Users by username             { username, id }
 *
 * id is always required to break ties when timestamps collide.
 */
export interface CursorPayload {
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  id: string;
}

/**
 * encodeCursor, call this when building the nextCursor to send to the client.
 *
 * Usage:
 *   const lastItem = data[data.length - 1]
 *   const nextCursor = encodeCursor({ createdAt: lastItem.createdAt.toISOString(), id: lastItem.id })
 *
 * Output is a base64 string, opaque to the client, they just pass it back as-is.
 */
export function encodeCursor(payload: CursorPayload): string {
  return btoa(JSON.stringify(payload));
}

/**
 * decodeCursor, call this at the start of your repo method to extract the cursor fields.
 *
 * Usage:
 *   const { createdAt, id } = decodeCursor(cursor)
     // then use createdAt and id in your where clause
 */
export function decodeCursor(cursor: string): CursorPayload {
  return JSON.parse(atob(cursor));
}

export interface Pagination<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const paginationSchema = z
  .object({
    limit: z.coerce.number(),
    cursor: z.string().nullable(),
  })
  .transform(({ limit, cursor }) => {
    const pag = { limit, cursor };
    if (!cursor) return { ...pag, cursor: null };
    if (typeof cursor === "string" && cursor === "null") {
      return { ...pag, cursor: null };
    }
    return pag;
  });

export type ReqPagination = z.infer<typeof paginationSchema>;
