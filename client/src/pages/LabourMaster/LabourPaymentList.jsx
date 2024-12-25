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
    const [rates, setRates] = useState({ dayShiftRate: 0, nightShiftRate: 0, overtimeRate: 0,halfDayShiftRate: 0 });
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
                    halfDayShiftRate: labourDetails.halfDayShift || 0,
                    absentShiftRate: labourDetails.absentShift || 0,
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
        let totalHalfDayShift = 0;
        let totalAbsentShift = 0;
        let totalOvertime = 0;
        let totalAmount = 0;

        labourAttendance.forEach((record) => {
            totalDayShift += record.dayShift || 0;
            totalNightShift += record.nightShift || 0;
            totalHalfDayShift += record.halfDayShift || 0;
            totalAbsentShift += record.absentShift || 0;
            totalOvertime += record.overtimeHours || 0;

            const dayShiftAmount = (record.dayShift || 0) * (rates.dayShiftRate || 0);
            const nightShiftAmount = (record.nightShift || 0) * (rates.nightShiftRate || 0);
            const halfDayShiftAmount = (record.halfDayShift || 0) * (rates.halfDayShiftRate || 0);
            const absentShiftAmount = (record.absentShift || 0) * (rates.absentShiftRate || 0);
            const overtimeAmount = (record.overtimeHours || 0) * (rates.overtimeRate || 0);

            totalAmount += dayShiftAmount + nightShiftAmount + overtimeAmount + halfDayShiftAmount + absentShiftAmount;
        });

        return { totalDayShift, totalNightShift,totalHalfDayShift,totalAbsentShift, totalOvertime, totalAmount };
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
                                            <div className="nunito text-white">Labour Payment List</div>
                                            <div className=" d-flex gap-3">
                                                <div className='d-flex align-items-center justify-content-center gap-2'>
                                                    <label className='nunito text-white p-0 m-0'>Select Project:</label>
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
                                                            {/* <th>Project Name</th> */}
                                                            {/* <th>Date</th> */}
                                                            <th>Day Shift</th>
                                                            <th>Night Shift</th>
                                                            <th>Half Day</th>
                                                            <th>Absent</th>
                                                            <th>Overtime</th>
                                                            <th>Total Amount</th>
                                                            <th>Paid Amt</th>
                                                            <th>Due Amt</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {labour.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="10" className="text-center">No Payment Found.</td>
                                                            </tr>
                                                        ) : (
                                                            labour.map((labourer) => {
                                                                // Destructuring the total values returned by calculateTotalAttendance
                                                                const { totalDayShift, totalNightShift,totalHalfDayShift,totalAbsentShift, totalOvertime, totalAmount } = calculateTotalAttendance(labourer.id);

                                                                // Retrieve payment details for the current labourer
                                                                const totalPaid = paymentDetails[labourer.id] || 0;
                                                                const totalDue = totalAmount - totalPaid;

                                                                return (
                                                                    <tr key={labourer.id}>
                                                                        <td>{labourer.labourName}</td>
                                                                        <td>{labourer.labourId}</td>
                                                                        {/* <td>{labourer.projectName}</td> */}
                                                                        {/* <td>
                                                                            {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}
                                                                        </td> */}
                                                                        <td>{totalDayShift} Day</td>
                                                                        <td>{totalNightShift} Night</td>
                                                                        <td>{totalHalfDayShift} Half</td>
                                                                        <td>{totalAbsentShift} Absent</td>
                                                                        <td>{totalOvertime} OT Hrs</td>
                                                                        <td className="text-end">&#x20B9;{totalAmount ? totalAmount.toFixed(2) : "0.00"}</td>
                                                                        <td className="text-end">&#x20B9;{totalPaid ? totalPaid.toFixed(2) : "0.00"}</td>
                                                                        <td className="text-end">&#x20B9;{totalDue ? totalDue.toFixed(2) : "0.00"}</td>
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
                </div>
            </div>
        </div>
    );
};

export default LabourPaymentList;
