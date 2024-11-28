import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";

function UserProjectLedger({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(''); // For month filtering
    const [selectedYear, setSelectedYear] = useState(''); // For year filtering

    const projectId = localStorage.getItem('projectId');

    console.log("projectId", projectId);

    useEffect(() => {
        if (projectId) {
            fetchLedgerEntries(projectId);
        }
    }, [projectId, selectedMonth, selectedYear]); // Include month and year in dependency array

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

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            <SidebarEmployee />
            <div className='w-100'>
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    <div className="row">
                        <div className="col-xl-12 p-0 mt-2">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Project Ledger</div>
                                            <div className="d-flex gap-3">
                                               
                                                <div className="d-flex align-items-center justify-content-center gap-2  mobileline">
                                                    <label className='nunito text-white p-0 m-0 userfont'>Filter:</label>
                                                    <select
                                                        className="button_details"
                                                        value={selectedMonth}
                                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                                    >
                                                        <option value="">Month</option>
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <option key={i} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="button_details"
                                                        value={selectedYear}
                                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                                    >
                                                        <option value="">Year</option>
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
                                        <div className="forresponsive" >
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
                                                            <th style={{ whiteSpace: "nowrap" }}>Amt Description</th>
                                                            <th>Credit</th>
                                                            <th>Debit</th>
                                                            <th>Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ledgerEntries.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="6" className="text-center tablefont">No Ledger Entries.</td>
                                                            </tr>
                                                        ) : (
                                                            ledgerEntries.map((entry, index) => (
                                                                <tr key={entry.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                                                    <td>{entry.description}</td>
                                                                    <td>{entry.credit ? entry.credit.toFixed(2) : '-'}</td>
                                                                    <td>{entry.debit ? entry.debit.toFixed(2) : '-'}</td>
                                                                    <td>{entry.balance.toFixed(2)}</td>
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

export default UserProjectLedger;
