import AuthCard from "@/components/neo/authCard";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {

    const handleLogin = () => {

    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <AuthCard
            title={"Login into your account."}
            description={"Enter Email & Password to login."}
            buttonText={"Login"}
            onSubmit={handleLogin}
            >
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
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
                            required 
                        />
                    </div>
                </div>
          </AuthCard>
        </div>
    )
}