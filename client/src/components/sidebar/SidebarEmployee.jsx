import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myLogo from '../../images/CashBackground.jpg';
import footerLogo from '../../images/CashTransparent.png';
import MakeEntry from '../../pages/UserDetails/EntryLedger/MakeEntry';
import AddFundRequest from '../../pages/UserDetails/FundRequest/AddFundRequest';

function SidebarEmployee() {
    const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

    // Add Request Leave 
    const [dashboardLogo, setDashboardLogo] = useState([]);
    const [isEntryModalOpen, setIsAddEntryModalOpen] = useState(false); // State to manage modal open/close
    const [isAddFundRequestModalOpen, setIsAddFundRequestModalOpen] = useState(false); // State to manage modal open/close

    useEffect(() => {
        // Check screen size and set initial sidebar state
        if (window.innerWidth <= 768) {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }

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

    const changeStyle = () => {
        if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }
    };

    // Handle Update 
    const handleUpdate = () => {
        toast.success("successfully uploaded");
        // window.location.reload();
    };

    const handleListClick = (path) => {
        if (window.location.pathname === path) {
            window.location.reload();
        }
    };

    // Add Entry Modal Handlers
    const handleAddEntryModal = () => {
        setIsAddEntryModalOpen(true);
    };

    const handleCloseEntryModal = () => {
        setIsAddEntryModalOpen(false);
    };

    // Fund Request Modal Handlers
    const handleAddFundRequestModal = () => {
        setIsAddFundRequestModalOpen(true);
    };

    const handleCloseFundRequestModal = () => {
        setIsAddFundRequestModalOpen(false);
    };




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
                            <div className="text-center d-none d-md-inline">
                                <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
                            </div>
                        </a>
                        {/*   <!-- Divider --> */}
                        <hr className="sidebar-divider my-0" />
                        {/*  <!-- Nav Item - Dashboard --> */}
                        <li style={{ zIndex: "999" }} className="nav-item active">
                            <Link to="/userdashboard" className="nav-link">
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>User Dashboard</span>
                            </Link>
                        </li>

                        {/*  <!-- Divider --> */}
                        <hr className="sidebar-divider" />

                        {/*   <!-- Heading --> */}
                        {/*  <!-- Nav Item - Pages Collapse Menu --> */}
                        <li style={{ zIndex: "999" }} className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseLedger"
                                aria-expanded="true" aria-controls="collapseLedger">
                                <i class="fa-solid fa-list-check"></i>
                                <span>Ledger Master</span>
                            </a>
                            <div id="collapseLedger" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                                <div className="bg-white py-2 collapse-inner rounded">
                                    <h6 className="collapse-header">Make Entry:</h6>
                                    <a className="collapse-item" href="#" onClick={handleAddEntryModal} >Make Entry </a>
                                    <Link to="/totalrecived" className="collapse-item" onClick={() => handleListClick("/totalrecived")}>
                                        <span>Received Ledger</span>
                                    </Link>
                                    <Link to="/viewledger" className="collapse-item" onClick={() => handleListClick("/viewledger")}>
                                        <span>Expenses Ledger</span>
                                    </Link>
                                    <Link to="/userprojectledger" className="collapse-item" onClick={() => handleListClick("/userprojectledger")}>
                                        <span>Project Ledger View</span>
                                    </Link>
                                    <Link to="/projectmonthlyreport" className="collapse-item" onClick={() => handleListClick("/projectmonthlyreport")}>
                                        <span>Monthly Report</span>
                                    </Link>
                                    <Link to="/userheadreport" className="collapse-item" onClick={() => handleListClick("/userheadreport")}>
                                        <span>Head Report</span>
                                    </Link>
                                </div>
                            </div>
                        </li>
                        <li style={{ zIndex: "999" }} className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseFundRequest"
                                aria-expanded="true" aria-controls="collapseFundRequest">
                                <i class="fa-solid fa-bell"></i>
                                <span>Request Master</span>
                            </a>
                            <div id="collapseFundRequest" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                                <div className="bg-white py-2 collapse-inner rounded">
                                    <h6 className="collapse-header">Request:</h6>
                                    <a className="collapse-item" href="#" onClick={handleAddFundRequestModal} >Fund Request</a>
                                    <Link to="/faunduserrequestlist" className="collapse-item" onClick={() => handleListClick("/faunduserrequestlist")}>
                                        <span>Fund Request List</span>
                                    </Link>
                                    <Link to="/fundstatus" className="collapse-item" onClick={() => handleListClick("/fundstatus")}>
                                        <span>Check Fund Status</span>
                                    </Link>
                                </div>
                            </div>
                        </li>
                        <li style={{ zIndex: "999" }} className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseLabour"
                                aria-expanded="true" aria-controls="collapseLabour">
                                <i class="fa-solid fa-bell"></i>
                                <span>Labour Master</span>
                            </a>
                            <div id="collapseLabour" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                                <div className="bg-white py-2 collapse-inner rounded">
                                    <h6 className="collapse-header">Labour:</h6>
                                    <Link to="/addlabourattendance" className="collapse-item" onClick={() => handleListClick("/addlabourattendance")}>
                                        <span>Labour Atendances</span>
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
            {isEntryModalOpen && <MakeEntry onClose={handleCloseEntryModal} onUpdate={handleUpdate} />}
            {isAddFundRequestModalOpen && <AddFundRequest onClose={handleCloseFundRequestModal} onUpdate={handleUpdate} />}
        </div>
    )
}

export default SidebarEmployee;


