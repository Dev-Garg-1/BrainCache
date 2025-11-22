import mongoose, {Schema, Types} from "mongoose"

interface IContent {
    _id: Types.ObjectId;
    title: string;
    link: string;
    description?: string;
    userId: Schema.Types.ObjectId
}

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
        }
    },
    {
        timestamps: true
    }
)

export const Content = mongoose.model<IContent>("Content", contentSchema);