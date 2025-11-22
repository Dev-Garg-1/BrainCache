import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { 
    ACCESS_TOKEN_EXPIRY, 
    ACCESS_TOKEN_SECRET, 
    REFRESH_TOKEN_EXPIRY, 
    REFRESH_TOKEN_SECRET 
} from "../config/config.js";

interface IUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    name: string;
    password: string;
    refreshToken: string;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
    isPasswordCorrect: (password: string) => Promise<boolean>
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },

        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
        },

        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

// pre-hook for hasing the pwd whenever it is modified before saving it to the DB.
userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

// function(method) for checking whether the pwd entered by the user is correct or not.
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

// function(method) for generating the access token.
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },

        ACCESS_TOKEN_SECRET,

        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

// function(method) for generating the refresh token.
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },

        REFRESH_TOKEN_SECRET,

        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model<IUser>("User", userSchema);