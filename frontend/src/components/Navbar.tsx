import { Brain } from "./icons/icons";

export default function Navbar() {
    return (
        <div>
            <div
            className="flex justify-between p-4 bg-[#d1faeb]"
            >
                <div
                className="flex items-center gap-4 text-4xl font-bold"
                >
                    <Brain size="size-16"/> Second Brain
                </div>

                <div
                className="flex items-center"
                >
                    <button
                    className="rounded-2xl py-4 px-8 mx-4 bg-teal-300"
                    >
                        Login
                    </button>

                    <button
                    className="rounded-2xl py-4 px-8 mx-4 bg-teal-300"
                    >
                        SignUp
                    </button>
                </div>
            </div>
        </div>
    )
}