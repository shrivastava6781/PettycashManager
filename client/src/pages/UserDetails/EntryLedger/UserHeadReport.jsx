import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import ViewPicture from "./ViewPicture";
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

function UserHeadReport({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [head, setHead] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(); // Initialize with current month (+1 since months are 0-indexed)
    const [selectedYear, setSelectedYear] = useState(); // Initialize with current year
    const [selectedHead, setSelectedHead] = useState(''); // For project filtering
    const [grandTotals, setGrandTotals] = useState({}); // State for grand totals
    // View Image  
    const [selectedviewpicture, setSelectedviewpicture] = useState(null);
    const [isViewPictureOpen, setIsAddViewPictureOpen] = useState(false); // State to manage modal open/close

    const projectId = localStorage.getItem('projectId');

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
    // Asset Cash Modal 
    useEffect(() => {
        fetchhead();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [filteredRecords]);


    useEffect(() => {
        filterRecords();
    }, [selectedMonth, selectedYear, selectedHead, ledgerEntries]);



    const fetchhead = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/heads`);
            setHead(response.data);
        } catch (error) {
            console.error("Error fetching head:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const filterRecords = () => {
        // Filter the ledger entries based on the selected project, month, and year
        const filtered = ledgerEntries.filter(record => {
            const date = new Date(record.date);
            const isHeadMatch = selectedHead ? record.headId === parseInt(selectedHead) : true;
            const isMonthMatch = selectedMonth ? date.getMonth() + 1 === selectedMonth : true; // +1 because JS months are 0-based
            const isYearMatch = selectedYear ? date.getFullYear() === selectedYear : true;
            return isHeadMatch && isMonthMatch && isYearMatch;
        });

        // Update the state with filtered records
        setFilteredRecords(filtered);
    };

    const handleAllButtonClick = () => {
        // Reset filters
        setSelectedHead('');
        setSelectedMonth('');
        setSelectedYear('');
        setFilteredRecords(ledgerEntries); // Show all records
    };

    const calculateTotals = () => {
        const totals = filteredRecords.reduce((acc, record) => {
            acc.totalProject += 1;
            acc.totalAmount += record.amount ? parseFloat(record.amount) : 0;
            return acc;
        }, {
            totalProject: 0,
            totalAmount: 0,
        });

        setGrandTotals(totals);
    };
    const handleHeadChange = (headId) => {
        setSelectedHead(headId);
    };
    // Add Entery
    const handleViewpictureModal = (entry) => {
        setSelectedviewpicture(entry)
        setIsAddViewPictureOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddViewPictureOpen(false);
    };



    return (
        <div className='d-flex w-100 h-100 bg-white'>
            {<SidebarEmployee />}
            <div className='w-100'>
                {<SearchBarEmployee username={username} handleLogout={handleLogout} />}
                <div className="container-fluid">
                    <ToastContainer />
                    <div className="row">
                        <div className="col-xl-12 p-0 mt-2">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable " style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Head Report </div>
                                            <div className="userledgertable gap-1 ">
                                                <div className='d-flex align-items-center justify-content-center gap-2 mobileline'>
                                                    <label className='nunito text-white p-0 m-0 userfont'>Head:</label>
                                                    <select
                                                        className="button_details overflow-hidden userfont"
                                                        value={selectedHead}
                                                        onChange={(e) => handleHeadChange(e.target.value)}
                                                    >
                                                        <option value="">Select Head</option>
                                                        {head.map(head => (
                                                            <option key={head.id} value={head.id}>{head.headName}</option>
                                                        ))}
                                                    </select>
                                                    <button className="button_details" onClick={handleAllButtonClick}>All</button>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center gap-2 ">
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
                                                <p className="nunito tablefont text-black text-center text-muted">No Amount Received</p>
                                            ) : (
                                                <>
                                                    {filteredRecords.map((entry, index) => (
                                                        <div key={index}
                                                            style={{ border: "1px solid #00509d", borderRadius: "10px", background: "linear-gradient(9deg, rgba(64,163,160,1) 19%, #00509d 93%)" }}
                                                            className="p-1 m-1 text-white"
                                                        >
                                                            <div className="d-flex align-items-start p-1">
                                                                <div className='w-100'>
                                                                    <div className='tabledetails'>
                                                                        <div className=''>
                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                <span>Date: </span>{new Date(entry.date).toLocaleDateString('en-GB')}
                                                                            </p>
                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                <span>Head: </span>{entry.headName}
                                                                            </p>
                                                                            <p className="nunito mb-0 lh-1 fs-14 fw-medium tablefont mt-1">
                                                                                <span className='fw-bolder '>Description: </span>{entry.description}
                                                                            </p>
                                                                        </div>
                                                                        <div className='text-end'>
                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                <span>Amt: </span>&#x20B9;{entry.amount.toFixed(2)}
                                                                            </p>
                                                                            <p
                                                                                style={{
                                                                                    color: entry.picture ? "yellow" : "black",
                                                                                    cursor: "pointer",
                                                                                    whiteSpace: "nowrap"
                                                                                }}
                                                                                onClick={() => handleViewpictureModal(entry)}
                                                                                className="tablefont nunito m-0 p-0"
                                                                            >
                                                                                <i className="fa-solid fa-eye"></i> view
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Footer section for grand totals */}
                                                    <div className="p-2 mt-2" style={{ borderTop: "2px solid #00509d" }}>
                                                        <div className="d-flex align-items-center justify-content-end">
                                                            <p className="tablefont text-success fw-bold m-0 ">
                                                                Total Amount: &#x20B9;{grandTotals.totalAmount != null ? grandTotals.totalAmount.toFixed(2) : '0.00'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
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
        </div>
    );
}

export default UserHeadReport;




