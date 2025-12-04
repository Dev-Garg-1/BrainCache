import { Content } from "../models/content.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AddResourceBody, DeleteResourceBody, UpdateResourceBody } from "../utils/interfaces.js";
import {v4 as uuidv4} from "uuid"

const addContent = asyncHandler(async (req, res) => {
    const {title, link, description}: AddResourceBody = req.body;

    if(
        [title, link].some(field => !field.trim())
    ) {
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "Title and link, both are needed !!"
            }
        )
    }

    const addedContent = await Content.create({
        userId: req.user._id,
        title: title,
        link: link,
        description: description
    })

    if(!addedContent) {
        return res
        .status(500)
        .json(
            {
                success: false,
                message: "Something went wrong while adding the content !!"
            }
        )
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            addedContent,
            "Conetnt added successfully !!"
        )
    )
})

const deleteContent = asyncHandler(async (req, res) => {
    const user = req.user;
    const {_id, userId}: DeleteResourceBody = req.body;

    if(!(_id) || !userId) {
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "Pls provide the id and the userId of the content to be deleted !!"
            }
        )
    }

    if(user._id.toString() !== userId) {
        return res
        .status(403)
        .json(
            {
                success: false,
                message: "The logged in user id didn't match with the content userId, so you cannot delete this content !!"
            }
        )
    }

    const deletedContent = await Content.findByIdAndDelete({
        _id
    })

    console.log(deletedContent);

    if(!deletedContent) {
        return res
        .status(500)
        .json(
            {
                success: false,
                message: "Something went wrong while deleting the content !!"
            }
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            deletedContent,
            "content was deleted successfully !!"
        )
    )
})

const updateContent = asyncHandler(async (req, res) => {
    const user = req.user;
    const {_id, title, link, description, userId}: UpdateResourceBody = req.body;

    if(!(_id) || !userId) {
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "Pls provide the id and the userId of the content that is to be udpated !!"
            }
        )
    }

    if(user._id.toString() !== userId) {
        return res
        .status(403)
        .json(
            {
                success: false,
                message: "The logged in user id didn't match with the content userId, so you cannot update this content !!"
            }
        )
    }

    const updatedContent = await Content.findByIdAndUpdate(
        _id,

        {
            title: title,
            link: link,
            description: description
        }, 

        {
            new: true
        }
    )

    if(!updatedContent) {
        return res
        .status(500)
        .json(
            {
                success: false,
                message: "Something went wrong while updating the content !!"
            }
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedContent,
            "Content updated successfully !!"
        )
    )
})

const getContent = asyncHandler(async (req, res) => {
    const user = req.user;

    const allContent = await Content.find({
        userId: user._id
    })

    console.log(allContent)

    if(!allContent) {
        return res
        .status(500)
        .json(
            {
                success: false,
                message: "Something went wrong while fetching all the content !!"
            }
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allContent,
            "all content fetched successfully !!"
        )
    )

})

const shareContent = asyncHandler(async (req, res) => {
    const user = req.user;
    const {_id, userId} = req.body;

    if(!(_id) || !(userId)) {
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "Pls provide the id & userId of the content to share !!"
            }
        )
    }

    if(userId !== user._id.toString()) {
        return res
        .status(403)
        .json(
            {
                success: false,
                message: "The logged in user id didn't match with the content userId, so you cannot share this content !!"
            }
        )
    }

    const slug = uuidv4();
    const shareId = `http://localhost:5173/share/content/${slug}`

    try {
        const shareIdCreated = await Content.findByIdAndUpdate(
            _id, 

            {
                isShare: true,
                shareId: shareId
            }, 

            {
                new: true
            }
        )

        if(!shareIdCreated) {
            return res
            .status(500)
            .json(
                {
                    success: false,
                    message: "Something went wrong while generating the share Link !!"
                }
            )
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                shareIdCreated,
                "ShareId link generated successfully !!"
            )
        )
    } catch (error) {
        console.error("shareId link creation error: ", error)

        return res
        .status(500)
        .json(
            {
                success: false,
                message: error
            }
        )
    }
})

const unShareContent = asyncHandler(async (req, res) => {
    const user = req.user;
    const {_id, userId} = req.body;

    if(!(_id) || !(userId)) {
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "Pls provide the id & userId of the content to unshare !!"
            }
        )
    }

    if(user._id.toString() !== userId) {
        return res
        .status(403)
        .json(
            {
                success: false,
                message: "The logged in user id didn't match with the content userId, so you cannot unshare this content !!"
            }
        )
    }

    try {
        const unShareContent = await Content.findByIdAndUpdate(
            _id, 
            
            {
                isShare: false,
                shareId: null
            },

            {
                new: true
            }
        )

        if(!unShareContent) {
            return res
            .status(500)
            .json(
                {
                    success: false,
                    message: "Something went wrong while marking this content as unshare !!"
                }
            )
        }

        return res
        .status(200)
        .json(
            {
                success: true,
                message: "ShareId disposed off successfully !!"
            }
        )
    } catch (error) {
        console.error("Content unshare error: ", error);

        return res
        .status(500)
        .json(
            {
                success: false,
                message: error
            }
        )
    }
})

export {
    addContent,
    deleteContent,
    updateContent,
    getContent,
    shareContent,
    unShareContent
}