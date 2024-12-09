import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import EditLabour from "./EditLabour";
import AddLabour from "./AddLabour";
import LabourDetails from "./LabourDetails";

function LabourList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [labour, setLabour] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedProject, setSelectedProject] = useState(''); // For project filtering
    const [isLabourEdit, setIsEditLabour] = useState(false);
    const [labourDetails, setLabourDetails] = useState(null);
    // Delete  
    const [deleteLabour, setDeleteLabour] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    // Add Labour
    const [isAddLabour, setIsAddLabour] = useState(false);
    // Show Labour Details
    const [showLabourDetails, setShowLabourDetails] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    // Labour Modal 
    const handleAddLabourModal = () => {
        setIsAddLabour(true);
    };

    const handleCloseAddLabourModal = () => {
        setIsAddLabour(false);
    };

    useEffect(() => {
        fetchlabour();
        fetchProjects();
    }, []);

    useEffect(() => {
        filterRecords();
    }, [selectedProject, labour]);

    const fetchlabour = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours`);
            setLabour(response.data);
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = () => {
        toast.success("Successfully updated");
    };

    const filterRecords = () => {
        // Filter the ledger entries based on the selected project, month, and year
        const filtered = labour.filter(record => {
            const date = new Date(record.date);
            const isProjectMatch = selectedProject ? record.projectId === parseInt(selectedProject) : true;
            return isProjectMatch;
        });
        // Update the state with filtered records
        setFilteredRecords(filtered);
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
    };

    // Make changes 
    const handlelabourDetails = (entry) => {
        setLabourDetails(entry);
        setIsEditLabour(true);
    };

    // DeleteConfirmationModal 
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

    // Show Labour Details 
    const handleCompanyDetails = (company) => {
        setSelectedLabour(company);
        setShowLabourDetails(true);
    };
    const handleBackToTable = () => {
        setSelectedLabour(null);
        setShowLabourDetails(false);
    };

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            <Sidebar />
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    {!showLabourDetails && (
                        <div className="row">
                            <div className="col-xl-12">
                                <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white">Labour List</div>
                                                <div className=" d-flex gap-3">
                                                    <div className='d-flex align-items-center justify-content-center gap-2'>
                                                        <label className='nunito text-white p-0 m-0'>Project:</label>
                                                        <select
                                                            className="button_details overflow-hidden"
                                                            value={selectedProject}
                                                            onChange={(e) => handleProjectChange(e.target.value)}
                                                        >
                                                            <option value="">Select Project</option>
                                                            {projects.map(proj => (
                                                                <option key={proj.id} value={proj.id}>{proj.projectName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <button onClick={handleAddLabourModal} className="button_details"><i className="fa fa-plus"></i> Add Labour
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
                                                                    <td colSpan="5" className="text-center">No Ledger Entries.</td>
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

                                                                            <button style={{ whiteSpace: "nowrap" }} onClick={() => handlelabourDetails(entry)} className="tablefont nunito m-0 p-1 button_action">
                                                                                <i className="fas fa-edit"></i> Modify
                                                                            </button>
                                                                            <button style={{ whiteSpace: "nowrap" }} onClick={() => handleCompanyDetails(entry)} className="tablefont nunito m-0 p-1 button_action">
                                                                                <i className="fas fa-eye"></i> View
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
                                    {isAddLabour && <AddLabour onClose={handleCloseAddLabourModal} onUpdate={handleUpdate} />}
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
                    )}
                    {showLabourDetails && selectedLabour && (
                        <LabourDetails
                            labour={selectedLabour}
                            onClose={handleBackToTable}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default LabourList;
