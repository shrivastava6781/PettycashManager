
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const LabourAttendance = () => {
//     const [projects, setProjects] = useState([]);
//     const [labour, setLabour] = useState([]);
//     const [attendance, setAttendance] = useState([]);
//         const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//         const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [selectedProjects, setSelectedProjects] = useState(null);
//     const [rates, setRates] = useState({ dayShiftRate: 0, nightShiftRate: 0, overtimeRate: 0 });
//     const [paymentDetails, setPaymentDetails] = useState({}); // To store payment details by labourId

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     useEffect(() => {
//         if (selectedProjects) {
//             fetchLabour(selectedProjects);
//         }
//     }, [selectedProjects]);

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
//             const labourData = response.data;
//             setLabour(labourData);

//             if (Array.isArray(labourData) && labourData.length > 0) {
//                 const labourDetails = labourData[0];
//                 setRates({
//                     dayShiftRate: labourDetails.dayShift || 0,
//                     nightShiftRate: labourDetails.nightShift || 0,
//                     overtimeRate: labourDetails.overtimeHrs || 0,
//                 });

//                 const labourIds = labourData.map((labour) => labour.id);
//                 await fetchAttendance(labourIds);

//                 // Fetch payment details for all labour IDs
//                 const paymentPromises = labourIds.map(fetchPaymentDetails);
//                 const paymentResults = await Promise.all(paymentPromises);

//                 const paymentData = labourIds.reduce((acc, labourId, index) => {
//                     acc[labourId] = paymentResults[index];
//                     return acc;
//                 }, {});

//                 setPaymentDetails(paymentData);
//             }
//         } catch (error) {
//             console.error('Error fetching labour:', error);
//         }
//     };

//     const fetchAttendance = async (labourIds) => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/labour-attendance`, { labourIds });
//             setAttendance(response.data);
//         } catch (error) {
//             console.error('Error fetching attendance:', error);
//         }
//     };

//     const fetchPaymentDetails = async (labourId) => {
//         console.log("labourId", labourId); // Log the incoming labourId to confirm it is being passed correctly
//         try {
//             // Make the API call to fetch payment details for the specified labourId
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/labourpaid`, {
//                 params: { labourId },
//             });

//             // Log the entire response to check its structure
//             console.log("Payment details response:", response.data);

//             // Extract payment details from the API response
//             const paymentDetails = response.data;

//             // Validate if paymentDetails is an array before reducing it
//             if (Array.isArray(paymentDetails)) {
//                 // Calculate the total paid amount by iterating over the array
//                 const totalPaid = paymentDetails.reduce((sum, payment) => {
//                     return sum + (payment.amountPaid || 0);
//                 }, 0);

//                 return totalPaid;
//             }
//             return 0; // Return 0 if no valid payment details found
//         } catch (error) {
//             console.error("Error fetching payment details:", error);
//             return 0; // Return 0 in case of error
//         }
//     };

//     const calculateTotalAttendance = (labourId) => {
//         const labourAttendance = attendance.filter((record) => record.labourId === labourId);

//         let totalDayShift = 0;
//         let totalNightShift = 0;
//         let totalOvertime = 0;
//         let totalAmount = 0;

//         labourAttendance.forEach((record) => {
//             totalDayShift += record.dayShift || 0;
//             totalNightShift += record.nightShift || 0;
//             totalOvertime += record.overtimeHours || 0;

//             const dayShiftAmount = (record.dayShift || 0) * (rates.dayShiftRate || 0);
//             const nightShiftAmount = (record.nightShift || 0) * (rates.nightShiftRate || 0);
//             const overtimeAmount = (record.overtimeHours || 0) * (rates.overtimeRate || 0);

//             totalAmount += dayShiftAmount + nightShiftAmount + overtimeAmount;
//         });

//         return { totalDayShift, totalNightShift, totalOvertime, totalAmount };
//     };

//     return (
//         <div>
//             <h1>Labour and Attendance Management</h1>
//             <div>
//                 <label>Select Project:</label>
//                 <select value={selectedProjects} onChange={(e) => setSelectedProjects(e.target.value)}>
//                     <option value="">-- Select a Project --</option>
//                     {projects.map((project) => (
//                         <option key={project.id} value={project.id}>
//                             {project.projectName}
//                         </option>
//                     ))}
//                 </select>


//             </div>
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th>Labour ID</th>
//                         <th>Labour Name</th>
//                         <th>Project Name</th>
//                         <th>Total Day Shift</th>
//                         <th>Total Night Shift</th>
//                         <th>Total Overtime</th>
//                         <th>Total Amount</th>
//                         <th>Paid</th>
//                         <th>Due</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {labour.map((labourer) => {
//                         const { totalDayShift, totalNightShift, totalOvertime, totalAmount } = calculateTotalAttendance(labourer.id);
//                         const totalPaid = paymentDetails[labourer.id] || 0;
//                         console.log(totalAmount, )
//                         const totalDue = totalAmount - totalPaid;

//                         return (
//                             <tr key={labourer.id}>
//                                 <td>{labourer.id}</td>
//                                 <td>{labourer.labourName}</td>
//                                 <td>{labourer.projectName}</td>
//                                 <td>{totalDayShift} times present</td>
//                                 <td>{totalNightShift} times present</td>
//                                 <td>{totalOvertime} overtime hours</td>
//                                 <td>{totalAmount.toFixed(2)}</td>
//                                 <td>{totalPaid.toFixed(2)}</td>
//                                 <td>{totalDue.toFixed(2)}</td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default LabourAttendance;






























// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const LabourAttendance = () => {
//     const [projects, setProjects] = useState([]);
//     const [labour, setLabour] = useState([]);
//     const [attendance, setAttendance] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [selectedProjects, setSelectedProjects] = useState(null);
//     const [rates, setRates] = useState({ dayShiftRate: 0, nightShiftRate: 0, overtimeRate: 0 });
//     const [paymentDetails, setPaymentDetails] = useState({}); // To store payment details by labourId

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     useEffect(() => {
//         if (selectedProjects) {
//             fetchLabour(selectedProjects);
//         }
//     }, [selectedProjects, selectedMonth, selectedYear]);

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
//             const labourData = response.data;
//             setLabour(labourData);

//             if (Array.isArray(labourData) && labourData.length > 0) {
//                 const labourDetails = labourData[0];
//                 setRates({
//                     dayShiftRate: labourDetails.dayShift || 0,
//                     nightShiftRate: labourDetails.nightShift || 0,
//                     overtimeRate: labourDetails.overtimeHrs || 0,
//                 });

//                 const labourIds = labourData.map((labour) => labour.id);
//                 await fetchAttendance(labourIds);

//                 // Fetch payment details for all labour IDs
//                 const paymentPromises = labourIds.map(fetchPaymentDetails);
//                 const paymentResults = await Promise.all(paymentPromises);

//                 const paymentData = labourIds.reduce((acc, labourId, index) => {
//                     acc[labourId] = paymentResults[index];
//                     return acc;
//                 }, {});

//                 setPaymentDetails(paymentData);
//             }
//         } catch (error) {
//             console.error('Error fetching labour:', error);
//         }
//     };

//     const fetchAttendance = async (labourIds) => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/labour-attendance`, { labourIds });
//             setAttendance(response.data);
//         } catch (error) {
//             console.error('Error fetching attendance:', error);
//         }
//     };

//     const fetchPaymentDetails = async (labourId) => {
//         console.log("labourId", labourId); // Log the incoming labourId to confirm it is being passed correctly
//         try {
//             // Make the API call to fetch payment details for the specified labourId
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/labourpaidyear`, {
//                 params: {
//                     labourId,
//                     year: selectedYear,
//                     month: selectedMonth,
//                 },
//             });

//             // Log the entire response to check its structure
//             console.log("Payment details response:", response.data);
//             // Extract payment details from the API response
//             const paymentDetails = response.data;

//             // Validate if paymentDetails is an array before reducing it
//             if (Array.isArray(paymentDetails)) {
//                 // Calculate the total paid amount by iterating over the array
//                 const totalPaid = paymentDetails.reduce((sum, payment) => {
//                     return sum + (payment.amountPaid || 0);
//                 }, 0);

//                 return totalPaid;
//             }
//             return 0; // Return 0 if no valid payment details found
//         } catch (error) {
//             console.error("Error fetching payment details:", error);
//             return 0; // Return 0 in case of error
//         }
//     };

//     const calculateTotalAttendance = (labourId) => {
//         const labourAttendance = attendance.filter((record) => record.labourId === labourId);

//         let totalDayShift = 0;
//         let totalNightShift = 0;
//         let totalOvertime = 0;
//         let totalAmount = 0;

//         labourAttendance.forEach((record) => {
//             totalDayShift += record.dayShift || 0;
//             totalNightShift += record.nightShift || 0;
//             totalOvertime += record.overtimeHours || 0;

//             const dayShiftAmount = (record.dayShift || 0) * (rates.dayShiftRate || 0);
//             const nightShiftAmount = (record.nightShift || 0) * (rates.nightShiftRate || 0);
//             const overtimeAmount = (record.overtimeHours || 0) * (rates.overtimeRate || 0);

//             totalAmount += dayShiftAmount + nightShiftAmount + overtimeAmount;
//         });

//         return { totalDayShift, totalNightShift, totalOvertime, totalAmount };
//     };
//     return (
//         <div>
//             <h1>Labour and Attendance Management</h1>
//             <div>
//                 <label>Select Project:</label>
//                 <select value={selectedProjects} onChange={(e) => setSelectedProjects(e.target.value)}>
//                     <option value="">-- Select a Project --</option>
//                     {projects.map((project) => (
//                         <option key={project.id} value={project.id}>
//                             {project.projectName}
//                         </option>
//                     ))}
//                 </select>
//                 <div className="form-group col-md-3">
//                     <label className="fw-bolder text-black">Month: </label>
//                     <select
//                         className="form-control "
//                         value={selectedMonth}
//                         onChange={(e) => setSelectedMonth(e.target.value)}
//                     >
//                         {Array.from({ length: 12 }, (_, i) => (
//                             <option key={i + 1} value={i + 1}>
//                                 {new Date(0, i).toLocaleString("default", { month: "long" })}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="form-group col-md-3">
//                     <label className="fw-bolder text-black">Year: </label>
//                     <select
//                         className="form-control "
//                         value={selectedYear}
//                         onChange={(e) => setSelectedYear(e.target.value)}
//                     >
//                         {Array.from({ length: 10 }, (_, i) => (
//                             <option key={i} value={new Date().getFullYear() - i}>
//                                 {new Date().getFullYear() - i}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th>Labour ID</th>
//                         <th>Labour Name</th>
//                         <th>Project Name</th>
//                         <th>Date </th>
//                         <th>Total Day Shift</th>
//                         <th>Total Night Shift</th>
//                         <th>Total Overtime</th>
//                         <th>Total Amount</th>
//                         <th>Paid</th>
//                         <th>Due</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {labour.map((labourer) => {
//                         const { totalDayShift, totalNightShift, totalOvertime, totalAmount } = calculateTotalAttendance(labourer.id);
//                         const totalPaid = paymentDetails[labourer.id] || 0;
//                         console.log(totalAmount,)
//                         const totalDue = totalAmount - totalPaid;

//                         return (
//                             <tr key={labourer.id}>
//                                 <td>{labourer.id}</td>
//                                 <td>{labourer.labourName}</td>
//                                 <td>{labourer.projectName}</td>
//                                 <td>{new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}</td>
//                                 <td>{totalDayShift} times present</td>
//                                 <td>{totalNightShift} times present</td>
//                                 <td>{totalOvertime} overtime hours</td>
//                                 <td>{totalAmount.toFixed(2)}</td>
//                                 <td>{totalPaid.toFixed(2)}</td>
//                                 <td>{totalDue.toFixed(2)}</td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default LabourAttendance;










import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; // Spinner

const LabourPaymentList = ({ handleLogout, username }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [labour, setLabour] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedProjects, setSelectedProjects] = useState(null);
    const [rates, setRates] = useState({ dayShiftRate: 0, nightShiftRate: 0, overtimeRate: 0 });
    const [paymentDetails, setPaymentDetails] = useState({}); // To store payment details by labourId

    // Fetch all projects on component mount
    useEffect(() => {
        fetchProjects();
    }, []);

    // Fetch labour and associated data when a project, month, or year changes
    useEffect(() => {
        if (selectedProjects) {
            fetchLabour(selectedProjects);
        }
    }, [selectedProjects, selectedMonth, selectedYear]);

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
            const labourData = response.data;
            setLabour(labourData);

            if (Array.isArray(labourData) && labourData.length > 0) {
                // Fetch rates from the first labour record (if applicable)
                const labourDetails = labourData[0];
                setRates({
                    dayShiftRate: labourDetails.dayShift || 0,
                    nightShiftRate: labourDetails.nightShift || 0,
                    overtimeRate: labourDetails.overtimeHrs || 0,
                });

                // Fetch attendance and payment details for all labour IDs
                const labourIds = labourData.map((labour) => labour.id);
                await fetchAttendance(labourIds);
                fetchAllPaymentDetails(labourIds);
            }
        } catch (error) {
            console.error("Error fetching labour:", error);
        }
    };

    const fetchAttendance = async (labourIds) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/labour-attendance`, {
                labourIds,
                month: selectedMonth,
                year: selectedYear,
            });
            console.log(response.data)
            setAttendance(response.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const fetchPaymentDetails = async (labourId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/labourpaidyear`, {
                params: {
                    labourId,
                    year: selectedYear,
                    month: selectedMonth,
                },
            });

            const paymentDetails = response.data;

            if (Array.isArray(paymentDetails)) {
                const totalPaid = paymentDetails.reduce((sum, payment) => {
                    return sum + (payment.amountPaid || 0);
                }, 0);

                return totalPaid;
            }
            return 0;
        } catch (error) {
            console.error("Error fetching payment details:", error);
            return 0;
        }
    };

    const fetchAllPaymentDetails = async (labourIds) => {
        try {
            const paymentPromises = labourIds.map(fetchPaymentDetails);
            const paymentResults = await Promise.all(paymentPromises);

            const paymentData = labourIds.reduce((acc, labourId, index) => {
                acc[labourId] = paymentResults[index];
                return acc;
            }, {});

            setPaymentDetails(paymentData);
        } catch (error) {
            console.error("Error fetching all payment details:", error);
        }
    };

    const calculateTotalAttendance = (labourId) => {
        const labourAttendance = attendance.filter((record) => record.labourId === labourId);

        let totalDayShift = 0;
        let totalNightShift = 0;
        let totalOvertime = 0;
        let totalAmount = 0;

        labourAttendance.forEach((record) => {
            totalDayShift += record.dayShift || 0;
            totalNightShift += record.nightShift || 0;
            totalOvertime += record.overtimeHours || 0;

            const dayShiftAmount = (record.dayShift || 0) * (rates.dayShiftRate || 0);
            const nightShiftAmount = (record.nightShift || 0) * (rates.nightShiftRate || 0);
            const overtimeAmount = (record.overtimeHours || 0) * (rates.overtimeRate || 0);

            totalAmount += dayShiftAmount + nightShiftAmount + overtimeAmount;
        });

        return { totalDayShift, totalNightShift, totalOvertime, totalAmount };
    };

    return (
        // <div>
        //     <h1>Labour Payment</h1>
        //     <div>
        //         <label>Select Project:</label>
        //         <select value={selectedProjects} onChange={(e) => setSelectedProjects(e.target.value)}>
        //             <option value="">-- Select a Project --</option>
        //             {projects.map((project) => (
        //                 <option key={project.id} value={project.id}>
        //                     {project.projectName}
        //                 </option>
        //             ))}
        //         </select>
        //         <div className="form-group col-md-3">
        //             <label className="fw-bolder text-black">Month: </label>
        //             <select
        //                 className="form-control"
        //                 value={selectedMonth}
        //                 onChange={(e) => setSelectedMonth(Number(e.target.value))}
        //             >
        //                 {Array.from({ length: 12 }, (_, i) => (
        //                     <option key={i + 1} value={i + 1}>
        //                         {new Date(0, i).toLocaleString("default", { month: "long" })}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>
        //         <div className="form-group col-md-3">
        //             <label className="fw-bolder text-black">Year: </label>
        //             <select
        //                 className="form-control"
        //                 value={selectedYear}
        //                 onChange={(e) => setSelectedYear(Number(e.target.value))}
        //             >
        //                 {Array.from({ length: 10 }, (_, i) => (
        //                     <option key={i} value={new Date().getFullYear() - i}>
        //                         {new Date().getFullYear() - i}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>
        //     </div>
        //     <table border="1">
        //         <thead>
        //             <tr>
        //                 <th>Labour ID</th>
        //                 <th>Labour Name</th>
        //                 <th>Project Name</th>
        //                 <th>Date</th>
        //                 <th>Total Day Shift</th>
        //                 <th>Total Night Shift</th>
        //                 <th>Total Overtime</th>
        //                 <th>Total Amount</th>
        //                 <th>Paid</th>
        //                 <th>Due</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {labour.map((labourer) => {
        //                 const { totalDayShift, totalNightShift, totalOvertime, totalAmount } = calculateTotalAttendance(
        //                     labourer.id
        //                 );
        //                 const totalPaid = paymentDetails[labourer.id] || 0;
        //                 const totalDue = totalAmount - totalPaid;

        //                 return (
        //                     <tr key={labourer.id}>
        //                         <td>{labourer.id}</td>
        //                         <td>{labourer.labourName}</td>
        //                         <td>{labourer.projectName}</td>
        //                         <td>
        //                             {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })}{" "}
        //                             {selectedYear}
        //                         </td>
        //                         <td>{totalDayShift} times present</td>
        //                         <td>{totalNightShift} times present</td>
        //                         <td>{totalOvertime} overtime hours</td>
        //                         <td>{totalAmount.toFixed(2)}</td>
        //                         <td>{totalPaid.toFixed(2)}</td>
        //                         <td>{totalDue.toFixed(2)}</td>
        //                     </tr>
        //                 );
        //             })}
        //         </tbody>
        //     </table>
        // </div>


























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
                                            <div className="nunito text-white">Labour Payment List</div>
                                            <div className=" d-flex gap-3">
                                                <div className='d-flex align-items-center justify-content-center gap-2'>
                                                    <label className='nunito text-white p-0 m-0'>Select Project:</label>
                                                    {/* <select
                                                        className="button_details overflow-hidden"
                                                        value={selectedProject}
                                                        onChange={(e) => handleProjectChange(e.target.value)}
                                                    >
                                                        <option value="">Select Project</option>
                                                        {projects.map((project) => (
                                                            <option key={project.id} value={project.id}>
                                                                {project.projectName}
                                                            </option>
                                                        ))}
                                                    </select> */}

                                                    <select className="button_details overflow-hidden" value={selectedProjects} onChange={(e) => setSelectedProjects(e.target.value)}>
                                                        <option value="">Select Project</option>
                                                        {projects.map((project) => (
                                                            <option key={project.id} value={project.id}>
                                                                {project.projectName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    <label className='nunito text-white p-0 m-0'>Filter:</label>
                                                    <select
                                                        className="button_details overflow-hidden"
                                                        value={selectedMonth}
                                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                                    >
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <option key={i + 1} value={i + 1}>
                                                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="button_details overflow-hidden"
                                                        value={selectedYear}
                                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                                    >
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
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : (
                                                <table className="table table-bordered" style={{ width: "100%" }}>
                                                    <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                        <tr>
                                                            
                                                            <th>Labour Name</th>
                                                            <th>Labour ID</th>
                                                            <th>Project Name</th>
                                                            <th>Date</th>
                                                            <th>Total Day Shift</th>
                                                            <th>Total Night Shift</th>
                                                            <th>Total Overtime</th>
                                                            <th>Total Amount</th>
                                                            <th>Paid</th>
                                                            <th>Due</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {labour.map((labourer) => {
                                                            const { totalDayShift, totalNightShift, totalOvertime, totalAmount } = calculateTotalAttendance(
                                                                labourer.id
                                                            );
                                                            const totalPaid = paymentDetails[labourer.id] || 0;
                                                            const totalDue = totalAmount - totalPaid;

                                                            return (
                                                                <tr key={labourer.id}>
                                                                    
                                                                    <td>{labourer.labourName}</td>
                                                                    <td>{labourer.labourId}</td>
                                                                    <td>{labourer.projectName}</td>
                                                                    <td>
                                                                        {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })}{" "}
                                                                        {selectedYear}
                                                                    </td>
                                                                    <td>{totalDayShift} D</td>
                                                                    <td>{totalNightShift} N</td>
                                                                    <td>{totalOvertime} OT Hrs</td>
                                                                    <td className='text-end'>&#x20B9;{totalAmount != null ? totalAmount.toFixed(2) : '0.00'}</td>
                                                                    <td className='text-end'>&#x20B9;{totalPaid != null ? totalPaid.toFixed(2) : '0.00'}</td>
                                                                    <td className='text-end'>&#x20B9;{totalDue != null ? totalDue.toFixed(2) : '0.00'}</td>
                                                                </tr>
                                                            );
                                                        })}
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
};

export default LabourPaymentList;
