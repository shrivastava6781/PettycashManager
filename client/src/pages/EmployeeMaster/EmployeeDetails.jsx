// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../components/sidebar/Sidebar";
// import SearchBar from "../../components/sidebar/SearchBar";
// import EditEmployeeModal from "./EditEmployeeModal";
// import RepaymentHistory from "./RepaymentHistory";
// import { Flip, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AddLoan from "../LoanMaster/AddLoan";
// import ChangeSalary from "./ChangeSalary";
// import SalaryHistory from "./SalaryHistory";
// import Payment_Bonous_Insentive from "../Bonous_Insentive/Payment_Bonous_Insentive";
// import ViewBonousInsentive from "../Bonous_Insentive/ViewBonousInsentive";
// import AddBonusIncentive from "../Bonous_Insentive/AddBonusIncentive";
// import AddAdvanceRepaymentForm from "./AddAdvanceRepaymentForm";
// import PaymentForm from "../SalaryMaster/PaymentForm";
// import PaymentHistory from "../SalaryMaster/PaymentHistory";
// import DocumentionForm from "./DocumentionForm";
// import AddDocumention from "./AddDocumentation";
// import AddTransferEmployee from "./AddTransferEmployee";
// import myImage from '../../images/employee_profile.png';
// import EmployeePrint from "./EmployeePrint";
// import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner




// const EmployeeDetails = ({ employee, onClose }) => {
//     const [employeeHistory, setEmployeeHistory] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     // const [loanRecords, setLoanRecords] = useState([]);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [transferHistory, setTransferHistory] = useState(null);
//     const [currentSection, setCurrentSection] = useState('basicInfo');
//     const [activeInactivelastOccurence, setActiveInactivelastOccurence] = useState(null);
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Initialize with current month
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year
//     const [attendanceRecords, setAttendanceRecords] = useState([]);
//     const [filteredAttendance, setFilteredAttendance] = useState([]);
//     const [totalPresent, setTotalPresent] = useState(0);
//     const [totalAbsent, setTotalAbsent] = useState(0);
//     const [totalHalfDay, setTotalHalfDay] = useState(0);
//     const [totalPaidLeave, setTotalPaidLeave] = useState(0);
//     const [totalUnpaidLeave, setTotalUnpaidLeave] = useState(0);
//     const [totalOvertime, setTotalOvertime] = useState(0);
//     const [totalWeeklyOff, setTotalWeeklyOff] = useState(0);
//     const [salaryRecords, setSalaryRecords] = useState([]);
//     const [filteredSalaryRecords, setFilteredSalaryRecords] = useState([]);
//     const [totalPaidAmount, setTotalPaidAmount] = useState(0);
//     const [totalSalaryAmount, setTotalSalaryAmount] = useState(0);
//     // Add Loan 
//     const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState(false);
//     // Add Bonouse Insentive 
//     const [isAddBonousInsentiveModalOpen, setIsAddBonousInsentiveModalOpen] = useState(false);
//     const [loanrepaymentHistory, setloanRepaymentHistory] = useState(null);
//     const [changeSalary, setChangeSalary] = useState(null);
//     const [salaryHistory, setSalaryHistory] = useState(null);
//     const [isloanRepaymentHistory, setIsloanRepaymentHistory] = useState(false);
//     const [ischangeSalary, setIschangeSalary] = useState(false);
//     const [isSalaryHistory, setIsSalaryHistory] = useState(false);
//     // for the loan loanrepaymentHistory
//     const [loanRecords, setLoanRecords] = useState([]);
//     const [repaymentRecords, setRepaymentRecords] = useState([]);
//     const [loading, setLoading] = useState(false);
//     // Payment Bonous Insentive 
//     const [paymentBonousInsentive, setpaymentBonousInsentive] = useState(null);
//     const [ispaymentBonousInsentive, setIspaymentBonousInsentive] = useState(false);
//     // Bonous Insentive 
//     const [bonusIncentive, setBonusIncentive] = useState([]);
//     const [paymentBonusIncentive, setPaymentBonusIncentive] = useState([]);
//     // view Bonous Insentive details    
//     const [viewBonousInsentive, setviewBonousInsentive] = useState(null);
//     const [isviewBonousInsentive, setIsviewBonousInsentive] = useState(false);
//     // Advance Rwpayment  
//     const [IsadvanceRepayemnt, setIsadvanceRepayemnt] = useState(false);
//     const [selectedMonthAdvance, setSelectedMonthAdvance] = useState(new Date().getMonth());
//     const [selectedYearAdvance, setSelectedYearAdvance] = useState(new Date().getFullYear());
//     const [advanceRecords, setAdvanceRecords] = useState([]);
//     const [advanceRepayments, setAdvanceRepayments] = useState([]);
//     const [advanceBalances, setAdvanceBalances] = useState([]);
//     const [filteredAdvanceRecords, setFilteredAdvanceRecords] = useState([]);
//     const [filteredAdvanceRepayments, setFilteredAdvanceRepayments] = useState([]);
//     const [filteredAdvanceBalances, setFilteredAdvanceBalances] = useState([]);
//     const [totalAdvanceCurrentMonth, setTotalAdvanceCurrentMonth] = useState(0);
//     const [totalAdvanceAmount, setTotalAdvanceAmount] = useState(0);
//     const [advanceRepayment, setAdvanceRepayment] = useState(null);
//     const [isAdvanceRepayment, setIsAdvanceRepayment] = useState(false);
//     const [totalRepayment, setTotalRepayment] = useState(0);
//     // SalaryPaymentDetails 
//     const [salaryPaymentHistory, setsalaryPaymentHistory] = useState([]);
//     // Salary Slip 
//     const [payroll, setPayroll] = useState([]);
//     const [filteredPayroll, setFilteredPayroll] = useState([]);
//     const [selectedpayrollYear, setSelectedpayrollYear] = useState(new Date().getFullYear()); // Initialize with current year
//     const [paymentDetails, setPaymentDetails] = useState({});
//     const [isPaymentForm, setIsPaymentForm] = useState(false);
//     const [isPaymentHistory, setIsPaymentHistory] = useState(false);
//     const [paymentForm, setPaymentForm] = useState(null);
//     const [paymentFormHistory, setPaymentFormHistory] = useState(null);
//     // Documention 
//     const [changeDocumention, setChangeDocumention] = useState(null);
//     const [ischangeDocumention, setIschangeDocumention] = useState(false);
//     // Add Documention 
//     const [addDocumention, setAddDocumention] = useState(null);
//     const [isaddDocumentation, setIsAddDocumentation] = useState(false);
//     // Add Documention 
//     const [addTransfer, setAddTransfer] = useState(null);
//     const [isaddTransfer, setIsAddTransfer] = useState(false);
//     // SalaryPaymentDetails 
//     // EmployeePrint  
//     const [showEmployeePrint, setShowEmployeePrint] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(<Sidebar />);
//     const [showSearchBar, setShowSearchBar] = useState(<SearchBar />);

//     useEffect(() => {
//         fetchsalaryPaymentHistoryByEmployee(employee.id);
//     }, [employee]);

//     useEffect(() => {
//         filterSalaryPaymentHistory();
//     }, [selectedYear, selectedMonth, salaryPaymentHistory]);

//     const fetchsalaryPaymentHistoryByEmployee = async (employeeId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/salarypaymenthistory/${employeeId}`);
//             setsalaryPaymentHistory(response.data);
//         } catch (error) {
//             console.error('Error fetching salaryPaymentHistory by employee:', error);
//             toast.error('Error fetching salaryPaymentHistory data.');
//         }
//     };

//     const filterSalaryPaymentHistory = () => {
//         return salaryPaymentHistory.filter(record => {
//             const recordDate = new Date(record.amountDate);
//             return recordDate.getFullYear() === selectedYear && recordDate.getMonth() === selectedMonth;
//         });
//     };

//     const filteredsalaryPaymentHistory = filterSalaryPaymentHistory();


//     // Salary Slip 

//     useEffect(() => {
//         fetchPayrollByEmployee(employee.id);
//     }, [employee]);

//     useEffect(() => {
//         filterPayrollByYear(selectedpayrollYear);
//     }, [selectedpayrollYear, payroll]);

//     useEffect(() => {
//         if (payroll.length > 0) {
//             fetchPaymentDetails();
//         }
//     }, [payroll]);

//     const fetchPayrollByEmployee = async (employeeId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/payroll/${employeeId}`);
//             setPayroll(response.data);
//             filterPayrollByYear(selectedpayrollYear, response.data);
//         } catch (error) {
//             console.error('Error fetching payroll by employee:', error);
//         }
//     };

//     const fetchPaymentDetails = async () => {
//         try {
//             const details = {};
//             for (const record of payroll) {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/paymentform/${record.id}`);
//                 details[record.id] = response.data.reduce((sum, payment) => sum + payment.amountPaid, 0);
//             }
//             setPaymentDetails(details);
//         } catch (error) {
//             console.error('Error fetching payment details:', error);
//         }
//     };

//     const filterPayrollByYear = (year, data = payroll) => {
//         const filteredRecords = data.filter(record => record.year === year);
//         setFilteredPayroll(filteredRecords);
//     };

//     // Payment Form
//     const handlePaymentForm = (record) => {
//         setPaymentForm(record);
//         setIsPaymentForm(true);
//     };

//     // Payment History
//     const handlePaymentHistory = (record) => {
//         setPaymentFormHistory(record);
//         setIsPaymentHistory(true);
//     };

//     const monthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];
//     // Salary Slip 



//     // Advance Payment and Repayments 
//     const handleAdvanceRepayment = (record, totalAdvanceAmount) => {
//         setAdvanceRepayment(record);
//         setIsAdvanceRepayment(true);
//     };

//     const fetchAdvanceRecords = async (employeeId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/advancepayment/${employeeId}`);
//             const allRecords = response.data;
//             setAdvanceRecords(allRecords);
//             filterAdvanceRecords(selectedMonthAdvance, selectedYearAdvance, allRecords);
//         } catch (error) {
//             console.error('Error fetching advance records:', error);
//         }
//     };

//     const fetchAdvanceRepaymentRecords = async (employeeId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/advancerepayments/${employeeId}`);
//             const allRecords = response.data;
//             setAdvanceRepayments(allRecords);
//             filterAdvanceRepayments(selectedMonthAdvance, selectedYearAdvance, allRecords);
//         } catch (error) {
//             console.error('Error fetching advance repayment records:', error);
//         }
//     };

//     const fetchAdvanceBalance = async (employeeId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/advancebalance/${employeeId}`);
//             setAdvanceBalances(response.data);
//             filterAdvanceBalances(selectedMonthAdvance, selectedYearAdvance, response.data);
//         } catch (error) {
//             console.error('Error fetching advance balance:', error);
//         }
//     };

//     useEffect(() => {
//         fetchAdvanceRecords(employee.id);
//         fetchAdvanceRepaymentRecords(employee.id);
//         fetchAdvanceBalance(employee.id);
//     }, [employee]);

//     const filterAdvanceRecords = (month, year, data = advanceRecords) => {
//         const filteredRecords = data.filter(record => {
//             const recordDate = new Date(record.date);
//             return recordDate.getMonth() === month && recordDate.getFullYear() === year;
//         });

//         const totalAdvance = filteredRecords.reduce((total, record) => total + record.amount, 0);
//         setTotalAdvanceCurrentMonth(totalAdvance);
//         setTotalAdvanceAmount(totalAdvance);
//         setFilteredAdvanceRecords(filteredRecords);
//     };

//     const filterAdvanceRepayments = (month, year, data = advanceRepayments) => {
//         const filteredRecords = data.filter(record => {
//             const recordDate = new Date(record.date);
//             return recordDate.getMonth() === month && recordDate.getFullYear() === year;
//         });

//         const totalRepayment = filteredRecords.reduce((total, record) => total + record.amount, 0);
//         setTotalRepayment(totalRepayment);
//         setFilteredAdvanceRepayments(filteredRecords);
//     };

//     const filterAdvanceBalances = (month, year, data = advanceBalances) => {
//         const currentMonth = new Date(year, month);
//         const previousMonth = new Date(year, month - 1);

//         const currentMonthBalance = data.find(balance => {
//             const balanceDate = new Date(balance.month);
//             return balanceDate.getFullYear() === currentMonth.getFullYear() && balanceDate.getMonth() === currentMonth.getMonth();
//         }) || { balance: 0 };

//         let previousMonthBalance = { balance: 0 };

//         for (let i = 1; i <= 12; i++) {
//             const checkMonth = new Date(year, month - i);
//             previousMonthBalance = data.find(balance => {
//                 const balanceDate = new Date(balance.month);
//                 return balanceDate.getFullYear() === checkMonth.getFullYear() && balanceDate.getMonth() === checkMonth.getMonth();
//             }) || previousMonthBalance;

//             if (previousMonthBalance.balance !== 0) break;
//         }

//         setFilteredAdvanceBalances({
//             currentMonth: currentMonthBalance.balance,
//             previousMonth: previousMonthBalance.balance
//         });
//     };

//     useEffect(() => {
//         filterAdvanceRecords(selectedMonthAdvance, selectedYearAdvance);
//         filterAdvanceRepayments(selectedMonthAdvance, selectedYearAdvance);
//         filterAdvanceBalances(selectedMonthAdvance, selectedYearAdvance);
//     }, [selectedMonthAdvance, selectedYearAdvance]);

//     // Advance Payment and Repayments 

//     useEffect(() => {
//         fetchLoanDetails();
//         fetchRepaymentDetails();
//     }, []);

//     const fetchLoanDetails = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${process.env.REACT_APP_LOCAL_URL}/api/loandetails/${employee.id}`
//             );
//             setLoanRecords(response.data);
//         } catch (error) {
//             console.error("Error fetching loan details:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchRepaymentDetails = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${process.env.REACT_APP_LOCAL_URL}/api/repaymentdetails/${employee.id}`
//             );
//             setRepaymentRecords(response.data);
//         } catch (error) {
//             console.error("Error fetching repayment details:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePaymentBonusIncentive = (record) => {
//         // Handle the payment addition logic here
//     };

//     const calculateTotalPayments = (bonusId) => {
//         const payments = paymentBonusIncentive.filter(payment => payment.bonousinsentiveId === bonusId);
//         return payments.reduce((total, payment) => total + parseFloat(payment.paymentAmount), 0);
//     };

//     const getStatusStyle = (status) => {
//         switch (status) {
//             case 'Completed':
//                 return { backgroundColor: 'blue', color: 'white' };
//             case 'Partially Paid':
//                 return { backgroundColor: 'yellow', color: 'black' };
//             case 'Pending':
//                 return { backgroundColor: 'red', color: 'white' };
//             default:
//                 return {};
//         }
//     };

//     const getTotalRepaymentAmount = (loanId) => {
//         // Filter repayment records for the specific loanId
//         const repaymentsForLoan = repaymentRecords.filter(repayment => repayment.loanId === loanId);

//         // Calculate total repayment amount
//         const totalRepaymentAmount = repaymentsForLoan.reduce((total, repayment) => {
//             return total + parseFloat(repayment.repaymentAmount || 0);
//         }, 0);

//         return totalRepaymentAmount.toFixed(2); // Adjust as per your requirement
//     };

//     const calculateLoanDue = (loanAmount, totalRepaymentAmount) => {
//         const loanDue = parseFloat(loanAmount) - parseFloat(totalRepaymentAmount);
//         return loanDue.toFixed(2); // Adjust as per your requirement
//     };

//     const getLoanStatus = (loanDue) => {
//         return parseFloat(loanDue) === 0 ? 'Close' : 'Open';
//     };


//     // Add Loan Modal 

//     const handleAddLoanModal = () => {
//         setIsAddLoanModalOpen(true);
//     };

//     const handleCloseLoanModal = () => {
//         setIsAddLoanModalOpen(false);
//     };

//     // Add Bonous Insentive 
//     const handleAddBonousInsentiveModal = () => {
//         setIsAddBonousInsentiveModalOpen(true);
//     };

//     const handleCloseBonousInsentiveModal = () => {
//         setIsAddBonousInsentiveModalOpen(false);
//     };


//     const handleloanRepaymentHistory = (record) => {
//         console.log("record", record)
//         setloanRepaymentHistory(record);
//         setIsloanRepaymentHistory(true);
//     };
//     const handlePaymentBonousInsentive = (record) => {
//         console.log("record", record)
//         setpaymentBonousInsentive(record);
//         setIspaymentBonousInsentive(true);
//     };

//     const handleChangeSalary = (employee) => {
//         console.log("employee", employee)
//         setChangeSalary(employee);
//         setIschangeSalary(true);
//     };
//     // Show Documention  
//     const handleChangeDocumention = (employee) => {
//         console.log("employee", employee)
//         setChangeDocumention(employee);
//         setIschangeDocumention(true);
//     };
//     // Add New Documention
//     const handleAddDocumention = (employee) => {
//         console.log("employee", employee)
//         setAddDocumention(employee);
//         setIsAddDocumentation(true);
//     };


//     const handleSalaryHistory = (employee) => {
//         console.log("employee", employee)
//         setSalaryHistory(employee);
//         setIsSalaryHistory(true);
//     };

//     const handleviewBonousInsentive = (record) => {
//         console.log("record", record)
//         setviewBonousInsentive(record);
//         setIsviewBonousInsentive(true);
//     };

//     // Transfer Employee  
//     const handleAddTransfer = (employee) => {
//         console.log("employee", employee)
//         setAddTransfer(employee);
//         setIsAddTransfer(true);
//     };

//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(5);

//     const fetchEmployeeHistory = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_LOCAL_URL}/activeinactive_employee/${employee.id}`
//             );
//             setEmployeeHistory(response.data);
//         } catch (error) {
//             console.error("Error fetching check-in/out history:", error);
//         }
//     };
//     const fetchTransferHistory = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_LOCAL_URL}/transferHistory/${employee.id}`
//             );
//             setTransferHistory(response.data);
//         } catch (error) {
//             console.error("Error fetching transfer history:", error);
//         }
//     };
//     const fetchBonousHistory = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_LOCAL_URL}/bonousinsentivehistory/${employee.id}`
//             );
//             setBonusIncentive(response.data);
//         } catch (error) {
//             console.error("Error fetching bonus/incentive history:", error);
//         }
//     };

//     const fetchBonousPaymentHistory = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_LOCAL_URL}/bonousinsentive/paymenthistory/${employee.id}`
//             );
//             setPaymentBonusIncentive(response.data);
//         } catch (error) {
//             console.error("Error fetching bonus/incentive payment history:", error);
//         }
//     };

//     const fetchAttendanceRecords = async (employeeId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/attendance/${employeeId}`);
//             const attendanceData = response.data || [];
//             setAttendanceRecords(attendanceData);
//             filterAttendanceRecords(selectedMonth, selectedYear, attendanceData);
//         } catch (error) {
//             console.error('Error fetching attendance records:', error);
//         }
//     };

//     const fetchSalaryRecords = async (employeeId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/salary/${employeeId}`);
//             const allRecords = response.data;
//             setSalaryRecords(allRecords);
//             filterAdvanceRecords(selectedMonth, selectedYear, allRecords);
//         } catch (error) {
//             console.error('Error fetching salary records:', error);
//         }
//     };
//     useEffect(() => {
//         fetchEmployeeHistory();
//         fetchTransferHistory();
//         fetchBonousHistory();
//         fetchBonousPaymentHistory();
//         fetchSalaryRecords(employee.id);
//         fetchAttendanceRecords(employee.id);
//     }, [employee]);

//     const filterAttendanceRecords = (month, year, data = attendanceRecords) => {
//         const filteredRecords = data.filter(record => {
//             const recordDate = new Date(record.date);
//             return recordDate.getMonth() === month && recordDate.getFullYear() === year;
//         });

//         const presentCount = filteredRecords.filter(record =>
//             ['present', 'overtime'].includes(record.status.toLowerCase())
//         ).length;
//         const absentCount = filteredRecords.filter(record =>
//             ['absent'].includes(record.status.toLowerCase())
//         ).length;
//         const halfDayCount = filteredRecords.filter(record =>
//             ['half day'].includes(record.status.toLowerCase())
//         ).length;
//         const paidLeaveCount = filteredRecords.filter(record =>
//             ['paid leave'].includes(record.status.toLowerCase())
//         ).length;
//         const unpaidLeaveCount = filteredRecords.filter(record =>
//             ['unpaid leave'].includes(record.status.toLowerCase())
//         ).length;
//         const overtimeCount = filteredRecords.filter(record =>
//             ['overtime'].includes(record.status.toLowerCase())
//         ).length;
//         const weeklyOffCount = filteredRecords.filter(record =>
//             ['weekly off'].includes(record.status.toLowerCase())
//         ).length;

//         setTotalPresent(presentCount);
//         setTotalAbsent(absentCount);
//         setTotalHalfDay(halfDayCount);
//         setTotalPaidLeave(paidLeaveCount);
//         setTotalUnpaidLeave(unpaidLeaveCount);
//         setTotalOvertime(overtimeCount);
//         setTotalWeeklyOff(weeklyOffCount);
//         setFilteredAttendance(filteredRecords);
//     };

//     // Handle month/year change for attendance
//     useEffect(() => {
//         filterAttendanceRecords(selectedMonth, selectedYear);
//     }, [selectedMonth, selectedYear]);

//     // Handle month/year change for salary
//     useEffect(() => {
//         filterAdvanceRecords(selectedMonth, selectedYear);
//     }, [selectedMonth, selectedYear]);

//     // Pagination logic
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItemsemployeehistory = employeeHistory ? employeeHistory.slice(indexOfFirstItem, indexOfLastItem) : [];
//     const currentItemstransferhistory = transferHistory ? transferHistory.slice(indexOfFirstItem, indexOfLastItem) : [];
//     const currentItemsLoanhistory = loanRecords ? loanRecords.slice(indexOfFirstItem, indexOfLastItem) : [];
//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     // Function to handle opening edit modal
//     const handleEditEmployee = () => {
//         setIsEditModalOpen(true);
//     };

//     const handleUpdateEmployees = () => {
//         toast.success('Data uploaded successfully');
//         fetchEmployeeHistory();
//         fetchAdvanceRecords(employee.id);
//         fetchAdvanceRepaymentRecords(employee.id);
//         fetchAdvanceBalance(employee.id);
//     };

//     // Function to handle downloading a file
//     // const handleDownload = async (fileUrl, fileName) => {
//     //     console.log(fileUrl);
//     //     try {
//     //         const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/download/${fileUrl}`, {
//     //             responseType: 'blob' // Ensure response is treated as binary data
//     //         });
//     //         const url = window.URL.createObjectURL(new Blob([response.data]));
//     //         const link = document.createElement('a');
//     //         link.href = url;
//     //         link.setAttribute('download', fileName);
//     //         document.body.appendChild(link);
//     //         link.click();
//     //     } catch (error) {
//     //         console.error('Error downloading file:', error);
//     //     }
//     // };
//     // Function to handle downloading a file
//     const handleDownload = async (fileUrl, fileName, fileType) => {
//         console.log(fileUrl);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/download/${fileUrl}`, {
//                 responseType: 'blob' // Ensure response is treated as binary data
//             });

//             // Determine the file extension based on the file type
//             const extension = fileType === 'image' ? 'jpg' : 'pdf';
//             const finalFileName = `${fileName}.${extension}`;

//             const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', finalFileName);
//             document.body.appendChild(link);
//             link.click();
//         } catch (error) {
//             console.error('Error downloading file:', error);
//         }
//     };
//     const handleEmployeePrint = () => {
//         setShowSidebar(false); // Set to false to hide sidebar
//         setShowSearchBar(false);
//         setShowEmployeePrint(true);
//     };

//     const handleClosePreview = () => {
//         setShowSidebar(true); // Set to true to hide sidebar
//         setShowSearchBar(true);
//         setShowEmployeePrint(false);
//     };


//     // Function to format the date
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} `;
//     };

//     return (
//         <div className="shadow-sm bg-white rounded">
//             <ToastContainer />

//             {showEmployeePrint ? (
//                 <EmployeePrint
//                     record={employee}
//                     onClose={handleClosePreview}
//                 />
//             ) : (
//                 <div className="card-body p-4">
//                     <div className="row">
//                         <div className="col-md-9 d-flex  justify-content-between px-3">
//                             <div>
//                                 <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder font-bold m-0">
//                                     {employee.employeeName}
//                                 </h2>
//                                 <hr className="m-1" />
//                                 <h6 className="title-detail m-0">
//                                     Employee Code: {employee.employeeCode}
//                                 </h6>
//                             </div>

//                             <div>
//                                 <p className="m-0">
//                                     <i className="fa fa-building"></i> <span> Department: {employee.departmentName || "N/A"}</span>
//                                 </p>
//                                 <p className="m-0">
//                                     <i class="fas fa-users"></i> <span> Designation: {employee.positionName || "N/A"}</span>
//                                 </p>
//                                 <p className="m-0">
//                                     <i class="fa fa-envelope" aria-hidden="true"></i> <span> Email: {employee.employeeEmail || "N/A"}</span>
//                                 </p>
//                                 <p className="m-0">
//                                     <i class="fa fa-phone"></i> <span> Phone: {employee.employeePhone || "N/A"}</span>
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="col-md-3">
//                             <div className=" p-2 barcode-inner d-flex gap-2 align-items-center justify-content-center">
//                                 <button onClick={onClose} className="btn btn-outline-primary">
//                                     <i className="fa fa-arrow-left"></i> Back
//                                 </button>
//                                 <button onClick={handleEditEmployee} className="btn btn-outline-primary">
//                                     <i className="fa fa-edit"></i>    Edit
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <hr className="m-0 p-0" />
//                     <div className="row ">
//                         <div className="col-md-12 px-0 py-2">
//                             <ul style={{borderTopLeftRadius:"15px",borderTopRightRadius:"15px",backgroundColor:"#00509d"}} className="nav nav-tabs px-2 " id="myTab" role="tablist">
//                                 <li className="nav-item">
//                                     <a
//                                         className="nav-link active show"
//                                         id="details-tab"
//                                         data-toggle="tab"
//                                         href="#details"
//                                         role="tab"
//                                         aria-controls="details"
//                                         aria-selected="true"
//                                     >
//                                         Basic Info
//                                     </a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a
//                                         className="nav-link"
//                                         id="documentation-tab"
//                                         data-toggle="tab"
//                                         href="#documentation"
//                                         role="tab"
//                                         aria-controls="documentation"
//                                         aria-selected="false"
//                                     >
//                                         Documentation
//                                     </a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a
//                                         className="nav-link"
//                                         id="attendance-tab"
//                                         data-toggle="tab"
//                                         href="#attendance"
//                                         role="tab"
//                                         aria-controls="attendance"
//                                         aria-selected="false"
//                                     >
//                                         Attendance
//                                     </a>
//                                 </li>

//                                 <li className="nav-item">
//                                     <a
//                                         className="nav-link"
//                                         id="advancesalary-tab"
//                                         data-toggle="tab"
//                                         href="#advancesalary"
//                                         role="tab"
//                                         aria-controls="advancesalary"
//                                         aria-selected="false"
//                                     >
//                                         Advance Payment
//                                     </a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a
//                                         className="nav-link"
//                                         id="salary-tab"
//                                         data-toggle="tab"
//                                         href="#salary"
//                                         role="tab"
//                                         aria-controls="salary"
//                                         aria-selected="false"
//                                     >
//                                         Salary Ledger
//                                     </a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a
//                                         className="nav-link"
//                                         id="loanhistory-tab"
//                                         data-toggle="tab"
//                                         href="#loanhistory"
//                                         role="tab"
//                                         aria-controls="loanhistory"
//                                         aria-selected="false"
//                                     >
//                                         Loan
//                                     </a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a
//                                         className="nav-link"
//                                         id="bonusincentive-tab"
//                                         data-toggle="tab"
//                                         href="#bonusincentive"
//                                         role="tab"
//                                         aria-controls="bonusincentive"
//                                         aria-selected="false"
//                                     >
//                                         Bonus/Incentive
//                                     </a>
//                                 </li>
//                             </ul>
//                             <div className="tab-content" id="myTabContent">
//                                 <div className="tab-pane fade active show" id="details" role="tabpanel" aria-labelledby="details-tab">
//                                     <div className="">
//                                         <div className=" p-2 d-flex gap-2">
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('basicInfo')}>Basic Info</button>
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('jobdetails')}>Positional Details</button>
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('familydetails')}>Family Details</button>
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('salarydetails')}>Salary Details</button>
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('accountdetails')}>Bank Details</button>
//                                             {/* <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('uploads')}>Uploads</button> */}
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('employeehistory')}>Employee History</button>
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('transferhistory')}>Transfer History</button>
//                                         </div>
//                                         <div className="tab-content m-1 rounded border">
//                                             {currentSection === 'basicInfo' && (
//                                                 <div className="row">
//                                                     <div className="col-md-9" style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto", overflowX: "hidden" }}>
//                                                         <table className="table table-hover" cellPadding="0" cellSpacing="0">
//                                                             <tbody>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Name</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Code</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeCode || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Email</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeEmail || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Phone</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeePhone || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Alt Phone</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeAltPhone || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee DOB</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {formatDate(employee.employeeDOB) || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Gender</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeGender || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Blood Group</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeBloodGroup || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee PAN</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeePan || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Aadhar</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeAadhar || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>

//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Current Address</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeAddress1 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Current City</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeCity1 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Current State</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeState1 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Current Pincode</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeePincode1 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Permanent Address</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeAddress2 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Permanent City</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeCity2 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Permanent State</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeState2 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Permanent Pincode</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeePincode2 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>

//                                                             </tbody>
//                                                         </table>

//                                                     </div>
//                                                     <div className="col-md-3 pt-2 text-center">
//                                                         <img
//                                                             src={employee.passportSizePhoto
//                                                                 ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.passportSizePhoto}`
//                                                                 : myImage}
//                                                             style={{ width: "200px" }}
//                                                             alt="Employee"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {currentSection === 'accountdetails' && (
//                                                 <div className="row">
//                                                     <div className="col-md-9" style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto", overflowX: "hidden" }}>
//                                                         <table className="table table-hover" cellPadding="0" cellSpacing="0">
//                                                             <tbody>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Account Holder Name</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.accountHolderName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Bank Name</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.bankName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Account Number</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.accountNumber || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>

//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">IFSC Code</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.ifscCode || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Branch Name</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.branchName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Passbook / Check</p>
//                                                                     </td>
//                                                                     <td >{employee.passbook_check ? (
//                                                                         <div>
//                                                                             : : <a href="#" onClick={() => handleDownload(employee.passbook_check, 'passbook_check.pdf')}>
//                                                                                 Download Passbook/Check
//                                                                             </a>
//                                                                         </div>
//                                                                     ) : (<p className="mb-0">: -</p>
//                                                                     )}
//                                                                     </td>
//                                                                 </tr>
//                                                             </tbody>
//                                                         </table>
//                                                     </div>
//                                                     <div className="col-md-3 pt-2 text-center">
//                                                         <img
//                                                             src={employee.passportSizePhoto
//                                                                 ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.passportSizePhoto}`
//                                                                 : myImage}
//                                                             style={{ width: "200px" }}
//                                                             alt="Employee"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {currentSection === 'familydetails' && (
//                                                 <div className="row">
//                                                     <div className="col-md-9" style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto", overflowX: "hidden" }}>
//                                                         <table className="table table-hover" cellPadding="0" cellSpacing="0">
//                                                             <tbody>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Father Name</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.fatherName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Mother Name</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.motherName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Marital Status</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeMaritalStatus || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>

//                                                                 {employee.employeeMaritalStatus === 'married' && (
//                                                                     <>
//                                                                         <tr>
//                                                                             <td bgcolor="#f2f3f4" width="200">
//                                                                                 <p className="mb-0 font-bold">Spouse Name</p>
//                                                                             </td>
//                                                                             <td>
//                                                                                 <p className="mb-0">: {employee.spouseName || 'N/A'}</p>
//                                                                             </td>
//                                                                         </tr>
//                                                                         {employee.haveChildren === 'yes' && employee.children && (
//                                                                             <>
//                                                                                 <tr>
//                                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                                         <p className="mb-0 font-bold">Children</p>
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <p className="mb-0">: {employee.haveChildren}</p>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                                 {JSON.parse(employee.children).map((child, index) => (
//                                                                                     <tr key={index}>
//                                                                                         <td bgcolor="#f2f3f4" width="200">
//                                                                                             <p className="mb-0 font-bold">Name: {child.name}</p>
//                                                                                         </td>
//                                                                                         <td>
//                                                                                             <p className="mb-0">DOB: {child.dob}</p>
//                                                                                         </td>
//                                                                                     </tr>
//                                                                                 ))}
//                                                                             </>
//                                                                         )}
//                                                                     </>
//                                                                 )}

//                                                                 {(employee.employeeMaritalStatus === 'widowed' && employee.haveChildren === 'yes') && (
//                                                                     <>
//                                                                         <tr>
//                                                                             <td bgcolor="#f2f3f4" width="200">
//                                                                                 <p className="mb-0 font-bold">Children</p>
//                                                                             </td>
//                                                                             <td>
//                                                                                 <p className="mb-0">: {employee.haveChildren}</p>
//                                                                             </td>

//                                                                         </tr>
//                                                                         {JSON.parse(employee.children).map((child, index) => (
//                                                                             <tr key={index}>
//                                                                                 <td bgcolor="#f2f3f4" width="200">
//                                                                                     <p className="mb-0 font-bold">Name : {child.name}</p>
//                                                                                 </td>
//                                                                                 <td>
//                                                                                     <p className="mb-0">DOB: {child.dob}</p>
//                                                                                 </td>
//                                                                             </tr>
//                                                                         ))}
//                                                                     </>
//                                                                 )}

//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Emergency Contact Person 1</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.emergencyContactName1 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Emergency Contact Number 1</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.emergencyContactNumber1 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Emergency Contact Relation 1</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.emergencyContactRelation1 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Emergency Contact Person 2</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.emergencyContactName2 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Emergency Contact Number 2</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.emergencyContactNumber2 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Emergency Contact Relation 2</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.emergencyContactRelation2 || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>


//                                                             </tbody>
//                                                         </table>
//                                                     </div>
//                                                     <div className="col-md-3 pt-2 text-center">
//                                                         <img
//                                                             src={employee.passportSizePhoto
//                                                                 ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.passportSizePhoto}`
//                                                                 : myImage}
//                                                             style={{ width: "200px" }}
//                                                             alt="Employee"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {currentSection === 'salarydetails' && (
//                                                 <div className="row">
//                                                     <div className="col-md-9" style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto", overflowX: "hidden" }}>
//                                                         <table className="table table-hover" cellPadding="0" cellSpacing="0">
//                                                             <tbody>
//                                                                 <h6 className=' m-0 text-primary fw-bolder p-2'>Basic Salary -------</h6>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Basic Salary</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.basicSalary || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">VDA</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.vda || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">House Allowance</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.houserentallowances || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Conveyance Allowance</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.conveyanceallowances || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Dearness Allowance</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.dearnessallowances || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Special Allowance</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.specialallowances || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Gross Salary</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.grossSalary || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <h6 className=' m-0 text-primary fw-bolder p-2'>EPF ESIC -------</h6>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">EPF & ESIC Applicable</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.epfesicApplicable ? 'Yes' : 'No'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <h6 className=' m-0 text-primary fw-bolder p-2'>Employeer  -------</h6>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">EPF 12% (Employer)</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.epfEmployer || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">ESIC 3.25%(Employer)</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.esicEmployer || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Total Employer Contribution</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.totalEmployerContribution || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <h6 className=' m-0 text-primary fw-bolder p-2'>Employee -------</h6>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">EPF 12% (Employee)</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.epfEmployee || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">ESIC 0.75% (Employee)</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.esicEmployee || '0'}</p>
//                                                                     </td>
//                                                                 </tr>

//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Total Employee Deduction</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.totalEmployeeDeduction || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <h6 className=' m-0 text-primary fw-bolder p-2'>TDS  -------</h6>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">TDS Applicable</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.tdsApplicable ? 'Yes' : 'No'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Total TDS Deduction</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.totalTdsDeduction || '0'}</p>
//                                                                     </td>
//                                                                 </tr>

//                                                                 <h6 className=' m-0 text-primary fw-bolder p-2'>Total Salary -------</h6>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Total In Hand Salary</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.totalInHandSalary || '0'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Total Payable Salary</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: &#x20B9;{employee.totalPayableSalary || '0'}</p>
//                                                                     </td>
//                                                                 </tr>

//                                                             </tbody>

//                                                         </table>
//                                                     </div>
//                                                     <div className="col-md-3 pt-2 text-center">
//                                                         <img
//                                                             src={employee.passportSizePhoto
//                                                                 ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.passportSizePhoto}`
//                                                                 : myImage}
//                                                             style={{ width: "200px" }}
//                                                             alt="Employee"
//                                                         />
//                                                         <div className="mt-1">
//                                                             <button className="btn btn-success m-1" onClick={() => handleChangeSalary(employee)}>Add/change Salary</button>
//                                                             <button className="btn btn-primary m-1" onClick={() => handleSalaryHistory(employee)}>Salary History</button>
//                                                         </div>

//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {currentSection === 'jobdetails' && (
//                                                 <div className="row">
//                                                     <div className="col-md-9" style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto", overflowX: "hidden" }}>
//                                                         <table className="table table-hover" cellPadding="0" cellSpacing="0">
//                                                             <tbody>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Department</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.departmentName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Position</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.positionName || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Employee Type</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.employeeType || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Joining Date</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.joiningDate ? formatDate(employee.joiningDate) : 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Intern/Contractual</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.interncontractual ? formatDate(employee.interncontractual) : 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>


//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Joining Company</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.joiningCompany || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <td bgcolor="#f2f3f4" width="200">
//                                                                         <p className="mb-0 font-bold">Joining Office</p>
//                                                                     </td>
//                                                                     <td>
//                                                                         <p className="mb-0">: {employee.joiningOffice || 'N/A'}</p>
//                                                                     </td>
//                                                                 </tr>
//                                                             </tbody>
//                                                         </table>

//                                                     </div>
//                                                     <div className="col-md-3 pt-2 text-center">
//                                                         <img
//                                                             src={employee.passportSizePhoto
//                                                                 ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.passportSizePhoto}`
//                                                                 : myImage}
//                                                             style={{ width: "200px" }}
//                                                             alt="Employee"
//                                                         />
//                                                         <div className="mt-1">
//                                                             <button className="btn btn-success" onClick={() => handleAddTransfer(employee)}>Transfer</button>
//                                                         </div>

//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {currentSection === 'employeehistory' && (
//                                                 <div>
//                                                     <div className="row">
//                                                         <div className="col-md-12">
//                                                             <table className="table table-striped">
//                                                                 <thead>
//                                                                     <tr>
//                                                                         <th>Employee Name</th>
//                                                                         <th>Employee status</th>
//                                                                         <th>Employee reason</th>
//                                                                         <th>Employee fromDate</th>
//                                                                         <th>Employee toDate</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     {isLoading ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">
//                                                                                 {/* Correct usage of spinner */}
//                                                                                 <div className="d-flex justify-content-center align-items-center">
//                                                                                     <ThreeDots
//                                                                                         color="#00BFFF"
//                                                                                         height={80}
//                                                                                         width={80}
//                                                                                     />
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     ) : currentItemsemployeehistory.length === 0 ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">
//                                                                                 There is No TransferList.
//                                                                             </td>
//                                                                         </tr>
//                                                                     ) : (
//                                                                         currentItemsemployeehistory.map((entry) => (
//                                                                             <React.Fragment key={entry.event_id}>
//                                                                                 <tr>
//                                                                                     <td>{entry.employeeName}</td>
//                                                                                     <td>{entry.status}</td>
//                                                                                     <td>{entry.reason}</td>
//                                                                                     <td>{formatDate(entry.fromDate)}</td>
//                                                                                     <td>{entry.toDate ? formatDate(entry.toDate) : 'N/A'}</td>
//                                                                                 </tr>
//                                                                                 {entry.description && (
//                                                                                     <tr>
//                                                                                         <td colSpan="6">
//                                                                                             <span style={{ fontWeight: "700" }}>Description: </span>{entry.description}
//                                                                                         </td>
//                                                                                     </tr>
//                                                                                 )}
//                                                                             </React.Fragment>
//                                                                         ))
//                                                                     )}
//                                                                 </tbody>

//                                                             </table>
//                                                             {/* Pagination */}
//                                                             <ul className="pagination">
//                                                                 <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
//                                                                     <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>Previous</a>
//                                                                 </li>
//                                                                 {Array.from({ length: Math.ceil(employeeHistory?.length / itemsPerPage) || 1 }, (_, i) => (
//                                                                     <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
//                                                                         <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1}</a>
//                                                                     </li>
//                                                                 ))}
//                                                                 <li className={`page-item ${currentPage === Math.ceil(employeeHistory?.length / itemsPerPage) && 'disabled'}`}>
//                                                                     <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>Next</a>
//                                                                 </li>
//                                                             </ul>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {currentSection === 'transferhistory' && (
//                                                 <div>
//                                                     <div className="row">
//                                                         <div className="col-md-12">
//                                                             <table className="table table-striped">
//                                                                 <thead>
//                                                                     <tr>
//                                                                         <th>Employee Name</th>
//                                                                         <th>Transfer From</th>
//                                                                         <th>Transfer To</th>
//                                                                         <th>Transfer Date</th>

//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     {isLoading ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">
//                                                                                 {/* Correct usage of spinner */}
//                                                                                 <div className="d-flex justify-content-center align-items-center">
//                                                                                     <ThreeDots color="#00BFFF" height={80} width={80} />
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     ) : currentItemstransferhistory.length === 0 ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">
//                                                                                 No Transfer History.
//                                                                             </td>
//                                                                         </tr>
//                                                                     ) : (
//                                                                         currentItemstransferhistory.map((entry) => (
//                                                                             <React.Fragment key={entry.event_id}>
//                                                                                 <tr>
//                                                                                     <td>{entry.employee_name}</td>
//                                                                                     <td>{entry.transfer_from}</td>
//                                                                                     <td>{entry.transfer_to}</td>
//                                                                                     <td>{formatDate(entry.transfer_date)}</td>
//                                                                                 </tr>
//                                                                                 <tr>
//                                                                                     <td colSpan="12">
//                                                                                         <strong>Description: </strong>{entry.description}
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </React.Fragment>
//                                                                         ))
//                                                                     )}
//                                                                 </tbody>

//                                                             </table>
//                                                             {/* Pagination */}
//                                                             <ul className="pagination">
//                                                                 <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
//                                                                     <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>Previous</a>
//                                                                 </li>
//                                                                 {Array.from({ length: Math.ceil(transferHistory?.length / itemsPerPage) || 1 }, (_, i) => (
//                                                                     <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
//                                                                         <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1}</a>
//                                                                     </li>
//                                                                 ))}
//                                                                 <li className={`page-item ${currentPage === Math.ceil(transferHistory?.length / itemsPerPage) && 'disabled'}`}>
//                                                                     <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>Next</a>
//                                                                 </li>
//                                                             </ul>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* attendance History  */}
//                                 <div className="tab-pane fade" id="attendance" role="tabpanel" aria-labelledby="attendance-tab">
//                                     <div className="row">
//                                         <div className="nav p-2 d-flex gap-2">
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('attendance')}>Attendance Details</button>
//                                         </div>
//                                         <div className="tab-content m-1 rounded border">
//                                             {currentSection === 'attendance' && (
//                                                 <div>
//                                                     <div className="d-flex align-items-center justify-content-between pt-2">
//                                                         <h6 className='text-black fw-bolder m-0 px-2'>Attendance Records</h6>
//                                                         <div className='d-flex align-items-center justify-content-center gap-1'>
//                                                             <label className='pt-2 text-black fw-bolder'>Filter:</label>
//                                                             <select className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
//                                                                 {Array.from({ length: 12 }, (_, i) => (
//                                                                     <option key={i} value={i}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
//                                                                 ))}
//                                                             </select>

//                                                             <select className="form-control" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
//                                                                 {Array.from({ length: 10 }, (_, i) => (
//                                                                     <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="card-body form-row">
//                                                         <div className='col-md-10 p-0' style={{ maxHeight: "450px", overflowY: "auto" }}>
//                                                             <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                                 <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                                     <tr>
//                                                                         <th>Photo</th>
//                                                                         <th>Name</th>
//                                                                         <th>Date</th>
//                                                                         <th>Status</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     {isLoading ? (
//                                                                         <div className="d-flex justify-content-center align-items-center">
//                                                                             {/* Correct usage of spinner */}
//                                                                             <ThreeDots
//                                                                                 color="#00BFFF"
//                                                                                 height={80}
//                                                                                 width={80}
//                                                                             />
//                                                                         </div>
//                                                                     ) : (filteredAttendance.length === 0 ? (
//                                                                         <tr>
//                                                                             <td colSpan="5" className="text-center">No Attendance Found First Select the Employee.</td>
//                                                                         </tr>
//                                                                     ) : (
//                                                                         filteredAttendance
//                                                                             .sort((a, b) => new Date(a.date) - new Date(b.date))
//                                                                             .map(record => (
//                                                                                 <tr key={`${record.id}-${record.date}`}>
//                                                                                     <td>
//                                                                                         <img
//                                                                                             src={
//                                                                                                 employee.passportSizePhoto
//                                                                                                     ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.passportSizePhoto}`
//                                                                                                     : myImage
//                                                                                             }
//                                                                                             style={{ width: "50px" }}
//                                                                                             alt="Employee"
//                                                                                         />
//                                                                                     </td>
//                                                                                     <td>{employee.employeeName}</td>
//                                                                                     <td>{formatDate(record.date)}</td>
//                                                                                     <td>{record.status}</td>
//                                                                                 </tr>
//                                                                             ))
//                                                                     ))}
//                                                                 </tbody>

//                                                             </table>
//                                                         </div>
//                                                         <div className="card-footer col-md-2">
//                                                             <h5 className="text-primary text-center fw-semibold">Summary Days</h5>
//                                                             <hr />
//                                                             <div className="d-flex gap-3 flex-column">
//                                                                 <div className="bg-success text-white p-2 text-center border rounded">Present: {totalPresent}</div>
//                                                                 <div className="bg-danger text-white p-2 text-center border rounded">Absent: {totalAbsent}</div>
//                                                                 <div className="bg-info text-white p-2 text-center border rounded">Half Day: {totalHalfDay}</div>
//                                                                 <div className="bg-warning text-white p-2 text-center border rounded">Weekly Off: {totalWeeklyOff}</div>
//                                                                 <div className="bg-warning text-white p-2 text-center border rounded">Unpaid Leave: {totalUnpaidLeave}</div>
//                                                                 <div className="bg-warning text-white p-2 text-center border rounded">Paid Leave: {totalPaidLeave}</div>
//                                                                 <div className="bg-primary text-white p-2 text-center border rounded">Overtime: {totalOvertime}</div>
//                                                             </div>
//                                                         </div>

//                                                     </div>
//                                                 </div>
//                                             )}

//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* advancesalary History  */}
//                                 <div className="tab-pane fade" id="advancesalary" role="tabpanel" aria-labelledby="advancesalary-tab">
//                                     <div className="row">
//                                         <div className="nav p-2 d-flex gap-2">
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('advancesalarydetails')}>Advance Payment</button>
//                                         </div>
//                                         <div className="tab-content m-1 rounded border">
//                                             {currentSection === 'advancesalarydetails' && (
//                                                 <div>
//                                                     <div className=" d-flex align-items-center justify-content-between p-2">
//                                                         <div>
//                                                             <h6 className='text-danger fw-bolder pt-3'>Carry Forward Balance: {filteredAdvanceBalances.previousMonth || "0"}</h6>
//                                                         </div>
//                                                         <div className="d-flex gap-2">
//                                                             <div className='d-flex align-items-center justify-content-center gap-1'>
//                                                                 <label className='pt-2 text-black fw-bolder'>Filter:</label>
//                                                                 <select className="form-control" value={selectedMonthAdvance}
//                                                                     onChange={(e) => setSelectedMonthAdvance(parseInt(e.target.value))}
//                                                                 >
//                                                                     <option value="">Select Month</option>
//                                                                     {Array.from({ length: 12 }, (_, i) => (
//                                                                         <option key={i} value={i}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
//                                                                     ))}
//                                                                 </select>
//                                                                 <select className="form-control" value={selectedYearAdvance}
//                                                                     onChange={(e) => setSelectedYearAdvance(parseInt(e.target.value))}
//                                                                 >
//                                                                     <option value="">Select Year</option>
//                                                                     {Array.from({ length: 10 }, (_, i) => (
//                                                                         <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>
//                                                             <button className="btn btn-primary" onClick={() => handleAdvanceRepayment(filteredAdvanceRecords, totalAdvanceAmount)}>Advance Repayment</button>
//                                                         </div>
//                                                     </div>
//                                                     <hr className="m-0" />
//                                                     <div className="row">
//                                                         <div className='col-md-6' >
//                                                             <h6 className=' m-0 text-primary fw-bolder pt-2'>Advance Payment:</h6>
//                                                             <div style={{ maxHeight: "220px", overflowY: "auto" }}>
//                                                                 <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                                     <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                                         <tr>
//                                                                             <th>Payment Date</th>
//                                                                             <th>Amount</th>
//                                                                             <th>Payment Mode Name</th>

//                                                                         </tr>
//                                                                     </thead>
//                                                                     <tbody>
//                                                                         {isLoading ? (
//                                                                             <div className="d-flex justify-content-center align-items-center">
//                                                                                 {/* Correct usage of spinner */}
//                                                                                 <ThreeDots
//                                                                                     color="#00BFFF"
//                                                                                     height={80}
//                                                                                     width={80}
//                                                                                 />
//                                                                             </div>
//                                                                         ) : (filteredAdvanceRecords.length === 0 ? (
//                                                                             <tr>
//                                                                                 <td colSpan="3" className="text-center">No advance records found for the selected month and year.</td>
//                                                                             </tr>
//                                                                         ) : (filteredAdvanceRecords.map(record => (
//                                                                             <tr key={record.id}>
//                                                                                 <td>{formatDate(record.date)}</td>
//                                                                                 <td>{record.amount}</td>
//                                                                                 <td>{record.paymentModeName || "-"}</td>
//                                                                             </tr>
//                                                                         ))
//                                                                         ))}
//                                                                     </tbody>
//                                                                     <tfoot>
//                                                                         <tr>
//                                                                             <td colSpan="1">Total :</td>
//                                                                             <td>{totalAdvanceCurrentMonth}</td>
//                                                                             <td>Month: {new Date(selectedYearAdvance, selectedMonthAdvance).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
//                                                                         </tr>
//                                                                     </tfoot>
//                                                                 </table>
//                                                             </div>
//                                                         </div>
//                                                         <div className='col-md-6'>
//                                                             <h6 className=' m-0 text-primary fw-bolder pt-2'>Advance Repayment:</h6>
//                                                             <div style={{ maxHeight: "220px", overflowY: "auto" }}>
//                                                                 <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                                     <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                                         <tr>
//                                                                             <th>Repayment Date</th>
//                                                                             <th>Amount</th>
//                                                                             <th>Payment Mode Name</th>

//                                                                         </tr>
//                                                                     </thead>
//                                                                     <tbody>
//                                                                         {isLoading ? (
//                                                                             <div className="d-flex justify-content-center align-items-center">
//                                                                                 {/* Correct usage of spinner */}
//                                                                                 <ThreeDots
//                                                                                     color="#00BFFF"
//                                                                                     height={80}
//                                                                                     width={80}
//                                                                                 />
//                                                                             </div>
//                                                                         ) : (filteredAdvanceRepayments.length === 0 ? (
//                                                                             <tr>
//                                                                                 <td colSpan="3" className="text-center">No advance repayments found for the selected month and year.</td>
//                                                                             </tr>
//                                                                         ) : (filteredAdvanceRepayments.map(record => (
//                                                                             <tr key={record.id}>
//                                                                                 <td>{formatDate(record.date)}</td>
//                                                                                 <td>{record.amount}</td>
//                                                                                 <td>{record.receivingMode || "-"}</td>
//                                                                             </tr>
//                                                                         ))
//                                                                         ))}
//                                                                     </tbody>
//                                                                     <tfoot>
//                                                                         <tr>
//                                                                             <td colSpan="1">Total :</td>
//                                                                             <td>{totalRepayment}</td>
//                                                                             <td>Month:{new Date(selectedYearAdvance, selectedMonthAdvance).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
//                                                                         </tr>
//                                                                     </tfoot>
//                                                                 </table>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div className="bg-light p-3 d-flex align-items-center justify-content-between">
//                                                         <small className="text-body-secondary">  Previous Month Balance:- {filteredAdvanceBalances.previousMonth || "0"}</small>
//                                                         <small className="text-body-secondary"> Current Month Amt:-  {totalAdvanceCurrentMonth || "0"}</small>
//                                                         <small className="text-body-secondary"> Current Month Received:- {totalRepayment || "0"}</small>
//                                                         <small className="fw-bolder text-black">Closing Balance:- {filteredAdvanceBalances.currentMonth || "0"}</small>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Salary History  */}
//                                 <div className="tab-pane fade" id="salary" role="tabpanel" aria-labelledby="salary-tab">
//                                     <div className="row">
//                                         <div className="nav p-2 d-flex gap-2">
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('salaryslip')}>Salary Slip</button>
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('salarypaymentdetails')}>Payment History</button>
//                                         </div>
//                                         <div className="tab-content m-1 rounded border">
//                                             {currentSection === 'salarypaymentdetails' && (
//                                                 <div>
//                                                     <div className="d-flex align-items-center justify-content-between">
//                                                         <h6 className='text-black fw-bolder py-2 my-3'>Salary Payment Details:</h6>
//                                                         <div className='d-flex align-items-center justify-content-center gap-1'>
//                                                             <label className='pt-2 text-black fw-bolder'>Filter:</label>
//                                                             <select className="form-control" value={selectedMonth}
//                                                                 onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                                                             >
//                                                                 <option value="">Select Month</option>
//                                                                 {Array.from({ length: 12 }, (_, i) => (
//                                                                     <option key={i} value={i}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
//                                                                 ))}
//                                                             </select>
//                                                             <select className="form-control" value={selectedYear}
//                                                                 onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                                                             >
//                                                                 <option value="">Select Year</option>
//                                                                 {Array.from({ length: 10 }, (_, i) => (
//                                                                     <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className='col-md-12' style={{ maxHeight: "450px", overflowY: "auto" }}>
//                                                             <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                                 <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                                     <tr>
//                                                                         <th>Employee Name</th>
//                                                                         <th>Salary Period</th>
//                                                                         <th>Net Salary Payable</th>
//                                                                         <th>Amount Paid</th>
//                                                                         <th>Payment Date</th>
//                                                                         <th>Payment Mode</th>
//                                                                         <th>Description</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     {isLoading ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">
//                                                                                 {/* Correct usage of spinner */}
//                                                                                 <div className="d-flex justify-content-center align-items-center">
//                                                                                     <ThreeDots
//                                                                                         color="#00BFFF"
//                                                                                         height={80}
//                                                                                         width={80}
//                                                                                     />
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     ) : (filteredsalaryPaymentHistory.length === 0 ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">
//                                                                                 There is No Salary Payment Found.
//                                                                             </td>
//                                                                         </tr>
//                                                                     ) : (filteredsalaryPaymentHistory.map(record => (
//                                                                         <tr key={record.id}>
//                                                                             <td>
//                                                                                 {record.employeeName}
//                                                                             </td>
//                                                                             <td>
//                                                                                 {monthNames[record.month - 1]} - {record.year}
//                                                                             </td>

//                                                                             <td>&#x20B9;{record.netSalaryPayableMonth.toFixed(2) || '0'}</td>

//                                                                             <td>
//                                                                                 &#x20B9;{record.amountPaid.toFixed(2) || '0'}
//                                                                             </td>
//                                                                             <td>
//                                                                                 {new Date(record.amountDate).toLocaleDateString()}
//                                                                             </td>
//                                                                             <td>
//                                                                                 {record.paymentModeName}
//                                                                             </td>
//                                                                             <td>
//                                                                                 {record.paymentDescription}
//                                                                             </td>
//                                                                         </tr>
//                                                                     ))
//                                                                     )
//                                                                     )}
//                                                                 </tbody>
//                                                             </table>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {currentSection === 'salaryslip' && (
//                                                 <div>
//                                                     <div className="d-flex align-items-center justify-content-between">
//                                                         <h6 className='text-black fw-bolder py-2 my-3'>Salary Slip:</h6>
//                                                         <div className='d-flex align-items-center justify-content-center gap-1'>
//                                                             <label className='pt-2 text-black fw-bolder'>Filter:</label>
//                                                             <select className="form-control" value={selectedpayrollYear}
//                                                                 onChange={(e) => setSelectedpayrollYear(parseInt(e.target.value))}
//                                                             >
//                                                                 <option value="">Select Year</option>
//                                                                 {Array.from({ length: 10 }, (_, i) => (
//                                                                     <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className='col-md-12' style={{ maxHeight: "450px", overflowY: "auto" }}>
//                                                             <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                                 <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                                     <tr>
//                                                                         <th>Employee Name</th>
//                                                                         <th>Salary Period</th>
//                                                                         <th>Salary With Contribution</th>
//                                                                         <th>Net Salary Payable</th>
//                                                                         <th>Amount Paid</th>
//                                                                         <th>Amount Due</th>
//                                                                         <th>Action</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     {isLoading ? (
//                                                                         <tr>
//                                                                             <td colSpan="12" className="text-center">
//                                                                                 {/* Correct usage of spinner */}
//                                                                                 <div className="d-flex justify-content-center align-items-center">
//                                                                                     <ThreeDots
//                                                                                         color="#00BFFF"
//                                                                                         height={80}
//                                                                                         width={80}
//                                                                                     />
//                                                                                 </div>
//                                                                             </td>
//                                                                         </tr>
//                                                                     ) : (
//                                                                         filteredPayroll.length === 0 ? (
//                                                                             <tr>
//                                                                                 <td colSpan="12" className="text-center">
//                                                                                     There is No Salary Found.
//                                                                                 </td>
//                                                                             </tr>
//                                                                         ) : (
//                                                                             filteredPayroll.map(record => {
//                                                                                 const amountPaid = paymentDetails[record.id] || 0;
//                                                                                 const amountDue = (record.netSalaryPayableMonth || 0) - amountPaid;
//                                                                                 const showAddPaymentButton = amountDue > 0;
//                                                                                 return (
//                                                                                     <tr key={record.id}>
//                                                                                         <td>
//                                                                                             {record.employeeName} <br />
//                                                                                             <small>{record.departmentName}</small>
//                                                                                         </td>
//                                                                                         <td>{monthNames[record.month - 1]} - {record.year}</td>
//                                                                                         <td>&#x20B9;{record.salaryWithContribution != null ? record.salaryWithContribution.toFixed(2) : '0.00'}</td>
//                                                                                         <td>&#x20B9;{record.netSalaryPayableMonth != null ? record.netSalaryPayableMonth.toFixed(2) : '0.00'}</td>
//                                                                                         <td>&#x20B9;{amountPaid.toFixed(2)}</td>
//                                                                                         <td>&#x20B9;{amountDue.toFixed(2)}</td>
//                                                                                         <td>
//                                                                                             <button className="m-1 btn btn-info btn-sm" onClick={() => handlePaymentHistory(record)}>
//                                                                                                 <i className="fa fa-eye" aria-hidden="true"></i> View History
//                                                                                             </button>
//                                                                                             {showAddPaymentButton && (
//                                                                                                 <button className="m-1 btn btn-primary btn-sm" onClick={() => handlePaymentForm(record)}>
//                                                                                                     <i className="fa fa-plus" aria-hidden="true"></i> Add Payment
//                                                                                                 </button>
//                                                                                             )}
//                                                                                         </td>
//                                                                                     </tr>
//                                                                                 );
//                                                                             })
//                                                                         )
//                                                                     )}
//                                                                 </tbody>

//                                                             </table>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* loan History  */}
//                                 <div className="tab-pane fade" id="loanhistory" role="tabpanel" aria-labelledby="loanhistory-tab">
//                                     <div className="row">
//                                         <div className="nav p-2 d-flex gap-2">
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('loandetails')}>Loan Details</button>
//                                         </div>
//                                         <div className="tab-content m-1 rounded border">
//                                             {currentSection === 'loandetails' && (
//                                                 <div>
//                                                     <div className="d-flex align-items-center justify-content-between p-2">
//                                                         <h6 className='text-black fw-bolder py-2 px-3'>Loan Details :</h6>
//                                                         <button onClick={handleAddLoanModal} className="btn btn-outline-primary">
//                                                             <i className="fa fa-plus"></i> Add Loan
//                                                         </button>
//                                                     </div>
//                                                     <div className='col-md-12' style={{ maxHeight: "250px", overflowY: "auto" }}>
//                                                         <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                             <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                                 <tr>
//                                                                     <th>Loan Number</th>
//                                                                     <th>Loan Date</th>
//                                                                     <th>Loan Type</th>
//                                                                     <th>Loan Amt.</th>
//                                                                     <th>Repayment Amt.</th>
//                                                                     <th>Loan Due</th>
//                                                                     <th>Loan Status.</th>
//                                                                     <th>Action</th>
//                                                                 </tr>
//                                                             </thead>
//                                                             <tbody>
//                                                                 {isLoading ? (
//                                                                     <div className="d-flex justify-content-center align-items-center">
//                                                                         {/* Correct usage of spinner */}
//                                                                         <ThreeDots
//                                                                             color="#00BFFF"
//                                                                             height={80}
//                                                                             width={80}
//                                                                         />
//                                                                     </div>
//                                                                 ) : (
//                                                                     loanRecords.length === 0 ? (
//                                                                         <tr>
//                                                                             <td colSpan="8" className="text-center">No loan records found.</td>
//                                                                         </tr>
//                                                                     ) : (
//                                                                         loanRecords.map(record => (
//                                                                             <tr className="bg-dark text-capitalize" key={`${record.id}-${record.date}`}>
//                                                                                 <td>{record.loanNumber}</td>
//                                                                                 <td>{formatDate(record.loanDate)}</td>
//                                                                                 <td>{record.loanFor}</td>
//                                                                                 <td>{record.loanAmount}</td>
//                                                                                 <td>{getTotalRepaymentAmount(record.id)}</td>
//                                                                                 <td>{calculateLoanDue(record.loanAmount, getTotalRepaymentAmount(record.id))}</td>
//                                                                                 <td>{getLoanStatus(calculateLoanDue(record.loanAmount, getTotalRepaymentAmount(record.id)))}</td>
//                                                                                 <td><button className="btn btn-outline-success" onClick={() => handleloanRepaymentHistory(record)}>View Repayment</button></td>
//                                                                             </tr>
//                                                                         ))
//                                                                     ))}
//                                                             </tbody>
//                                                         </table>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* bonusincentiv History  */}
//                                 <div className="tab-pane fade" id="bonusincentive" role="tabpanel" aria-labelledby="bonusincentiv-tab">
//                                     <div className="row">
//                                         <div className="nav p-2 d-flex gap-2">
//                                             <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentSection('bonusincentive')}>Bonus/Incentive Details</button>
//                                         </div>
//                                         <div className="tab-content m-1 rounded border">
//                                             {currentSection === 'bonusincentive' && (
//                                                 <div>
//                                                     <div className="d-flex align-items-center justify-content-between">
//                                                         <h6 className='text-black fw-bolder py-2 my-3'>Bonus/Incentive:</h6>
//                                                         <button onClick={handleAddBonousInsentiveModal} className="btn btn-outline-primary">
//                                                             <i className="fa fa-plus"></i> Add Bonous/Insentive
//                                                         </button>

//                                                     </div>
//                                                     <div className="row">
//                                                         <div className='col-md-12' style={{ maxHeight: "320px", overflowY: "auto" }}>
//                                                             <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                                 <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                                     <tr>
//                                                                         <th>Employee Name</th>
//                                                                         <th>Code</th>
//                                                                         <th>Payment Type</th>
//                                                                         <th>Payment Mode</th>
//                                                                         <th>Period</th>
//                                                                         <th>Amount</th>
//                                                                         <th>Amount Due</th>
//                                                                         <th>Payment Status</th>
//                                                                         <th>Action</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     {isLoading ? (
//                                                                         <div className="d-flex justify-content-center align-items-center">
//                                                                             {/* Correct usage of spinner */}
//                                                                             <ThreeDots
//                                                                                 color="#00BFFF"
//                                                                                 height={80}
//                                                                                 width={80}
//                                                                             />
//                                                                         </div>
//                                                                     ) : (
//                                                                         bonusIncentive.length === 0 ? (
//                                                                             <tr>
//                                                                                 <td colSpan="10" className="text-center">No Bonus and Incentive.</td>
//                                                                             </tr>
//                                                                         ) : (
//                                                                             bonusIncentive.map(record => {
//                                                                                 const totalPayments = calculateTotalPayments(record.id);
//                                                                                 const amountDue = parseFloat(record.amount) - totalPayments;
//                                                                                 let paymentStatus;
//                                                                                 if (amountDue === 0) {
//                                                                                     paymentStatus = 'Completed';
//                                                                                 } else if (amountDue < parseFloat(record.amount)) {
//                                                                                     paymentStatus = 'Partially Paid';
//                                                                                 } else {
//                                                                                     paymentStatus = 'Pending';
//                                                                                 }

//                                                                                 return (
//                                                                                     <React.Fragment key={record.id}>
//                                                                                         <tr>
//                                                                                             <td>{record.employeeName}</td>
//                                                                                             <td>{record.employeeCode}</td>
//                                                                                             <td>{record.paymentType}</td>
//                                                                                             <td>{record.paymentMode}</td>
//                                                                                             <td>{formatDate(record.fromDate)} to {formatDate(record.toDate)}</td>
//                                                                                             <td>{record.amount}</td>

//                                                                                             <td>{amountDue.toFixed(2)}</td>
//                                                                                             <td>
//                                                                                                 <span className="badge" style={getStatusStyle(paymentStatus)}>
//                                                                                                     {paymentStatus}
//                                                                                                 </span>
//                                                                                             </td>
//                                                                                             <td className="d-flex gap-1">
//                                                                                                 <button className="btn btn-outline-primary p-1" onClick={() => handleviewBonousInsentive(record)}>View</button>
//                                                                                                 <button className="btn btn-outline-success p-1" onClick={() => handlePaymentBonousInsentive(record)}>Add Payment</button>
//                                                                                             </td>
//                                                                                         </tr>

//                                                                                     </React.Fragment>
//                                                                                 );
//                                                                             })
//                                                                         ))}
//                                                                 </tbody>
//                                                             </table>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Documentation  */}
//                                 <div className="tab-pane fade" id="documentation" role="tabpanel" aria-labelledby="bonusincentiv-tab">
//                                     <div className="row">
//                                         <div className="col-md-9" style={{ maxHeight: "calc(100vh - 360px)", overflowY: "auto", overflowX: "hidden" }}>
//                                             <table className="table table-hover" cellPadding="0" cellSpacing="0">
//                                                 <tbody>
//                                                     <h6 className=' m-0 text-primary fw-bolder p-2'>Basic -------</h6>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Passport Size Photo</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.passportSizePhoto ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.passportSizePhoto, 'PassportPhoto.pdf')}>
//                                                                         Download Passport Photo
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">PAN Card Photo</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.panCardPhoto ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.panCardPhoto, 'PanCard.pdf')}>
//                                                                         Download PAN Card
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Aadhar Card Photo</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.aadharCardPhoto ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.aadharCardPhoto, 'AadharCard.pdf')}>
//                                                                         Download Aadhar Card
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Driving License</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.drivinglicense ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.drivinglicense, 'DrivingLicense.pdf')}>
//                                                                         Download Driving License
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Passport</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.passport ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.passport, 'Passport.pdf')}>
//                                                                         Download Passport
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <h6 className=' m-0 text-primary fw-bolder p-2'>Eduction Documentation -------</h6>

//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Marksheet 10th Photo</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.marksheet10thPhoto ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.marksheet10thPhoto, 'Marksheet10th.pdf')}>
//                                                                         Download 10th Marksheet
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Marksheet 12th Photo</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.marksheet12thPhoto ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.marksheet12thPhoto, 'Marksheet12th.pdf')}>
//                                                                         Download 12th Marksheet
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Other Photo</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.otherPhoto ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.otherPhoto, 'Other.pdf')}>
//                                                                         Download Other
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>

//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Graduation Marksheet</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.graductionmarksheet ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.graductionmarksheet, 'GraduationMarksheet.pdf')}>
//                                                                         Download Graduation Marksheet
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Post Graduation Marksheet</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.postgraductionmarksheet ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.postgraductionmarksheet, 'PostGraduationMarksheet.pdf')}>
//                                                                         Download Post Graduation Marksheet
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Professional Degree</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.professionaldegree ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.professionaldegree, 'ProfessionalDegree.pdf')}>
//                                                                         Download Professional Degree
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <h6 className=' m-0 text-primary fw-bolder p-2'>Company Documentation -------</h6>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Resume</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.resumePhoto ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.resumePhoto, 'Resume.pdf')}>
//                                                                         Download Resume
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Offer Letter</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.offerletter ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.offerletter, 'OfferLetter.pdf')}>
//                                                                         Download Offer Letter
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Joining Letter</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.joiningletter ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.joiningletter, 'JoiningLetter.pdf')}>
//                                                                         Download Joining Letter
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Appointment Letter</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.appointmentletter ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.appointmentletter, 'AppointmentLetter.pdf')}>
//                                                                         Download Appointment Letter
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Employment Letter</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.employeementletter ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.employeementletter, 'EmploymentLetter.pdf')}>
//                                                                         Download Employment Letter
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Experience Letter</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.experienceletter ? (
//                                                                 <div>
//                                                                     : <a href="#" onClick={() => handleDownload(employee.experienceletter, 'ExperienceLetter.pdf')}>
//                                                                         Download Experience Letter
//                                                                     </a>
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Additional Documentation</p>
//                                                         </td>
//                                                         <td>
//                                                             {employee.additionalDocumentation ? (
//                                                                 <div>
//                                                                     {JSON.parse(employee.additionalDocumentation).map((doc, index) => {
//                                                                         const [fileName, fileUrl] = Object.entries(doc)[0]; // Extract filename and URL
//                                                                         return (
//                                                                             <div key={index}>
//                                                                                 : <a href="#" onClick={() => handleDownload(fileUrl, fileName)}>
//                                                                                     Download {fileName}
//                                                                                 </a>
//                                                                             </div>
//                                                                         );
//                                                                     })}
//                                                                 </div>
//                                                             ) : (
//                                                                 <p className="mb-0">: N/A</p>
//                                                             )}
//                                                         </td>
//                                                     </tr>

//                                                     <tr>
//                                                         <td bgcolor="#f2f3f4" width="200">
//                                                             <p className="mb-0 font-bold">Created At</p>
//                                                         </td>
//                                                         <td>
//                                                             <p className="mb-0">: {formatDate(employee.createdAt) || 'N/A'}</p>
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         <div className="col-md-3 pt-2 text-center">
//                                             <img
//                                                 src={employee.passportSizePhoto
//                                                     ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.passportSizePhoto}`
//                                                     : myImage}
//                                                 style={{ width: "200px" }}
//                                                 alt="Employee"
//                                             />
//                                             <button className="btn btn-success m-1" onClick={() => handleChangeDocumention(employee)}>Add/Update Document</button>
//                                             <button className="btn btn-success m-1" onClick={() => handleAddDocumention(employee)}>Add Document</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {isEditModalOpen && (<EditEmployeeModal employee={employee} onUpdate={handleUpdateEmployees} onClose={() => setIsEditModalOpen(false)} />)}
//             {isAddLoanModalOpen && <AddLoan onClose={handleCloseLoanModal} onUpdate={handleUpdateEmployees} />}
//             {isAddBonousInsentiveModalOpen && <AddBonusIncentive onClose={handleCloseBonousInsentiveModal} onUpdate={handleUpdateEmployees} />}
//             {isloanRepaymentHistory && (
//                 <RepaymentHistory
//                     loan={loanrepaymentHistory}
//                     onClose={() => setIsloanRepaymentHistory(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {ispaymentBonousInsentive && (
//                 <Payment_Bonous_Insentive
//                     bonousinsentive={paymentBonousInsentive}
//                     onClose={() => setIspaymentBonousInsentive(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {ischangeSalary && (
//                 <ChangeSalary
//                     employee={changeSalary}
//                     onClose={() => setIschangeSalary(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {isAdvanceRepayment && (
//                 <AddAdvanceRepaymentForm
//                     employeeId={employee.id}
//                     advanceRepayment={advanceRepayment}
//                     onClose={() => setIsAdvanceRepayment(false)}
//                     onUpdate={handleUpdateEmployees}
//                     totalAdvanceAmount={totalAdvanceAmount}
//                     totalRepayment={totalRepayment}
//                 />
//             )}
//             {isviewBonousInsentive && (
//                 <ViewBonousInsentive
//                     record={viewBonousInsentive}
//                     onClose={() => setIsviewBonousInsentive(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {isSalaryHistory && (
//                 <SalaryHistory
//                     employee={salaryHistory}
//                     onClose={() => setIsSalaryHistory(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {isPaymentForm && (
//                 <PaymentForm
//                     record={paymentForm}
//                     onClose={() => setIsPaymentForm(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {isPaymentHistory && (
//                 <PaymentHistory
//                     record={paymentFormHistory}
//                     onClose={() => setIsPaymentHistory(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {/* Documention */}
//             {ischangeDocumention && (
//                 <DocumentionForm
//                     employee={changeDocumention}
//                     onClose={() => setIschangeDocumention(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {/* Add Documention */}
//             {isaddDocumentation && (
//                 <AddDocumention
//                     employee={addDocumention}
//                     onClose={() => setIsAddDocumentation(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//             {/* Add Transfer */}
//             {isaddTransfer && (
//                 <AddTransferEmployee
//                     employee={addTransfer}
//                     onClose={() => setIsAddTransfer(false)}
//                     onUpdate={handleUpdateEmployees}
//                 />
//             )}
//         </div>
//     );
// };

// export default EmployeeDetails;





import React from 'react'

const EmployeeDetails = () => {
  return (
    <div>
      
    </div>
  )
}

export default EmployeeDetails

