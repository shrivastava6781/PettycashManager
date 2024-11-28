import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myLogo from '../images/CashBackground.jpg';
import favicon from '../images/CashTransparent.png';
import signinimg from '../images/signinimg.png';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardLogo, setDashboardLogo] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'admin', // default value
  });


  useEffect(() => {
    const fetchDashboardLogo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);
        setDashboardLogo(response.data);
      } catch (error) {
        console.error('Error fetching Dashboard Logo', error);
      }
    };

    fetchDashboardLogo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.message === 'User created successfully') {
        toast.success('Signup successful!');
        setTimeout(() => {
          navigate('/');
        }, 1000); // 1 second delay
      } else if (data.error === 'Admin already exists') {
        // If admin already exists, show an alert and redirect to the forgot password page
        alert('Admin already registered. Redirecting to forgot password...');
        navigate('/forgotpassword');
      } else if (data.error === 'User already exists') {
        toast.error('User already registered!');
      } else {
        toast.error('Failed to create details! Please ensure all fields are correctly filled.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{ backgroundColor: "#f9f9f9" }} className='login-container '>
      <div className='main-container shadow-sm'>
        <ToastContainer /> {/* Toast container */}
        <div className='login-right d-flex align-item-end justify-content-end'>
          <img className='loginimage' src={signinimg} alt="Background" />
          <div className='right-div'>
            <img className='login-favicon' src={favicon} alt="Background" />
            <div style={{ color: "white" }}>
              <h4 className='fw-bolder'>Cash Monitor - Petty-Cash Manager</h4>
              <p className='fw-bold'>Quick and easy real time Project Petty-Cash management solution</p>
            </div>
          </div>
        </div>
        <div className='login-left'>
          <div className='d-flex flex-column align-items-center justify-content-between'>
            <div className=' d-flex flex-column align-items-center '>
              <nav className="signinimg m-2">
                <div style={{ width: "100%", height: "100%" }} className=''>
                  <img
                    src={dashboardLogo.landingPageLogo
                      ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${dashboardLogo.landingPageLogo}`
                      : myLogo}
                    className='img-signin-logo'
                    alt="LOGO"
                  />
                </div>
              </nav>
              <div className='text-center heading pb-1'>
                <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0">Petty Cash.</h2>
              </div>
              <div style={{ width: "70%", boxShadow: "2px 2px 10px black" }} className="d-flex flex-column justify-content-around align-items-center gap-3  p-4 rounded-3 text-center ">
                <h4 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0"> Sign Up.</h4>
                <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
                  <div className="row">
                    <div className="form-group">
                      <input id="username"
                        name="username"
                        label="Username"
                        autoComplete="username"
                        autoFocus
                        type="text"
                        required
                        placeholder="Username" value={formData.username}
                        onChange={handleChange} className="form-control" />
                    </div>
                    <div className="form-group">
                      <input id="email" name="email"
                        autoComplete="email"
                        autoFocus
                        type="email"
                        label="Email Address"
                        placeholder="Email" value={formData.email}
                        onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                      <input name="password" type="password" id="password" placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        label="Password"
                        autoComplete="current-password"
                        className="form-control" required />
                    </div>
                    <div className="form-group">
                      <select id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        label="User Type" className="form-control" >
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign Up'}
                      </button>
                    </div>
                    <hr className='m-1 p-0' />
                    <div className="d-flex align-items-center justify-content-center gap-3 ">
                      <Link style={{ cursor: 'pointer' }} to="/forgotpassword">
                        Forgot password?
                      </Link>
                      <Link style={{ cursor: 'pointer' }} to="/">
                        Signin
                      </Link>
                    </div>
                  </div>

                </form>
              </div>
            </div>

            <div className=''>
              <p className="text-center text-body-secondary">Version 1.0 &copy; Developed by Prospect Digital</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;

