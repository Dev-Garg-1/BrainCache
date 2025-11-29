import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


type AuthCardProps = {
  title: string
  description: string
  buttonText: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode,
  loading: boolean
}

export default function AuthCard({
  title,
  description,
  buttonText,
  onSubmit,
  children,
  loading
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-sm">

      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit}>
          {children}

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Please wait" : buttonText}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {
        buttonText === "Login" ? 
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
        : 
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Login
          </a>
        </div>
        }
      </CardFooter>
    </Card>
  )
}
