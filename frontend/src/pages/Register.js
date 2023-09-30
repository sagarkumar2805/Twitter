import './Login.css'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../config';

const Register = () => {

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const register = (event) => {
    event.preventDefault();
    setLoading(true);

    const requestData = { name: name, userName: userName, email, password }

    axios.post(`${API_BASE_URL}/auth/register`, requestData)
      .then((result) => {
        if (result.status == 201) {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "user successfully registered"
          })
        }
        setName("");
        setUserName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Some error occured please try again later!"
        })
      })
  }

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-3 col-sm-12 d-flex justify-content-center align-items-center logoRight card shadow">
          <h3>Join Us</h3>
          <i class="fa-regular fa-comments"></i>
        </div>
        <div className="col-md-5 col-sm-12 p-0">
          <div className="card shadow">
            {loading ? <div className='col-md-12 mt-3 text-center'>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div> : ''}

            <div className="card-body px-5 p-0">
              <h4 className="card-title mt-3 fw-bold">Register</h4>
              <form onSubmit={(e)=> register(e)}>
                <input type="text" value={name} onChange={(ev)=> setName(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Name' />
                <input type="email" value={email} onChange={(ev)=> setEmail(ev.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Email' />
                <input type="text" value={userName} onChange={(ev)=> setUserName(ev.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='User Name' />
                <input type="password" value={password} onChange={(ev)=> setPassword(ev.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Password' />
                <div className='mt-3'>
                  <button className="custom-btn custom-btn-blue" type='submit'>Register</button>
                </div>

                <div className='mt-4 mb-5 d-flex'>

                  <span className='text-muted fs-6'>Already have an account?</span>
                  <Link to="/login" className='ms-1 text-info fw-bold'>Log In</Link>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register