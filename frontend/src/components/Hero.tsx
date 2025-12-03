import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Hero() {
    return (
        <div>
            <div
            className="flex justify-center items-center mt-20"
            >
                <div
                className="w-[25%] p-4 m-4 mx-60"
                >
                    <div
                    className="font-bold text-7xl p-4 m-4"
                    >
                        Your brain deserves this.
                    </div>

                    <div
                    className="p-4 m-4 text-xl"
                    >
                        BrainCache is your personal knowledge base to capture, connect, and recall your best ideas. Stop losing brilliant thoughts and start building your second brain today.
                    </div>

                    <Link to={'/signup'}>
                        <Button
                        className="bg-cyan-400 p-4 m-4 cursor-pointer"
                        >
                            Sign Up to continue
                        </Button>
                    </Link>
                </div>

                <div
                className="p-4 m-4 mx-80"
                >
                    <img src={'/vite.svg'} className="size-60" alt="something" />
                </div>
            </div>
        </div>
    )
}