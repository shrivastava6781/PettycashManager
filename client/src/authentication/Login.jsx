// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // import './login.css'; // Import your external CSS file
// import myLogo from '../images/CashBackground.jpg';
// import loginimg from '../images/loginimg.png';
// import favicon from '../images/CashTransparent.png';
// import axios from 'axios';

// const Login = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');


//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.status === 200 && data.message === 'Login successful') {
//         // Fetch login details after successful login
//         const loginDetailsResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/logindetails/${email}`);
//         const loginDetails = loginDetailsResponse.data[0]; // Access the first record

//         // Store the required details in localStorage
//         localStorage.setItem('token', data.token); // Assuming the token comes from the first response
//         localStorage.setItem('username', loginDetails.username);
//         localStorage.setItem('fetchemail', loginDetails.email);
//         localStorage.setItem('employeeId', loginDetails.employeeId);
//         localStorage.setItem('projectId', loginDetails.projectId);
//         localStorage.setItem('userType', loginDetails.userType);

//         // Log the fetched data for debugging
//         console.log('Login details:', loginDetails);

//         toast.success('Successfully logged in');

//         // Redirect based on userType
//         if (loginDetails.userType === 'user') {
//           window.location.href = '/userdashboard';
//         } else if (loginDetails.userType === 'manager' || loginDetails.userType === 'admin') {
//           window.location.href = '/dashboard';
//         }
//       } else {
//         toast.error('Invalid email or password');
//         setError('Invalid email or password');
//       }
//     } catch (error) {
//       toast.error('Failed to login');
//       setError('Invalid email or password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const [dashboardLogo, setDashboardLogo] = useState([]);

//   useEffect(() => {
//     const fetchDashboardLogo = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);
//         setDashboardLogo(response.data);
//       } catch (error) {
//         console.error('Error fetching Dashboard Logo', error);
//       }
//     };

//     fetchDashboardLogo();
//   }, []);

//   return (
//     <div style={{ backgroundColor: "#f9f9f9" }} className='login-container '>
//       <div className='main-container shadow-sm'>
//         <ToastContainer /> {/* Toast container */}
//         <div className='login-left'>
//           <div className='header'>
//             <nav className="logo-pc signin_logo signin_logo_responsive">
//               <div style={{ width: "100%", height: "100%" }} className=''>
//                 <img
//                   src={dashboardLogo.landingPageLogo
//                     ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${dashboardLogo.landingPageLogo}`
//                     : myLogo}
//                   className='img-signin-logo'
//                   alt="LOGO"
//                 />
//               </div>
//             </nav>
//             {/* <nav className="logo-phone signin_logo signin_logo_responsive">
//               <div style={{ width: "100%", height: "100%" }} className=''>
//                 <img
//                   src={myLogo}
//                   className='img-signin-logo'
//                   alt="LOGO"
//                 />
//               </div>
//             </nav> */}
//           </div>
//           <div className='content d-flex flex-column align-items-center justify-content-center mainphone '>
//             <nav className=" company_logo">
//               <div style={{ width: "100%", height: "100%" }} className=''>
//                 <img
//                   src={dashboardLogo.landingPageLogo
//                     ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${dashboardLogo.landingPageLogo}`
//                     : myLogo}
//                   className='img-signin-logo'
//                   alt="LOGO"
//                 />
//               </div>
//             </nav>
//             <div className='text-center heading'>
//               <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0">Petty Cash Manager </h2>
//               <p className=''>Manage cash-flow easily with Cash Monitor Petty Cash Manager</p>
//             </div>
//             <div style={{ boxShadow: "2px 2px 10px black" }} className=" main-box d-flex flex-column justify-content-around align-items-center gap-3  p-4 rounded-3 text-center ">
//               <h4 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0"> Login in</h4>
//               <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
//                 <div className="row">
//                   <div className="form-group">
//                     <input id="email" name="email"
//                       autoComplete="email"
//                       autoFocus
//                       type="email"
//                       placeholder="Email" value={email}
//                       onChange={(e) => setEmail(e.target.value)} className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <input name="password" type="password" id="password" placeholder="Password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="form-control" required />
//                   </div>
//                   <div className="form-group">
//                     <button type="submit" className="btn btn-primary" disabled={isLoading}>
//                       {isLoading ? 'Loading...' : 'Sign In'}
//                     </button>
//                   </div>
//                   <hr className='m-1 p-0' />
//                   <div className="">

//                     <Link style={{ cursor: 'pointer' }} to="/forgotpassword">
//                       Forgot password?
//                     </Link>
//                   </div>
//                 </div>

//               </form>
//             </div>
//           </div>
//           <div className='footer footer-phone'>
//              <div className="logo-phone signin_logo signin_logo_responsive">
//               <div style={{ width: "100%", height: "100%" }} className=''>
//                 <img
//                   src={myLogo}
//                   className='img-signin-logo'
//                   alt="LOGO"
//                 />
//               </div>
//             </div>
//             <p className="text-center text-body-secondary">Version 1.0 &copy; Developed by Prospect Digital</p>
//           </div>
//         </div>
//         <div className='login-right d-flex align-item-end justify-content-end'>
//           <img className='loginimage' src={loginimg} alt="Background" />
//           <div className='right-div'>
//             <img className='login-favicon' src={favicon} alt="Background" />
//             <div style={{color:"white"}}>
//               <h4 className='fw-bolder'>Cash Monitor - Petty-Cash Manager</h4>
//               <p className='fw-bold'>Quick and easy real time Project Petty-Cash management solution</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;














import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './login.css'; // Import your external CSS file
import myLogo from '../images/CashBackground.jpg';
import loginimg from '../images/loginimg.png';
import favicon from '../images/CashTransparent.png';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200 && data.message === 'Login successful') {
        // Fetch login details after successful login
        const loginDetailsResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/logindetails/${email}`);
        const loginDetails = loginDetailsResponse.data[0]; // Access the first record

        // Store the required details in localStorage
        localStorage.setItem('token', data.token); // Assuming the token comes from the first response
        localStorage.setItem('username', loginDetails.username);
        localStorage.setItem('fetchemail', loginDetails.email);
        localStorage.setItem('employeeId', loginDetails.employeeId);
        localStorage.setItem('projectId', loginDetails.projectId);
        localStorage.setItem('userType', loginDetails.userType);

        // Log the fetched data for debugging
        console.log('Login details:', loginDetails);

        toast.success('Successfully logged in');

        // Redirect based on userType
        if (loginDetails.userType === 'user') {
          window.location.href = '/userdashboard';
        } else if (loginDetails.userType === 'manager' || loginDetails.userType === 'admin') {
          window.location.href = '/dashboard';
        }
      } else {
        toast.error('Invalid email or password');
        setError('Invalid email or password');
      }
    } catch (error) {
      toast.error('Failed to login');
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div style={{ backgroundColor: "#f9f9f9" }} className='login-container '>
      <div className='main-container shadow-sm'>
        <ToastContainer /> {/* Toast container */}
        <div className='login-left'>
          <div className='content d-flex flex-column align-items-center justify-content-center mainphone'>
            <nav className="loginimg mt-4">
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
            <div className='text-center heading mt-2'>
              <h3 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0">Petty Cash Manager </h3>
              <p className=''>Manage cash-flow easily with Cash Monitor Petty Cash Manager</p>
            </div>
            <div style={{ boxShadow: "2px 2px 10px black" }} className=" main-box d-flex flex-column justify-content-around align-items-center gap-3  p-4 rounded-3 text-center ">
              <h4 style={{ color: "#00509d" }} className="title-detail fw-bolder text-uppercase font-bold m-0"> Login in</h4>
              <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
                <div className="row">
                  <div className="form-group">
                    <input id="email" name="email"
                      autoComplete="email"
                      autoFocus
                      type="email"
                      placeholder="Email" value={email}
                      onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <input name="password" type="password" id="password" placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Sign In'}
                    </button>
                  </div>
                  <hr className='m-1 p-0' />
                  <div className="">

                    <Link style={{ cursor: 'pointer' }} to="/forgotpassword">
                      Forgot password?
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
                  alt="LOGO"
                />
              </div>
            </div>
            <p className="text-center text-body-secondary">Version 1.0 &copy; Developed by Prospect Digital</p>
          </div>
        </div>



















        <div className='login-right d-flex align-item-end justify-content-end'>
          <img className='loginimage' src={loginimg} alt="Background" />
          <div className='right-div'>
            <img className='login-favicon' src={favicon} alt="Background" />
            <div style={{ color: "white" }}>
              <h4 className='fw-bolder'>Cash Monitor - Petty-Cash Manager</h4>
              <p className='fw-bold'>Quick and easy real time Project Petty-Cash management solution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
