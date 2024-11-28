
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

function UserMonthlyReport({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [ledgerEntries, setLedgerEntries] = useState([]); // Combined credit and debit entries
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(''); // For month filtering
    const [selectedYear, setSelectedYear] = useState(''); // For year filtering
    const [grandTotals, setGrandTotals] = useState({ totalcredit: 0, totaldebit: 0 }); // State for grand totals
    const projectId = localStorage.getItem('projectId');
    console.log("projectId", projectId);


    useEffect(() => {
        if (projectId) {
            fetchCreditDebit(projectId);
        }
    }, [projectId, selectedMonth, selectedYear]); // Fetch data again when month or year changes

    const fetchCreditDebit = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projectcreditdebit/${projectId}`);
            let formattedData = formatLedgerData(response.data);

            // Apply filtering by month and year
            if (selectedMonth || selectedYear) {
                formattedData = formattedData.filter((entry) => {
                    const entryDate = new Date(entry.date);
                    const entryMonth = entryDate.getMonth() + 1; // getMonth returns 0-indexed month
                    const entryYear = entryDate.getFullYear();
                    return (
                        (!selectedMonth || entryMonth === parseInt(selectedMonth)) &&
                        (!selectedYear || entryYear === parseInt(selectedYear))
                    );
                });
            }

            setLedgerEntries(formattedData); // Set the filtered entries in state
            const summary = calculateMonthlySummary(formattedData);
            setMonthlySummary(summary); // Set monthly summary

            // If no data for the current selection, reset grand totals to zero
            if (summary.length === 0) {
                setGrandTotals({ totalcredit: 0, totaldebit: 0 });
            }
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
            toast.error("Failed to fetch ledger entries");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to format date strings to "Month Year" (e.g., "September 2024")
    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    // Format ledger data by adding month/year info
    const formatLedgerData = (data) => {
        return data.map((entry) => ({
            ...entry,
            monthYear: getMonthYear(entry.date),
        }));
    };

    // Function to calculate the monthly summary of credit, debit, and balance
    const calculateMonthlySummary = (data) => {
        const summary = {};

        data.forEach(entry => {
            const monthYear = entry.monthYear;
            if (!summary[monthYear]) {
                summary[monthYear] = { credit: 0, debit: 0 };
            }

            if (entry.type === 'Credit') {
                summary[monthYear].credit += entry.amount;
            } else if (entry.type === 'Debit') {
                summary[monthYear].debit += entry.amount;
            }
        });

        return Object.keys(summary).map(monthYear => {
            const { credit, debit } = summary[monthYear];
            return {
                monthYear,
                credit,
                debit,
                balance: credit - debit
            };
        });
    };

    useEffect(() => {
        if (monthlySummary.length > 0) {
            calculateTotals();
        } else {
            setGrandTotals({ totalcredit: 0, totaldebit: 0 }); // Reset grand totals to zero if no summary
        }
    }, [monthlySummary]);

    const calculateTotals = () => {
        if (monthlySummary.length === 0) {
            setGrandTotals({ totalcredit: 0, totaldebit: 0 }); // Reset to 0 if no data
        } else {
            const totals = monthlySummary.reduce((acc, record) => {
                acc.totalcredit += record.credit ? parseFloat(record.credit) : 0;
                acc.totaldebit += record.debit ? parseFloat(record.debit) : 0;
                return acc;
            }, {
                totalcredit: 0,
                totaldebit: 0,
            });

            setGrandTotals(totals);
        }
    };

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            <SidebarEmployee />
            <div className='w-100 bg-white'>
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid ">
                    <ToastContainer />
                    <div className="row">
                        <div className="col-xl-12 p-0 mt-2">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Monthly Report</div>
                                            <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
                                                <label className='nunito text-white p-0 m-0 userfont '>Filter:</label>
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
                                <hr className='m-0 p-0' />
                                <div className=''>
                                    <div className="card-body">
                                        <div className='forresponsive'>
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : monthlySummary.length === 0 ? (
                                                <p className="nunito tablefont text-black text-center text-muted">No Amount Received</p>
                                            ) : (
                                                <>
                                                    {monthlySummary.map((summary, index) => (
                                                        <div key={index}
                                                            style={{ border: "1px solid #00509d", borderRadius: "10px", background: "linear-gradient(9deg, rgba(64,163,160,1) 19%, #00509d 93%)" }}
                                                            className="p-1 m-1 text-white"
                                                        >
                                                            <div className="d-flex align-items-start p-1">
                                                                <div className='w-100'>
                                                                    <div>
                                                                        <div className="tabledetails">
                                                                            <div className="">
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    <span>Month & Year: </span>
                                                                                </p>
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    <span>{summary.monthYear}</span>
                                                                                </p>
                                                                            </div>
                                                                            <div className="">
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    <span>Credit: </span>&#x20B9;{summary.credit != null ? summary.credit.toFixed(2) : '0.00'}
                                                                                </p>
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    <span>Debit: </span>&#x20B9;{summary.debit != null ? summary.debit.toFixed(2) : '0.00'}
                                                                                </p>
                                                                                <p className="tablefont nunito m-0 p-0">
                                                                                    <span>Balance: </span>&#x20B9;{summary.balance != null ? summary.balance.toFixed(2) : '0.00'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Footer section for grand totals */}
                                                    <div className="p-2 mt-2" style={{ borderTop: "2px solid #00509d" }}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="tablefont text-success fw-bold m-0 text-center">
                                                                Credit Total: &#x20B9;{grandTotals.totalcredit != null ? grandTotals.totalcredit.toFixed(2) : '0.00'}
                                                            </p>
                                                            <p className="tablefont text-danger fw-bold m-0 text-center">
                                                                Debit Total: &#x20B9;{grandTotals.totaldebit != null ? grandTotals.totaldebit.toFixed(2) : '0.00'}
                                                            </p>
                                                            <p className="tablefont fw-bold m-0 text-center">
                                                                Balance: &#x20B9;{(grandTotals.totalcredit - grandTotals.totaldebit).toFixed(2)}
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
                        <ToastContainer />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UserMonthlyReport;







