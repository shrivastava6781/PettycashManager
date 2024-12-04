// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from '../../components/sidebar/Sidebar';
// import SearchBar from '../../components/sidebar/SearchBar';
// import { Link, useNavigate } from 'react-router-dom';
// import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
// import AddLabour from './AddLabour';
// import AdminMakeEntry from '../AdminEntry/AdminMakeEntry';

// function LabourPaymentList({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [projects, setProjects] = useState([]);
//     const [labour, setLabour] = useState([]);
//     const [payroll, setPayroll] = useState([]);
//     const [filteredPayroll, setFilteredPayroll] = useState([]);
//     const [selectedProjects, setSelectedProjects] = useState('');
//     const [selectedLabour, setSelectedLabour] = useState('');
//     const [selectedMonth, setSelectedMonth] = useState(''); // Initialize with empty string
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year
//     const [paymentForm, setPaymentForm] = useState(null);
//     const [isPaymentForm, setIsPaymentForm] = useState(false);
//     const [paymentDetails, setPaymentDetails] = useState({}); // New state to store payment details
//     // Payment History 
//     const [paymentFormHistory, setPaymentFormHistory] = useState(null);
//     const [isPaymentHistory, setIsPaymentHistory] = useState(false);

//     const navigate = useNavigate();
//     console.log("editsalaryslip");

//     const handleEditClick = (record) => {
//         if (record) {
//             navigate('/editsalaryslip', { state: { salarydata: record } });
//         } else {
//             console.error('Salary data is not ready.');
//         }
//     };

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     useEffect(() => {
//         if (selectedProjects) {
//             fetchLabour(selectedProjects);
//             setSelectedLabour(''); // Reset selected employee when department changes
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
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/project/${projectId}`);
//             setPayroll(response.data);
//             filterPayroll(response.data);
//         } catch (error) {
//             console.error('Error fetching payroll by department:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     const fetchPayrollByLabour = async (labourId) => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/labour/${labourId}`);
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
//             setPaymentDetails(details);
//         } catch (error) {
//             console.error('Error fetching payment details:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     const filterPayroll = (data = payroll) => {
//         const filteredRecords = data.filter(record =>
//             record.year === selectedYear &&
//             (selectedMonth === '' || record.month === parseInt(selectedMonth))
//         );
//         setFilteredPayroll(filteredRecords);
//     };

//     // Payment Form 
//     const handlePaymentForm = (record) => {
//         setPaymentForm(record);
//         setIsPaymentForm(true);
//     };

//     const handleUpdate = () => {
//         toast.success('Data uploaded successfully');
//         fetchLabour(selectedProjects);
//         setSelectedLabour(''); // Reset selected employee when department changes
//         fetchPayrollByProject(selectedProjects);
//     };

//     const monthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     return (
//         <div className='d-flex w-100 h-100 bg-white'>
//             {<Sidebar />}
//             <div className='w-100'>
//                 {<SearchBar />}
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     <div className="row">
//                         <div className="col-xl-12">
//                             <div className="card shadow mb-4">
//                                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
//                                     <h6 className="m-0 font-weight-bold text-primary">Labour Payment List</h6>
//                                     <div className='d-flex align-items-center justify-content-center gap-1 w-50'>
//                                         <label className='nunito text-white'>Project: </label>
//                                         <select className="button_details overflow-hidden" value={selectedProjects}
//                                             onChange={(e) => setSelectedProjects(e.target.value)}
//                                         >
//                                             <option value="" disabled>Select Department</option>
//                                             {projects.map(project => (
//                                                 <option key={project.id} value={project.id}>{project.projectShortName}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className='d-flex align-items-center justify-content-center gap-1'>
//                                         <label className='nunito text-white'>Labour Name:</label>
//                                         <select className="button_details overflow-hidden" value={selectedLabour}
//                                             onChange={(e) => setSelectedLabour(e.target.value)}
//                                         >
//                                             <option value="">Select Labour</option>
//                                             {labour.map(labour => (
//                                                 <option key={labour.id} value={labour.id}>{labour.labourName}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className='d-flex align-items-center justify-content-center gap-1'>
//                                         <label className='nunito text-white'>Filter:</label>
//                                         <select className="button_details overflow-hidden" value={selectedMonth}
//                                             onChange={(e) => setSelectedMonth(e.target.value)}
//                                         >
//                                             <option value="">Month</option>
//                                             {Array.from({ length: 12 }, (_, i) => (
//                                                 <option key={i} value={i + 1}>{monthNames[i]}</option>
//                                             ))}
//                                         </select>
//                                         <select className="button_details overflow-hidden" value={selectedYear}
//                                             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                                         >
//                                             <option value="">Select Year</option>
//                                             {Array.from({ length: 10 }, (_, i) => (
//                                                 <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="card-body form-row">
//                                     <div className='col-md-12' style={{ maxHeight: "500px", overflowY: "auto" }}>
//                                         {isLoading ? (
//                                             <div className="d-flex justify-content-center align-items-center">
//                                                 {/* Correct usage of spinner */}
//                                                 <ThreeDots
//                                                     color="#00BFFF"
//                                                     height={80}
//                                                     width={80}
//                                                 />
//                                             </div>
//                                         ) : (
//                                             <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                 <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                     <tr>
//                                                         <th>Labour Name</th>
//                                                         <th>Salary Period</th>
//                                                         <th>Net Salary Payable</th>
//                                                         <th>Amount Paid</th>
//                                                         <th>Amount Due</th>
//                                                         <th>Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     <style>
//                                                         {`.hyperlink:hover {color: blue;}`}
//                                                     </style>
//                                                     {filteredPayroll.length === 0 ? (
//                                                         <tr>
//                                                             <td colSpan="12" className="text-center">There is No Salary List.</td>
//                                                         </tr>
//                                                     ) : (
//                                                         filteredPayroll.map(record => {
//                                                             const amountPaid = paymentDetails[record.id] || 0;
//                                                             const amountDue = (record.netSalaryPayableMonth || 0) - amountPaid;
//                                                             const showAddPaymentButton = amountDue > 0;

//                                                             return (
//                                                                 <tr key={record.id}>
//                                                                     <td>
//                                                                         {record.employeeName} <br />
//                                                                         <small>{record.departmentName}</small>
//                                                                     </td>
//                                                                     <td>{monthNames[record.month - 1]} - {record.year}</td>
//                                                                     <td>&#x20B9;{record.netSalaryPayableMonth ? record.netSalaryPayableMonth.toFixed(2) : '0.00'}</td>
//                                                                     <td>&#x20B9;{amountPaid.toFixed(2)}</td> {/* Display total amount paid */}
//                                                                     <td>&#x20B9;{amountDue.toFixed(2)}</td> {/* Display amount due */}
//                                                                     <td className='d-flex flex-column'>
//                                                                         <div className='d-flex align-items-center justify-content-center gap-1'>
//                                                                             <button className=" m-1 btn btn-outline-danger btn-sm" onClick={() => handleEditClick(record)}>
//                                                                                 <i className="fas fa-edit"></i>
//                                                                             </button>

//                                                                             {/* <button className=" m-1 btn btn-outline-danger btn-sm" onClick={() => handleDeleteBonous(record)}>
//                                                                                 <i className="fa fa-trash"></i>
//                                                                             </button> */}
//                                                                         </div>
//                                                                         {showAddPaymentButton && (
//                                                                             <button className="m-1 btn btn-primary btn-sm" onClick={() => handlePaymentForm(record)}>
//                                                                                 <i className="fa fa-plus" aria-hidden="true"></i> Add Payment
//                                                                             </button>
//                                                                         )}
//                                                                     </td>
//                                                                 </tr>
//                                                             );
//                                                         })
//                                                     )}
//                                                 </tbody>
//                                             </table>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {isPaymentForm && (
//                         <AddLabour
//                             record={paymentForm}
//                             onClose={() => setIsPaymentForm(false)}
//                             onUpdate={handleUpdate}
//                         />
//                     )}
//                     {isPaymentHistory && (
//                         <AdminMakeEntry
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

// export default LabourPaymentList;


















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/sidebar/Sidebar';
import SearchBar from '../../components/sidebar/SearchBar';
import { Link, useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';

function LabourPaymentList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [labour, setLabour] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [filteredPayroll, setFilteredPayroll] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState('');
    const [selectedLabour, setSelectedLabour] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({}); // New state to store payment details
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isPaymentForm, setIsPaymentForm] = useState(false);
    const [paymentForm, setPaymentForm] = useState(null);
    // Edit and the history 
    // Payment History 
    const [paymentFormHistory, setPaymentFormHistory] = useState(null);
    const [isPaymentHistory, setIsPaymentHistory] = useState(false);
    const navigate = useNavigate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProjects) {
            fetchLabour(selectedProjects);
            fetchPayrollByProject(selectedProjects);
        }
    }, [selectedProjects]);

    useEffect(() => {
        if (selectedLabour) {
            fetchPayrollByLabour(selectedLabour);
        } else {
            // Fetch payroll by department if no employee is selected
            if (selectedProjects) {
                fetchPayrollByProject(selectedProjects);
            }
        }
    }, [selectedLabour]);

    useEffect(() => {
        filterPayroll();
    }, [selectedYear, selectedMonth, payroll]);

    useEffect(() => {
        fetchPaymentDetails(); // Fetch payment details when payroll data changes
    }, [payroll]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchLabour = async (projectId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
            setLabour(response.data);
        } catch (error) {
            console.error('Error fetching labour:', error);
        }
    };

    const fetchPayrollByProject = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/project/${projectId}`);
            setPayroll(response.data);
            setFilteredPayroll(response.data); // Initialize with fetched data
        } catch (error) {
            console.error('Error fetching payroll by project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPayrollByLabour = async (labourId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/labour/${labourId}`);
            setPayroll(response.data);
            filterPayroll(response.data);
        } catch (error) {
            console.error('Error fetching payroll by employee:', error);
        }
    };

    const fetchPaymentDetails = async () => {
        setIsLoading(true);
        try {
            const details = {};
            for (const record of payroll) {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/paymentform/${record.id}`);
                details[record.id] = response.data.reduce((sum, payment) => sum + payment.amountPaid, 0);
            }
            console.log("setPaymentDetails", details);
            setPaymentDetails(details);
        } catch (error) {
            console.error('Error fetching payment details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterPayroll = (data = payroll) => {
        console.log("Original Payroll Data:", data);

        // Filter records based on the `month` field
        const filteredRecords = data.filter(record => {
            if (!record.month) return false; // Skip records with no `month` field

            const [recordYear, recordMonth] = record.month.split("-").map(Number); // Split and parse the year and month
            const selectedYearInt = parseInt(selectedYear, 10); // Ensure `selectedYear` is a number
            const selectedMonthInt = selectedMonth !== '' ? parseInt(selectedMonth, 10) : null;

            return (
                recordYear === selectedYearInt &&
                (selectedMonthInt === null || recordMonth === selectedMonthInt)
            );
        });

        console.log("Filtered Records:", filteredRecords);

        // Update the filtered payroll state
        setFilteredPayroll(filteredRecords);
    };

    const handlePaymentForm = (record) => {
        setPaymentForm(record);
        setIsPaymentForm(true);
    };
    // Payment History
    const handlePaymentHistory = (record) => {
        console.log("re", record)
        setPaymentFormHistory(record);
        setIsPaymentHistory(true);
    };

    const handleUpdate = () => {
        toast.success('Data updated successfully');
        if (selectedProjects) {
            fetchPayrollByProject(selectedProjects);
        }
    };

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {<Sidebar />}
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
                                            <div className="nunito text-white" >Labour Payment List</div>
                                            <div className='d-flex align-items-center justify-content-center gap-4'>
                                                <div className=''>
                                                    <label className='nunito text-white'>Project: </label>
                                                    <select className="button_details overflow-hidden mx-1" value={selectedProjects}
                                                        onChange={(e) => setSelectedProjects(e.target.value)}
                                                    >
                                                        <option value="" disabled>Select Project</option>
                                                        {projects.map(project => (
                                                            <option key={project.id} value={project.id}>
                                                                {project.projectShortName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className=''>
                                                    <label className='nunito text-white'>Select Labour:</label>
                                                    <select className="button_details overflow-hidden mx-1" value={selectedLabour}
                                                        onChange={(e) => setSelectedLabour(e.target.value)}
                                                    >
                                                        <option value="">Select Labour</option>
                                                        {labour.map(labour => (
                                                            <option key={labour.id} value={labour.id}>{labour.labourName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className=''>
                                                    <label className='nunito text-white'>Filter:</label>
                                                    <select className="button_details mx-1" value={selectedMonth}
                                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                                    >
                                                        <option value="">Month</option>
                                                        {monthNames.map((month, index) => (
                                                            <option key={index} value={index + 1}>{month}</option>
                                                        ))}
                                                    </select>
                                                    <select className="button_details mx-1" value={selectedYear}
                                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                                    >
                                                        <option value="">Year</option>
                                                        {Array.from({ length: 10 }, (_, i) => (
                                                            <option key={i} value={new Date().getFullYear() - i}>
                                                                {new Date().getFullYear() - i}
                                                            </option>
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
                                                    {/* Correct usage of spinner */}
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : (
                                                <table className="table table-bordered" style={{ width: "100%" }}>
                                                    <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                        <tr>
                                                            <th>Labour Name</th>
                                                            <th>Month</th>
                                                            <th>Total Amount</th>
                                                            <th>Paid</th>
                                                            <th>Due</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredPayroll.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="6" className="text-center">No records found</td>
                                                            </tr>
                                                        ) : (
                                                            filteredPayroll.map(record => {
                                                                const amountPaid = paymentDetails[record.id] || 0;
                                                                const amountDue = (record.totalAmount || 0) - amountPaid;
                                                                return (
                                                                    <tr key={record.id}>
                                                                        <td>{record.labourName}</td>
                                                                        <td>{monthNames[new Date(record.month).getMonth()]} {new Date(record.month).getFullYear()}</td>
                                                                        <td>₹{record.totalAmount?.toFixed(2)}</td>
                                                                        <td>₹{amountPaid.toFixed(2)}</td>
                                                                        <td>₹{amountDue.toFixed(2)}</td>
                                                                        <td>
                                                                            <button className="m-1 btn btn-outline-info btn-sm" onClick={() => handlePaymentHistory(record)}>
                                                                                <i className="fa fa-eye" aria-hidden="true"></i>
                                                                            </button>
                                                                            {/* <button className=" m-1 btn btn-outline-danger btn-sm" onClick={() => handleDeleteBonous(record)}>
                                                                <i className="fa fa-trash"></i>
                                                            </button> */}
                                                                            {amountDue > 0 && (
                                                                                <button
                                                                                    className="btn btn-primary btn-sm"
                                                                                    onClick={() => handlePaymentForm(record)}
                                                                                >
                                                                                    Add Payment
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
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

export default LabourPaymentList;












