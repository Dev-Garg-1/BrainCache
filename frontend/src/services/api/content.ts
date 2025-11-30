import { http } from "../http";

export interface AddContentData {
    title: string;
    link: string;
    description?: string
}

export interface UpdateContentData {
    id: string;
    title?: string;
    link?: string;
    description?: string
    userId: string
}

export interface DeleteContentData {
    _id: string;
    userId: string
}

export const addContentApi = (data: AddContentData) => http.post("/content/add", data)

export const updateContentApi = (data: UpdateContentData) => http.post("/content/update", data)

export const deleteContentApi = (data: DeleteContentData) => http.post("/content/delete", data)

export const getContentApi = () => http.get("/content/get")