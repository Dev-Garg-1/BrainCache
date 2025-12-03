import { addContentApi } from "@/services/api/content";
import { useState } from "react"
import toast from "react-hot-toast";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void
}

export default function AddContentModal(props: ModalProps) {
    const [title, setTitle] = useState("")
    const [link, setLink] = useState("")
    const [description, setDescription] = useState("")
    const urlRegex = /^(https?:\/\/)([\w.-]+)\.([a-zA-Z]{2,})(\/\S*)?$/

    const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target;
        requestAnimationFrame(() => {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        })
    }

    const handleContentAdd = async () => {
        if(!title || !link) {
            toast.error("Both title and link fields are needed !!")
            return;
        }

        if(!urlRegex.test(link)) {
            toast.error("Enter a valid https link !!")
            return;
        }

        try {
            const res = await addContentApi({title, link, description});

            console.log("data added successfully : ", res.data);

            toast.success("Content Added successfully !!")

            window.location.reload();
        } catch (error: any) {
            console.log("content adding error: ", error);

            const msg = error.response?.data.message || "Something went wrong while adding the content !!"

            toast.error(msg);
        }
    }

    if(!props.isOpen) return null; 

    return (
        <div
        className="flex justify-center items-center"
        >
            <div
            className="border-l-2 bg-amber-200 w-fit h-full"
            >
                <div
                className="flex flex-col items-center"
                >
                    <span
                    className="text-4xl font-bold p-4 m-4"
                    >
                        Add Content
                    </span>

                    <input 
                    type="text" 
                    id="title"
                    className="p-4 m-4 border-2 rounded-2xl min-w-sm bg-white"
                    value={title}
                    placeholder="Add Title..."
                    onChange={(e) => setTitle(e.target.value)}
                    />

                    <input 
                    type="text"
                    id="link"
                    className="p-4 m-4 border-2 rounded-2xl min-w-sm bg-white"
                    value={link}
                    placeholder="Add Link..."
                    onChange={(e) => setLink(e.target.value)}
                    />

                    <textarea
                    id="description"
                    className="p-4 m-4 border-2 rounded-2xl min-w-sm resize-none overflow-auto max-h-80 bg-white"
                    value={description}
                    placeholder="Add Description..."
                    onChange={(e) => {
                        setDescription(e.target.value)
                        autoGrow(e)
                    }}
                    />
                </div>

                <div
                className="flex justify-between mx-6"
                >
                    <button
                    className="p-4 m-4 border-2 rounded-2xl cursor-pointer bg-green-400 shadow-xl hover:-translate-y-1"
                    onClick={handleContentAdd}
                    >
                        Add Content
                    </button>

                    <button
                    className="p-4 m-4 border-2 rounded-2xl cursor-pointer bg-red-400 shadow-xl hover:-translate-y-1"
                    onClick={props.onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
