import React, { useState, useEffect } from "react";
import axios from "axios";
import EditSupervisor from "./EditSupervisor";  // Component to edit supervisor
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSupervisor from "./AddSupervisor";  // Component to add a new supervisor
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner';  // Correct import for spinner
import CreateUser from "../EmployeeMaster/CreateUser";
import SupervisorRelif from "./SupervisorRelif";

function SupervisorList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [supervisors, setSupervisors] = useState([]);  // Supervisors list
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);  // Selected supervisor for details/edit
    const [showSupervisorDetails, setShowSupervisorDetails] = useState(false);  // Show details flag
    const [isAddSupervisorModalOpen, setIsAddSupervisorModalOpen] = useState(false);  // Add modal state
    const [isSupervisorRelif, setIsSupervisorRelif] = useState(false);  // Edit modal state
    const [supervisorRelif, setSupervisorRelif] = useState(null);  // Supervisor being edited
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    // Employee Create 
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedsupervisor, setSelectedsupervisor] = useState(null);
    // Make Chacnges Edit  
    const [isMakeChangesModalOpen, setIsMakeChangesModalOpen] = useState(false);
    const [makeChanges, setMakeChanges] = useState(null);


    const handleCreateEmployee = (supervisor) => {
        setSelectedsupervisor(supervisor); // Set selected employee for creation
        setIsCreateModalOpen(true); // Open create modal
    };
    //   employee create 
    useEffect(() => {
        fetchSupervisors();
    }, []);

    const fetchSupervisors = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/supervisors`);  // Fetch supervisors data
            setSupervisors(response.data);
        } catch (error) {
            console.error("Error fetching supervisors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSupervisor = () => {
        setIsAddSupervisorModalOpen(true);
    };

    const handleCloseSupervisorModal = () => {
        setIsAddSupervisorModalOpen(false);
        setIsSupervisorRelif(false);
    };

    const handleSupervisorRelif = (supervisor) => {
        setSupervisorRelif(supervisor);
        setIsSupervisorRelif(true);
    };

    const handleUpdateSupervisors = () => {
        toast.success("Successfully updated");
        fetchSupervisors();
        setIsAddSupervisorModalOpen(false); // Ensure the modal is closed after updating supervisors
    };
    // Make changes 
    const handleMakeChanges = (supervisor) => {
        setMakeChanges(supervisor);
        setIsMakeChangesModalOpen(true);
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} `;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = supervisors.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            <Sidebar />
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    {!showSupervisorDetails && (
                        <div className="row">
                            <div className="col-xl-12">
                                <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white">Active Supervisor List</div>
                                                <button style={{ whiteSpace: "nowrap" }} onClick={handleAddSupervisor} className="button_details">
                                                    <i className="fa fa-plus"></i> Assign supervisor
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className=''>
                                        <div className="card-body">
                                            <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
                                                {isLoading ? (
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <ThreeDots color="#00BFFF" height={80} width={80} />
                                                    </div>
                                                ) : (
                                                    <table className="table table-bordered" style={{ width: "100%" }}>
                                                        <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                            <tr>
                                                                <th>Project Name</th>
                                                                <th>Supervisor Name</th>
                                                                <th>Department   Name</th>
                                                                <th>Contact No.</th>
                                                                <th>Appointment Date</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <style>
                                                                {`.hyperlink:hover { color: #00509d; }`}
                                                            </style>
                                                            {supervisors && (
                                                                <>
                                                                    {currentItems.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan="12" className="text-center">No Supervisors found.</td>
                                                                        </tr>
                                                                    ) : (
                                                                        currentItems.map((supervisor, index) => (
                                                                            <tr key={index}>
                                                                                <td>{supervisor.projectName}</td>
                                                                                <td>{supervisor.employeeName}</td>
                                                                                <td>{supervisor.departmentName}</td>
                                                                                <td>{supervisor.employeePhone}</td>
                                                                                {/* <td>{formatDate(supervisor.appointmentDate)}</td> */}
                                                                                <td>{new Date(supervisor.appointmentDate).toLocaleDateString('en-GB')}</td>

                                                                                <td>
                                                                                    <div className="btn-group">
                                                                                        <button className="button_action" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <div className="dropdown-menu actionmenu">
                                                                                            <a style={{ whiteSpace: "nowrap" }} className="dropdown-item" href="#" onClick={() => handleMakeChanges(supervisor)}><i className="fas fa-edit"></i> Edit</a>
                                                                                            <a style={{ whiteSpace: "nowrap" }} className="dropdown-item" href="#" onClick={() => handleSupervisorRelif(supervisor)}><i class="fa-solid fa-person-walking-arrow-right"></i> Relief</a>
                                                                                            <a style={{ whiteSpace: "nowrap" }} className="dropdown-item" href="#" onClick={() => handleCreateEmployee(supervisor)}><i className="fa fa-plus"></i> Create Login</a>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    )}
                                                                </>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}
                                                <div className="mt-2">
                                                    <ul className="pagination">
                                                        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                                                            <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>Previous</a>
                                                        </li>
                                                        {Array.from({ length: Math.ceil(supervisors.length / itemsPerPage) }, (_, i) => (
                                                            <li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                                                                <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1} </a>
                                                            </li>
                                                        ))}
                                                        <li className={`page-item ${currentPage === Math.ceil(supervisors.length / itemsPerPage) && "disabled"}`}>
                                                            <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>Next</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isAddSupervisorModalOpen && (
                        <AddSupervisor
                            onClose={handleCloseSupervisorModal}
                            onUpdate={handleUpdateSupervisors}
                        />
                    )}
                    {isSupervisorRelif && (
                        <SupervisorRelif
                            onClose={handleCloseSupervisorModal}
                            supervisorRelif={supervisorRelif}
                            onUpdate={handleUpdateSupervisors}
                        />
                    )}
                    {isCreateModalOpen && (
                        <CreateUser
                            employee={selectedsupervisor}
                            onClose={() => setIsCreateModalOpen(false)}
                            onUpdate={handleUpdateSupervisors}
                        />
                    )}
                    {isMakeChangesModalOpen && (
                        <EditSupervisor
                            editsupervisor={makeChanges}
                            onClose={() => setIsMakeChangesModalOpen(false)}
                            onUpdate={handleUpdateSupervisors}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SupervisorList;
