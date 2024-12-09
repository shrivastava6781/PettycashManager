
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
import PaymentForm from "../../LabourMaster/PaymentForm";
import PaymentHistory from "../../LabourMaster/PaymentHistory";



const ViewLabourDetails = ({ labour, onClose }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());   // Current year
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0); // Track total amount
    const [totalAttendance, setTotalAttendance] = useState(0); // Track total attendance
    const [attendanceSummary, setAttendanceSummary] = useState({
        dayShift: 0,
        nightShift: 0,
        overtime: 0
    }); // Track attendance breakdown
    // for the labour Payment 
    const [payroll, setPayroll] = useState([]);
    const [filteredPayroll, setFilteredPayroll] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState({});
    const [isPaymentForm, setIsPaymentForm] = useState(false);
    const [paymentForm, setPaymentForm] = useState(null);
    const [paymentFormHistory, setPaymentFormHistory] = useState(null);
    const [isPaymentHistory, setIsPaymentHistory] = useState(false);

    // Day and Night shift amounts
    const dayShiftRate = labour.dayShift;  // Example: Rs 5000 for Day Shift
    const nightShiftRate = labour.nightShift;  // Example: Rs 6000 for Night Shift
    const overtimeRate = labour.overtimeHrs;  // Example: Rs 100 per overtime hour

    useEffect(() => {
        fetchAttendance();
    }, [selectedMonth, selectedYear]);

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourattendance`, {
                params: {
                    labourId: labour.id,
                    year: selectedYear,
                    month: selectedMonth,
                },
            });

            console.log("Fetched Attendance Records:", response.data.data);
            setAttendanceRecords(response.data.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to fetch attendance records");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAttendanceAmount = (record) => {
        let attendance = "";
        let amount = 0;

        // Day Shift Calculation
        if (record.dayShift > 0) {
            attendance += `D - ${record.dayShift}`;
            amount += record.dayShift * dayShiftRate;
        }

        // Night Shift Calculation
        if (record.nightShift > 0) {
            if (attendance) attendance += ", ";
            attendance += `N - ${record.nightShift}`;
            amount += record.nightShift * nightShiftRate;
        }

        // Overtime Calculation
        if (record.overtimeHours > 0) {
            if (attendance) attendance += ", ";
            attendance += `OT - ${record.overtimeHours} Hrs`;
            amount += record.overtimeHours * overtimeRate;
        }

        return { attendance, amount, dayShift: record.dayShift, nightShift: record.nightShift, overtime: record.overtimeHours };
    };

    // Calculate Total Amount
    const calculateTotalAmount = () => {
        return attendanceRecords.reduce((total, record) => {
            const { amount } = calculateAttendanceAmount(record);
            return total + amount;
        }, 0);
    };

    // Calculate Total Attendance (total of day shifts, night shifts, and overtime hours)
    const calculateTotalAttendance = () => {
        return attendanceRecords.reduce((total, record) => {
            const totalAttendanceForRecord =
                record.dayShift + record.nightShift + record.overtimeHours;
            return total + totalAttendanceForRecord;
        }, 0);
    };

    useEffect(() => {
        // Accumulate attendance summary
        let dayShiftTotal = 0;
        let nightShiftTotal = 0;
        let overtimeTotal = 0;

        attendanceRecords.forEach((record) => {
            const { dayShift, nightShift, overtime } = calculateAttendanceAmount(record);
            dayShiftTotal += dayShift;
            nightShiftTotal += nightShift;
            overtimeTotal += overtime;
        });

        setAttendanceSummary({
            dayShift: dayShiftTotal,
            nightShift: nightShiftTotal,
            overtime: overtimeTotal,
        });

        setTotalAmount(calculateTotalAmount());
        setTotalAttendance(calculateTotalAttendance());
    }, [attendanceRecords]);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        if (labour?.id) {
            fetchPayrollByLabour();
        }
    }, [labour]);

    useEffect(() => {
        filterPayroll();
    }, [selectedYear, selectedMonth, payroll]);

    useEffect(() => {
        fetchPaymentDetails();
    }, [payroll]);

    const fetchPayrollByLabour = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/labour/${labour.id}`);
            setPayroll(response.data);
        } catch (error) {
            console.error('Error fetching payroll by labour:', error);
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
            setPaymentDetails(details);
        } catch (error) {
            console.error('Error fetching payment details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterPayroll = () => {
        const filteredRecords = payroll.filter(record => {
            if (!record.month) return false;

            const [recordYear, recordMonth] = record.month.split("-").map(Number);
            const selectedYearInt = parseInt(selectedYear, 10);
            const selectedMonthInt = selectedMonth !== '' ? parseInt(selectedMonth, 10) : null;

            return (
                recordYear === selectedYearInt &&
                (selectedMonthInt === null || recordMonth === selectedMonthInt)
            );
        });

        setFilteredPayroll(filteredRecords);
    };

    const handlePaymentForm = (record) => {
        setPaymentForm(record);
        setIsPaymentForm(true);
    };

    const handlePaymentHistory = (record) => {
        setPaymentFormHistory(record);
        setIsPaymentHistory(true);
    };

    const handleUpdate = () => {
        toast.success('Data updated successfully');
        fetchPayrollByLabour();
    };


    return (
        <div>
            <div className="mt-3">
                <ToastContainer />
                <div className="bg-white rounded shadow-sm card-body">
                    <div className="row laptop">

                        <div className="col-md-12 d-flex ">
                            <div className="col-md-9 d-flex justify-content-between px-3">
                                <div className="w-100">
                                    <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder m-0">
                                        Labour Dashboard
                                    </h2>
                                    <hr className="m-0 p-0" />
                                    <div className="mt-2 w-100 d-flex justify-content-between">
                                        <div>
                                            <h6 className="nunito text-black">Name: <span className="text-dark">{labour.labourName}</span></h6>
                                            <h6 className="nunito text-black">Project: <span className="text-dark">{labour.projectShortName}</span></h6>
                                            <h6 className="nunito text-black">Labour Code: <span className="text-dark">{labour.labourId}</span></h6>
                                        </div>
                                        <div>
                                            <h6 className="nunito text-black">Father's Name: <span className="text-dark">{labour.fatherName}</span></h6>
                                            <h6 className="nunito text-black">Mobile Number: <span className="text-dark">{labour.mobileNo}</span></h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 d-flex align-items-center justify-content-center">
                                <button type="button" className="button_action" onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </div>
                    <div className="row phone ">
                        <div className="col-md-9 d-flex justify-content-between px-3">
                            <div className="w-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h3 style={{ color: "#00509d" }} className="title-detail fw-bolder m-0">
                                        Labour Dashboard
                                    </h3>
                                    <button style={{ backgroundColor: "#00509d" }} type="button" className=" button_details" onClick={onClose}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>

                                <hr className="m-0 p-0" />
                                <div className="mt-2 w-100 d-flex justify-content-between">
                                    <div>
                                        <h6 className="nunito tablefont text-black">Name: <span className="text-dark">{labour.labourName}</span></h6>
                                        <h6 className="nunito tablefont text-black">Project: <span className="text-dark">{labour.projectShortName}</span></h6>
                                        <h6 className="nunito tablefont text-black">Labour Code: <span className="text-dark">{labour.labourId}</span></h6>
                                    </div>
                                    <div>
                                        <h6 className="nunito tablefont text-black">Father's Name: <span className="text-dark">{labour.fatherName}</span></h6>
                                        <h6 className="nunito tablefont text-black">Mobile Number: <span className="text-dark">{labour.mobileNo}</span></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div style={{ borderRadius: "10px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs p-0 font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between">
                                            <div className="nunito tablefont text-white m-0 p-0" > Labour Payment Details
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
                                                            <th className="text-center">Day Shift</th>
                                                            <th className="text-center">Night Shift</th>
                                                            <th className="text-center">Overtime Hours</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='text-end'>&#x20B9;{labour.dayShift != null ? labour.dayShift.toFixed(2) : '0.00'}</td>
                                                            <td className='text-end'>&#x20B9;{labour.nightShift != null ? labour.nightShift.toFixed(2) : '0.00'}</td>
                                                            <td className='text-end'>&#x20B9;{labour.overtimeHrs != null ? labour.overtimeHrs.toFixed(2) : '0.00'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-12">
                            <ul style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px", backgroundColor: "#00509D", padding: "7px" }} className="nav nav-tabs px-2 " id="myTab" role="tablist">

                                <li className="nav-item">
                                    <a
                                        className="nav-link-labour active show"
                                        id="details-tab"
                                        data-toggle="tab"
                                        href="#details"
                                        role="tab"
                                        aria-controls="details"
                                        aria-selected="true"
                                    >
                                        Labour Attendance
                                    </a>
                                </li>

                                <li className="nav-item laptop">
                                    <a
                                        className="nav-link-labour "
                                        id="checkin-tab"
                                        data-toggle="tab"
                                        href="#checkin"
                                        role="tab"
                                        aria-controls="checkin"
                                        aria-selected="false"
                                    >
                                        Payment Ledger
                                    </a>
                                </li>

                                <li className="nav-item phone">
                                    <a
                                        className="nav-link-labour "
                                        id="checkin_phone-tab"
                                        data-toggle="tab"
                                        href="#checkin_phone"
                                        role="tab"
                                        aria-controls="checkin_phone"
                                        aria-selected="false"
                                    >
                                        Payment Ledger
                                    </a>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade active show" id="details" role="tabpanel"
                                    aria-labelledby="details-tab"
                                >
                                    {/* Attendance Records */}
                                    <div className="row p-1 laptop">
                                        <div className="col-md-12">
                                            <div style={{ borderRadius: "15px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                                    <div className="col">
                                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between">
                                                            <div className="nunito text-white m-0 p-0">Labour Attendance</div>
                                                            <div>
                                                                <label className="nunito text-white m-0 p-0">Month:</label>
                                                                <select className="button_details mx-1" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                                                                    {Array.from({ length: 12 }, (_, i) => (
                                                                        <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                                                    ))}
                                                                </select>
                                                                <label className="nunito text-white m-0 p-0">Year:</label>
                                                                <select className="button_details mx-1" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                                                    {Array.from({ length: 10 }, (_, i) => (
                                                                        <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className='m-0 p-0' />
                                                <div>
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
                                                                            <th className="text-center">Date</th>
                                                                            <th className="text-center">Attendance</th>
                                                                            <th className="text-center">Amount</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {attendanceRecords.map((record) => {
                                                                            const { attendance, amount } = calculateAttendanceAmount(record);
                                                                            return (
                                                                                <tr key={record.id}>
                                                                                    <td className="text-center">{new Date(record.date).toLocaleDateString()}</td>
                                                                                    <td className="text-center">{attendance}</td>
                                                                                    <td className="text-center">Rs {amount.toFixed(2)}</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                            <div className="d-flex justify-content-end">
                                                                <strong>Total Attendance: D-{attendanceSummary.dayShift} N-{attendanceSummary.nightShift} OT-{attendanceSummary.overtime}</strong>
                                                                <strong className="ml-3">Total: Rs {totalAmount.toFixed(2)}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendance Records */}
                                    <div className="row p-1 phone">
                                        <div className="col-md-12">
                                            <div style={{ borderRadius: "15px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                                    <div className="col">
                                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                                            <div className="nunito tablefont text-white userfont">Labour Attendance</div>
                                                            <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
                                                                <label className='nunito tablefont text-white p-0 m-0 userfont '>Filter:</label>
                                                                <select className="button_details mx-1" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                                                                    {Array.from({ length: 12 }, (_, i) => (
                                                                        <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                                                    ))}
                                                                </select>
                                                                <select className="button_details mx-1" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                                                    {Array.from({ length: 10 }, (_, i) => (
                                                                        <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className='m-0 p-0' />
                                                <div>
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
                                                                            <th className="text-center">Date</th>
                                                                            <th className="text-center">Attendance</th>
                                                                            <th className="text-center">Amount</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {attendanceRecords.map((record) => {
                                                                            const { attendance, amount } = calculateAttendanceAmount(record);
                                                                            return (
                                                                                <tr key={record.id}>
                                                                                    <td className="text-center">{new Date(record.date).toLocaleDateString()}</td>
                                                                                    <td className="text-center">{attendance}</td>
                                                                                    <td className="text-center">Rs {amount.toFixed(2)}</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                            {/* Footer section for grand totals */}
                                                            <div className="p-2 mt-2" style={{ borderTop: "2px solid #00509d" }}>
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <p className="tablefont text-black fw-bold m-0 text-center">
                                                                        Total Attendance: D-{attendanceSummary.dayShift} N-{attendanceSummary.nightShift} OT-{attendanceSummary.overtime}
                                                                    </p>
                                                                    <p className="tablefont text-black fw-bold m-0 text-center">
                                                                        Total: Rs {totalAmount.toFixed(2)}
                                                                    </p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Laptop history */}
                                <div className="tab-pane fade" id="checkin" role="tabpanel" aria-labelledby="checkin-tab">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className="overflow-hidden">
                                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                                    <div className="col">
                                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                            <div className="nunito text-white">Labour Details List</div>
                                                            <div className="d-flex align-items-center justify-content-center gap-4">
                                                                <div>
                                                                    <label className="nunito text-white">Filter:</label>
                                                                    <select
                                                                        className="button_details mx-1"
                                                                        value={selectedMonth}
                                                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                                                    >
                                                                        <option value="">Month</option>
                                                                        {monthNames.map((month, index) => (
                                                                            <option key={index} value={index + 1}>{month}</option>
                                                                        ))}
                                                                    </select>
                                                                    <select
                                                                        className="button_details mx-1"
                                                                        value={selectedYear}
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
                                                <hr className="m-0 p-0" />
                                                <div>
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
                                </div>

                                {/* Phone  history */}
                                <div className="tab-pane fade" id="checkin_phone" role="tabpanel" aria-labelledby="checkin_phone-tab">
                                    <div className="row p-1">
                                        <div className="col-md-12">
                                            <div style={{ borderRadius: "15px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                                    <div className="col">
                                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                                            <div className="nunito tablefont text-white userfont">Labour Details List</div>
                                                            <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
                                                                <label className='nunito tablefont text-white p-0 m-0 userfont '>Filter:</label>
                                                                <select
                                                                    className="button_details mx-1"
                                                                    value={selectedMonth}
                                                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                                                >
                                                                    <option value="">Month</option>
                                                                    {monthNames.map((month, index) => (
                                                                        <option key={index} value={index + 1}>{month}</option>
                                                                    ))}
                                                                </select>
                                                                <select
                                                                    className="button_details mx-1"
                                                                    value={selectedYear}
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
                                                <hr className='m-0 p-0' />
                                                <div className=''>
                                                    <div className="card-body">
                                                        <div className="forresponsive">
                                                            {isLoading ? (
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                                </div>
                                                            ) : filteredPayroll.length === 0 ? (
                                                                <p className="nunito tablefont text-black text-center text-muted">No Records Found</p>
                                                            ) : (
                                                                filteredPayroll.map((record) => {
                                                                    const amountPaid = paymentDetails[record.id] || 0;
                                                                    const amountDue = (record.totalAmount || 0) - amountPaid;

                                                                    return (
                                                                        <div
                                                                            key={record.id}
                                                                            style={{
                                                                                border: "1px solid #00509d",
                                                                                borderRadius: "10px",
                                                                                background: "linear-gradient(9deg, rgba(64,163,160,1) 19%, #00509d 93%)",
                                                                            }}
                                                                            className="p-1 m-1 text-white"
                                                                        >
                                                                            <div className="d-flex align-items-start p-1">
                                                                                <div className="w-100">
                                                                                    <div className="tabledetails">
                                                                                        <div>
                                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                                {record.labourName}
                                                                                            </p>
                                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                                <span>Month: </span>
                                                                                                {monthNames[new Date(record.month).getMonth()]} {new Date(record.month).getFullYear()}
                                                                                            </p>
                                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                                <span>Total Amount: </span>₹{record.totalAmount?.toFixed(2)}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="text-end">
                                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                                <span>Paid: </span>₹{amountPaid.toFixed(2)}
                                                                                            </p>
                                                                                            <p className="tablefont nunito m-0 p-0">
                                                                                                <span>Due: </span>₹{amountDue.toFixed(2)}
                                                                                            </p>
                                                                                            <button onClick={() => handlePaymentHistory(record)} className="button_details px-1 py-0">
                                                                                                view
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
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
                    />
                )}
            </div>
        </div>



    );
};

export default ViewLabourDetails;















