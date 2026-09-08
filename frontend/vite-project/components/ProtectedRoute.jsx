import React from "react";
import { useAuth } from "../context/AuthContext";
import {useNavigate} from 'react-router-dom'


function ProtectedRoute({children}){
    const [user, loading] = useAuth()
    const navigate = useNavigate()

    if(loading){
        return <h1>Loading...</h1>
    }

    if(!user){
        navigate('/login')
    }


    return children
}

export default ProtectedRoute