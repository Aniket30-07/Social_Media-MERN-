import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({children}){
    const {user, loader} = useAuth()

    if(loader){
        return <h1>Loading...</h1>
    }

    if(user){
        return <Navigate to="/home" replace />
    }

    //console.log(children)
    return children
}

export default PublicRoute