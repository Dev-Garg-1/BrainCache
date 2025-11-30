import Delete from "../icons/Delete";
import Share from "../icons/Share";
import Update from "../icons/Update";

type CardProps = {
    title: string;
    link: string;
    description?: string;
}

export default function Card(props: CardProps) {

    const handleContentDelete = () => {

    }

    const handleContentUpdate = () => {

    }

    const handleContentShare = () => {

    }

    return (
        <div
        className="w-[25%] border-2 rounded-2xl bg-teal-200 border-black p-2 m-2"
        >
            <div
            className="flex justify-between p-2 m-2"
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
                    onClick={handleContentDelete}
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