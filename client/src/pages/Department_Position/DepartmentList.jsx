import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDepartmentModal from './AddDepartmentModal'; // Replace with your actual modal component
import DepartmentDesc from './DepartmentDesc'; // Replace with actual DepartmentDesc component
import AddPositionModal from './AddPositionModal'; // Replace with actual AddPositionModal component
import DeleteConfirmationModal from '../DeleteConfirmationModal'; // Replace with actual DeleteConfirmationModal path
import Sidebar from '../../components/sidebar/Sidebar'; // Replace with actual Sidebar path
import SearchBar from '../../components/sidebar/SearchBar'; // Replace with actual SearchBar path
import { toast, ToastContainer } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
import EditDepartment from './EditDepartment';

function DepartmentList({ handleLogout, username }) {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false); // State for loading status
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);
    const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState(null);
    const [deleteDepartment, setDeleteDepartment] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    const fetchDepartments = async () => {
        setLoading(true); // Set loading to true before fetching data
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/departments`);
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDepartment = () => {
        setIsAddDepartmentModalOpen(true);
    };

    const handleCloseDepartmentModal = () => {
        setIsAddDepartmentModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleDepartmentDetails = (department) => {
        setSelectedDepartment(department);
        setShowDepartmentDetails(true);
    };

    const handleEditDepartment = (department) => {
        setEditDepartment(department);
        setIsEditModalOpen(true);
    };

    const handleDeleteDepartment = (department) => {
        setDeleteDepartment(department);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteDepartment = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL}/departments/${deleteDepartment.id}`);
            const deletedDepartment = { ...deleteDepartment, reason: deleteReason };
            await axios.post(`${process.env.REACT_APP_LOCAL_URL}/delete_details`, deletedDepartment);
            setDepartments((prevDepartments) =>
                prevDepartments.filter((department) => department.id !== deleteDepartment.id)
            );
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting Department:", error);
        }
    };

    const handleUpdateDepartments = () => {
        toast.success('Department data updated successfully'); // Display toast notification
        fetchDepartments();
    };


    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {<Sidebar />}
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    {showDepartmentDetails ? (
                        <DepartmentDesc department={selectedDepartment} onClose={() => setShowDepartmentDetails(false)} />
                    ) : (
                        <div className="row">
                            <div className="col-xl-12">
                                <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >Department List
                                                </div>
                                                <button onClick={handleAddDepartment} className="button_details">
                                                <i className="fa fa-plus"></i> Add New Department
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className=''>
                                        <div className="card-body">
                                            <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
                                                {loading ? (
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        {/* Correct usage of spinner */}
                                                        <ThreeDots color="#00BFFF" height={80} width={80} />
                                                    </div>
                                                ) : (
                                                    <table className="table table-bordered" style={{ width: "100%" }}>
                                                        <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                            <tr>
                                                                <th>Department Name</th>
                                                                <th>Description</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <style>
                                                                {`.hyperlink:hover { color: #00509d; }`}
                                                            </style>
                                                            {departments && (
                                                                <>
                                                                    {departments.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan="12" className="text-center">There are No Employees.</td>
                                                                        </tr>
                                                                    ) : (
                                                                        departments.map((department) => (
                                                                            <tr key={department.id}>
                                                                                <td className='hyperlink' style={{ cursor: "pointer" }} onClick={() => handleDepartmentDetails(department)}>{department.name}</td>
                                                                                <td>{department.description}</td>
                                                                                <td>
                                                                                    <div className="d-flex align-item-center justify-content-start gap-3">
                                                                                        <div className="btn-group">
                                                                                            <button className="button_action" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                                                            </button>
                                                                                            <div className="dropdown-menu actionmenu" x-placement="bottom-start">
                                                                                                <a className="dropdown-item" href="javascript:void(0);" onClick={() => handleDepartmentDetails(department)}>
                                                                                                    <i className="fa fa-file"></i> Details
                                                                                                </a>
                                                                                                {/* Uncomment the below code to add edit and delete functionality */}
                                                                                                <a className="dropdown-item" href="#" onClick={() => handleEditDepartment(department)}>
                                                                                                    <i className="fas fa-edit"></i> Edit
                                                                                                </a>
                                                                                                <a className="dropdown-item" href="#" onClick={() => handleDeleteDepartment(department)}>
                                                                                                    <i className="fa fa-trash"></i> Delete
                                                                                                </a>
                                                                                            </div>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isAddDepartmentModalOpen && <AddDepartmentModal onClose={handleCloseDepartmentModal} onUpdate={handleUpdateDepartments} />}
                    {isEditModalOpen && <EditDepartment department={editDepartment} onClose={handleCloseDepartmentModal} onUpdate={handleUpdateDepartments} />}
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        itemName={deleteDepartment ? deleteDepartment.name : ""}
                        onDelete={confirmDeleteDepartment}
                        onClose={() => setIsDeleteModalOpen(false)}
                        deleteReason={deleteReason}
                        setDeleteReason={setDeleteReason}
                    />
                </div>
            </div>
        </div>
    );
}

export default DepartmentList;




