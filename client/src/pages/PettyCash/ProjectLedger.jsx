import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner'; // Spinner

function ProjectLedger({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(''); // For project filtering
    const [selectedMonth, setSelectedMonth] = useState(''); // For month filtering
    const [selectedYear, setSelectedYear] = useState(''); // For year filtering

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchLedgerEntries(selectedProject);
        }
    }, [selectedProject, selectedMonth, selectedYear]); // Include month and year in dependency array

    const fetchLedgerEntries = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/transactions/${projectId}`);
            console.log("data", response.data);

            // Filter entries based on selected month and year
            const filteredEntries = response.data.filter(entry => {
                const entryDate = new Date(entry.date);
                const monthMatch = selectedMonth ? entryDate.getMonth() + 1 === selectedMonth : true;
                const yearMatch = selectedYear ? entryDate.getFullYear() === selectedYear : true;
                return monthMatch && yearMatch;
            });

            setLedgerEntries(filteredEntries);
            console.log(filteredEntries);
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
            toast.error("Failed to fetch ledger entries");
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
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
        setSelectedMonth(''); // Reset month filter when project changes
        setSelectedYear(''); // Reset year filter when project changes
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
                                            <div className="nunito text-white">Project Ledger</div>
                                            <div className="d-flex gap-3">
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
                                                            <th>SNo.</th>
                                                            <th>Date</th>
                                                            <th>Amt Description</th>
                                                            <th>Credit</th>
                                                            <th>Debit</th>
                                                            <th>Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ledgerEntries.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="6" className="text-center">No Ledger Entries.</td>
                                                            </tr>
                                                        ) : (
                                                            ledgerEntries.map((entry, index) => (
                                                                <tr key={entry.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                                                    <td>{entry.description}</td>
                                                                    <td className='text-end'>&#x20B9;{entry.credit ? entry.credit.toFixed(2) : '0.00'}</td>
                                                                    <td className='text-end'>&#x20B9;{entry.debit ? entry.debit.toFixed(2) : '0.00'}</td>
                                                                    <td className='text-end'>&#x20B9;{entry.balance ? entry.balance.toFixed(2) : '0.00'}</td>
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

export default ProjectLedger;
