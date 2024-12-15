// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from '../../components/sidebar/Sidebar';
// import SearchBar from '../../components/sidebar/SearchBar';
// import { Link, useNavigate } from 'react-router-dom';
// import { ThreeDots } from 'react-loader-spinner';
// import PaymentForm from './PaymentForm';
// import PaymentHistory from './PaymentHistory';

// function Pay({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [projects, setProjects] = useState([]);
//     const [labour, setLabour] = useState([]);
//     const [payroll, setPayroll] = useState([]);
//     const [filteredPayroll, setFilteredPayroll] = useState([]);
//     const [selectedProjects, setSelectedProjects] = useState('');
//     const [selectedLabour, setSelectedLabour] = useState('');
//     const [paymentDetails, setPaymentDetails] = useState({}); // New state to store payment details
//     const [selectedMonth, setSelectedMonth] = useState('');
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [isPaymentForm, setIsPaymentForm] = useState(false);
//     const [paymentForm, setPaymentForm] = useState(null);
//     // Edit and the history 
//     // Payment History 
//     const [paymentFormHistory, setPaymentFormHistory] = useState(null);
//     const [isPaymentHistory, setIsPaymentHistory] = useState(false);
//     const navigate = useNavigate();

//     const monthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     useEffect(() => {
//         if (selectedProjects) {
//             fetchLabour(selectedProjects);
//             fetchPayrollByProject(selectedProjects);
//         }
//     }, [selectedProjects]);

//     useEffect(() => {
//         if (selectedLabour) {
//             fetchPayrollByLabour(selectedLabour);
//         } else {
//             // Fetch payroll by department if no employee is selected
//             if (selectedProjects) {
//                 fetchPayrollByProject(selectedProjects);
//             }
//         }
//     }, [selectedLabour]);

//     useEffect(() => {
//         filterPayroll();
//     }, [selectedYear, selectedMonth, payroll]);

//     useEffect(() => {
//         fetchPaymentDetails(); // Fetch payment details when payroll data changes
//     }, [payroll]);

//     const fetchProjects = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//         }
//     };
//     const fetchLabour = async (projectId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
//             setLabour(response.data);
//         } catch (error) {
//             console.error('Error fetching labour:', error);
//         }
//     };

//     const fetchPayrollByProject = async (projectId) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/Pay/project/${projectId}`);
//             setPayroll(response.data);
//             setFilteredPayroll(response.data); // Initialize with fetched data
//         } catch (error) {
//             console.error('Error fetching payroll by project:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchPayrollByLabour = async (labourId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/Pay/labour/${labourId}`);
//             setPayroll(response.data);
//             filterPayroll(response.data);
//         } catch (error) {
//             console.error('Error fetching payroll by employee:', error);
//         }
//     };

//     const fetchPaymentDetails = async () => {
//         setIsLoading(true);
//         try {
//             const details = {};
//             for (const record of payroll) {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/paymentform/${record.id}`);
//                 details[record.id] = response.data.reduce((sum, payment) => sum + payment.amountPaid, 0);
//             }
//             console.log("setPaymentDetails", details);
//             setPaymentDetails(details);
//         } catch (error) {
//             console.error('Error fetching payment details:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const filterPayroll = (data = payroll) => {
//         console.log("Original Payroll Data:", data);

//         // Filter records based on the `month` field
//         const filteredRecords = data.filter(record => {
//             if (!record.month) return false; // Skip records with no `month` field

//             const [recordYear, recordMonth] = record.month.split("-").map(Number); // Split and parse the year and month
//             const selectedYearInt = parseInt(selectedYear, 10); // Ensure `selectedYear` is a number
//             const selectedMonthInt = selectedMonth !== '' ? parseInt(selectedMonth, 10) : null;

//             return (
//                 recordYear === selectedYearInt &&
//                 (selectedMonthInt === null || recordMonth === selectedMonthInt)
//             );
//         });

//         console.log("Filtered Records:", filteredRecords);

//         // Update the filtered payroll state
//         setFilteredPayroll(filteredRecords);
//     };

//     const handlePaymentForm = (record) => {
//         setPaymentForm(record);
//         setIsPaymentForm(true);
//     };
//     // Payment History
//     const handlePaymentHistory = (record) => {
//         console.log("re", record)
//         setPaymentFormHistory(record);
//         setIsPaymentHistory(true);
//     };

//     const handleUpdate = () => {
//         toast.success('Data updated successfully');
//         if (selectedProjects) {
//             fetchPayrollByProject(selectedProjects);
//         }
//     };

//     return (
//         <div className='d-flex w-100 h-100 bg-white '>
//             {<Sidebar />}
//             <div className='w-100'>
//                 <SearchBar username={username} handleLogout={handleLogout} />
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     <div className="row">
//                         <div className="col-xl-12">
//                             <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
//                                 <div style={{ backgroundColor: "#00509D" }} className="row no-gutters align-items-center p-3">
//                                     <div className="col">
//                                         <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
//                                             <div className="nunito text-white" >Labour Payment List</div>
//                                             <div className='d-flex align-items-center justify-content-center gap-4'>
//                                                 <div className=''>
//                                                     <label className='nunito text-white'>Project: </label>
//                                                     <select className="button_details overflow-hidden mx-1" value={selectedProjects}
//                                                         onChange={(e) => setSelectedProjects(e.target.value)}
//                                                     >
//                                                         <option value="" disabled>Select Project</option>
//                                                         {projects.map(project => (
//                                                             <option key={project.id} value={project.id}>
//                                                                 {project.projectShortName}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div className=''>
//                                                     <label className='nunito text-white'>Select Labour:</label>
//                                                     <select className="button_details overflow-hidden mx-1" value={selectedLabour}
//                                                         onChange={(e) => setSelectedLabour(e.target.value)}
//                                                     >
//                                                         <option value="">Select Labour</option>
//                                                         {labour.map(labour => (
//                                                             <option key={labour.id} value={labour.id}>{labour.labourName}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div className=''>
//                                                     <label className='nunito text-white'>Filter:</label>
//                                                     <select className="button_details mx-1" value={selectedMonth}
//                                                         onChange={(e) => setSelectedMonth(e.target.value)}
//                                                     >
//                                                         <option value="">Month</option>
//                                                         {monthNames.map((month, index) => (
//                                                             <option key={index} value={index + 1}>{month}</option>
//                                                         ))}
//                                                     </select>
//                                                     <select className="button_details mx-1" value={selectedYear}
//                                                         onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                                                     >
//                                                         <option value="">Year</option>
//                                                         {Array.from({ length: 10 }, (_, i) => (
//                                                             <option key={i} value={new Date().getFullYear() - i}>
//                                                                 {new Date().getFullYear() - i}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <hr className='m-0 p-0' />
//                                 <div className=''>
//                                     <div className="card-body">
//                                         <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
//                                             {isLoading ? (
//                                                 <div className="d-flex justify-content-center align-items-center">
//                                                     {/* Correct usage of spinner */}
//                                                     <ThreeDots color="#00BFFF" height={80} width={80} />
//                                                 </div>
//                                             ) : (
//                                                 <table className="table table-bordered" style={{ width: "100%" }}>
//                                                     <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                         <tr>
//                                                             <th>Labour Name</th>
//                                                             <th>Month</th>
//                                                             <th>Total Amount</th>
//                                                             <th>Paid</th>
//                                                             <th>Due</th>
//                                                             <th>Actions</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {filteredPayroll.length === 0 ? (
//                                                             <tr>
//                                                                 <td colSpan="6" className="text-center">No records found</td>
//                                                             </tr>
//                                                         ) : (
//                                                             filteredPayroll.map(record => {
//                                                                 const amountPaid = paymentDetails[record.id] || 0;
//                                                                 const amountDue = (record.totalAmount || 0) - amountPaid;
//                                                                 return (
//                                                                     <tr key={record.id}>
//                                                                         <td>{record.labourName}</td>
//                                                                         <td>{monthNames[new Date(record.month).getMonth()]} {new Date(record.month).getFullYear()}</td>
//                                                                         <td>₹{record.totalAmount?.toFixed(2)}</td>
//                                                                         <td>₹{amountPaid.toFixed(2)}</td>
//                                                                         <td>₹{amountDue.toFixed(2)}</td>
//                                                                         <td>
//                                                                             <button className="m-1 btn btn-outline-info btn-sm" onClick={() => handlePaymentHistory(record)}>
//                                                                                 <i className="fa fa-eye" aria-hidden="true"></i>
//                                                                             </button>
//                                                                             {/* <button className=" m-1 btn btn-outline-danger btn-sm" onClick={() => handleDeleteBonous(record)}>
//                                                                 <i className="fa fa-trash"></i>
//                                                             </button> */}
//                                                                             {amountDue > 0 && (
//                                                                                 <button
//                                                                                     className="btn btn-primary btn-sm"
//                                                                                     onClick={() => handlePaymentForm(record)}
//                                                                                 >
//                                                                                     Add Payment
//                                                                                 </button>
//                                                                             )}
//                                                                         </td>
//                                                                     </tr>
//                                                                 );
//                                                             })
//                                                         )}
//                                                     </tbody>
//                                                 </table>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {isPaymentForm && (
//                         <PaymentForm
//                             record={paymentForm}
//                             onClose={() => setIsPaymentForm(false)}
//                             onUpdate={handleUpdate}
//                         />
//                     )}
//                     {isPaymentHistory && (
//                         <PaymentHistory
//                             record={paymentFormHistory}
//                             onClose={() => setIsPaymentHistory(false)}
//                             onUpdate={handleUpdate}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Pay;

























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "../../components/sidebar/Sidebar";
// import SearchBar from "../../components/sidebar/SearchBar";
// import { ThreeDots } from "react-loader-spinner";
// import PaymentForm from './PaymentForm';
// import PaymentHistory from './PaymentHistory';

// function Pay({ handleLogout, username }) {
//     const [projects, setProjects] = useState([]);
//     const [labour, setLabour] = useState([]);
//     const [selectedProject, setSelectedProject] = useState("");
//     const [selectedLabour, setSelectedLabour] = useState("");
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [attendanceRecords, setAttendanceRecords] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [rates, setRates] = useState({});
//     const [totalAmount, setTotalAmount] = useState(0);
//     // paid and due 
//     const [paymentDetails, setPaymentDetails] = useState([]);
//     const [paidAmount, setPaidAmount] = useState(0);
//     const [dueAmount, setDueAmount] = useState(0);
//     // Payment History 
//     const [isPaymentForm, setIsPaymentForm] = useState(false);
//     const [paymentForm, setPaymentForm] = useState(null);
//     const [paymentFormHistory, setPaymentFormHistory] = useState(null);
//     const [isPaymentHistory, setIsPaymentHistory] = useState(false);

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     useEffect(() => {
//         if (selectedProject) {
//             fetchLabour(selectedProject);
//         }
//     }, [selectedProject]);

//     useEffect(() => {
//         if (selectedLabour) {
//             fetchLabourDetails(selectedLabour);
//             fetchAttendance(selectedLabour);
//         }
//     }, [selectedLabour, selectedMonth, selectedYear]);

//     const fetchProjects = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
//             setProjects(response.data);
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//         }
//     };

//     const fetchLabour = async (projectId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
//             setLabour(response.data);
//         } catch (error) {
//             console.error("Error fetching labour:", error);
//         }
//     };

//     const fetchLabourDetails = async (labourId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourdetails/${labourId}`);

//             console.log("Response Data:", response.data);

//             // Check if the response data is an array and has at least one element
//             if (Array.isArray(response.data) && response.data.length > 0) {
//                 const labourDetails = response.data[0]; // Access the first element
//                 // Update the rates state
//                 setRates({
//                     dayShiftRate: labourDetails.dayShift || 0,
//                     nightShiftRate: labourDetails.nightShift || 0,
//                     overtimeRate: labourDetails.overtimeHrs || 0,
//                 });

//             } else {
//                 console.warn("No labour details found for the given ID.");
//                 setRates({
//                     dayShiftRate: 0,
//                     nightShiftRate: 0,
//                     overtimeRate: 0,
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching labour details:", error);
//         }
//     };


//     const fetchAttendance = async (labourId) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourattendance`, {
//                 params: {
//                     labourId,
//                     year: selectedYear,
//                     month: selectedMonth,
//                 },
//             });
//             setAttendanceRecords(response.data.data);
//         } catch (error) {
//             console.error("Error fetching attendance:", error);
//             toast.error("Failed to fetch attendance records");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const calculateAttendanceAmount = (record) => {
//         const { dayShiftRate, nightShiftRate, overtimeRate } = rates;
//         console.log("rates", rates)

//         let amount = 0;
//         amount += (record.dayShift || 0) * dayShiftRate;
//         amount += (record.nightShift || 0) * nightShiftRate;
//         amount += (record.overtimeHours || 0) * overtimeRate;

//         return {
//             amount,
//             dayShift: record.dayShift || 0,
//             nightShift: record.nightShift || 0,
//             overtime: record.overtimeHours || 0,
//         };
//     };

//     const calculateTotalAmount = () => {
//         return attendanceRecords.reduce((total, record) => {
//             const { amount } = calculateAttendanceAmount(record);
//             return total + amount;
//         }, 0);
//     };

//     useEffect(() => {
//         setTotalAmount(calculateTotalAmount());
//     }, [attendanceRecords, rates]);

//     // Fetch payment details when labour is selected
//     useEffect(() => {
//         if (selectedLabour) {
//             fetchPaymentDetails(selectedLabour);
//         }
//     }, [selectedLabour]);

//     const fetchPaymentDetails = async (labourId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/Pay/checklabour`, {
//                 params: {
//                     labourId,
//                     year: selectedYear,
//                     month: selectedMonth,
//                 },
//             });

//             setPaymentDetails(response.data);

//             // Calculate paid amount based on the fetched payment details
//             const totalPaid = response.data.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
//             setPaidAmount(totalPaid);

//         } catch (error) {
//             console.error("Error fetching payment details:", error);
//             toast.error("Failed to fetch payment details");
//         }
//     };

//     // Calculate due amount based on total attendance amount and paid amount
//     useEffect(() => {
//         console.log("totalAmount", totalAmount, "paidAmount", paidAmount)
//         const calculatedDueAmount = totalAmount - paidAmount;

//         console.log("calculatedDueAmount", calculatedDueAmount)
//         setDueAmount(calculatedDueAmount > 0 ? calculatedDueAmount : 0);
//     }, [totalAmount, paidAmount]);

//     const handlePaymentForm = (record) => {
//         setPaymentForm(record);
//         setIsPaymentForm(true);
//     };
//     // Payment History
//     const handlePaymentHistory = (record) => {
//         console.log("re", record)
//         setPaymentFormHistory(record);
//         setIsPaymentHistory(true);
//     };

//         const handleUpdate = () => {
//         toast.success('Data updated successfully');
//     };

//     return (
//         <div className="d-flex w-100 h-100 bg-white">
//             <Sidebar />
//             <div className="w-100">
//                 <SearchBar username={username} handleLogout={handleLogout} />
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     <div className="row">
//                         <div className="col-xl-12">
//                             <div className="overflow-hidden" style={{ borderRadius: "20px", border: "1px solid #00509d" }}>
//                                 <div className="row no-gutters align-items-center p-3" style={{ backgroundColor: "#00509D" }}>
//                                     <div className="col">
//                                         <div className="text-white d-flex justify-content-between align-items-center">
//                                             <span>Labour Payment List</span>
//                                             <div className="d-flex gap-4">
//                                                 <div>
//                                                     <label className="text-white">Project: </label>
//                                                     <select
//                                                         className="button_details mx-1"
//                                                         value={selectedProject}
//                                                         onChange={(e) => setSelectedProject(e.target.value)}
//                                                     >
//                                                         <option value="">Select Project</option>
//                                                         {projects.map((project) => (
//                                                             <option key={project.id} value={project.id}>
//                                                                 {project.projectShortName}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div>
//                                                     <label className="text-white">Labour: </label>
//                                                     <select
//                                                         className="button_details mx-1"
//                                                         value={selectedLabour}
//                                                         onChange={(e) => setSelectedLabour(e.target.value)}
//                                                     >
//                                                         <option value="">Select Labour</option>
//                                                         {labour.map((lab) => (
//                                                             <option key={lab.id} value={lab.id}>
//                                                                 {lab.labourName}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div>
//                                                     <label className="text-white">Month: </label>
//                                                     <select
//                                                         className="button_details mx-1"
//                                                         value={selectedMonth}
//                                                         onChange={(e) => setSelectedMonth(e.target.value)}
//                                                     >
//                                                         {Array.from({ length: 12 }, (_, i) => (
//                                                             <option key={i + 1} value={i + 1}>
//                                                                 {new Date(0, i).toLocaleString("default", { month: "long" })}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                     <label className="text-white">Year: </label>
//                                                     <select
//                                                         className="button_details mx-1"
//                                                         value={selectedYear}
//                                                         onChange={(e) => setSelectedYear(e.target.value)}
//                                                     >
//                                                         {Array.from({ length: 10 }, (_, i) => (
//                                                             <option key={i} value={new Date().getFullYear() - i}>
//                                                                 {new Date().getFullYear() - i}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <hr className="m-0 p-0" />
//                                 <div className="card-body">
//                                     {isLoading ? (
//                                         <div className="d-flex justify-content-center align-items-center">
//                                             <ThreeDots color="#00BFFF" height={80} width={80} />
//                                         </div>
//                                     ) : (
//                                         <table className="table table-bordered">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Labour Name</th>
//                                                     <th>Month</th>
//                                                     <th>Total Amount</th>
//                                                     <th>Paid</th>
//                                                     <th>Due</th>
//                                                     <th>Action </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 <tr>
//                                                     <td>
//                                                         {labour.find((l) => String(l.id) === String(selectedLabour))?.labourName || "N/A"}
//                                                     </td>
//                                                     <td>
//                                                         {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}
//                                                     </td>
//                                                     <td>{totalAmount.toFixed(2)}</td>
//                                                     <td>{paidAmount.toFixed(2)}</td>
//                                                     <td>{dueAmount.toFixed(2)}</td>
//                                                     <td>
//                                                         <button
//                                                             className="btn btn-primary mx-1"
//                                                             onClick={() => handlePaymentForm({ labourId: selectedLabour, totalAmount, paidAmount, dueAmount,selectedMonth,selectedYear,selectedProject })}
//                                                         >
//                                                             Pay
//                                                         </button>
//                                                         <button
//                                                             className="btn btn-secondary mx-1"
//                                                             onClick={() => handlePaymentHistory({ labourId: selectedLabour })}
//                                                         >
//                                                             History
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             </tbody>
//                                         </table>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {isPaymentForm && (
//                         <PaymentForm
//                             record={paymentForm}
//                             onClose={() => setIsPaymentForm(false)}
//                             onUpdate={handleUpdate}
//                         />
//                     )}
//                     {isPaymentHistory && (
//                         <PaymentHistory
//                             record={paymentFormHistory}
//                             onClose={() => setIsPaymentHistory(false)}
//                             onUpdate={handleUpdate}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Pay;


























import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from "react-loader-spinner";
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';

function PayLabourPayment({ handleLogout, username }) {
    const [projects, setProjects] = useState([]);
    const [labour, setLabour] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedLabour, setSelectedLabour] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rates, setRates] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    // paid and due 
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [paidAmount, setPaidAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);
    // Payment History 
    const [isPaymentForm, setIsPaymentForm] = useState(false);
    const [paymentForm, setPaymentForm] = useState(null);
    const [paymentFormHistory, setPaymentFormHistory] = useState(null);
    const [isPaymentHistory, setIsPaymentHistory] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchLabour(selectedProject);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedLabour) {
            fetchLabourDetails(selectedLabour);
            fetchAttendance(selectedLabour);
        }
    }, [selectedLabour, selectedMonth, selectedYear]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const fetchLabour = async (projectId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
            setLabour(response.data);
        } catch (error) {
            console.error("Error fetching labour:", error);
        }
    };

    const fetchLabourDetails = async (labourId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourdetails/${labourId}`);

            console.log("Response Data:", response.data);

            // Check if the response data is an array and has at least one element
            if (Array.isArray(response.data) && response.data.length > 0) {
                const labourDetails = response.data[0]; // Access the first element
                // Update the rates state
                setRates({
                    dayShiftRate: labourDetails.dayShift || 0,
                    nightShiftRate: labourDetails.nightShift || 0,
                    overtimeRate: labourDetails.overtimeHrs || 0,
                });

            } else {
                console.warn("No labour details found for the given ID.");
                setRates({
                    dayShiftRate: 0,
                    nightShiftRate: 0,
                    overtimeRate: 0,
                });
            }
        } catch (error) {
            console.error("Error fetching labour details:", error);
        }
    };


    const fetchAttendance = async (labourId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourattendance`, {
                params: {
                    labourId,
                    year: selectedYear,
                    month: selectedMonth,
                },
            });
            setAttendanceRecords(response.data.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to fetch attendance records");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAttendanceAmount = (record) => {
        const { dayShiftRate, nightShiftRate, overtimeRate } = rates;
        console.log("rates", rates)

        let amount = 0;
        amount += (record.dayShift || 0) * dayShiftRate;
        amount += (record.nightShift || 0) * nightShiftRate;
        amount += (record.overtimeHours || 0) * overtimeRate;

        return {
            amount,
            dayShift: record.dayShift || 0,
            nightShift: record.nightShift || 0,
            overtime: record.overtimeHours || 0,
        };
    };

    const calculateTotalAmount = () => {
        return attendanceRecords.reduce((total, record) => {
            const { amount } = calculateAttendanceAmount(record);
            return total + amount;
        }, 0);
    };

    useEffect(() => {
        setTotalAmount(calculateTotalAmount());
    }, [attendanceRecords, rates]);

    // Fetch payment details when labour is selected
    useEffect(() => {
        if (selectedLabour) {
            fetchPaymentDetails(selectedLabour, selectedMonth, selectedYear);
        }
    }, [selectedLabour, selectedMonth, selectedYear]);

    const fetchPaymentDetails = async (labourId, month, year) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/checklabour`, {
                params: {
                    labourId,
                    year,
                    month,
                },
            });

            // Set payment details for the selected month and year
            setPaymentDetails(response.data);

            // Calculate paid amount for the selected month and year
            const totalPaid = response.data.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
            setPaidAmount(totalPaid);

        } catch (error) {
            console.error("Error fetching payment details:", error);
            toast.error("Failed to fetch payment details");
        }
    };

    // Calculate due amount based on total attendance amount and paid amount
    useEffect(() => {
        const calculatedDueAmount = totalAmount - paidAmount;
        setDueAmount(calculatedDueAmount > 0 ? calculatedDueAmount : 0);
    }, [totalAmount, paidAmount]);

    // Additional helper functions remain unchanged

    const handlePaymentForm = (record) => {
        setPaymentForm(record);
        setIsPaymentForm(true);
    };
    const handleUpdate = () => {
        if (selectedLabour) {
            fetchPaymentDetails(selectedLabour, selectedMonth, selectedYear);
        }
        toast.success('Data updated successfully');
    };
    return (
        <div className="d-flex w-100 h-100 bg-white">
            <Sidebar />
            <div className="w-100">
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid mb-3">
                    <ToastContainer />
                    <div style={{ boxShadow: "1px 1px 6px  black" }} className="bg-white rounded card-body p-4">
                        <div className="row ">
                            <div className="col-md-12 d-flex justify-content-between px-3">
                                <div className="w-100 pb-1 ">
                                    <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder m-0">
                                        Labour Payment
                                    </h2>
                                </div>
                            </div>
                            <hr className="m-0 p-0" />
                            <div className="bg-white rounded shadow-sm card-body p-3 mt-2">
                                <div className="row">
                                    <div className="form-group col-md-3">
                                        <label className="fw-bolder text-black">Project: </label>
                                        <select
                                            className="form-control "
                                            value={selectedProject}
                                            onChange={(e) => setSelectedProject(e.target.value)}
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.projectShortName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label className="fw-bolder text-black">Labour: </label>
                                        <select
                                            className="form-control "
                                            value={selectedLabour}
                                            onChange={(e) => setSelectedLabour(e.target.value)}
                                        >
                                            <option value="">Select Labour</option>
                                            {labour.map((lab) => (
                                                <option key={lab.id} value={lab.id}>
                                                    {lab.labourName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label className="fw-bolder text-black">Month: </label>
                                        <select
                                            className="form-control "
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-3">
                                        <label className="fw-bolder text-black">Year: </label>
                                        <select
                                            className="form-control "
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                        >
                                            {Array.from({ length: 10 }, (_, i) => (
                                                <option key={i} value={new Date().getFullYear() - i}>
                                                    {new Date().getFullYear() - i}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-success px-3 py-1"
                                    onClick={() => handlePaymentForm({ labourId: selectedLabour, totalAmount, paidAmount, dueAmount, selectedMonth, selectedYear, selectedProject })}
                                >
                                    <i className="fa-solid fa-hand-holding-dollar"></i> Make Payment
                                </button>
                            </div>

                        </div>
                        <div className="row mt-2">
                            <div className="col-xl-12 p-0">
                                <div className="overflow-hidden" style={{ borderRadius: "10px", border: "1px solid #00509d" }}>
                                    <div className="row no-gutters align-items-center px-3 py-2" style={{ backgroundColor: "#00509D" }}>
                                        <div className="col">
                                            <div className="text-white d-flex justify-content-between align-items-center">
                                                <span>Labour Payment List</span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="m-0 p-0" />
                                    <div className="card-body">
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                <ThreeDots color="#00BFFF" height={80} width={80} />
                                            </div>
                                        ) : (
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Labour Name</th>
                                                        <th>Month</th>
                                                        <th>Total Amount</th>
                                                        <th>Paid</th>
                                                        <th>Due</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedLabour && totalAmount  ? (
                                                        <tr>
                                                            <td>
                                                                {labour.find((l) => String(l.id) === String(selectedLabour))?.labourName || "N/A"}
                                                            </td>
                                                            <td>
                                                                {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}
                                                            </td>
                                                            <td className='text-end'>&#x20B9;{totalAmount != null ? totalAmount.toFixed(2) : '0.00'}</td>
                                                            <td className='text-end text-success'>&#x20B9;{paidAmount != null ? paidAmount.toFixed(2) : '0.00'}</td>
                                                            <td className='text-end text-danger'>&#x20B9;{dueAmount != null ? dueAmount.toFixed(2) : '0.00'}</td>
                                                        </tr>
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center text-dark">Choosing Labour and Project</td>
                                                        </tr>
                                                    )}
                                                </tbody>

                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row mt-2">
                            <div className="col-xl-12 p-0">
                                <div className="overflow-hidden" style={{ borderRadius: "10px", border: "1px solid #00509d" }}>
                                    <div className="row no-gutters align-items-center px-3 py-2" style={{ backgroundColor: "#00509D" }}>
                                        <div className="col">
                                            <div className="text-white d-flex justify-content-between align-items-center">
                                                <span>Month Wise List</span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="m-0 p-0" />
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
                                                            <th>Payment Date</th>
                                                            <th>Month</th>
                                                            <th>Paid Amount</th>
                                                            <th>Mode</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paymentDetails.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="5" className="text-center text-dark">No Data</td>
                                                            </tr>
                                                        ) : (
                                                            paymentDetails.map((entry, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td> {/* Serial Number */}
                                                                    <td> {new Date(entry.amountDate).toLocaleDateString('en-GB')}</td>
                                                                    <td>{new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}</td>
                                                                    {/* <td>{entry.amountPaid}</td> */}
                                                                    <td className='text-end'>&#x20B9;{entry.amountPaid != null ? entry.amountPaid.toFixed(2) : '0.00'}</td>
                                                                    <td>{entry.paymentModeName}</td>
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
                    {isPaymentForm && (
                        <PaymentForm
                            record={paymentForm}
                            onClose={() => setIsPaymentForm(false)}
                            onUpdate={handleUpdate}
                        />
                    )}
                    {isPaymentHistory && (
                        <PaymentHistory
                            record={paymentFormHistory}
                            onClose={() => setIsPaymentHistory(false)}
                            onUpdate={handleUpdate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PayLabourPayment;


