import { z } from "zod";

export const inputSchema = z.object({ left: z.number(), right: z.number() });

export function add({ left, right }: z.infer<typeof inputSchema>): number {
  return left + right;
}
