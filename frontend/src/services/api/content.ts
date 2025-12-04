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

export interface ContentData {
    _id: string;
    userId: string
}

export interface GetSharedContentData {
    shareId: string
}

export const addContentApi = (data: AddContentData) => http.post("/content/add", data)

export const updateContentApi = (data: UpdateContentData) => http.post("/content/update", data)

export const deleteContentApi = (data: ContentData) => http.post("/content/delete", data)

export const getContentApi = () => http.get("/content/get")

export const shareContentApi = (data: ContentData) => http.post("/content/share", data)

export const unshareContentApi = (data: ContentData) => http.post("/content/unshare", data)

export const getSharedContentApi = (data: GetSharedContentData) => http.post("/content/getSharedContent", data)