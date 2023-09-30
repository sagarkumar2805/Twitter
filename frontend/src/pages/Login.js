import "./Login.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";
import { toast} from "react-toastify";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();
    setLoading(true);

    const isEmail = userName.includes("@"); // Check if the input contains '@' to determine if it's an email

    const requestData = isEmail
      ? { email: userName, password: password }
      : { userName: userName, password: password };

    axios
      .post(`${API_BASE_URL}/auth/login`, requestData)
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Save the authentication token in local storage
          const token = response.data.result.token;
          localStorage.setItem("token", token);

          const id = response.data.result.user._id;
          localStorage.setItem("currentUserID", id);


          // Redirect to the home page or any other page you want after successful login
          navigate("/");
        }
        toast.success('user log In successfully');
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Invalid credentials. Please check your username/email and password.",
        });
        toast.error(error);
      });
  };

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-3 col-sm-12 d-flex justify-content-center align-items-center logoRight card shadow">
          <h3>Welcome Back</h3>
          <i className="fa-regular fa-comments"></i>
        </div>
        <div className="col-md-5 col-sm-12 p-0">
          <div className="card shadow">
            {loading ? (
              <div className="col-md-12 mt-3 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : null}

            <div className="card-body px-5 p-0">
              <h4 className="card-title mt-3 fw-bold">Log In</h4>
              <form onSubmit={login}>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="p-2 mt-4 mb-2 form-control input-bg"
                  placeholder="User Name / Email"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 mb-2 form-control input-bg"
                  placeholder="Password"
                  required
                />
                <div className="mt-3">
                  <button type="submit" className="custom-btn custom-btn-blue">
                    Log In
                  </button>
                </div>

                <div className="mt-4 mb-5 d-flex">
                  <span className="text-muted fs-6">
                    Don't have an account?
                  </span>
                  <Link to="/register" className="ms-1 text-info fw-bold">
                    Register
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
