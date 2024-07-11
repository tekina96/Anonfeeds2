import {z} from 'zod'

// Checking username validation
export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username should contain at max 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

// Here we using object because here are multiple fields (username, email, password etc.) to check validation, where as previously we checked only for username (single field)
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: "Password must be at least 6 caracters"})
})