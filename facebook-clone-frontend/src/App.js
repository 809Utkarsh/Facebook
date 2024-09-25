import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // Combined login/signup page
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home"; // Home page for authenticated users
import PrivateRoute from "./utils/PrivateRoute"; // PrivateRoute for protected routes

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes for login/signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private route for authenticated users */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} /> {/* Home route if authenticated */}
        </Route>

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
