import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner';  // <-- Spinner import
import Approve_Reject from "./Approve_Reject"; // Make sure this component is created

function FundRequestList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [fundRequest, setfundRequest] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [fundRequestData, setfundRequestData] = useState(null);

    useEffect(() => {
        fetchfundRequest();
    }, []);

    const fetchfundRequest = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/fundrequest`);
            // Filter the data to only include items with status "Request"
            const filteredRequests = response.data.filter(request => request.status === "Request");
            setfundRequest(filteredRequests);
        } catch (error) {
            console.error("Error fetching fund requests:", error);
            toast.error("Failed to fetch fund requests.");
        } finally {
            setIsLoading(false);
        }
    };
    // Handle Fund Request
    const handleFundRequest = (fundRequest) => {
        setfundRequestData(fundRequest);
        setIsEditModalOpen(true);
    };

    // Handle Update Fund Request
    const handleUpdate = () => {
        toast.success("Successfully updated fund request");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} `;
    };


    return (
        <div className='d-flex w-100 h-100 bg-white'>
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
                                            <div className="nunito text-white">Fund Request</div>
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
                                                            <th>Date</th>
                                                            <th>Project Name</th>
                                                            <th>Supervisor</th>
                                                            <th>Request Amt.</th>
                                                            <th>Description</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {fundRequest.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="6" className="text-center">No Fund Requests Found</td>
                                                            </tr>
                                                        ) : (
                                                            fundRequest.map((head, index) => (
                                                                <tr key={index}>
                                                                    <td>{new Date(head.requestdate).toLocaleDateString('en-GB')}</td>
                                                                    <td>{head.projectName}</td>
                                                                    <td>{head.supervisorName}</td>
                                                                    <td>{head.requestAmount}</td>
                                                                    <td>{head.requestdescription}</td>
                                                                    <td>
                                                                        <button className="tablefont nunito m-0 p-1 button_action" onClick={() => handleFundRequest(head)}>
                                                                            Action
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
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <Approve_Reject
                    fundRequest={fundRequestData}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}

export default FundRequestList;
