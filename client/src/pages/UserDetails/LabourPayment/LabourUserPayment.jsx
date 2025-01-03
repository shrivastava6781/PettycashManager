import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";
import PayLabourPaymentUser from "./PayLabourPaymentUser";
import LabourAttendanceperMonth from "./LabourAttendanceperMonth";
import PaymentHistory from "./PaymentHistory";

const LabourUserPayment = ({ handleLogout, username }) => {
    const [labour, setLabour] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [rates, setRates] = useState({ dayShiftRate: 0, nightShiftRate: 0, overtimeRate: 0 });
    const [paymentDetails, setPaymentDetails] = useState({}); // To store payment details by labourId
    const [expandedLabour, setExpandedLabour] = useState(null);
    // Payment Form 
    const [isPaymentForm, setIsPaymentForm] = useState(false);
    const [paymentForm, setPaymentForm] = useState(null);
    // Payment Form 
    const [isPaymentAttendanceForm, setIsPaymentAttendanceForm] = useState(false);
    const [paymentAttendanceForm, setPaymentAttendanceForm] = useState(null);
    // Payment History Form 
    const [isPaymentHistoryForm, setIsPaymentHistoryForm] = useState(false);
    const [paymentHistoryForm, setPaymentHistoryForm] = useState(null);
    // Fetch all projects on component mount
    const selectedProjects = localStorage.getItem('projectId');


    // Fetch labour and associated data when a project, month, or year changes
    useEffect(() => {
        if (selectedProjects) {
            fetchLabour(selectedProjects);
        }
    }, [selectedProjects, selectedMonth, selectedYear]);

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

    const toggleDropdown = (labourId) => {
        setExpandedLabour((prevId) => (prevId === labourId ? null : labourId));
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


    const handlePaymentForm = (record) => {
        setPaymentForm(record);
        setIsPaymentForm(true);
    };

    const handlePaymentAttendanceForm = (record) => {
        setPaymentAttendanceForm(record);
        setIsPaymentAttendanceForm(true);
    };

    const handlePaymentHistoryForm = (record) => {
        setPaymentHistoryForm(record);
        setIsPaymentHistoryForm(true);
    };

    const handleUpdate = () => {
        toast.success('Data updated successfully');
    };

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            <SidebarEmployee />
            <div className='w-100'>
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    <div className="row">
                        <div className="col-xl-12">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Labour Payment List</div>
                                            <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
                                                <label className='nunito text-white p-0 m-0 userfont '>Filter:</label>
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
                                <hr className='m-0 p-0' />
                                <div className="p-3">
                                    {labour.length === 0 ? (
                                        <div className="text-center">
                                            <p>No Payment Found.</p>
                                        </div>
                                    ) : (
                                        labour.map((labourer) => {
                                            // Destructuring the total values returned by calculateTotalAttendance
                                            const { totalAmount } = calculateTotalAttendance(labourer.id);

                                            // Retrieve payment details for the current labourer
                                            const totalPaid = paymentDetails[labourer.id] || 0;
                                            const totalDue = totalAmount - totalPaid;

                                            return (
                                                <div
                                                    key={labourer.id}
                                                    className="mb-3 "
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor: "#00509d",
                                                        border: "1px solid #00509d",
                                                        borderRadius: "10px",
                                                        padding: "10px",
                                                        color: "white",
                                                    }}
                                                >
                                                    <div
                                                        className="d-flex justify-content-between align-items-center"
                                                        onClick={() => toggleDropdown(labourer.id)}
                                                    >
                                                        <span>{labourer.labourName}</span>
                                                        <span>{expandedLabour === labourer.id ? "▲" : "▼"}</span>
                                                    </div>
                                                    {expandedLabour === labourer.id && (
                                                        <div
                                                            style={{
                                                                marginTop: "4px",
                                                                border: "1px solid white",
                                                                borderRadius: "5px",

                                                                color: "white",
                                                                padding: "5px",
                                                                display: "flex",
                                                                backgroundColor: "#F9F9F9",
                                                                justifyContent: "space-between",
                                                            }}
                                                        >
                                                            <div className="text-black d-flex align-items-start justify-content-between flex-column">
                                                                <p className="tablefont nunito m-0 p-0">
                                                                    <span>Total Amt: </span>&#x20B9;{totalAmount ? totalAmount.toFixed(2) : "0.00"}
                                                                </p>
                                                                <p className="tablefont nunito m-0 p-0">
                                                                    <span>Total Paid: </span>&#x20B9;{totalPaid ? totalPaid.toFixed(2) : "0.00"}
                                                                </p>
                                                                <p className="tablefont nunito m-0 p-0">
                                                                    <span>Total Due: </span>&#x20B9;{totalDue ? totalDue.toFixed(2) : "0.00"}
                                                                </p>

                                                            </div>
                                                            <div className="d-flex flex-column gap-1">
                                                                <button
                                                                    className="tablefont nunito py-0.6 px-2 text-white"
                                                                    style={{ border: "none", backgroundColor: "#218838", borderRadius: "3px", fontSize: "15px" }}
                                                                    onClick={() => handlePaymentForm({
                                                                        labourer,
                                                                        totalAmount: totalAmount || 0,
                                                                        paidAmount: totalPaid || 0,
                                                                        dueAmount: totalDue || 0,
                                                                        selectedMonth,
                                                                        selectedYear,
                                                                        selectedProjects,
                                                                    })}
                                                                > Make Payment</button>
                                                                <button
                                                                    className="tablefont nunito py-0.6 px-2 text-white"
                                                                    style={{ border: "none", backgroundColor: "#007BFF", borderRadius: "3px", fontSize: "15px" }}
                                                                    onClick={() => handlePaymentAttendanceForm({
                                                                        labourer,
                                                                        totalAmount: totalAmount || 0,
                                                                        paidAmount: totalPaid || 0,
                                                                        dueAmount: totalDue || 0,
                                                                        selectedMonth,
                                                                        selectedYear,
                                                                        selectedProjects,
                                                                    })}
                                                                > Check Attendance </button>
                                                                <button
                                                                    className="tablefont nunito py-0.6 px-2 text-white"
                                                                    style={{ border: "none", backgroundColor: "#D91159", borderRadius: "3px", fontSize: "15px" }}
                                                                    onClick={() => handlePaymentHistoryForm({
                                                                        labourer,
                                                                        totalAmount: totalAmount || 0,
                                                                        paidAmount: totalPaid || 0,
                                                                        dueAmount: totalDue || 0,
                                                                        selectedMonth,
                                                                        selectedYear,
                                                                        selectedProjects,
                                                                    })}
                                                                > Payment History </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {isPaymentForm && (
                    <PayLabourPaymentUser
                        record={paymentForm}
                        onClose={() => setIsPaymentForm(false)}
                        onUpdate={handleUpdate}
                    />
                )}
                {isPaymentAttendanceForm && (
                    <LabourAttendanceperMonth
                        record={paymentAttendanceForm}
                        onClose={() => setIsPaymentAttendanceForm(false)}
                        onUpdate={handleUpdate}
                    />
                )}
                {isPaymentHistoryForm && (
                    <PaymentHistory
                        record={paymentHistoryForm}
                        onClose={() => setIsPaymentHistoryForm(false)}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default LabourUserPayment;
