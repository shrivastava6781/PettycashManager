// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from "../../components/sidebar/Sidebar";
// import SearchBar from "../../components/sidebar/SearchBar";
// import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
// import ProjectReportPreview from "./ProjectReportPreview";


// function ProjectReport({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [projects, setProjects] = useState([]);
//     const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
//     const [showSearchBar, setShowSearchBar] = useState(true); // State to control search bar visibility
//     const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
//     const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record

//     useEffect(() => {
//         fetchProjects();
//     }, []);

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
//         status: projects.length > 0 ? projects[0].status : '',
//         recordData: projects,

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

//     return (
//         <div className='d-flex w-100 h-100 bg-white '>
//             {showSidebar && <Sidebar />}
//             <div className='w-100'>
//                 {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     {detailsVisible ? (
//                         <ProjectReportPreview
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
//                                                 <div className="nunito text-white" >Project List Report
//                                                 </div>
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
//                                                         {/* Correct usage of spinner */}
//                                                         <ThreeDots color="#00BFFF" height={80} width={80} />
//                                                     </div>
//                                                 ) : (
//                                                     <table className="table table-bordered" style={{ width: "100%" }}>
//                                                         <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                             <tr>
//                                                                 <th>Project Name</th>
//                                                                 <th>Project Type</th>
//                                                                 <th>company Name </th>
//                                                                 <th>Address</th>

//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>

//                                                             {projects && (
//                                                                 <>
//                                                                     {projects.length === 0 ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">There are No Employees.</td>
//                                                                         </tr>
//                                                                     ) : (
//                                                                         projects.map((project, index) => (
//                                                                             <tr key={index}>
//                                                                                 <td>{project.projectName}</td>
//                                                                                 <td>{project.projectType}</td>
//                                                                                 <td>{project.companyName}</td>
//                                                                                 <td>{project.projectAddress},{project.projectstate},{project.projectcity}</td>

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

// export default ProjectReport;






import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner'; // For spinner
import ProjectReportPreview from "./ProjectReportPreview";

function ProjectReport({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true); // Controls sidebar visibility
    const [showSearchBar, setShowSearchBar] = useState(true); // Controls search bar visibility
    const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
    const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record

    useEffect(() => {
        fetchProjects();
    }, []);

    // Fetch and sort projects alphabetically
    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            const sortedProjects = response.data.sort((a, b) =>
                a.projectName.localeCompare(b.projectName)
            ); // Sorting alphabetically by projectName
            setProjects(sortedProjects);
        } catch (error) {
            toast.error("Error fetching projects.");
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetails = () => {
        setSelectedRecord({
            status: projects.length > 0 ? projects[0].status : '',
            recordData: projects,
        });
        setDetailsVisible(true);
        setShowSidebar(false);
        setShowSearchBar(false);
    };

    const handleClosePreview = () => {
        setShowSidebar(true);
        setShowSearchBar(true);
        setDetailsVisible(false);
    };
    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {showSidebar && <Sidebar />}
            <div className='w-100'>
                {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
                <div className="container-fluid">
                    <ToastContainer />
                    {detailsVisible ? (
                        <ProjectReportPreview
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
                                                <div className="nunito text-white" >Project List Report
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
                                                                <th>Project Name</th>
                                                                <th>Short Name</th>
                                                                <th>Project Type</th>
                                                                <th>Company Name</th>
                                                                <th>Address</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {projects.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="5" className="text-center">No Projects Found.</td>
                                                                </tr>
                                                            ) : (
                                                                projects.map((project, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td> {/* Serial number */}
                                                                        <td>{project.projectName}</td>
                                                                        <td>{project.projectShortName}</td>
                                                                        <td>{project.projectType}</td>
                                                                        <td>{project.companyName}</td>
                                                                        <td>{`${project.projectAddress}, ${project.projectstate}, ${project.projectcity}`}</td>
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

export default ProjectReport;





