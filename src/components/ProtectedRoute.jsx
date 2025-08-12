// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;