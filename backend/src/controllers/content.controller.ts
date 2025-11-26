import { Content } from "../models/content.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AddResourceBody, DeleteResourceBody, UpdateResourceBody } from "../utils/interfaces.js";

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

    if(user._id != userId) {
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

    if(user._id != userId) {
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

export {
    addContent,
    deleteContent,
    updateContent,
    getContent
}