import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
import EmployeeReportPreview from "./EmployeeReportPreview";


function EmployeeReport({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
    const [showSearchBar, setShowSearchBar] = useState(true); // State to control search bar visibility
    const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
    const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record

    useEffect(() => {
        fetchEmployees();
    }, []);

    // const fetchEmployees = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`);
    //         const filteredEmployees = response.data.filter(
    //             employee => employee.status !== 'resign_terminate'
    //         );
    //         setEmployees(filteredEmployees);
    //     } catch (error) {
    //         console.error("Error fetching employees:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`);
            const filteredEmployees = response.data
                .filter(employee => employee.status !== 'resign_terminate')
                .sort((a, b) => a.employeeName.localeCompare(b.employeeName)); // Sort alphabetically by 'name'
            setEmployees(filteredEmployees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDetails = () => {
        setSelectedRecord({
            status: employees.length > 0 ? employees[0].status : '',
            recordData: employees,

        });

        setDetailsVisible(true);
        setShowSidebar(false);
        setShowSearchBar(false);
    };

    const handleClosePreview = () => {
        setShowSidebar(true); // Show sidebar when closing preview
        setShowSearchBar(true); // Show search bar when closing preview
        setDetailsVisible(false); // Hide details
    };

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {showSidebar && <Sidebar />}
            <div className='w-100'>
                {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
                <div className="container-fluid">
                    <ToastContainer />
                    {detailsVisible ? (
                        <EmployeeReportPreview
                            record={selectedRecord}
                            onClose={handleClosePreview}
                        />
                    ) : (
                        <div className="row">
                            <div className="col-xl-12">
                                <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >Employee List Report
                                                </div>
                                                <button onClick={handleDetails} className="button_details">
                                                    <i className="fa fa-download"></i> PDF
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
                                                        {/* Correct usage of spinner */}
                                                        <ThreeDots color="#00BFFF" height={80} width={80} />
                                                    </div>
                                                ) : (
                                                    <table className="table table-bordered" style={{ width: "100%" }}>
                                                        <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Employee Name</th>
                                                                <th>Employee Code</th>
                                                                <th>Fathers Name</th>
                                                                <th>Phone No.</th>
                                                                <th>Email Id.</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {employees && (
                                                                <>
                                                                    {employees.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan="12" className="text-center">There are No Employees.</td>
                                                                        </tr>
                                                                    ) : (
                                                                        employees.map((employee, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td> {/* Serial number */}
                                                                                <td>
                                                                                    <span className="fw-bolder">{employee.employeeName}</span>
                                                                                    <hr />
                                                                                    <span>Department: </span>{employee.departmentName}
                                                                                </td>
                                                                                <td>
                                                                                    <span >{employee.employeeCode}</span>
                                                                                    <hr />
                                                                                    <span>Disgnation: </span>{employee.designationName}
                                                                                </td>
                                                                                <td>{employee.fatherName}</td>
                                                                                <td>{employee.employeePhone}</td>
                                                                                <td>{employee.employeeEmail}</td>
                                                                            </tr>
                                                                        )))}
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployeeReport;




