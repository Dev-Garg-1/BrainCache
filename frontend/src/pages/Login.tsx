import AuthCard from "@/components/neo/AuthCard";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginApi } from "@/services/api/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!email || !password) {
            toast.error("Both the fields are required !!")
            return;
        }

        setLoading(true)

        try {
            const res = await loginApi(
                {
                    email: email.trim(), 
                    password: password.trim()
                }
            );

            console.log("Login successfull: ", res.data);

            toast.success("Logged in successfully !");
            navigate("/dashboard")
        } catch (error: any) {
            console.log("Login error: ", error);

            const message = error.response?.data?.message || "Failed to login, Please try again !!"

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <AuthCard
            title={"Login into your account."}
            description={"Enter Email & Password to login."}
            buttonText={"Login"}
            onSubmit={handleLogin}
            loading={loading}
            >
                <div className="flex flex-col gap-6">
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