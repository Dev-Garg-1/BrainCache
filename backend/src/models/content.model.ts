import mongoose, {Schema} from "mongoose"
import type { IContent } from "../utils/interfaces.js";


const contentSchema = new Schema<IContent>(
    {
        title: {
            type: String,
            required: true
        },

        link: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        isShare: {
            type: Boolean,
            default: false
        },

        shareId: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Content = mongoose.model<IContent>("Content", contentSchema);