import Plus from "@/components/icons/Plus";
import Share from "@/components/icons/Share";
import Card from "@/components/myComp/Card";
import SideBar from "@/components/myComp/Sidebar";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen">
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
                    >
                        <Plus /> Add Content
                    </button>
                </div>

                <div
                className="p-4 m-4 -mt-12"
                >
                    <h1 className="text-5xl font-bold">All Notes</h1>
                </div>

                <div
                className="p-2 m-2"
                >
                    <Card title={"First Note"} link={"https://x.com/"} description={"Hello this is a test description to check what happens if a long description comes in"}/>
                </div>

            </div>
        </div>
    );
}
