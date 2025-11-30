import AuthCard from "@/components/neo/AuthCard";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupApi } from "@/services/api/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!username || !name || !email || !password) {
            toast.error("All fields are required !!")
            return;
        }

        setLoading(true);

        try {
            const res = await signupApi(
                {
                    username: username.trim(), 
                    name: name.trim(), 
                    email: email.trim(), 
                    password: password.trim()
                }
            );

            console.log("Signup successfull: ", res.data);

            toast.success("Signed up successfully !!")

            navigate("/login");
        } catch (error: any) {
            console.error("Signup error: ", error);

            const message = error.response?.data?.message || "Failed to Signup, Please try again."

            toast.error(message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 flex justify-center items-center">
            <AuthCard
            title={"SignUp to create an account."}
            description={"Enter the following details."}
            buttonText={"SignUp"}
            onSubmit={handleSignup}
            loading={loading}
            >
                <div className="flex flex-col gap-6">

                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="m@example.com"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input 
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                </div>
          </AuthCard>
        </div>
    )
}