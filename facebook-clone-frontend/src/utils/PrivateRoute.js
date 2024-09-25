import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AutoLogout from "./AutoLogout"; // Import AutoLogout

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); // Check if token is present

  // If authenticated, render AutoLogout and the private route (Outlet)
  return isAuthenticated ? (
    <>
      <AutoLogout /> {/* Start auto-logout timer when on private route */}
      <Outlet /> {/* Render the child route */}
    </>
  ) : (
    <Navigate to="/login" /> // If not authenticated, redirect to login
  );
};

export default PrivateRoute;
