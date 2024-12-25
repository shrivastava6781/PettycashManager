// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import DeleteConfirmationModal from "../DeleteConfirmationModal";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from "../../components/sidebar/Sidebar";
// import SearchBar from "../../components/sidebar/SearchBar";
// import { ThreeDots } from 'react-loader-spinner'; // Spinner
// import LabourReportPreview from "./LabourReportPreview";

// function LabourReport({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [ledgerEntries, setLedgerEntries] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [filteredRecords, setFilteredRecords] = useState([]);
//        const [selectedProject, setSelectedProject] = useState(''); // For project filtering
//     const [grandTotals, setGrandTotals] = useState({}); // State for grand totals
//     // Add Cash 
//     const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
//     const [showSearchBar, setShowSearchBar] = useState(true); // State to control search bar visibility
//     const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
//     const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record

//     // Asset Cash Modal 
//     useEffect(() => {
//         fetchLedgerEntries();
//         fetchProjects();
//     }, [selectedProject]);

//     const fetchLedgerEntries = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}//labours/${selectedProject}`);
//             setLedgerEntries(response.data);
//         } catch (error) {
//             console.error("Error fetching ledger entries:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     const fetchProjects = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
//             setProjects(response.data);
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDetails = () => {
//         setSelectedRecord({
//             date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
//             status: filteredRecords.length > 0 ? filteredRecords[0].status : '',
//             recordData: filteredRecords,
//             selectedMonth,
//             selectedYear
//         });

//         setDetailsVisible(true);
//         setShowSidebar(false);
//         setShowSearchBar(false);
//     };

//     const handleClosePreview = () => {
//         setShowSidebar(true); // Show sidebar when closing preview
//         setShowSearchBar(true); // Show search bar when closing preview
//         setDetailsVisible(false); // Hide details
//     };

//     const handleProjectChange = (projectId) => {
//         setSelectedProject(projectId);
//     };


//     return (
//         <div className='d-flex w-100 h-100 bg-white'>
//             {showSidebar && <Sidebar />}
//             <div className='w-100'>
//                 {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     {detailsVisible ? (
//                         <ExpensesCashReportPreview
//                             record={selectedRecord}
//                             onClose={handleClosePreview}
//                         />
//                     ) : (<div className="row">
//                         <div className="col-xl-12">
//                             <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
//                                 <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
//                                     <div className="col">
//                                         <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
//                                             <div className="nunito text-white">Expenses Ledger</div>
//                                             <div className=" d-flex gap-3">
//                                                 <div className='d-flex align-items-center justify-content-center gap-2'>
//                                                     <label className='nunito text-white p-0 m-0'>Project:</label>
//                                                     <select
//                                                         className="button_details overflow-hidden"
//                                                         value={selectedProject}
//                                                         onChange={(e) => handleProjectChange(e.target.value)}
//                                                     >
//                                                         <option value="">Select Project</option>
//                                                         {projects.map(proj => (
//                                                             <option key={proj.id} value={proj.id}>{proj.projectName}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                             <button onClick={handleDetails} className="button_details">
//                                                 PDF
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <hr className='m-0 p-0' />
//                                 <div className=''>
//                                     <div className="card-body">
//                                         <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
//                                             {isLoading ? (
//                                                 <div className="d-flex justify-content-center align-items-center">
//                                                     <ThreeDots color="#00BFFF" height={80} width={80} />
//                                                 </div>
//                                             ) : (
//                                                 <table className="table table-bordered" style={{ width: "100%" }}>
//                                                     <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                         <tr>
//                                                             <th>S.No</th>
//                                                             <th>Labour Name</th>
//                                                             <th>Labour ID</th>
//                                                             <th>Mobile</th>
//                                                             <th>Day Shift (Rs)</th>
//                                                             <th>Night Shift (Rs)</th>
//                                                             <th>OverTime (Per Hrs)</th>

//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {filteredRecords.length === 0 ? (
//                                                             <tr>
//                                                                 <td colSpan="5" className="text-center">No Ledger Entries.</td>
//                                                             </tr>
//                                                         ) : (
//                                                             filteredRecords.map((entry, index) => (
//                                                                 <tr key={index}>
//                                                                     <td>{index + 1}</td> {/* Serial number */}
//                                                                     <td>{entry.labourName}</td>
//                                                                     <td>{entry.labourId}</td>
//                                                                     <td>{entry.MobileNo}</td>
//                                                                     <td>{entry.dayShift}</td>
//                                                                     <td>{entry.nightShift}</td>
//                                                                     <td>{entry.overtimeHrs}</td>                                                                    
//                                                                 </tr>
//                                                             ))
//                                                         )}
//                                                     </tbody>
//                                                 </table>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LabourReport;










import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import LabourReportPreview from "./LabourReportPreview";

function LabourReport({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedProject, setSelectedProject] = useState(""); // For project filtering
    // Add Cash 
    const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
    const [showSearchBar, setShowSearchBar] = useState(true); // State to control search bar visibility
    const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
    const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record



    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchLedgerEntries(selectedProject);
        }
    }, [selectedProject]); // Include month and year in dependency array

    const fetchLedgerEntries = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourproject/${projectId}`);
            console.log("data", response.data);
            setFilteredRecords(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
            toast.error("Failed to fetch ledger entries");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetails = () => {
        setSelectedRecord({
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            status: filteredRecords.length > 0 ? filteredRecords[0].status : '',
            recordData: filteredRecords,
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

    // Handle project selection
    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
    };

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            {showSidebar && <Sidebar />}
            <div className='w-100'>
                {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
                <div className="container-fluid">
                    <ToastContainer />
                    {detailsVisible ? (
                        <LabourReportPreview
                            record={selectedRecord}
                            onClose={handleClosePreview}
                        />
                    ) : (
                        <div className="row">
                            <div className="col-xl-12">
                                <div
                                    style={{ borderRadius: "20px", border: "1px solid #00509d" }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        style={{ backgroundColor: "#00509d" }}
                                        className="row no-gutters align-items-center p-3"
                                    >
                                        <div className="col">
                                            <div
                                                className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between"
                                                style={{ fontSize: "1.5rem" }}
                                            >
                                                <div className="nunito text-white">Labour List Report</div>
                                                <div className="d-flex gap-3">
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <label className="nunito text-white p-0 m-0">Project:</label>
                                                        <select
                                                            className="button_details overflow-hidden"
                                                            value={selectedProject}
                                                            onChange={(e) => handleProjectChange(e.target.value)}
                                                        >
                                                            <option value="">Select Project</option>
                                                            {projects.map((proj) => (
                                                                <option key={proj.id} value={proj.id}>
                                                                    {proj.projectName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button onClick={handleDetails} className="button_details">
                                                        PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="m-0 p-0" />
                                    <div className="">
                                        <div className="card-body">
                                            <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
                                                {isLoading ? (
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <ThreeDots color="#00BFFF" height={80} width={80} />
                                                    </div>
                                                ) : (
                                                    <table
                                                        className="table table-bordered"
                                                        style={{ width: "100%" }}
                                                    >
                                                        <thead
                                                            style={{
                                                                position: "sticky",
                                                                top: "0",
                                                                zIndex: "1",
                                                                backgroundColor: "#fff",
                                                            }}
                                                        >
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Labour Name</th>
                                                                <th>Labour ID</th>
                                                                <th>Mobile</th>
                                                                <th>Day Shift (Rs)</th>
                                                                <th>Night Shift (Rs)</th>
                                                                <th>Half Day (Rs)</th>
                                                                <th>OverTime (Per Hrs)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredRecords.length === 0 ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan="7"
                                                                        className="text-center"
                                                                    >
                                                                        No Ledger Entries.
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                filteredRecords.map((entry, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{entry.labourName}</td>
                                                                        <td>{entry.labourId}</td>
                                                                        <td>{entry.mobileNo}</td>
                                                                        <td className="text-end">&#x20B9;{entry.dayShift ? entry.dayShift.toFixed(2) : "0.00"}</td>
                                                                        <td className="text-end">&#x20B9;{entry.nightShift ? entry.nightShift.toFixed(2) : "0.00"}</td>
                                                                        <td className="text-end">&#x20B9;{entry.halfDayShift ? entry.halfDayShift.toFixed(2) : "0.00"}</td>
                                                                        <td className="text-end">&#x20B9;{entry.overtimeHrs ? entry.overtimeHrs.toFixed(2) : "0.00"}</td>
                                                                    </tr>
                                                                ))
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

export default LabourReport;

