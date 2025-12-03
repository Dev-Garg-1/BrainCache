import { Link } from "react-router-dom";
import { Brain } from "./icons/icons";

export default function Navbar() {
    return (
        <div>
            <div
            className="flex justify-between py-4 px-30 bg-[#d1faeb] border-b"
            >
                <div
                className="flex items-center gap-4 text-4xl font-bold"
                >
                    <Brain size="size-16"/> BrainCache
                </div>

                <div
                className="flex items-center"
                >
                    <Link to={'/login'}> 
                        <button
                        className="rounded-4xl py-4 px-10 mx-4 bg-teal-300 cursor-pointer" 
                        >
                                Login   
                        </button>
                    </Link>

                    <Link to={'/signup'}>
                        <button
                        className="rounded-4xl py-4 px-10 mx-4 bg-teal-300 cursor-pointer"
                        >
                                SignUp
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}