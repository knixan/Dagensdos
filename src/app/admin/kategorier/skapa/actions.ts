"use server"

import { prisma } from "@/lib/prisma"
import { CategorySchema, CategoryValues } from "./schema";
import { requireAdmin } from "@/lib/server-auth";
/* 
import {auth} from "@/lib/auth"
import {headers} from "next/headers"
*/
export async function createCategory(values: CategoryValues) {
    await requireAdmin();
    /* const session = await auth.api.getSession({
    headers : await headers(),
    }) 
    if (!session) {
    redirect("/sign-in")
    }
    */
    const data = await CategorySchema.parseAsync(values)
    const category = await prisma.category.create({
        data: {
            name: data.name
        }

    })

    // Return the created category so the client can refresh or update local state
    return { id: category.id, name: category.name }
}
