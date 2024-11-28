import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner';  // <-- Spinner import
import AddHead from "./AddHead";
import EditHead from "./EditHead";
import DeleteConfirmationModal from "../DeleteConfirmationModal";


function HeadList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [heads, setHeads] = useState([]);
    const [isHeadModalOpen, setIsAddHeadModalOpen] = useState(false); // State to manage modal open/close
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [isMakeChangesModalOpen, setIsMakeChangesModalOpen] = useState(false);
    const [makeChanges, setMakeChanges] = useState(null);
    // Delete  
    const [deleteHead, setDeleteHead] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    useEffect(() => {
        fetchHeads();
    }, []);

    const fetchHeads = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/heads`);
            setHeads(response.data);
        } catch (error) {
            console.error("Error fetching heads:", error);
        } finally {
            setIsLoading(false);
        }
    };
    // Add Head 
    const handleAddHeadModal = () => {
        setIsAddHeadModalOpen(true);
    };

    const handleCloseHeadModal = () => {
        setIsAddHeadModalOpen(false);
    };

    // Make changes 
    const handleMakeChanges = (head) => {
        setMakeChanges(head);
        setIsMakeChangesModalOpen(true);
    };


    const handleUpdate = () => {
        toast.success("successfully uploaded");
        // window.location.reload();
    }

    // DeleteConfirmationModal 
    const handleDeleteHead = (head) => {
        setDeleteHead(head);
        setIsDeleteModalOpen(true);
    };


    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL}/deletehead/${deleteHead.id}`);
            setHeads((prevHead) =>
                prevHead.filter((head) => head.id !== deleteHead.id)
            );
            setIsDeleteModalOpen(false);
            toast.success("Successfully Delete");
            console.log("head deleted successfully");
        } catch (error) {
            console.error("Error deleting head:", error);
        }
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = heads.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            {<Sidebar />}
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
                                            <div className="nunito text-white">Head List</div>
                                            <button style={{whiteSpace:"nowrap"}} onClick={handleAddHeadModal} className="button_details">
                                            <i className="fa fa-plus"></i> Add Head
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
                                                            <th>Head Name</th>
                                                            <th>Description</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {heads && (
                                                            <>
                                                                {currentItems.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="2" className="text-center">No Heads Found</td>
                                                                    </tr>
                                                                ) : (
                                                                    currentItems.map((head, index) => (
                                                                        <tr key={index}>
                                                                            <td>{head.headName}</td>
                                                                            <td>{head.description}</td>
                                                                            <td> <button style={{whiteSpace:"nowrap"}} onClick={() => handleMakeChanges(head)} className="tablefont nunito m-0 p-1 button_action">
                                                                            <i className="fas fa-edit"></i> Edit
                                                                            </button>
                                                                                <button style={{whiteSpace:"nowrap"}} onClick={() => handleDeleteHead(head)} className="tablefont nunito m-0 p-1 button_action">
                                                                                <i className="fa fa-trash"></i> Delete
                                                                                </button>
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
                                                    {Array.from({ length: Math.ceil(heads.length / itemsPerPage) }, (_, i) => (
                                                        <li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                                                            <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1}</a>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === Math.ceil(heads.length / itemsPerPage) && "disabled"}`}>
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
                </div>
            </div>
            {isHeadModalOpen && <AddHead onClose={handleCloseHeadModal} onUpdate={handleUpdate} />}

            {isMakeChangesModalOpen && (
                <EditHead
                    headdetails={makeChanges}
                    onClose={() => setIsMakeChangesModalOpen(false)}
                    onUpdate={handleUpdate}
                />
            )}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                itemName={deleteHead ? deleteHead.headName : ""}
                onDelete={handleDeleteConfirmation}
                onClose={() => setIsDeleteModalOpen(false)}
                deleteReason={deleteReason}
                setDeleteReason={setDeleteReason}
            />
        </div>
    );
}

export default HeadList;
