import { z } from "zod";

export const CategorySchema = z.object({
    name: z.string().min(1).max(50)
})

export type CategoryValues = z.infer<typeof CategorySchema>
