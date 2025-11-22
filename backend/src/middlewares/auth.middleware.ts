import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ACCESS_TOKEN_SECRET } from "../config/config.js"

interface JWTPayload {
    _id: string;
    email: string;
    username: string;
}

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            return res
            .status(401)
            .json(
                {
                    success: false,
                    message: "Unauthorized request !!"
                }
            )
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user) {
            return res
            .status(401)
            .json(
                {
                    success: false,
                    message: "Invalid access token !!"
                }
            )
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Something went wrong while verifying the JWT : ", error);

        return res
        .status(401)
        .json(
            {
                success: false,
                message: (error instanceof Error) ? error.message : "Something went wrong while verifying the JWT !!"
            }
        )
    }
})