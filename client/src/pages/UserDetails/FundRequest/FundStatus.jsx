import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';  // Loading spinner
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

function FundStatus({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [fundRequest, setFundRequest] = useState([]);
    const projectId = localStorage.getItem('projectId');  // Fetch projectId from localStorage

    useEffect(() => {
        if (projectId) {
            fetchRequest(projectId);
        }
    }, [projectId]);  // Re-fetch when projectId changes

    const fetchRequest = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/userfundrequest/${projectId}`);
            const filteredRequest = response.data.filter(request => request.status !== 'Request');
            setFundRequest(filteredRequest);
        } catch (error) {
            console.error("Error fetching fund requests:", error);
            toast.error("Failed to fetch fund requests.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            <SidebarEmployee />
            <div className='w-100 bg-white'>
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    <div className="row">
                        <div className="col-xl-12  p-0 mt-2">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Check Fund Status</div>
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
                                            ) : fundRequest.length === 0 ? (
                                                <p className="nunito tablefont text-black text-center text-muted">No fund status available</p>
                                            ) : (
                                                fundRequest.map((request, index) => (
                                                    <div key={index}
                                                        style={{
                                                            border: "1px solid #00509d",
                                                            borderRadius: "10px",
                                                            background: request.status === "Approved"
                                                                ? "linear-gradient(9deg, rgba(64,163,160,1) 19%, #2183d0 93%)"  // Blue for approved
                                                                : request.status === "Rejected"
                                                                ? "linear-gradient(9deg, rgba(255,0,0,1) 19%, #ff6666 93%)"  // Red for rejected
                                                                : "linear-gradient(9deg, rgba(64,163,160,1) 19%, #00509d 93%)",  // Default background
                                                        }}
                                                        className="p-1 m-1 text-white"
                                                    >
                                                        <div className="d-flex align-items-start p-1">
                                                            <div className='w-100'>
                                                                <div className=''>
                                                                    <div className="">
                                                                        <div className="tabledetails">
                                                                            <p className="tablefont nunito m-0 p-1">
                                                                                {/* <span>Request Date: </span>{formatDate(request.requestdate)} */}
                                                                                <span>Request Date: </span>{new Date(request.requestdate).toLocaleDateString('en-GB')}
                                                                            </p>
                                                                            <p className="tablefont nunito m-0 p-1">
                                                                                <span>Request Amt: </span>&#x20B9;{request.requestAmount.toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                        <hr className="p-0 m-0" />
                                                                        <div className="tabledetails">
                                                                            <p className="tablefont nunito m-0 p-1">
                                                                                <span>Description: </span>{(request.requestdescription)}
                                                                            </p>
                                                                            <p className="tablefont nunito  m-0 p-1">
                                                                                <span className="border-bottom">Request</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{borderTop:"1px solid white",margin:"3px 0px"}} className="">
                                                                        <div className="tabledetails">
                                                                            <p className="tablefont nunito m-0 p-1">
                                                                                {/* <span>Payment Date: </span>{formatDate(request.paymentDate)} */}
                                                                                <span>Payment Date: </span>{new Date(request.paymentDate).toLocaleDateString('en-GB')}
                                                                            </p>
                                                                            <p className="tablefont nunito m-0 p-1">
                                                                                <span>Paid Amt: </span>&#x20B9;{request.paidAmount.toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                        <hr className="p-0 m-0" />
                                                                        <div className="tabledetails">
                                                                            <p className="tablefont nunito m-0 p-1">
                                                                                <span>Description: </span>{(request.reason)}
                                                                            </p>
                                                                            <p className="tablefont nunito m-0 p-1">
                                                                                <span className="border-bottom">{request.status}</span>
                                                                            </p>
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
            </div>
        </div>
    );
}

export default FundStatus;

