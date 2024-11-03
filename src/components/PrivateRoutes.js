import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export default function PrivateRoutes({ Component }) {
    const { user } = useAuthContext()
        // Check if user or user.roles is undefined
        if (!user || !user.roles || !Array.isArray(user.roles)) {
            return <Navigate to='/' />
        }
    
        // Check if the user has the 'admin' role
        const isAdmin = user.roles.includes('admin')
    
        if (!isAdmin) { 
            return <Navigate to='/' /> 
        }

    return (
        <Component />
    )
}
