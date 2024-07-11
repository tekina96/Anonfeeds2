import {z} from "zod"

export const signInSchema = ({
    identifier: z.string(),
    password: z.string()
})