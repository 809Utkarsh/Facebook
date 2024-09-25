// utils/AutoLogout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto logout after 2 hours (2 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const timer = setTimeout(() => {
      localStorage.removeItem("token"); // Remove the token from localStorage
      alert("Session expired. You will be logged out.");
      navigate("/login"); // Redirect to login page
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default AutoLogout;
