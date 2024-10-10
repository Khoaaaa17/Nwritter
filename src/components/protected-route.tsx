import { Navigate } from "react-router-dom"
import { auth } from "../firebase"
import Home from "../routes/home";

export default function ProtectedRoute({children}: {children:React.ReactNode}){
    const user = auth.currentUser;
    if(!user){
        return <Navigate to={"/login"}></Navigate>
    }
    console.log(user.displayName,user.email);
    return children;
}