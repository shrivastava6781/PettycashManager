import React, { useEffect, useState, } from "react";
import { Link, useLocation, Route, Routes, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import AddEmployeeTable from "../../pages/EmployeeMaster/AddEmployeeTable";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCompany from "../../pages/Company Master/AddCompany";
import AddDepartmentModal from "../../pages/Department_Position/AddDepartmentModal";
import AddPositionModal from "../../pages/Department_Position/AddPositionModal";
import AddProjectModal from "../../pages/Project_Master/AddProjectModal";
import myLogo from '../../images/CashBackground.jpg';
import footerLogo from '../../images/CashTransparent.png';
import AddSupervisor from "../../pages/ProjectSuperVisior/AddSupervisor";
import AddCash from "../../pages/PettyCash/AddCash";
import AddPaymentMode from "../../pages/PaymentModeMaster/AddPaymentMode";
import AddHead from "../../pages/HeadMaster/AddHead";
import AdminMakeEntry from "../../pages/AdminEntry/AdminMakeEntry";
import AddLabour from "../../pages/LabourMaster/AddLabour";
import PayLabourAmt from "../../pages/LabourMaster/PayLabourAmt";

function Sidebar() {


  // Form Modal open 
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close
  const [isHeadModalOpen, setIsAddHeadModalOpen] = useState(false); // State to manage modal open/close
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);


  // Employee Modal 
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  // Office Modal 
  const [isAddOfficeModalOpen, setIsAddOfficeModalOpen] = useState(false);
  // Comapny Modal 
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  // Department Modal 
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  // add Position
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
  // Add Project  
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  // Add Supervisor
  const [isAddSupervisor, setIsAddSupervisor] = useState(false);
  // AddPaymentMode modal 
  const [isAddPaymentModeModalopen, setIsAddPaymentModeModalopen] = useState(false);
  // AddLabour modal 
  const [isAddLabourModalopen, setIsAddLabourModalopen] = useState(false);
  // Admin Make Entry modal 
  const [isAdminMakeEntryModalopen, setIsAdminMakeEntryModalopen] = useState(false);
  // Pay Amount modal 
  const [isPayLabourAmtModalopen, setIsPayLabourAmtModalopen] = useState(false);


  // Add Cash
  const [isAddCashModal, setIsAddCashModal] = useState(false);
  // Add Hr Manager Form 
  const [isAddHRManager, setIsAddHRManager] = useState(false);
  // Add Request Leave 
  const [isRequestLeaveModalOpen, setIsRequestLeaveModalOpen] = useState(false);





  const location = useLocation();




  const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

  const changeStyle = () => {
    if (style == "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
    }
    else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion")
    }
  };
  const changeStyle1 = () => {
    if (style == "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1");
    }
    else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion")
    }
  };

  const navigate = useNavigate(); // Place the hook outside of the component


  // Handle 
  const handleAddAsset = () => {
    setIsModalOpen(true); // Open the modal when "Add new Asset" button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const handleAddEmployee = () => {
    setIsEmployeeModalOpen(true);
  };

  const handleAddVendor = () => {
    setIsVendorModalOpen(true);
  };

  const handleAddRequestLeave = () => {
    setIsRequestLeaveModalOpen(true);
  };

  const handleCloseRequestLeave = () => {
    setIsRequestLeaveModalOpen(false);
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
  };

  const handleCloseVendorModal = () => {
    setIsVendorModalOpen(false);
  };

  // company modal 

  const handleAddCompany = () => {
    setIsAddCompanyModalOpen(true);
  };

  const handleCloseCompanyModal = () => {
    setIsAddCompanyModalOpen(false);
  };

  // Asset Lost 

  const handleAddOffice = () => {
    setIsAddOfficeModalOpen(true);
  };

  const handleCloseOfficeModal = () => {
    setIsAddOfficeModalOpen(false);
  };

  // site Modal 

  const handleAddHRManager = () => {
    setIsAddHRManager(true)
  };

  const handleCloseHRManager = () => {
    setIsAddHRManager(false);
  };

  // Brand  Modal 

  const handleAddDepartment = () => {
    setIsAddDepartmentModalOpen(true);
  };

  const handleCloseDepartmentModal = () => {
    setIsAddDepartmentModalOpen(false);
  };

  // Add Inward Modal 

  const handleAddPaymentMode = () => {
    setIsAddPaymentModeModalopen(true);
  };

  const handleCloseAddPaymentModal = () => {
    setIsAddPaymentModeModalopen(false);
  };

  // Add Labour Master 

  const handleAddLabour = () => {
    setIsAddLabourModalopen(true);
  };

  const handleCloseLabour = () => {
    setIsAddLabourModalopen(false);
  };

  // Component SuperVisor Modal 

  const handleAddSupervisorModal = () => {
    setIsAddSupervisor(true);
  };

  const handleCloseSupervisorModal = () => {
    setIsAddSupervisor(false);
  };

  // Asset Cash Modal 
  const handleAddCashModal = () => {
    setIsAddCashModal(true);
  };

  const handleCloseAddCashModal = () => {
    setIsAddCashModal(false);
  };
  // Asser Maintenance Modal 

  const handleAddPositionModal = () => {
    setIsAddPositionModalOpen(true);
  };

  const handleClosePositionModal = () => {
    setIsAddPositionModalOpen(false);
  };

  // Project Modal 

  const handleAddProjectModal = () => {
    setIsAddProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsAddProjectModalOpen(false);
  };

  // Add Head 
  const handleAddHeadModal = () => {
    setIsAddHeadModalOpen(true);
  };

  const handleCloseHeadModal = () => {
    setIsAddHeadModalOpen(false);
  };

  // Add Admin Make Entry
  const handleAdminMakeEntryModal = () => {
    setIsAdminMakeEntryModalopen(true);
  };

  const handleCloseAdminMakeEntryModal = () => {
    setIsAdminMakeEntryModalopen(false);
  };

  // Add Labour Amt
  const handleAddLabourAmtModal = () => {
    setIsPayLabourAmtModalopen(true);
  };

  const handleCloseAddLabourAmtModal = () => {
    setIsPayLabourAmtModalopen(false);
  };

  const handleListClick = (path) => {
    if (window.location.pathname === path) {
      window.location.reload();
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

  const handleUpdate = () => {
    toast.success("successfully uploaded");
    // window.location.reload();
  }

  return (
    <div style={{ position: "relative" }}>
      <body style={{ backgroundColor: "green" }} className={style} id="accordionSidebar">
        {/*  <!-- Sidebar --> */}
        <div style={{ height: "100%" }} className="d-flex flex-column">
          <ul>
            {/*  <!-- Sidebar - Brand --> */}
            <a className="sidebar-brand d-flex align-items-center justify-content-center gap-2 px-3 py-1" href="#">
              <div className="sidebar-brand-text" style={{ width: "100%", height: "100%" }}>
                <div className='logoo'>
                  <img
                    src={dashboardLogo.landingPageLogo
                      ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${dashboardLogo.landingPageLogo}`
                      : myLogo}
                    className="img-logo"
                  />
                </div>
              </div>
              <div className="text-center d-none d-md-inline ">
                <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
              </div>
            </a>
            {/*   <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />
            {/*  <!-- Nav Item - Dashboard --> */}
            <li style={{ zIndex: "999" }} className="nav-item active">
              <Link to="/dashboard" className="nav-link">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            {/*  <!-- Divider --> */}
            <hr className="sidebar-divider" />
            {/* <!-- Nav Item - Company --> */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsepettyCash"
                aria-expanded="true" aria-controls="collapsepettyCash">
                <i class="fa-solid fa-briefcase"></i>
                <span>Petty Cash Master</span>
              </a>
              <div id="collapsepettyCash" className="collapse" aria-labelledby="headingCompany" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Petty Cash Master:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddCashModal}>Add Petty Cash </a>
                  <Link to="/cashledger" className="collapse-item" onClick={() => handleListClick("/cashledger")}>
                    <span>Payment Ledger</span>
                  </Link>
                  <Link to="/expensesledger" className="collapse-item" onClick={() => handleListClick("/expensesledger")}>
                    <span>Expenses Ledger</span>
                  </Link>
                  <Link to="/projectledger" className="collapse-item" onClick={() => handleListClick("/projectledger")}>
                    <span>Project Ledger</span>
                  </Link>
                  <h6 className="collapse-header">Head Master:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddHeadModal}>Add Head </a>
                  <Link to="/headlist" className="collapse-item" onClick={() => handleListClick("/headlist")}>
                    <span>Head List</span>
                  </Link>
                  <h6 className="collapse-header">Fund Request Master:</h6>
                  {/* <a className="collapse-item" href="#" onClick={handleAddProjectModal}>Add new Project </a> */}
                  <Link to="/fundrequest" className="collapse-item" onClick={() => handleListClick("/fundrequest")}>
                    <span>Request List</span>
                  </Link>
                  <Link to="/approvreject" className="collapse-item" onClick={() => handleListClick("/approvreject")}>
                    <span>Approve/Reject List</span>
                  </Link>
                  <h6 className="collapse-header">make Entry</h6>
                  <a className="collapse-item" href="#" onClick={handleAdminMakeEntryModal} >Admin Make Entry</a>
                </div>
              </div>
            </li>
            {/* <!-- Nav Item - Company --> */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseCompany"
                aria-expanded="true" aria-controls="collapseCompany">
                <i class="fa-solid fa-building"></i>
                <span>Company Master</span>
              </a>
              <div id="collapseCompany" className="collapse" aria-labelledby="headingCompany" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Company Master:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddCompany}>Add new Company </a>
                  <Link to="/companylist" className="collapse-item" onClick={() => handleListClick("/companylist")}>
                    <span>Company List</span>
                  </Link>
                  <h6 className="collapse-header">Department/Designation:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddDepartment} >Add new Department </a>
                  <a className="collapse-item" href="#" onClick={handleAddPositionModal} >Add new Designation </a>

                  <Link to="/departmentlist" className="collapse-item" onClick={() => handleListClick("/departmentlist")}>
                    <span>Department List</span>
                  </Link>
                </div>
              </div>
            </li>
            {/* <!-- Nav Item - Employee --> */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseEmployee"
                aria-expanded="true" aria-controls="collapseEmployee">

                <i className="fas fa-users"></i>
                <span>Employee Master</span>
              </a>
              <div id="collapseEmployee" className="collapse" aria-labelledby="headingEmployee" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Employees:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddEmployee} >Add new Employee </a>
                  <Link to="/employeelist" className="collapse-item" onClick={() => handleListClick("/employeelist")}>
                    <span>Employee List</span>
                  </Link>
                </div>
              </div>
            </li>
            {/* <!-- Nav Item - Project --> */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseProject"
                aria-expanded="true" aria-controls="collapseProject">
                <i class="fa-solid fa-diagram-project"></i>
                <span>Project Master</span>
              </a>
              <div id="collapseProject" className="collapse" aria-labelledby="headingProject" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Project Master:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddProjectModal}>Add new Project </a>
                  <Link to="/projectlist" className="collapse-item" onClick={() => handleListClick("/projectlist")}>
                    <span>Project List</span>
                  </Link>

                  {/* <h6 className="collapse-header">Select HR Manager:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddHRManager} >Add Hr Manageer</a>
                  <Link to="/hrmanagertimeline" className="collapse-item" onClick={() => handleListClick("/hrmanagertimeline")}>
                    <span>HR Manager TimeLine</span>
                  </Link> */}
                </div>
              </div>
            </li>
            {/* <!-- Nav Item - supervisor --> */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsesupervisor"
                aria-expanded="true" aria-controls="collapsesupervisor">
                <i class="fa-solid fa-users-gear"></i>
                <span>supervisor Master</span>
              </a>
              <div id="collapsesupervisor" className="collapse" aria-labelledby="headingsupervisor" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">supervisor Master:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddSupervisorModal}>Assign supervisor </a>
                  <Link to="/supervisorlist" className="collapse-item" onClick={() => handleListClick("/supervisorlist")}>
                    <span>Active Supervisor List</span>
                  </Link>
                  <Link to="/archivedsupervisor" className="collapse-item" onClick={() => handleListClick("/archivedsupervisor")}>
                    <span>Superviosr Archived</span>
                  </Link>

                  {/* <h6 className="collapse-header">Select HR Manager:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddHRManager} >Add Hr Manageer</a>
                  <Link to="/hrmanagertimeline" className="collapse-item" onClick={() => handleListClick("/hrmanagertimeline")}>
                    <span>HR Manager TimeLine</span>
                  </Link> */}
                </div>
              </div>
            </li>

            {/* <!-- Nav Item - Department --> */}
            {/* <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseDepartment"
                aria-expanded="true" aria-controls="collapseDepartment">
                <i class="fa-solid fa-building-user"></i>
                <span>Department Master</span>
              </a>
              <div id="collapseDepartment" className="collapse" aria-labelledby="headingDepartment" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Department/Designation:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddDepartment} >Add new Department </a>
                  <a className="collapse-item" href="#" onClick={handleAddPositionModal} >Add new Designation </a>

                  <Link to="/departmentlist" className="collapse-item" onClick={() => handleListClick("/departmentlist")}>
                    <span>Department List</span>
                  </Link>
                </div>
              </div>
            </li> */}

            {/* Nav Item - Payment Mode */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePaymentMode"
                aria-expanded="true" aria-controls="collapsePaymentMode">
                <i class="fa-solid fa-money-check-dollar"></i>
                <span>Payment master</span>
              </a>
              <div id="collapsePaymentMode" className="collapse" aria-labelledby="headingcategory" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Payment Mode Master:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddPaymentMode}>Add Payment Mode</a>
                  <Link to="/paymentmodelist" className="collapse-item" onClick={() => handleListClick("/paymentmodelist")}>
                    <span>Payment Mode List</span>
                  </Link>
                </div>
              </div>
            </li>

            {/* Nav Item - Labour Master */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseLabourMaster"
                aria-expanded="true" aria-controls="collapseLabourMaster">
                <i class="fa-solid fa-money-check-dollar"></i>
                <span>Labour master</span>
              </a>
              <div id="collapseLabourMaster" className="collapse" aria-labelledby="headingcategory" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Labour Master:</h6>
                  <a className="collapse-item" href="#" onClick={handleAddLabour}>Add Labour</a>
                  <a className="collapse-item" href="#" onClick={handleAddLabourAmtModal}>Labour Payment</a>
                  <Link to="/labourpaymentlist" className="collapse-item" onClick={() => handleListClick("/labourpaymentlist")}>
                    <span>Labour Payment List</span>
                  </Link>
                  <Link to="/labourlist" className="collapse-item" onClick={() => handleListClick("/labourlist")}>
                    <span>Labour List</span>
                  </Link>
                  <Link to="/labourattendance" className="collapse-item" onClick={() => handleListClick("/labourattendance")}>
                    <span>Add Labour Attendance</span>
                  </Link>
                  {/* <Link to="/viewattendance" className="collapse-item" onClick={() => handleListClick("/viewattendance")}>
                    <span>View Attendance</span>
                  </Link> */}
                </div>
              </div>
            </li>

            {/* Nav Item - Report Master */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseReport"
                aria-expanded="true" aria-controls="collapseReport">
                <i class="fa-solid fa-list-check"></i>
                <span>Report master</span>
              </a>
              <div id="collapseReport" className="collapse" aria-labelledby="headingcategory" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Report Master:</h6>
                  <Link to="/projectreport" className="collapse-item" onClick={() => handleListClick("/projectreport")}>
                    <span>Project List Report</span>
                  </Link>
                  <Link to="/employeereport" className="collapse-item" onClick={() => handleListClick("/employeereport")}>
                    <span>Employee List Report</span>
                  </Link>
                  <Link to="/headreport" className="collapse-item" onClick={() => handleListClick("/headreport")}>
                    <span>Head List Report</span>
                  </Link>
                  <Link to="/supervisorreport" className="collapse-item" onClick={() => handleListClick("/supervisorreport")}>
                    <span>SuperVisor Report</span>
                  </Link>
                  <Link to="/cashledgerreport" className="collapse-item" onClick={() => handleListClick("/cashledgerreport")}>
                    <span>Payment Report</span>
                  </Link>
                  <Link to="/expensesCashreport" className="collapse-item" onClick={() => handleListClick("/expensesCashreport")}>
                    <span>Expenses Report</span>
                  </Link>
                  <Link to="/pettycashreport" className="collapse-item" onClick={() => handleListClick("/pettycashreport")}>
                    <span>Petty Cash Report</span>
                  </Link>
                  <Link to="/projectcreditdebitreport" className="collapse-item" onClick={() => handleListClick("/projectcreditdebitreport")}>
                    <span>Monthly Report</span>
                  </Link>
                </div>
              </div>
            </li>

            {/* Nav Item - Total Setting */}
            <li className="nav-item">
              <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsesetting"
                aria-expanded="true" aria-controls="collapsesetting">
                <i className="fa fa-cog"></i>
                <span>Setting master</span>
              </a>
              <div id="collapsesetting" className="collapse" aria-labelledby="headingcategory" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Setting:</h6>
                  {/* <Link className="collapse-item" to="/profile" >
                    <span>Profile Setting</span>
                  </Link>*/}
                  <Link className="collapse-item" to="/applicationsetting" >
                    <span>Application Setting</span>
                  </Link>
                </div>
              </div>
            </li>

            <hr className="sidebar-divider d-none d-md-block" />
          </ul>
        </div>
        <div className="footer p-1 d-flex align-items-center justify-content-center flex-column">
          <div className='sidebar-footer'>
            <img
              src={footerLogo}
              className="img-logo"
            />
          </div>
          <p style={{ fontSize: "10px" }} className="text-center m-0 p-0 text-white">Version 1.0 &copy; Developed by Prospect Digital</p>
        </div>
        <button style={{ border: "2px solid black", position: "absolute", left: "30px", top: "10px", zIndex: "999" }} id="sidebarToggleTop" className="btn btn-link d-md-none" onClick={changeStyle}>
          <i className="fa fa-bars"></i>
        </button>
      </body>
      {isEmployeeModalOpen && <AddEmployeeTable onClose={handleCloseEmployeeModal} onUpdate={handleUpdate} />}
      {isHeadModalOpen && <AddHead onClose={handleCloseHeadModal} onUpdate={handleUpdate} />}
      {isAddCompanyModalOpen && <AddCompany onClose={handleCloseCompanyModal} onUpdate={handleUpdate} />}
      {isAddDepartmentModalOpen && <AddDepartmentModal onClose={handleCloseDepartmentModal} onUpdate={handleUpdate} />}
      {isAddPaymentModeModalopen && <AddPaymentMode onClose={handleCloseAddPaymentModal} onUpdate={handleUpdate} />}
      {isAddLabourModalopen && <AddLabour onClose={handleCloseLabour} onUpdate={handleUpdate} />}
      {isAddSupervisor && <AddSupervisor onClose={handleCloseSupervisorModal} onUpdate={handleUpdate} />}
      {isAddCashModal && <AddCash onClose={handleCloseAddCashModal} onUpdate={handleUpdate} />}
      {isAddPositionModalOpen && <AddPositionModal onClose={handleClosePositionModal} onUpdate={handleUpdate} />}
      {isAddProjectModalOpen && <AddProjectModal onClose={handleCloseProjectModal} onUpdate={handleUpdate} />}
      {isAdminMakeEntryModalopen && <AdminMakeEntry onClose={handleCloseAdminMakeEntryModal} onUpdate={handleUpdate} />}
      {isPayLabourAmtModalopen && <PayLabourAmt onClose={handleCloseAddLabourAmtModal} onUpdate={handleUpdate} />}

    </div>
  )
}

export default Sidebar;



