import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401}
        )
    }

    // const userId = user._id;
    // We have saved user as strings, so now when we want to use it in aggregation pipeline to fetch data it gives some errors
    // So we need to convert it from string to mongoose object id
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        // aggregation pipeline code
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
        // we get return type array from aggregation

        if(!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 401}
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            { status: 200}
        )
    } catch (error) {
        console.error("Unexpected Error occurred while getting messages ", error)
        return Response.json(
            {
                success: false,
                message: "Unexpected Error occurred"
            },
            { status: 500}
        )
    }
}