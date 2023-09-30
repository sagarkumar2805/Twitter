import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css"; // Make sure to import the NavBar.css file for styling
import { toast} from "react-toastify";

const NavBar = () => {
  const currentUserID = localStorage.getItem("currentUserID");

  const handleLogout = () => {
    try {
      localStorage.clear();
      window.location.href = "/login";
      toast.success('user liked successfully');
      
    } catch (error) {
      toast.error(error);
      
    }

  };
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink className="nav-link" to="/">
          <i class="fa-regular fa-comments"></i>
        </NavLink>
        <NavLink className="nav-link" to="/">
          <i className="fa-solid fa-house"></i>
          <h5>Home</h5>
        </NavLink>
        <NavLink className="nav-link" to={`/profileDetails/${currentUserID}`}>
          <i className="fa-regular fa-user-circle"></i>
          <h5>Profile</h5>
        </NavLink>
        <div className="nav-link" onClick={handleLogout}>
          <i class="fa-solid fa-right-from-bracket"></i>
          <h5>Logout</h5>
        </div>
        <NavLink className="nav-link" to="/profileDetails">
          <i className="fa-regular fa-user"></i>
          <div className="myProfile">
            <h6>My Profile</h6>
            <p>@Sagar</p>
          </div>
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
