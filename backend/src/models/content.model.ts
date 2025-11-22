import mongoose, {Schema} from "mongoose"

const contentSchema = new Schema(
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

export const Content = mongoose.model("Content", contentSchema);