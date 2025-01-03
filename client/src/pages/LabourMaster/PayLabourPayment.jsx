
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
        const { dayShiftRate, nightShiftRate, halfDayShiftRate, absentShiftRate, overtimeRate } = rates; // Destructure rates state
        console.log("rates", rates)

        let amount = 0;
        amount += (record.dayShift || 0) * dayShiftRate;
        amount += (record.nightShift || 0) * nightShiftRate;
        amount += (record.halfDayShift || 0) * halfDayShiftRate;
        amount += (record.absentShift || 0) * absentShiftRate;
        amount += (record.overtimeHours || 0) * overtimeRate;

        return {
            amount,
            dayShift: record.dayShift || 0,
            nightShift: record.nightShift || 0,
            halfDayShift: record.halfDayShift || 0,
            absentShift: record.absentShift || 0,
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
                                       Pay Labour Payment
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


