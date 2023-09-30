import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProfileDetails from "./pages/ProfileDetails";
import TweetDetails from "./pages/TweetDetails";
import NavBar from "./components/NavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const currentUser = localStorage.getItem("token");
  return (
    <div className="container d-flex">
      <BrowserRouter>
      <ToastContainer  limit={1} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/profileDetails/:id" element={<ProfileDetails />} />
          <Route path="/tweetDetails/:id" element={<TweetDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
