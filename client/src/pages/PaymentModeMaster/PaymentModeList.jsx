import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteConfirmationModal from '../DeleteConfirmationModal'; // Replace with actual DeleteConfirmationModal path
import Sidebar from '../../components/sidebar/Sidebar'; // Replace with actual Sidebar path
import SearchBar from '../../components/sidebar/SearchBar'; // Replace with actual SearchBar path
import { toast, ToastContainer } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css';
import AddPaymentMode from './AddPaymentMode'; // Assuming AddPaymentMode is the modal for adding/editing
import PaymentDetails from './PaymentDetails'; // Assuming this is the component for showing details
import { ThreeDots } from 'react-loader-spinner';  // Correct import for spinner
import EditPayment from './EditPayment';

function PaymentModeList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentModes, setPaymentModes] = useState([]);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
    const [showPaymentModeDetails, setShowPaymentModeDetails] = useState(false);
    const [isAddPaymentModeModalOpen, setIsAddPaymentModeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editPaymentMode, setEditPaymentMode] = useState(null);
    const [deletePaymentMode, setDeletePaymentMode] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    const fetchPaymentModes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/paymentmodes`);
            setPaymentModes(response.data);
        } catch (error) {
            console.error('Error fetching payment modes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentModes();
    }, []);

    const handleAddPaymentMode = () => {
        setIsAddPaymentModeModalOpen(true);
    };

    const handleClosePaymentModeModal = () => {
        setIsAddPaymentModeModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handlePaymentModeDetails = (paymentMode) => {
        setSelectedPaymentMode(paymentMode);
        setShowPaymentModeDetails(true);
    };

    const handleEditPaymentMode = (paymentMode) => {
        setEditPaymentMode(paymentMode);
        setIsEditModalOpen(true);
    };

    const handleDeletePaymentMode = (paymentMode) => {
        setDeletePaymentMode(paymentMode);
        setIsDeleteModalOpen(true);
    };

    const confirmDeletePaymentMode = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL}/paymentmodes/${deletePaymentMode.id}`);
            const deletedPaymentMode = { ...deletePaymentMode, reason: deleteReason };
            await axios.post(`${process.env.REACT_APP_LOCAL_URL}/delete_details`, deletedPaymentMode);
            setPaymentModes((prevPaymentModes) =>
                prevPaymentModes.filter((paymentMode) => paymentMode.id !== deletePaymentMode.id)
            );
            setIsDeleteModalOpen(false);
            toast.success('Successfully Deleted');
        } catch (error) {
            console.error("Error deleting Payment Mode:", error);
        }
    };

    const handleUpdatePaymentModes = () => {
        toast.success('Payment mode data updated successfully');
        fetchPaymentModes();
    };

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            <Sidebar />
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    {showPaymentModeDetails ? (
                        <PaymentDetails paymentMode={selectedPaymentMode} onClose={() => setShowPaymentModeDetails(false)} />
                    ) : (
                        <div className="row">
                        <div className="col-xl-12">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white" >Payment Mode List
                                            </div>
                                            <button style={{whiteSpace:"nowrap"}} onClick={handleAddPaymentMode} className="button_details">
                                            <i className="fa fa-plus"></i> Add New Payment Mode
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
                                                        <th>Payment Mode Name</th>
                                                        <th>Payment Type</th>
                                                        <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <style>
                                                            {`.hyperlink:hover { color: #00509d; }`}
                                                        </style>
                                                        {paymentModes && (
                                                            <>
                                                                {paymentModes.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="12" className="text-center">No Payment Mode.</td>
                                                                    </tr>
                                                                ) : (
                                                                    paymentModes.map((paymentMode) => (
                                                                        <tr key={paymentMode.id}>
                                                                            <td className='hyperlink' style={{ cursor: "pointer" }} onClick={() => handlePaymentModeDetails(paymentMode)}>
                                                                                {paymentMode.paymentModeName}
                                                                            </td>
                                                                            <td>{paymentMode.paymentType}</td>
                                                                            <td>
                                                                                <div className="d-flex align-item-center justify-content-start gap-3">
                                                                                    <div className="btn-group">
                                                                                        <button className="button_action" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <div className="dropdown-menu actionmenu" x-placement="bottom-start">
                                                                                            <button style={{whiteSpace:"nowrap"}} className="dropdown-item" onClick={() => handlePaymentModeDetails(paymentMode)}>
                                                                                                <i className="fa fa-file"></i> Details
                                                                                            </button>
                                                                                            <button style={{whiteSpace:"nowrap"}} className="dropdown-item" onClick={() => handleEditPaymentMode(paymentMode)}>
                                                                                                <i className="fas fa-edit"></i> Edit
                                                                                            </button>
                                                                                            <button style={{whiteSpace:"nowrap"}} className="dropdown-item" onClick={() => handleDeletePaymentMode(paymentMode)}>
                                                                                                <i className="fa fa-trash"></i> Delete
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
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
                    {isAddPaymentModeModalOpen && <AddPaymentMode onClose={handleClosePaymentModeModal} onUpdate={handleUpdatePaymentModes} />}
                    {isEditModalOpen && <EditPayment paymentMode={editPaymentMode} onClose={handleClosePaymentModeModal} onUpdate={handleUpdatePaymentModes} />}
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        itemName={deletePaymentMode ? deletePaymentMode.paymentModeName : ""}
                        onDelete={confirmDeletePaymentMode}
                        onClose={() => setIsDeleteModalOpen(false)}
                        deleteReason={deleteReason}
                        setDeleteReason={setDeleteReason}
                    />
                </div>
            </div>
        </div>
    );
}

export default PaymentModeList;
