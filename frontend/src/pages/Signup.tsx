import AuthCard from "@/components/neo/authCard";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Signup() {

    const handleSignup = () => {

    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <AuthCard
            title={"SignUp to create an account."}
            description={"Enter the following details."}
            buttonText={"SignUp"}
            onSubmit={handleSignup}
            >
                <div className="flex flex-col gap-6">

                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="username"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="name"
                            required
                        />
                    </div>

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