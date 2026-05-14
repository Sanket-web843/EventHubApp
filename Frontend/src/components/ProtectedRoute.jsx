import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  const userStr = sessionStorage.getItem('Users');
  
  if (!token || !userStr) {
    return <Navigate to="/?login=true" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // User role not authorized
      return <Navigate to="/" replace />;
    }
    
    return children;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return <Navigate to="/?login=true" replace />;
  }
};

export default ProtectedRoute;
