import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}: {children: React.ReactNode}) => {
    const {user} = useAuth();

    if(!user) {
        return <Navigate to="/login" />
    }

    return children;
}

export default PrivateRoute;