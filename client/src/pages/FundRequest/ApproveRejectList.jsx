import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner'; // Spinner


function ApprovRejectList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [fundApprReject, setfundApprReject] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Initialize with current month (+1 since months are 0-indexed)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year
    const [selectedProject, setSelectedProject] = useState(''); // For project filtering


    useEffect(() => {
        fetchfuncdApproveReject();
        fetchProjects();
    }, []);

    useEffect(() => {
        filterRecords();
    }, [selectedMonth, selectedYear, selectedProject, fundApprReject]);

    const fetchfuncdApproveReject = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/fundrequest`);
            // Filter the data to only include fund requests with status 'leave'
            const filteredRequest = response.data.filter(request => request.status !== 'Request');
            setfundApprReject(filteredRequest);
        } catch (error) {
            console.error("Error fetching fund requests:", error);
            toast.error("Failed to fetch fund requests.");
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
        const filtered = fundApprReject.filter(record => {
            const date = new Date(record.paymentDate);
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
        setFilteredRecords(fundApprReject); // Show all records
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
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
                                            <div className="nunito text-white">Approve/Reject List</div>
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
                                                            <th>Project</th>
                                                            <th>Reason</th>
                                                            <th>Amount</th>
                                                            <th>Status</th>
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
                                                                    <td>{new Date(entry.paymentDate).toLocaleDateString('en-GB')}</td>
                                                                    <td>{entry.projectName}</td>
                                                                    <td>{entry.reason}</td>
                                                                    <td className='text-end'>&#x20B9;{entry.paidAmount.toFixed(2) || "0.00"}</td>
                                                                    <td>
                                                                      {entry.status}
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
        </div>
    );
}

export default ApprovRejectList;
