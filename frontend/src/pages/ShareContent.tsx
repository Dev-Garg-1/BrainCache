import { getSharedContentApi } from "@/services/api/content";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom"

interface ContentData {
    _id: string;
    title: string;
    description: string;
    link: string
}

export default function ShareContent() {
    const [content, setContent] = useState<ContentData | null>(null)
    const [noShareId, setNoShareId] = useState(false)
    const params = useParams();

    const shareId = `http://localhost:5173/share/content/${params.shareId}`

    const getSharedContent = async () => {
        if(!params.shareId) {
            return;
        }

        try {
            const res = await getSharedContentApi({shareId: shareId})

            console.log("shared content fetch success: ", res.data);
            setContent(res.data.data)

            toast.success("Shared content fetched successfully !!");
        } catch (error: any) {
            console.error("shared content fetch error : ", error)

            const msg = error.response?.data?.message
            setNoShareId(true)

            toast.error(msg || "Something went wrong while fetching the shared content !!")
        }
    }

    useEffect(() => {
        getSharedContent();
    }, [params.shareId])

    if(!content && !noShareId) return <div>loading</div>

    if(noShareId) return <div className="min-h-screen flex justify-center items-center text-2xl">Such Share id does not exist.</div>

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="rounded-4xl border p-4 m-4">
                <div className="font-bold text-2xl p-2 m-2">
                    {content!.title}
                </div>

                <div className="p-2 m-2 text-blue-600">
                    {content!.link}
                </div>

                <div className="p-2 m-2">
                    {content!.description}
                </div>
            </div>
        </div>
    )
}