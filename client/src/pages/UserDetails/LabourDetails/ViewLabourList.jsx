// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ThreeDots } from 'react-loader-spinner'; // Spinner
// import ViewLabourDetails from "./ViewLabourDetails";
// import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
// import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

// function ViewLabourList({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [labour, setLabour] = useState([]);
//     const [labourDetails, setLabourDetails] = useState(null);
//     const [showLabourDetails, setShowLabourDetails] = useState(false);
//     const [selectedLabour, setSelectedLabour] = useState(null);
//     const projectId = localStorage.getItem("projectId");

//     useEffect(() => {
//         if (projectId) {
//             fetchlabour(projectId);
//         }
//     }, [projectId]);

//     const fetchlabour = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
//             setLabour(response.data);
//         } catch (error) {
//             console.error("Error fetching ledger entries:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleUpdate = () => {
//         toast.success("Successfully updated");
//     };


//     // Make changes 
//     const handlelabourDetails = (entry) => {
//         setLabourDetails(entry);
//     };

//     // Show Labour Details 
//     const handleCompanyDetails = (company) => {
//         setSelectedLabour(company);
//         setShowLabourDetails(true);
//     };

//     return (
//         <div className='d-flex w-100 h-100 bg-white'>
//             <SidebarEmployee />
//             <div className='w-100'>
//                 <SearchBarEmployee username={username} handleLogout={handleLogout} />
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     {!showLabourDetails && (
//                         <div className="row">
//                             <div className="col-xl-12">
//                                 <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
//                                     <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
//                                         <div className="col">
//                                             <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
//                                                 <div className="nunito text-white">View Labour List</div>
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
//                                                                 <th>Project Name</th>
//                                                                 <th>Labor Name</th>
//                                                                 <th>Labour Id</th>
//                                                                 <th>Mobile No.</th>
//                                                                 <th>Action</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {filteredRecords.length === 0 ? (
//                                                                 <tr>
//                                                                     <td colSpan="5" className="text-center">No Ledger Entries.</td>
//                                                                 </tr>
//                                                             ) : (
//                                                                 filteredRecords.map((entry, index) => (
//                                                                     <tr key={index}>

//                                                                         <td>{entry.projectShortName}</td>
//                                                                         <td>{entry.labourName}</td>
//                                                                         <td>{entry.labourId}</td>
//                                                                         <td>{entry.mobileNo}</td>
//                                                                         <td>
//                                                                             <button style={{ whiteSpace: "nowrap" }} onClick={() => handleCompanyDetails(entry)} className="tablefont nunito m-0 p-1 button_action">
//                                                                                 <i className="fas fa-eye"></i> View
//                                                                             </button>
//                                                                         </td>
//                                                                     </tr>
//                                                                 ))
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
//                     {showLabourDetails && selectedLabour && (
//                         <ViewLabourDetails
//                             labour={selectedLabour}
//                             onClose={handleBackToTable}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ViewLabourList;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import ViewLabourDetails from "./ViewLabourDetails";
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import EditLabour from "../../LabourMaster/EditLabour";

function ViewLabourList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [labour, setLabour] = useState([]);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [showLabourDetails, setShowLabourDetails] = useState(false);
    const projectId = localStorage.getItem("projectId");
    // Edit Labour 
    const [isLabourEdit, setIsEditLabour] = useState(false);
    const [labourDetails, setLabourDetails] = useState(null);
    // Delete  
    const [deleteLabour, setDeleteLabour] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    // DeleteConfirmationModal 
    // Make changes 
    const handlelabourDetails = (entry) => {
        setLabourDetails(entry);
        setIsEditLabour(true);
    };

    const handleDeleteLabour = (entry) => {
        setDeleteLabour(entry);
        setIsDeleteModalOpen(true);
    };
    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL}/deletelabour/${deleteLabour.id}`);
            setLabour((prevlabour) =>
                prevlabour.filter((entry) => entry.id !== deleteLabour.id)
            );
            setIsDeleteModalOpen(false);
            toast.success("Successfully Delete");
            console.log("entry deleted successfully");
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    // Edit Delete 
    useEffect(() => {
        if (projectId) {
            fetchLabour();
        }
    }, [projectId]);

    const fetchLabour = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
            setLabour(response.data);
        } catch (error) {
            console.error("Error fetching labour details:", error);
            toast.error("Failed to fetch labour details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (labourEntry) => {
        setSelectedLabour(labourEntry);
        setShowLabourDetails(true);
    };

    const handleBackToTable = () => {
        setShowLabourDetails(false);
        setSelectedLabour(null);
    };

    const filteredRecords = labour; // Assuming no filtering logic is applied yet

    const handleUpdate = () => {
        toast.success("Successfully updated");
    };

    return (
        <div className="d-flex w-100 h-100 bg-white">
            <SidebarEmployee />
            <div className="w-100">
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid p-0">
                    <ToastContainer />
                    {!showLabourDetails ? (
                        <div>
                            <div className="row laptop px-4">
                                <div className="col-xl-12 p-0 mt-2">
                                    <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className="overflow-hidden">
                                        <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                            <div className="col">
                                                <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                    <div className="nunito text-white">Labour List</div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="m-0 p-0" />
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
                                                                <th>S.No</th>
                                                                <th>Labour Name</th>
                                                                <th>Labour ID</th>
                                                                <th>Mobile No.</th>
                                                                <th>Project Name</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredRecords.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="12" className="text-center">No Labour Entries.</td>
                                                                </tr>
                                                            ) : (
                                                                filteredRecords.map((entry, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td> {/* Serial Number */}
                                                                        <td>{entry.labourName}</td>
                                                                        <td>{entry.labourId}</td>
                                                                        <td>{entry.mobileNo}</td>
                                                                        <td>{entry.projectShortName}</td>
                                                                        <td>
                                                                            <button
                                                                                style={{ whiteSpace: "nowrap" }}
                                                                                onClick={() => handleViewDetails(entry)}
                                                                                className="tablefont nunito m-0 p-1 button_action"
                                                                            >
                                                                                <i className="fas fa-eye"></i> View
                                                                            </button>
                                                                            <button style={{ whiteSpace: "nowrap" }} onClick={() => handlelabourDetails(entry)} className="tablefont nunito m-0 p-1 button_action">
                                                                                <i className="fas fa-edit"></i> Modify
                                                                            </button>
                                                                            <button style={{ whiteSpace: "nowrap" }} onClick={() => handleDeleteLabour(entry)} className="tablefont nunito m-0 p-1 button_action">
                                                                                <i className="fa fa-trash"></i> Delete
                                                                            </button>
                                                                        </td>
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

                            <div className="row phone px-4">
                                <div className="col-xl-12 p-0 mt-2">
                                    <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                        <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                            <div className="col">
                                                <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                                    <div className="nunito text-white userfont">Labour List</div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className='m-0 p-0' />
                                        <div className=''>
                                            <div className="card-body">
                                                <div className='forresponsive'>
                                                    {isLoading ? (
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <ThreeDots color="#00BFFF" height={80} width={80} />
                                                        </div>
                                                    ) : filteredRecords.length === 0 ? (
                                                        <p className="nunito tablefont text-black text-center text-muted">No Expenses</p>
                                                    ) : (
                                                        filteredRecords.map((request, index) => (
                                                            <div key={index}
                                                                style={{ border: "1px solid #00509d", borderRadius: "10px", background: "linear-gradient(9deg, rgba(64,163,160,1) 19%, #00509d 93%)" }}
                                                                className="p-1 m-1 text-white"
                                                            >
                                                                <div className="d-flex align-items-start p-1">
                                                                    <div className='w-100'>
                                                                        <div className='tabledetails'>
                                                                            <div className=''>
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    {request.projectShortName}
                                                                                </p>
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    <span>Labour Id: </span>{request.labourId}
                                                                                </p>
                                                                            </div>
                                                                            <div className='text-end'>
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    <span>Mobile No: </span>{request.mobileNo}
                                                                                </p>
                                                                                <div className="">
                                                                                    <button
                                                                                        style={{ whiteSpace: "nowrap" }}
                                                                                        onClick={() => handleViewDetails(request)}
                                                                                        className="button_details py-0 px-1 tablefont mx-1"
                                                                                    >
                                                                                        View
                                                                                    </button>
                                                                                    <button
                                                                                        style={{ whiteSpace: "nowrap" }}
                                                                                        onClick={() => handlelabourDetails(request)}
                                                                                        className="button_details py-0 px-1 tablefont mx-1"
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                    <button
                                                                                        style={{ whiteSpace: "nowrap" }}
                                                                                        onClick={() => handleDeleteLabour(request)}
                                                                                        className="button_details py-0 px-1 tablefont mx-1"
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <ViewLabourDetails
                            labour={selectedLabour}
                            onClose={handleBackToTable}
                        />
                    )}
                    {isLabourEdit && (
                        <EditLabour
                            labourDetails={labourDetails}
                            onClose={() => setIsEditLabour(false)}
                            onUpdate={handleUpdate}
                        />
                    )}
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        itemName={deleteLabour ? deleteLabour.projectName : ""}
                        onDelete={handleDeleteConfirmation}
                        onClose={() => setIsDeleteModalOpen(false)}
                        deleteReason={deleteReason}
                        setDeleteReason={setDeleteReason}
                    />
                </div>
            </div>
        </div>
    );
}

export default ViewLabourList;
