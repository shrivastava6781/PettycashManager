import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "./Sidebar.css";
import myImage from '../../images/employee_profile.png';
import axios from "axios";

const SearchBar = ({ username, handleLogout }) => {
  const navigate = useNavigate();

  const [style, setStyle] = useState(
    "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
  );

  const changeStyle1 = () => {
    if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
      setStyle(
        "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1"
      );
    } else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    }
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails(employeeId);
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/employee/${employeeId}`);
      if (response.data.length > 0) {
        const employeeData = response.data[0];
        setSelectedEmployee(employeeData);
        console.log("Employee Details:", employeeData);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const [profilePicture, setProfilePicture] = useState(myImage);

  useEffect(() => {
    if (selectedEmployee) {
      fetchProfilePicture(selectedEmployee);
    }
  }, [selectedEmployee]);

  const fetchProfilePicture = async (employee) => {
    try {
      setProfilePicture(employee.picture ? `${process.env.REACT_APP_LOCAL_URL}/uploads/profile/${employee.picture}` : myImage);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  return (
    <div>
      <div id="content-wrapper" className="d-flex flex-column">
        {/*  <!-- Main Content --> */}
        <div id="content">
          <div id="content-wrapper" className="d-flex flex-column">
            {/*  <!-- Topbar --> */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <h3 style={{ fontSize: "3vh", marginLeft: "90px", marginBottom: "0px" }} className="pt-1 fw-bolder text-center w-100 text-uppercase ">CASH & DAILY WORKER MANAGER</h3>
              <ul className="navbar-nav ml-auto">
                {/*  <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
                <div className="topbar-divider d-none d-sm-block"></div>
                <li className="nav-item dropdown no-arrow">

                  <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="m-1 d-none d-lg-inline text-gray-600 small">{username}</span>
                    <img src={profilePicture}
                      className="img-profile rounded-circle" />
                  </a>
                  {/*  <!-- Dropdown - User Information --> */}
                  <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown">
                    <Link className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                      <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </Link>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/*  <!-- Logout Modal--> */}
      <div className="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
              <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
              <Link className="btn btn-primary" to="/" onClick={handleLogout} >Logout</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SearchBar



