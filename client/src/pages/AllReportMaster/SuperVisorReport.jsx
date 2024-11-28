// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from "../../components/sidebar/Sidebar";
// import SearchBar from "../../components/sidebar/SearchBar";
// import { ThreeDots } from 'react-loader-spinner';
// import SuperVisorReportPreview from "./SuperVisorReportPreview";

// function SuperVisorReport({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [employees, setEmployees] = useState([]);
//     const [supervisors, setSupervisors] = useState([]);
//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showSearchBar, setShowSearchBar] = useState(true);
//     const [detailsVisible, setDetailsVisible] = useState(false);
//     const [selectedRecord, setSelectedRecord] = useState(null);

//     useEffect(() => {
//         fetchEmployees();
//         fetchSupervisors();
//     }, []);

//     const fetchEmployees = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`);
//             const allEmployees = response.data.filter(
//                 employee => employee.status !== 'resign_terminate'
//             );
//             setEmployees(allEmployees);
//         } catch (error) {
//             console.error("Error fetching employees:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchSupervisors = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/supervisors`);
//             const supervisorData = response.data;
//             setSupervisors(supervisorData);
//         } catch (error) {
//             console.error("Error fetching supervisors:", error);
//             toast.error('Failed to fetch supervisors');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDetails = () => {
//         setSelectedRecord({
//             status: employees.length > 0 ? employees[0].status : '',
//             recordData: employees,
//         });
//         setDetailsVisible(true);
//         setShowSidebar(false);
//         setShowSearchBar(false);
//     };

//     const handleClosePreview = () => {
//         setShowSidebar(true);
//         setShowSearchBar(true);
//         setDetailsVisible(false);
//     };

//     const getProjectNameForEmployee = (employeeId) => {
//         const supervisor = supervisors.find(supervisor => supervisor.employeeCode === employeeId);
//         return supervisor ? supervisor.projectName : "N/A"; // Use project name if supervisor found, else "N/A"
//     };

//     return (
//         <div className='d-flex w-100 h-100 bg-white'>
//             {showSidebar && <Sidebar />}
//             <div className='w-100'>
//                 {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     {detailsVisible ? (
//                         <SuperVisorReportPreview
//                             record={selectedRecord}
//                             onClose={handleClosePreview}
//                         />
//                     ) : (
//                         <div className="row">
//                             <div className="col-xl-12">
//                                 <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
//                                     <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
//                                         <div className="col">
//                                             <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
//                                                 <div className="nunito text-white">SuperVisor Report</div>
//                                                 <button onClick={handleDetails} className="button_details">
//                                                     <i className="fa fa-download"></i> PDF
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <hr className='m-0 p-0' />
//                                     <div className=''>
//                                         <div className="card-body">
//                                             <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
//                                                 {isLoading ? (
//                                                     <div className="d-flex justify-content-center align-items-center">
//                                                         <ThreeDots color="#00BFFF" height={80} width={80} />
//                                                     </div>
//                                                 ) : (
//                                                     <table className="table table-bordered" style={{ width: "100%" }}>
//                                                         <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                             <tr>
//                                                                 <th>Employee Name/Designation</th>
//                                                                 <th>Employee Code</th>
//                                                                 <th>Phone No.</th>
//                                                                 <th>Project Name</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {employees && (
//                                                                 <>
//                                                                     {employees.length === 0 ? (
//                                                                         <tr>
//                                                                             <td colSpan="4" className="text-center">There are No Employees.</td>
//                                                                         </tr>
//                                                                     ) : (
//                                                                         employees.map((employee, index) => (
//                                                                             <tr key={index}>
//                                                                                 <td>
//                                                                                     {employee.employeeName}
//                                                                                     <hr />
//                                                                                     {employee.designationName}
//                                                                                     <br />
//                                                                                     {employee.departmentName}
//                                                                                 </td>
//                                                                                 <td>{employee.employeeCode}</td>
//                                                                                 <td>{employee.employeePhone}</td>
//                                                                                 <td>{getProjectNameForEmployee(employee.employeeCode.trim())}</td> {/* Fetch project name */}
//                                                                             </tr>
//                                                                         )))}
//                                                                 </>
//                                                             )}
//                                                         </tbody>
//                                                     </table>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SuperVisorReport;






import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
import SuperVisorReportPreview from "./SuperVisorReportPreview";


function SuperVisorReport({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [supervisors, setSupervisors] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
    const [showSearchBar, setShowSearchBar] = useState(true); // State to control search bar visibility
    const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
    const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record

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

    const handleDetails = () => {
        setSelectedRecord({
            status: supervisors.length > 0 ? supervisors[0].status : '',
            recordData: supervisors,

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} `;
    };

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {showSidebar && <Sidebar />}
            <div className='w-100'>
                {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
                <div className="container-fluid">
                    <ToastContainer />
                    {detailsVisible ? (
                        <SuperVisorReportPreview
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
                                                <div className="nunito text-white" >Active Supervisor Report
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
                                                                <th>Project Name</th>
                                                                <th>Supervisor Name</th>
                                                                <th>Department Name</th>
                                                                <th>Contact No.</th>
                                                                <th>Appoitment Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {supervisors && (
                                                                <>
                                                                    {supervisors.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan="12" className="text-center">There are No supervisors.</td>
                                                                        </tr>
                                                                    ) : (
                                                                        supervisors.map((supervisor, index) => (
                                                                            <tr key={index}>
                                                                                <td>{supervisor.projectShortName}</td>
                                                                                <td>{supervisor.employeeName}</td>
                                                                                <td>{supervisor.departmentName}</td>
                                                                                <td>{supervisor.employeePhone}</td>
                                                                                {/* <td>{formatDate(supervisor.appointmentDate)}</td> */}
                                                                                <td>{new Date(supervisor.appointmentDate).toLocaleDateString('en-GB')}</td>

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

export default SuperVisorReport;




