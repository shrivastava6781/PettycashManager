import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

const HomePage = () => {

  return (
    <>
      <nav>
        <div className="d-flex align-items-center text-center align-middle" style={{ height: "50px" }}>
          <img
            src="https://prospectlegal.co.in/wp-content/uploads/2022/12/PROSPECT-LEGAL-NEW-LOGO.png"
            alt="Logo"
            className="logo"
          />
          <span className="align-middle h5 mt-2">Asset Managment</span>
        </div>
        <div className="d-flex align-items-center">
          <Link to="/userdashboard/services" className="text-white mr-5">Services</Link>

          <Link to="/signin" className="btn btn-outline-light mr-2">Sign In</Link>
          <Link to="/signup" className="btn btn-light">Sign Up</Link>
        </div>
      </nav>

      <h2 className="text-center mb-4 welcome-heading mt-2">Welcome to Our Website</h2>
    </>
  );
};

export default HomePage;
