export const ROLES = ["admin", "editor", "subscriber", "user"] as const;
export type Role = (typeof ROLES)[number];
