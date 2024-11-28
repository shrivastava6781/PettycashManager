
// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Button, Paper, TextField, Typography } from '@mui/material';
// import './ForgotPassword.css'; // Import your external CSS file

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/forgotpassword`, { email });
//       setMessage(response.data.message);
//       setError('');
//       toast.success(response.data.message); // Success toast
//     } catch (error) {
//       setMessage('');
//       setError(error.response.data.error);
//       toast.error(error.response.data.error); // Error toast
//     }
//   };

//   return (
//     <div className="container-fluid d-flex justify-content-center align-items-center " style={{ minHeight: "100vh" }}>
//       <ToastContainer /> {/* Toast container */}
//       <div className="forgot-password-container">
//         <h1 className="title m-2" style={{textAlign:"center"}}>Forgot Password</h1>
//         <Paper className="forgot-password-paper p-3" elevation={3} style={{ borderRadius: '20px' }}>
//           <form className="forgot-password-form" onSubmit={handleSubmit}>
//             <TextField
//               variant="outlined"
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={handleEmailChange}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               color="primary"
//               className="reset-password-button"
//             >
//               Reset Password
//             </Button>
//           </form>
//           {error && (
//             <Typography variant="body2" className="text-center m-4" style={{ color: "red" }}>
//               {error}
//             </Typography>
//           )}
//         </Paper>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;




import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myLogo from '../images/CashBackground.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardLogo, setDashboardLogo] = useState([]);


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


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/forgotpassword`, { email });
      setMessage(response.data.message);
      setError('');
      toast.success(response.data.message); // Success toast
    } catch (error) {
      setMessage('');
      setError(error.response.data.error);
      toast.error(error.response.data.error); // Error toast
    }
  };

  return (
    <div style={{ backgroundColor: "#E8FBFF" }} className='login-container'>
      <div className='main-container-forgotpassward shadow-sm'>
        <ToastContainer /> {/* Toast container */}
        <div className='forgot-main'>
          <div className='content d-flex flex-column align-items-center justify-content-center mainphone '>
            <nav className="loginimg mt-4">
              <div style={{ width: "100%", height: "100%" }} className=''>
                <img
                  src={dashboardLogo.landingPageLogo
                    ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${dashboardLogo.landingPageLogo}`
                    : myLogo}
                  className='img-signin-logo'
                
                />
              </div>
            </nav>
            <div className='text-center heading mt-2'>
              <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0">Petty Cash Manager </h2>
              <p className=''>Manage cash-flow easily with Cash Monitor Petty Cash Manager</p>
            </div>
            <div style={{ width: "70%", boxShadow: "2px 2px 10px black" }} className="d-flex flex-column justify-content-around align-items-center gap-3  p-4 rounded-3 text-center ">
              <h4 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0"> forgot</h4>
              <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
                <div className="row">
                  <div className="form-group">
                    <input id="email" name="email"
                      autoComplete="email"
                      autoFocus
                      type="email"
                      placeholder="Email" value={email}
                      onChange={handleEmailChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Forgot Passward'}
                    </button>
                  </div>
                  <hr className='m-1 p-0' />
                  <div className="">
                    <Link style={{ cursor: 'pointer' }} to="/">
                      Sign in ?
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center justify-content-center">
              <div style={{ width: "50%", height: "100%" }} className='footer-img'>
                <img
                  src={myLogo}
                  className='img-signin-logo'
                
                />
              </div>
            </div>
            <p className="text-center text-body-secondary">Version 1.0 &copy; Developed by Prospect Digital</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
