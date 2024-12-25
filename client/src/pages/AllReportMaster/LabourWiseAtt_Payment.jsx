import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from "react-loader-spinner";

function LabourWiseAtt_Payment({ handleLogout, username }) {
    const [projects, setProjects] = useState([]);
    const [labour, setLabour] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedLabour, setSelectedLabour] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());   // Current year
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rates, setRates] = useState({});
    const [totalAmount, setTotalAmount] = useState(0); // Track total amount
    const [totalAttendance, setTotalAttendance] = useState(0); // Track total attendance
    const [attendanceSummary, setAttendanceSummary] = useState({
        dayShift: 0,
        nightShift: 0,
        halfDayShift: 0,
        absentShift: 0,
        overtime: 0
    }); // Track attendance breakdown
    // Payment of the labour 
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [paidAmount, setPaidAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchLabour(selectedProject);
        }
    }, [selectedProject]);

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
                    halfDayShiftRate: labourDetails.halfDayShift || 0,
                    absentShiftRate: 0,
                    overtimeRate: labourDetails.overtimeHrs || 0,
                });

            } else {
                console.warn("No labour details found for the given ID.");
                setRates({
                    dayShiftRate: 0,
                    nightShiftRate: 0,
                    halfDayShiftRate: 0,
                    absentShiftRate: 0,
                    overtimeRate: 0,
                });
            }
        } catch (error) {
            console.error("Error fetching labour details:", error);
        }
    };

    // Fetch payment details when labour is selected
    useEffect(() => {
        if (selectedLabour) {
            fetchLabourDetails(selectedLabour);
            fetchAttendance(selectedLabour);
        }
    }, [selectedLabour, selectedMonth, selectedYear]);

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourattendance`, {
                params: {
                    labourId: selectedLabour,
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

        const { dayShiftRate, nightShiftRate, halfDayShiftRate, absentShiftRate, overtimeRate } = rates; // Destructure rates state

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

        // halfday Shift Calculation
        if (record.halfDayShift > 0) {
            if (attendance) attendance += ", ";
            attendance += `HD - ${record.halfDayShift}`;
            amount += record.halfDayShift * halfDayShiftRate;
        }

        // absent Shift Calculation
        if (record.absentShift > 0) {
            if (attendance) attendance += ", ";
            attendance += `A - ${record.absentShift}`;
            amount += record.absentShift * absentShiftRate;
        }

        // Overtime Calculation
        if (record.overtimeHours > 0) {
            if (attendance) attendance += ", ";
            attendance += `OT - ${record.overtimeHours} Hrs`;
            amount += record.overtimeHours * overtimeRate;
        }

        return { attendance, amount, dayShift: record.dayShift, nightShift: record.nightShift, halfDayShift: record.halfDayShift, absentShift: record.absentShift, overtime: record.overtimeHours };
    };


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
                record.dayShift + record.nightShift + record.halfDayShift + record.absentShift + record.overtimeHours;
            return total + totalAttendanceForRecord;
        }, 0);
    };

    useEffect(() => {
        // Accumulate attendance summary
        let dayShiftTotal = 0;
        let nightShiftTotal = 0;
        let halfDayShiftTotal = 0;
        let absentShiftTotal = 0;
        let overtimeTotal = 0;

        attendanceRecords.forEach((record) => {
            const { dayShift, nightShift, halfDayShift, absentShift, overtime } = calculateAttendanceAmount(record);
            dayShiftTotal += dayShift;
            nightShiftTotal += nightShift;
            halfDayShiftTotal += halfDayShift;
            absentShiftTotal += absentShift;
            overtimeTotal += overtime;
        });

        setAttendanceSummary({
            dayShift: dayShiftTotal,
            nightShift: nightShiftTotal,
            halfDayShift: halfDayShiftTotal,
            absentShift: absentShiftTotal,
            overtime: overtimeTotal,
        });

        setTotalAmount(calculateTotalAmount());
        setTotalAttendance(calculateTotalAttendance());
    }, [attendanceRecords]);



    // paymentDetails  


    // Fetch payment details when labour is selected
    useEffect(() => {
        if (selectedLabour) {
            fetchPaymentDetails(selectedLabour, selectedMonth, selectedYear);
        }
    }, [selectedLabour, selectedMonth, selectedYear]);


    const fetchPaymentDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/checklabour`, {
                params: {
                    labourId: selectedLabour,
                    year: selectedYear,
                    month: selectedMonth,
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

    const handleUpdate = () => {
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
                                                            <th className="text-center">Day Shift</th>
                                                            <th className="text-center">Night Shift</th>
                                                            <th className="text-center">Half Shift</th>
                                                            <th className="text-center">Absent</th>
                                                            <th className="text-center">Overtime Hrs</th>
                                                            <th className="text-center">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {attendanceRecords.map((record) => {
                                                            const { attendance, amount } = calculateAttendanceAmount(record);
                                                            return (
                                                                <tr key={record.id}>
                                                                    <td className="text-center">{new Date(record.date).toLocaleDateString()}</td>
                                                                    {/* Check if Day Shift is greater than 0 to display "Yes" or "No" */}
                                                                    <td className="text-center">{record.dayShift > 0 ? "Yes" : "No"}</td>
                                                                    {/* Check if Night Shift is greater than 0 to display "Yes" or "No" */}
                                                                    <td className="text-center">{record.nightShift > 0 ? "Yes" : "No"}</td>
                                                                    {/* Check if Half Day Shift is greater than 0 to display "Yes" or "No" */}
                                                                    <td className="text-center">{record.halfDayShift > 0 ? "Yes" : "No"}</td>
                                                                    {/* Check if Absent Shift is greater than 0 to display "Yes" or "No" */}
                                                                    <td className="text-center">{record.absentShift > 0 ? "Yes" : "No"}</td>
                                                                    <td className="text-center">
                                                                        {record.overtimeHours > 0 ? `${record.overtimeHours} Hrs` : "No"}
                                                                    </td>
                                                                    {/* Display calculated amount */}
                                                                    <td className="text-center">Rs {amount.toFixed(2)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            )}
                                            <div className="d-flex justify-content-end">
                                                <strong>Total Attendance: D-{attendanceSummary.dayShift} N-{attendanceSummary.nightShift} H-{attendanceSummary.halfDayShift} A-{attendanceSummary.absentShift} OT-{attendanceSummary.overtime}</strong>
                                                <strong className="ml-3">Total: Rs {totalAmount.toFixed(2)}</strong>
                                            </div>
                                        </div>
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
                </div>
            </div>
        </div>
    );
}

export default LabourWiseAtt_Payment;




















