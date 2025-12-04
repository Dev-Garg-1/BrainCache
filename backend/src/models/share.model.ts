import mongoose, {Schema} from "mongoose"
import type { IShare } from "../utils/interfaces.js";


const shareSchema = new Schema<IShare>(
    {
        contentId: {
            type: Schema.Types.ObjectId,
            ref: "Content"
        },

        shareId: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Share = mongoose.model<IShare>("Share", shareSchema);