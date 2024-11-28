import React from 'react';
import { Link } from 'react-router-dom';
import error from '../images/error.gif';

// import './PageNotFound.css'; // Optional: If you want to add custom styles

const PageNotFound = () => {
    return (

        <div style={{ height: "100vh", width: "100%", backgroundColor:"#FFFFFF" }} className="d-flex align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-center flex-column">
                <div className='error'>
                    <img src={error} alt="404 Error" style={{width:"100%",height:"100%"}} />
                </div>
                <div className='text-center'>
                    <h1 className='pagenotfound text-black fw-bolder'>404 - Page Not Found</h1>
                    <h6 className='pagenotfound text-black fw-bolder'>Sorry, The Page you are Looking for does not Exist.</h6>
                    <Link className='text-decoration-none errorbutton' to="/">Go Back to Home</Link> 
                </div>
            </div>


        </div>
    );
};

export default PageNotFound;
