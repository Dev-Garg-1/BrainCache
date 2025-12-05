import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import type { Types } from "mongoose";

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
        const user = await User.findById(userId);

        // i have put "!" against user because i know that the user won't be null here as i am calling this function only after checking that whether the user exists or not in the login controller.

        const accessToken= user!.generateAccessToken();
        const refreshToken = user!.generateRefreshToken();

        user!.refreshToken = refreshToken;

        await user!.save({validateBeforeSave: false});

        return {
            accessToken,
            refreshToken
        }
}

// post request for signing up the user
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password, name} = req.body;

    if(
        [username, email, password, name].some((field) => !field?.trim())
    ) {
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "All the fields are required !!"
            }
        )
    }

    const existingUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if(existingUser) {
        return res
        .status(409)
        .json(
            {
                success: false,
                message: "User with email or username already exists in the database !!"
            }
        )
    }

    try {
        const user = await User.create({
            username,
            email,
            password,
            name
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser) {
            return res
            .status(500)
            .json(
                {
                    success: false,
                    message: "Something went wrong while creating the User !!"
                }
            )
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdUser,
                "User registered successfully !!"
            )
        )

    } catch (error) {
        console.log("User registration error : ", error);

        return res
        .status(500)
        .json(
            {
                success: false,
                message: (error instanceof Error) ? error.message : error
            }
        )
    }
    
})

// post request for signing in the user
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(
        [email, password].some((field) => !field?.trim())
    ) {
        return res
        .status(400) 
        .json(
            {
                success: false,
                message: "Both Email and password are required !!"
            }
        )
    }

    const existingUser = await User.findOne({
        email: email
    })

    if(!existingUser) {
        return res
        .status(401)
        .json(
            {
                success: false,
                message: "First singup then login !!"
            }
        )
    }

    const validPassword = existingUser.isPasswordCorrect(password);

    if(!validPassword) {
        return res
        .status(401)
        .json(
            {
                success: false,
                message: "Pls enter correct password !!"
            }
        )
    }

    try {
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(existingUser._id);
    
        const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken -createdAt -updatedAt -__v")
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as "none" // for prod
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully !!"
            )
        )
    } catch (error) {
        console.log("Something went wrong while signing you in !!", error)

        return res
        .status(500)
        .json(
            {
                success: false,
                message: (error instanceof Error) ? error.message : "Something went wrong while signing you in !!"
            }
        )
    }
})

// post request for logging out the user
const logoutUser = asyncHandler(async (req, res) => {

    console.log(req.user._id)

    await User.findOneAndUpdate(
        {
            _id: req.user._id
        },
        {
            $unset: {
                refreshToken: ""
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as "none" // fo prod
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully !!"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
}