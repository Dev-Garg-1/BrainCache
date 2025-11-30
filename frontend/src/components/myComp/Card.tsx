import { useAuth } from "@/context/AuthContext";
import {Delete, Share, Update} from "../icons/icons"
import { deleteContentApi } from "@/services/api/content";
import toast from "react-hot-toast";

type CardProps = {
    id: string
    title: string;
    link: string;
    description?: string;
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

    const handleContentShare = () => {

    }

    return (
        <div
        className="w-fit border-2 rounded-2xl bg-teal-200 border-black p-2 m-2"
        >
            <div
            className="flex justify-between gap-8 p-2 m-2"
            >
                <div
                className="font-bold text-2xl"
                >
                    {props.title}
                </div>

                <div
                className="flex gap-4"
                >
                    <button
                    className="cursor-pointer transition ease-in-out hover:scale-110 hover:-translate-y-1"
                    onClick={handleContentShare}
                    >
                        <Share />
                    </button>

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
            className="p-2 m-2"
            >
                {props.link}
            </div>

            <div
            className="p-2 m-2"
            >
                {props.description}
            </div>
        </div>
    )
}