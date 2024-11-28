import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import ExpensesCashReportPreview from "./ExpensesCashReportPreview";

function ExpensesCashReport({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Initialize with current month (+1 since months are 0-indexed)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year
    const [selectedProject, setSelectedProject] = useState(''); // For project filtering
    const [grandTotals, setGrandTotals] = useState({}); // State for grand totals
    // Add Cash 
    const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
    const [showSearchBar, setShowSearchBar] = useState(true); // State to control search bar visibility
    const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
    const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record

    // Asset Cash Modal 
    useEffect(() => {
        fetchLedgerEntries();
        fetchProjects();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [filteredRecords]);


    useEffect(() => {
        filterRecords();
    }, [selectedMonth, selectedYear, selectedProject, ledgerEntries]);

    const fetchLedgerEntries = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/expensesledger`);
            setLedgerEntries(response.data);
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
    const filterRecords = () => {
        // Filter the ledger entries based on the selected project, month, and year
        const filtered = ledgerEntries.filter(record => {
            const date = new Date(record.date);
            const isProjectMatch = selectedProject ? record.projectId === parseInt(selectedProject) : true;
            const isMonthMatch = selectedMonth ? date.getMonth() + 1 === selectedMonth : true; // +1 because JS months are 0-based
            const isYearMatch = selectedYear ? date.getFullYear() === selectedYear : true;
            return isProjectMatch && isMonthMatch && isYearMatch;
        });

        // Update the state with filtered records
        setFilteredRecords(filtered);
    };

    const handleAllButtonClick = () => {
        // Reset filters
        setSelectedProject('');
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

    const handleDetails = () => {
        setSelectedRecord({
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            status: filteredRecords.length > 0 ? filteredRecords[0].status : '',
            recordData: filteredRecords,
            selectedMonth,
            selectedYear
        });

        setDetailsVisible(true);
        setShowSidebar(false);
        setShowSearchBar(false);
    };

    const handleClosePreview = () => {
        setShowSidebar(true); // Show sidebar when closing preview
        setShowSearchBar(true); // Show search bar when closing preview
        setDetailsVisible(false); // Hide details
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
    };


    return (
        <div className='d-flex w-100 h-100 bg-white'>
            {showSidebar && <Sidebar />}
            <div className='w-100'>
                {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
                <div className="container-fluid">
                    <ToastContainer />
                    {detailsVisible ? (
                        <ExpensesCashReportPreview
                            record={selectedRecord}
                            onClose={handleClosePreview}
                        />
                    ) : (<div className="row">
                        <div className="col-xl-12">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white">Expenses Ledger</div>
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
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    <label className='nunito text-white p-0 m-0'>Filter:</label>
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
                                                <button className="button_details" onClick={handleAllButtonClick}>All</button>
                                            </div>
                                            <button onClick={handleDetails} className="button_details">
                                                PDF
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
                                                            <th>Date</th>
                                                            <th>Project</th>
                                                            <th>head</th>
                                                            <th>Description</th>
                                                            <th>Amount</th>
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
                                                                    <td>{index + 1}</td> {/* Serial number */}
                                                                    <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                                                    <td>{entry.projectShortName}</td>
                                                                    <td>{entry.headName}</td>
                                                                    <td>{entry.description}</td>
                                                                    <td className='text-end'>&#x20B9;{entry.amount != null ? entry.amount.toFixed(2) : '0.00'}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th>Total {grandTotals.totalProject}</th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th className='text-end'>&#x20B9;{grandTotals.totalAmount != null ? grandTotals.totalAmount.toFixed(2) : '0.00'}</th>
                                                        </tr>
                                                    </tfoot>
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

export default ExpensesCashReport;
