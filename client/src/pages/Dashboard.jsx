import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from '../components/sidebar/Sidebar';
import SearchBar from '../components/sidebar/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myImage from '../images/employee_profile.png';
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
import AddCash from './PettyCash/AddCash';
import AddHead from './HeadMaster/AddHead';
import AdminMakeEntry from './AdminEntry/AdminMakeEntry';

function Dashboard({ handleLogout, username }) {
    // for Dashboard 
    const [employee, setEmployee] = useState(0);
    const [project, setproject] = useState(0);
    const [fundRequest, setFundRequest] = useState([]);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [fundApprReject, setFundApprReject] = useState([]);

    // For Total Amount Credit Debit  
    const [credits, setCredits] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [filteredCredits, setFilteredCredits] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Initialize with current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year
    const [totalCreditMonth, setTotalCreditMonth] = useState(0);
    const [totalExpenseMonth, setTotalExpenseMonth] = useState(0);
    const [totalCreditYear, setTotalCreditYear] = useState(0);
    const [totalExpenseYear, setTotalExpenseYear] = useState(0);
    // For Total Amount Credit Debit  

    useEffect(() => {
        fetchEmployees();
        fetchProjects();
        fetchRequest();
        fetchLedgerEntries();
        fetchfuncdApproveReject();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const employeeResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`);
            console.log(employeeResponse.data);
            if (Array.isArray(employeeResponse.data)) {
                setEmployee(employeeResponse.data.length);
            } else {
                console.error('Invalid response format for total Employee count');
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const projectResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            console.log(projectResponse.data);
            if (Array.isArray(projectResponse.data)) {
                setproject(projectResponse.data.length);
            } else {
                console.error('Invalid response format for total asset count');
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLedgerEntries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/expensesledger`);
            const filteredEntries = response.data.filter(entry => entry.status === "Request");
            setLedgerEntries(filteredEntries);
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequest = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/fundrequest`);
            // Filter the data to only include fund requests with status 'leave'
            const filteredRequest = response.data.filter(request => request.status === 'Request');
            setFundRequest(filteredRequest);
        } catch (error) {
            console.error("Error fetching fund requests:", error);
            toast.error("Failed to fetch fund requests.");
        } finally {
            setLoading(false);
        }
    };

    const fetchfuncdApproveReject = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/fundrequest`);
            // Filter the data to only include fund requests with status 'leave'
            const filteredRequest = response.data.filter(request => request.status !== 'Request');
            setFundApprReject(filteredRequest);
        } catch (error) {
            console.error("Error fetching fund requests:", error);
            toast.error("Failed to fetch fund requests.");
        } finally {
            setLoading(false);
        }
    };

    // For Total Amount 
    useEffect(() => {
        fetchCredits();
        fetchExpenses();
    }, []);

    useEffect(() => {
        filterRecords();
    }, [credits, expenses, selectedMonth, selectedYear]);

    useEffect(() => {
        calculateTotals();
    }, [filteredCredits, filteredExpenses]);

    const fetchCredits = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/totalcredit`);
            setCredits(response.data);
        } catch (error) {
            console.error("Error fetching credit entries:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/totalexpenses`);
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expense entries:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterRecords = () => {
        const filterByDate = (records) => {
            return records.filter(record => {
                const date = new Date(record.date);
                const isMonthMatch = selectedMonth ? (date.getMonth() + 1) === parseInt(selectedMonth) : true;
                const isYearMatch = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true;
                return isMonthMatch && isYearMatch;
            });
        };

        setFilteredCredits(filterByDate(credits));
        setFilteredExpenses(filterByDate(expenses));
    };

    const calculateTotals = () => {
        const sumAmounts = (records) =>
            records.reduce((sum, record) => {
                const amount = parseFloat(record.amount) || 0; // Ensure Amount is a valid number
                return sum + amount;
            }, 0);

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // Months are 0-based, so add 1

        // Filter records for the current year
        const yearlyCredits = credits.filter(credit => new Date(credit.date).getFullYear() === currentYear);
        const yearlyExpenses = expenses.filter(expense => new Date(expense.date).getFullYear() === currentYear);

        setTotalCreditYear(sumAmounts(yearlyCredits));
        setTotalExpenseYear(sumAmounts(yearlyExpenses));

        // Filter records for the current month within the current year
        const monthlyCredits = yearlyCredits.filter(credit => (new Date(credit.date).getMonth() + 1) === currentMonth);
        const monthlyExpenses = yearlyExpenses.filter(expense => (new Date(expense.date).getMonth() + 1) === currentMonth);

        setTotalCreditMonth(sumAmounts(monthlyCredits));
        setTotalExpenseMonth(sumAmounts(monthlyExpenses));
    };

    // For Total Amount 
    const handleUpdate = () => {
        toast.success("successfully uploaded");
    }

    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1]; // monthNumber is 1-based, array is 0-based
    };


    // Add Cash Head Modal
    const [isAddCashModal, setIsAddCashModal] = useState(false);
    const [isHeadModalOpen, setIsAddHeadModalOpen] = useState(false); // State to manage modal open/close
    // Admin Make Entry modal 
    const [isAdminMakeEntryModalopen, setIsAdminMakeEntryModalopen] = useState(false);

    // Asset Cash Modal 
    const handleAddCashModal = () => {
        setIsAddCashModal(true);
    };

    const handleCloseAddCashModal = () => {
        setIsAddCashModal(false);
    };
    // Add Head 
    const handleAddHeadModal = () => {
        setIsAddHeadModalOpen(true);
    };

    const handleCloseHeadModal = () => {
        setIsAddHeadModalOpen(false);
    };
    // Add Admin Make Entry
    const handleAdminMakeEntryModal = () => {
        setIsAdminMakeEntryModalopen(true);
    };

    const handleCloseAdminMakeEntryModal = () => {
        setIsAdminMakeEntryModalopen(false);
    };

    // For Monthly Project Report 
    const [isLoading, setIsLoading] = useState(false);
    const [monthlyProjects, setMonthlyProjects] = useState([]);
    const [availableProjects, setAvailableProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedYearProject, setSelectedYearProject] = useState('');
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [grandTotals, setGrandTotals] = useState({ totalCredit: 0, totalDebit: 0 });

    useEffect(() => {
        fetchProjectReports();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchCreditDebit(selectedProject);
        }
    }, [selectedProject, selectedYearProject]);

    const fetchProjectReports = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setAvailableProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCreditDebit = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projectcreditdebit/${projectId}`);
            const formattedData = formatLedgerData(response.data);

            // Filter data based on selected financial year
            const filteredData = formattedData.filter(entry => {
                const entryDate = new Date(entry.date);
                const entryFinancialYear = getFinancialYear(entryDate);
                return !selectedYearProject || entryFinancialYear === selectedYearProject;
            });

            setMonthlyProjects(filteredData);
            const summary = calculateMonthlySummary(filteredData);
            setMonthlySummary(summary);

            if (summary.length === 0) {
                setGrandTotals({ totalCredit: 0, totalDebit: 0 });
            }
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
            toast.error("Failed to fetch ledger entries");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
    };

    const formatLedgerData = (data) => {
        return data.map(entry => ({
            ...entry,
            monthYear: getMonthYear(entry.date),
        }));
    };

    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    const getFinancialYear = (date) => {
        const year = date.getFullYear();
        const startOfFinancialYear = new Date(year, 3, 1); // 1st April
        if (date >= startOfFinancialYear) {
            return `${year}-${year + 1}`;
        } else {
            return `${year - 1}-${year}`;
        }
    };

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
                balance: credit - debit,
            };
        });
    };

    useEffect(() => {
        if (monthlySummary.length > 0) {
            calculateProjectTotals();
        } else {
            setGrandTotals({ totalCredit: 0, totalDebit: 0 });
        }
    }, [monthlySummary]);

    const calculateProjectTotals = () => {
        const totals = monthlySummary.reduce((acc, record) => {
            acc.totalCredit += record.credit || 0;
            acc.totalDebit += record.debit || 0;
            return acc;
        }, { totalCredit: 0, totalDebit: 0 });

        setGrandTotals(totals);
    };
    
    // For Monthly Project Report 
    return (
        <div className='d-flex w-100 h-100 bg-white '>
            <Sidebar />
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} /> {/* Pass username and handleLogout props */}
                <div className="container-fluid px-3">
                    <ToastContainer />
                    <div className=' bg-white rounded p-3 shadow'>
                        <div style={{ borderRadius: "10px", background: "rgb(33,131,128)", background: "linear-gradient(9deg, #00509d 19%, #00509d 93%)", }} className="d-sm-flex align-items-center justify-content-between shadow-sm mb-4 p-3 ">
                            <h3 style={{ color: "white" }} className="title-detail fw-bolder font-bold m-0">
                                Dashboard
                            </h3>
                            <div className='d-flex align-items-center justify-content-center gap-2'>
                                <button onClick={handleAddCashModal} className="button_details"><i className="fa fa-plus"></i> Add Cash
                                </button>
                                <button style={{ whiteSpace: "nowrap" }} onClick={handleAddHeadModal} className="button_details">
                                    <i className="fa fa-plus"></i> Add Head
                                </button>
                                <button style={{ whiteSpace: "nowrap" }} onClick={handleAdminMakeEntryModal} className="button_details">
                                    <i className="fa fa-plus"></i> Add Expense
                                </button>
                            </div>

                        </div>
                        {/* Content Row */}
                        <div className="row px-3 mb-3">
                            <div style={{ width: "100%" }} className='p-0 d-flex align-items-center justify-content-between'>
                                <div style={{ width: "22%", background: "rgb(33,131,128)", background: "linear-gradient(9deg, #8f2d56 19%, #8f2d56 93%)", borderRadius: "20px" }} className=' p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1rem' }}>
                                                <i className="fa-solid fa-users"></i>
                                                <span><Link className='text-white' to="/employeelist"><i style={{ rotate: "45deg" }} className=" fa-solid fa-circle-arrow-up"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="nunito text-white" >
                                                Total Employee
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {loading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 style={{ fontSize: "2vw" }} className="text-end text-white fw-bolder m-0">
                                                {employee}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                                <div style={{ width: "22%", background: "rgb(33,131,128)", background: "linear-gradient(9deg, #f77f00 19%, #f77f00 93%)", borderRadius: "20px" }} className=' p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1rem' }}>
                                                <i class="fa-solid fa-diagram-project"></i>
                                                <span><Link className='text-white' to="/projectledger"><i style={{ rotate: "45deg" }} className=" fa-solid fa-circle-arrow-up"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="nunito text-white" >
                                                Total Project
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {loading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 style={{ fontSize: "2vw" }} className="text-end text-white fw-bolder m-0">
                                                {project}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                                <div style={{ width: "22%", background: "rgb(33,131,128)", background: "linear-gradient(9deg,  #0D7C66 19%,  #0D7C66 93%)", borderRadius: "20px" }} className=' p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >
                                                    Total Credit
                                                </div>
                                                <span><Link className='text-white' to="/cashledger"><i class="fa-solid fa-sack-dollar"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col d-flex align-items-center justify-content-between">
                                            <div className="nunito text-white" >
                                                - {getMonthName(selectedMonth)}
                                            </div>
                                            <div className="nunito text-white" >
                                                &#x20B9;{totalCreditMonth ? totalCreditMonth.toFixed(2) : '0.00'}
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2 d-flex align-items-center justify-content-between'>
                                        {loading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                <h3 style={{ fontSize: "2vw" }} className="text-end text-white fw-bolder m-0">
                                                    <div className="nunito text-white">- {selectedYear}</div>
                                                </h3>
                                                <h3 style={{ fontSize: "2vw" }} className="text-end text-white fw-bolder m-0">
                                                    <div className="nunito text-white">
                                                        &#x20B9;{totalCreditYear ? totalCreditYear.toFixed(2) : '0.00'}
                                                    </div>
                                                </h3>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                                <div style={{ width: "22%", background: "rgb(33,131,128)", background: "linear-gradient(9deg, #d81159 19%, #d81159 93%)", borderRadius: "20px" }} className=' p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >
                                                    Total Expenses
                                                </div>
                                                <span><Link className='text-white' to="/expensesledger"><i class="fa-solid fa-sack-dollar"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col d-flex align-items-center justify-content-between">
                                            <div className="nunito text-white" >
                                                - {getMonthName(selectedMonth)}
                                            </div>
                                            <div className="nunito text-white" >
                                                &#x20B9;{totalExpenseMonth ? totalExpenseMonth.toFixed(2) : '0.00'}
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2 d-flex align-items-center justify-content-between'>
                                        {loading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                <h3 style={{ fontSize: "2vw" }} className="text-end text-white fw-bolder m-0">
                                                    <div className="nunito text-white">- {selectedYear}</div>
                                                </h3>
                                                <h3 style={{ fontSize: "2vw" }} className="text-end text-white fw-bolder m-0">
                                                    <div className="nunito text-white">
                                                        &#x20B9;{totalExpenseYear ? totalExpenseYear.toFixed(2) : '0.00'}
                                                    </div>
                                                </h3>
                                            </React.Fragment>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* content row   */}
                        <div className="row px-3 mb-3">
                            <div style={{ width: "100%" }} className='p-0 d-flex justify-content-between'>
                                <div style={{ width: "49%", borderRadius: "20px", border: "1px solid #0077b6" }} className='overflow-hidden'>
                                    <div style={{ background: "rgb(33,131,128)", background: "linear-gradient(9deg, #00509d 19%, #00509d 93%)", }} className="row no-gutters align-items-center px-4 py-2">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >
                                                    Fund Requested
                                                </div>
                                                <span><Link className='text-white' to="/fundrequest"><i class="fa-solid fa-bell"></i></Link></span>

                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='p-1'>
                                        <div
                                            // className='forresponsive'
                                            style={{ height: "270px", overflowY: "auto", overflowX: "hidden" }}
                                        >
                                            {loading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    {/* Correct usage of spinner */}
                                                    <ThreeDots
                                                        color="#00BFFF"
                                                        height={80}
                                                        width={80}
                                                    />
                                                </div>
                                            ) : fundRequest.length === 0 ? (
                                                <p className="nunito text-black text-center text-muted">No Fund Request</p>
                                            ) : (
                                                fundRequest.map((request, index) => (
                                                    <div key={index}
                                                        style={{ border: "1px solid #00509d", borderRadius: "10px", background: "rgb(33,131,128)", background: "linear-gradient(9deg, #00509d 19%, #00509d 93%)" }}
                                                        className="p-1 m-1 text-white"
                                                    >
                                                        <div className="d-flex align-items-start p-1 ">
                                                            <div className='w-100'>
                                                                <div className='d-flex justify-content-between'>
                                                                    <div className=''>
                                                                        <p className=" nunito m-0 p-0">
                                                                            {/* <span>Request Date: </span>{formatDate(request.requestdate)} */}
                                                                            <span>Request Date: </span>{new Date(request.requestdate).toLocaleDateString('en-GB')}
                                                                        </p>
                                                                        <p className=" nunito m-0 p-0">
                                                                            <span>Project Name: </span>{request.projectName}
                                                                        </p>
                                                                        <p className="nunito mb-0 lh-1 fs-14 fw-medium tablefont mt-1">
                                                                            <span className='fw-bolder '>Request Description: </span>{request.requestdescription}
                                                                        </p>
                                                                    </div>
                                                                    <div className='d-flex align-items-center justify-content-center'>
                                                                        <p style={{ color: "yellow", fontWeight: "700", backgroundColor: "#b8c0c087" }} className="nunito px-1 rounded m-0 border ">{request.status}</p>
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
                                <div style={{ width: "49%", borderRadius: "20px", border: "1px solid #0077b6" }} className='overflow-hidden'>
                                    <div style={{ background: "rgb(33,131,128)", background: "linear-gradient(9deg, #00509d 19%, #00509d 93%)", }} className="row no-gutters align-items-center px-4 py-2">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >
                                                    Fund Approve/Reject
                                                </div>
                                                <span><Link className='text-white' to="/approvreject"><i class="fa-solid fa-bell"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='p-1'>
                                        <div
                                            //  className='forresponsive'
                                            style={{ height: "270px", overflowY: "auto", overflowX: "hidden" }}
                                        >
                                            {loading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    {/* Correct usage of spinner */}
                                                    <ThreeDots
                                                        color="#00BFFF"
                                                        height={80}
                                                        width={80}
                                                    />
                                                </div>
                                            ) : fundApprReject.length === 0 ? (
                                                <p className="nunito text-black text-center text-muted">No Approve /Reject </p>
                                            ) : (
                                                fundApprReject.map((request, index) => (
                                                    <div key={index}
                                                        style={{ border: "1px solid #00509d", borderRadius: "10px", background: "rgb(33,131,128)", background: "linear-gradient(9deg, #00509d 19%, #00509d 93%)" }}
                                                        className="p-1 m-1 text-white"
                                                    >
                                                        <div className="d-flex align-items-start p-1 ">
                                                            <div className='w-100'>
                                                                <div className='d-flex justify-content-between'>
                                                                    <div className=''>
                                                                        <p className=" nunito m-0 p-0">
                                                                            {/* <span>Payment Date: </span>{formatDate(request.requestdate)} */}
                                                                            <span>Payment Date: </span>{new Date(request.requestdate).toLocaleDateString('en-GB')}
                                                                        </p>
                                                                        <p className=" nunito m-0 p-0">
                                                                            <span>Project Name: </span>{request.projectName}
                                                                        </p>
                                                                        <p className="nunito mb-0 lh-1 fs-14 fw-medium tablefont mt-1">
                                                                            <span className='fw-bolder '>Reason: </span>{request.requestdescription}
                                                                        </p>
                                                                    </div>
                                                                    <div className='d-flex align-items-center justify-content-center'>
                                                                        <p
                                                                            style={{
                                                                                color: request.status === 'Approve' ? 'blue' : request.status === 'Reject' ? 'red' : 'yellow',
                                                                                fontWeight: '700', backgroundColor: "#b8c0c087"
                                                                            }}
                                                                            className="nunito px-1 rounded m-0 border"
                                                                        >
                                                                            {request.status}
                                                                        </p>
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

                        {/* content row   */}
                        <div className="row px-3 mb-3">
                            <div style={{ width: "100%" }} className='p-0 d-flex justify-content-between'>
                                <div style={{ width: "100%", borderRadius: "20px", border: "1px solid #0077b6" }} className='overflow-hidden'>
                                    <div style={{ background: "linear-gradient(9deg, #00509d 19%, #00509d 93%)" }} className="row no-gutters align-items-center px-4 py-2">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white">
                                                    Project Report
                                                </div>
                                                <div className="d-flex gap-3">
                                                    <div className='d-flex align-items-center justify-content-center gap-2'>
                                                        <label className='nunito text-white p-0 m-0'>Project:</label>
                                                        <select
                                                            className="button_details overflow-hidden"
                                                            value={selectedProject}
                                                            onChange={(e) => handleProjectChange(e.target.value)}
                                                        >
                                                            <option value="">Select Project</option>
                                                            {availableProjects.map(proj => (
                                                                <option key={proj.id} value={proj.id}>{proj.projectName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <label className='nunito text-white p-0 m-0'>Filter:</label>
                                                        <select
                                                            className="button_details"
                                                            value={selectedYearProject}
                                                            onChange={(e) => setSelectedYearProject(e.target.value)}
                                                        >
                                                            <option value="">Select Financial Year</option>
                                                            {Array.from({ length: 10 }, (_, i) => {
                                                                const startYear = new Date().getFullYear() - i;
                                                                const financialYear = `${startYear}-${startYear + 1}`;
                                                                return (
                                                                    <option key={i} value={financialYear}>{financialYear}</option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className="card-body">
                                        <div style={{ maxHeight: "550px", overflowY: "auto" }}>
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : (
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Month-Year</th>
                                                            <th>Total Credit</th>
                                                            <th>Total Debit</th>
                                                            <th>Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {monthlySummary.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="4" className="text-center">No Monthly Summary.</td>
                                                            </tr>
                                                        ) : (
                                                            monthlySummary.map((summary, index) => (
                                                                <tr key={index}>
                                                                    <td>{summary.monthYear}</td>
                                                                    <td className="text-end">&#x20B9;{summary.credit.toFixed(2)}</td>
                                                                    <td className="text-end">&#x20B9;{summary.debit.toFixed(2)}</td>
                                                                    <td className={`text-end ${summary.balance < 0 ? 'text-danger' : ''}`}>
                                                                        &#x20B9;{summary.balance.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th>Totals</th>
                                                            <th className="text-success text-end">&#x20B9;{grandTotals.totalCredit.toFixed(2)}</th>
                                                            <th className="text-danger text-end">&#x20B9;{grandTotals.totalDebit.toFixed(2)}</th>
                                                            <th className="text-end">&#x20B9;{(grandTotals.totalCredit - grandTotals.totalDebit).toFixed(2)}</th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* content row   */}
                        {isAddCashModal && <AddCash onClose={handleCloseAddCashModal} onUpdate={handleUpdate} />}
                        {isHeadModalOpen && <AddHead onClose={handleCloseHeadModal} onUpdate={handleUpdate} />}
                        {isAdminMakeEntryModalopen && <AdminMakeEntry onClose={handleCloseAdminMakeEntryModal} onUpdate={handleUpdate} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;






