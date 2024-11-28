import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';  // For loading spinner
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";
import ViewPicture from "./ViewPicture";
import UpdateProjectEntry from "../../UpdateProjectEntry.jsx/UpdateProjectEntry";

function ViewLedger({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedviewpicture, setSelectedviewpicture] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(); // Initialize with current month (+1 since months are 0-indexed)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year
    const projectId = localStorage.getItem('projectId');
    const [isMakeChangesModalOpen, setIsMakeChangesModalOpen] = useState(false);
    const [makeChanges, setMakeChanges] = useState(null);
    // Add button  
    const [isViewPictureOpen, setIsAddViewPictureOpen] = useState(false); // State to manage modal open/close
    console.log("projectId", projectId);

    useEffect(() => {
        if (projectId) {
            fetchLedgerEntries(projectId);
        }
    }, [projectId]);

    const fetchLedgerEntries = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/viewledger/${projectId}`);
            setLedgerEntries(response.data);
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        filterRecords();
    }, [selectedMonth, selectedYear, ledgerEntries]);

    const filterRecords = () => {
        // Filter the ledger entries based on the selected project, month, and year
        const filtered = ledgerEntries.filter(record => {
            const date = new Date(record.date);
            const isMonthMatch = selectedMonth ? date.getMonth() + 1 === selectedMonth : true; // +1 because JS months are 0-based
            const isYearMatch = selectedYear ? date.getFullYear() === selectedYear : true;
            return isMonthMatch && isYearMatch;
        });

        // Update the state with filtered records
        setFilteredRecords(filtered);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    // Add Entery
    const handleViewpictureModal = (request) => {
        setSelectedviewpicture(request)
        setIsAddViewPictureOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddViewPictureOpen(false);
    };

    // Make changes 
    const handleMakeChanges = (request) => {
        setMakeChanges(request);
        setIsMakeChangesModalOpen(true);
    };
    //   Handle Update 
    const handleUpdate = () => {
        toast.success("successfully uploaded");
        // window.location.reload();
    }

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            <SidebarEmployee />
            <div className='w-100 bg-white'>
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    <div className="row">
                        <div className="col-xl-12 p-0 mt-2">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Expenses Ledger</div>
                                            <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
                                                <label className='nunito text-white p-0 m-0 userfont'>Filter:</label>
                                                <select
                                                    className="button_details"
                                                    value={selectedMonth}
                                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                                >
                                                    <option value="">Select Month</option>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <option key={i} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    className="button_details"
                                                    value={selectedYear}
                                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                                >
                                                    <option value="">Select Year</option>
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                                    ))}
                                                </select>
                                            </div>
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
                                                                            {/* <span>Date: </span>{formatDate(request.date)} */}
                                                                            <span>Date: </span>{new Date(request.date).toLocaleDateString('en-GB')}
                                                                        </p>
                                                                        <p className="tablefont nunito m-0 p-0">
                                                                            <span>Head: </span>{request.headName}
                                                                        </p>
                                                                        <p className="nunito mb-0 lh-1 fs-14 fw-medium tablefont mt-1">
                                                                            <span className='fw-bolder '>Description: </span>{request.description}
                                                                        </p>
                                                                    </div>
                                                                    <div className='text-end'>
                                                                        <p className="tablefont nunito m-0 p-0">
                                                                            <span>Amt: </span>&#x20B9;{request.amount.toFixed(2)}
                                                                        </p>
                                                                        <p style={{
                                                                                    color: request.picture ? "yellow" : "black",
                                                                                    cursor: "pointer",
                                                                                    whiteSpace: "nowrap"
                                                                                }} onClick={() => handleViewpictureModal(request)} className="tablefont nunito m-0 p-0">
                                                                        <i class="fa-solid fa-eye"></i> view
                                                                        </p>
                                                                        {request.isEditable && (
                                                                            <p style={{ color: "yellow", cursor: "pointer",whiteSpace:"nowrap" }} onClick={() => handleMakeChanges(request)} className="tablefont nunito m-0 p-0">
                                                                                <i className="fas fa-edit"></i> Modify
                                                                            </p>
                                                                        )}
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
            {isViewPictureOpen && (
                <ViewPicture
                    ViewPicture={selectedviewpicture}
                    onClose={handleCloseModal}
                />
            )}
            {isMakeChangesModalOpen && (
                <UpdateProjectEntry
                    ledgerChanges={makeChanges}
                    onClose={() => setIsMakeChangesModalOpen(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}

export default ViewLedger;





