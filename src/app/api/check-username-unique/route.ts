import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

// Checking username by extracting query, debouncing technique ?
export async function GET(request:Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        // With safe parse we check if parsing is safe & schema gets followed and username valid then we get value else not
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log(result)
        if(!result.success) {
            // all the errors are pushed in result.error.format(), we can extract username errors from it, this is an advantage of using zod
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, {status: 400})
        }

        const {username} = result.data
        // console.log(username);
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});

        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken.'
            }, {status: 400})
        }
        return Response.json({
            success: true,
            message: 'Username is available'
        }, {status: 200})

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            { status: 500}
        )
    }
}