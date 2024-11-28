import React, { useState, useEffect } from "react";
import axios from "axios";
import SupervisorDesc from "./SupervisorDesc";  // Component to show supervisor details
import EditSupervisor from "./EditSupervisor";  // Component to edit supervisor
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSupervisor from "./AddSupervisor";  // Component to add a new supervisor
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner';  // Correct import for spinner
import CreateUser from "../EmployeeMaster/CreateUser";

function ArchivedSupervisor({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [supervisors, setSupervisors] = useState([]);  // Supervisors list

    //   employee create 
    useEffect(() => {
        fetchSupervisors();
    }, []);

    const fetchSupervisors = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/archived/supervisors`);  // Fetch supervisors data
            setSupervisors(response.data);
        } catch (error) {
            console.error("Error fetching supervisors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} `;
    };


    return (
        <div className='d-flex w-100 h-100 bg-white '>
            <Sidebar />
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />

                    <div className="row">
                        <div className="col-xl-12">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white">Superviosr Archived</div>
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
                                                            <th>Code</th>
                                                            <th>Contact No.</th>
                                                            <th>Appointment Date</th>
                                                            <th>Leave Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <style>
                                                            {`.hyperlink:hover { color: #00509d; }`}
                                                        </style>
                                                        {supervisors && (
                                                            <>
                                                                {supervisors.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="6" className="text-center">No Supervisors found.</td>
                                                                    </tr>
                                                                ) : (
                                                                    supervisors.map((supervisor, index) => (
                                                                        <React.Fragment key={index}>
                                                                            <tr>
                                                                                <td>{supervisor.projectName}</td>
                                                                                <td>{supervisor.employeeName}</td>
                                                                                <td>{supervisor.employeeCode}</td>
                                                                                <td>{supervisor.employeePhone}</td>
                                                                                {/* <td>{formatDate(supervisor.appointmentDate)}</td> */}
                                                                                <td>{new Date(supervisor.appointmentDate).toLocaleDateString('en-GB')}</td>
                                                                                <td>{new Date(supervisor.leavedate).toLocaleDateString('en-GB')}</td>
                                                                                {/* <td>{formatDate(supervisor.leavedate)}</td> */}
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan="6"> <span className="fw-bolder">Description: </span>{supervisor.relifDescription}</td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    ))
                                                                )}
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default ArchivedSupervisor;
