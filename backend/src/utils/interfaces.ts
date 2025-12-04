import { Schema, Types } from "mongoose";

export interface IContent {
    _id: Types.ObjectId;
    title: string;
    link: string;
    description?: string;
    userId: Schema.Types.ObjectId;
    isShare: boolean;
    shareId: string;
}

export interface IUser {
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

export interface IShare {
    _id: Types.ObjectId;
    shareId: string;
    contentId: Schema.Types.ObjectId;
}

export interface AddResourceBody {
    title: string;
    link: string;
    description?: string;
}

export interface UpdateResourceBody {
    _id: Types.ObjectId;
    title?: string;
    link?: string;
    description?: string;
    userId: Schema.Types.ObjectId;
}

export interface DeleteResourceBody {
    _id: Types.ObjectId;
    userId: Schema.Types.ObjectId;
}