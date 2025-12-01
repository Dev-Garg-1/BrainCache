
import { useAuth } from "@/context/AuthContext";
import {Brain, Document, Hashtag, Link, Twitter, Youtube} from "../icons/icons"
import { LogOutIcon } from "lucide-react";
import { logoutApi } from "@/services/api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SideBar() {
    const {user, setUser} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true)

        try {
            const res = await logoutApi();

            console.log("Logout successfull : ", res.data)

            setUser(null);
            localStorage.removeItem('user')

            toast.success("Logged out successfully !!")
            navigate("/login");
        } catch (error: any) {
            console.error("logout error: ", error);

            const message = error.response?.data?.message || "Something went wrong while logging you out !!"

            toast.error(message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="border-r-2 border-black w-fit p-2 flex flex-col bg-teal-200 h-full">
                <div
                className="text-4xl font-bold flex items-center justify-center gap-4 m-2 p-2 mr-14"
                >
                    <Brain size="size-10"/> Second Brain
                </div>

                <button
                className="flex gap-4 items-center p-4 m-4 pl-10 text-2xl cursor-pointer w-[75%] ransition duration-300 hover:bg-teal-100 hover:scale-110 rounded-2xl"
                >
                    <Twitter /> Tweets
                </button>

                <button
                className="flex gap-4 items-center p-4 m-4 pl-10 text-2xl cursor-pointer w-[75%] ransition duration-300 hover:bg-teal-100 hover:scale-110 rounded-2xl"
                >
                    <Youtube /> Videos
                </button>

                <button
                className="flex gap-4 items-center p-4 m-4 pl-10 text-2xl cursor-pointer w-[75%] ransition duration-300 hover:bg-teal-100 hover:scale-110 rounded-2xl"
                >
                    <Document /> Documents
                </button>

                <button
                className="flex gap-4 items-center p-4 m-4 pl-10 text-2xl cursor-pointer w-[75%] ransition duration-300 hover:bg-teal-100 hover:scale-110 rounded-2xl"
                >
                    <Link /> Links
                </button>

                <button
                className="flex gap-4 items-center p-4 m-4 pl-10 text-2xl cursor-pointer w-[75%] ransition duration-300 hover:bg-teal-100 hover:scale-110 rounded-2xl"
                >
                    <Hashtag /> Tags
                </button>

                <div className="border-2 border-black p-4 m-4 mt-auto flex justify-between bg-teal-100">
                    <div>
                        <div className="font-bold">
                            Username: {user?.username}
                        </div>
                        <div className="font-bold">
                            Email: {user?.email}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button 
                        className="cursor-pointer transition dealy-150 duration-100 ease-in-out hover:scale-130"
                        onClick={handleLogout}
                        disabled={loading}
                        >
                            <LogOutIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}