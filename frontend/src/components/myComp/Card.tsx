import { useAuth } from "@/context/AuthContext";
import {Delete, Share, Unshare, Update} from "../icons/icons"
import { deleteContentApi, shareContentApi, unshareContentApi } from "@/services/api/content";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

type CardProps = {
    id: string
    title: string;
    link: string;
    description?: string;
    isShare: boolean
}

export default function Card(props: CardProps) {
    const {user} = useAuth();

    const handleContentDelete = async (id: string) => {
        const userId = user?._id as string;

        try {
            const res = await deleteContentApi({_id: id, userId: userId})

            console.log("content delete successfull : ", res.data);

            setTimeout(() => {
                window.location.reload();
            }, 1000)

            toast.success("Content Deleted successfully !!")
        } catch (error: any) {
            console.error("content delete error : ", error)

            const msg = error.response?.data?.message || "Something went wrong while deleting the content !!"

            toast.error(msg);
        }
    }

    const handleContentUpdate = () => {

    }

    const handleContentUnShare = async (id: string) => {
        const userId = user?._id as string;

        try {
            const res = await unshareContentApi({_id: id, userId: userId})

            console.log("Content unshared successfully : ", res.data);

            toast.success("Content share id disposed off successfully !!")

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error: any) {
            console.error("content unshare error : ", error)

            const msg = error.response?.data?.message || "Something went wrong while unsharing the content !!"

            toast.error(msg);
        }
    }

    const handleContentShare = async (id: string) => {
        const userId = user?._id as string;

        try {
            const res = await shareContentApi({_id: id, userId: userId})

            console.log("Content shared successfully : ", res.data);

            toast.success(`Content share id generated successfully : ${res.data.data.shareId}`)
        } catch (error: any) {
            console.error("content share error : ", error)

            const msg = error.response?.data?.message || "Something went wrong while sharing the content !!"

            toast.error(msg);
        }
    }

    return (
        <div
        className="max-w-md border-2 rounded-2xl bg-teal-200 border-black p-2 m-2 wrap-break-word break-all break-inside-avoid mb-4"
        >
            <div
            className="flex justify-between gap-8 p-2 m-2"
            >
                <div
                className="font-bold text-2xl wrap-break-word"
                >
                    {props.title}
                </div>

                <div
                className="flex gap-4"
                >
                    {props.isShare 
                    ? <button
                        className="cursor-pointer transition ease-in-out hover:scale-110 hover:-translate-y-1"
                        onClick={() => handleContentUnShare(props.id)}
                        >
                            <Unshare />
                    </button>
                    : <button
                    className="cursor-pointer transition ease-in-out hover:scale-110 hover:-translate-y-1"
                    onClick={() => handleContentShare(props.id)}
                    >
                        <Share />
                    </button>
                    }
                    

                    <button
                    className="cursor-pointer transition ease-in-out hover:scale-110 hover:-translate-y-1"
                    onClick={handleContentUpdate}
                    >
                        <Update />
                    </button>

                    <button
                    className="cursor-pointer transition ease-in-out hover:scale-110 hover:-translate-y-1"
                    onClick={() => handleContentDelete(props.id)}
                    >
                        <Delete />
                    </button>
                </div>  
            </div>

            <div
            className="p-2 m-2 wrap-break-word text-lg text-blue-400"
            >
                <Link to={props.link}>
                    {props.link}
                </Link>
            </div>

            <div
            className="p-2 m-2 whitespace-pre-wrap wrap-break-word max-h-40 overflow-y-auto"
            >
                {props.description}
            </div>
        </div>
    )
}