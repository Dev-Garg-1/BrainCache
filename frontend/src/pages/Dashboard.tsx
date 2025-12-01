import {Plus, Share} from "@/components/icons/icons"
import Card from "@/components/myComp/Card";
import SideBar from "@/components/myComp/Sidebar";
import { getContentApi } from "@/services/api/content";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ContentModal from "./ContentModal";

type ContentData = {
    title: string;
    link: string;
    description?: string;
    _id: string;
}

export default function Dashboard() {
    const [contentData, setContentData] = useState<ContentData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchAllContent = async () => {
        try {
            const res = await getContentApi();

            console.log("fetched content success : ", res.data);

            setContentData(res.data.data)

            toast.success("All Content fetched successfully !!")
        } catch (error: any) {
            console.error("content fetching error : ", error);

            const msg = error.resopnse?.data?.message || "Something went wrong while fetching the contents, pls refresh the window !!"

            toast.error(msg)
        }
    }

    useEffect(() => {
        fetchAllContent();
    }, [])

    return (
        <div className="flex w-full min-h-screen h-auto">
            <SideBar />

            <div className="flex-1 p-4">

                <div className="flex justify-end gap-4">
                    <button 
                    className="flex items-center gap-2 p-4 m-4 bg-cyan-400 rounded-2xl shadow-lg cursor-pointer transition ease-in-out hover:bg-cyan-300 hover:-translate-1 hover:scale-110"
                    >
                        <Share /> Share Brain
                    </button>

                    <button 
                    className="flex items-center gap-2 p-4 m-4 bg-cyan-400 rounded-2xl shadow-lg cursor-pointer transition ease-in-out hover:bg-cyan-300 hover:-translate-1 hover:scale-110"
                    onClick={() => setIsModalOpen(true)}
                    >
                        <Plus /> Add Content
                    </button>
                </div>

                <div
                className="p-4 m-4 -mt-12"
                >
                    <h1 className="text-5xl font-bold">All Notes</h1>
                </div>

                <div className="p-2 m-2 grid grid-cols-3">
                    {contentData.map(item => (
                        <Card
                            key={item._id}
                            title={item.title}
                            link={item.link}
                            description={item.description}
                            id={item._id}
                        />
                    ))}
                </div>
            </div>

            <ContentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

        </div>
    );
}
