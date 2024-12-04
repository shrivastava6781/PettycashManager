import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner"; // Spinner
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

function AddLabourAttendences({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [labour, setLabour] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [expandedLabour, setExpandedLabour] = useState(null);
    const projectId = localStorage.getItem("projectId");

    useEffect(() => {
        if (projectId) {
            fetchLabourByProject(projectId);
        }
    }, [projectId]);

    const fetchLabourByProject = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
            const filteredLabours = response.data.filter((record) =>
                projectId ? record.projectId === parseInt(projectId) : true
            );
            setLabour(filteredLabours);
            setAttendanceData(
                filteredLabours.map((labour) => ({
                    labourId: labour.id,
                    dayShift: false,
                    nightShift: false,
                    overtime: 0,
                }))
            );
        } catch (error) {
            console.error("Error fetching labours:", error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const handleAttendanceChange = (labourId, field, value) => {
        setAttendanceData((prevData) =>
            prevData.map((record) =>
                record.labourId === labourId
                    ? { ...record, [field]: value }
                    : record
            )
        );
    };
    const toggleDropdown = (labourId) => {
        setExpandedLabour((prevId) => (prevId === labourId ? null : labourId));
    };
    const generateAttendanceText = (record) => {
        const parts = [];
        if (record.dayShift) parts.push("D");
        if (record.nightShift) parts.push("N");
        if (record.overtime > 0) parts.push(record.overtime);
        return parts.length > 0 ? `(${parts.join(" | ")})` : "";
    };
    const handleSubmit = async () => {
        if (!selectedDate || !projectId) {
            toast.error("Please select a project and date.");
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
                projectId,
                date: selectedDate,
                attendance: attendanceData,
            });
            toast.success(response.data.message || "Attendance submitted successfully!");
        } catch (error) {
            console.error("Error submitting attendance:", error);
            toast.error("Failed to submit attendance.");
        }
    };

    return (
        <div className="d-flex w-100 h-100 bg-white">
            <SidebarEmployee />
            <div className="w-100">
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    <div className="row">
                        <div className="col-xl-12">
                            <div
                                style={{ borderRadius: "20px", border: "1px solid #00509d" }}
                                className="overflow-hidden"
                            >
                                <div
                                    style={{ backgroundColor: "#00509d" }}
                                    className="row no-gutters align-items-center p-3"
                                >
                                    <div className="col">
                                        <div
                                            className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between"
                                            style={{ fontSize: "1.5rem" }}
                                        >
                                            <div className="nunito text-white">Add Attendance</div>
                                            <div className="d-flex gap-3">
                                                <div className="form-group">
                                                    <label className="nunito text-white">Date - </label>
                                                    <input
                                                        type="date"
                                                        className="button_details"
                                                        value={selectedDate}
                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="m-0 p-0" />
                                <div className="p-3">
                                    {isLoading ? (
                                        <div className="d-flex justify-content-center align-items-center">
                                            <ThreeDots color="#00BFFF" height={80} width={80} />
                                        </div>
                                    ) : (
                                        labour.map((entry) => {
                                            const attendanceRecord = attendanceData.find(
                                                (record) => record.labourId === entry.id
                                            );
                                            return (
                                                <div key={entry.id} className="mb-3">
                                                    <div style={{
                                                        cursor: "pointer",
                                                        border: "1px solid #00509d",
                                                        borderRadius: "10px",
                                                        padding: "10px",
                                                        color: "white",
                                                        background: "#00509D",
                                                    }}>
                                                        <div
                                                            className="d-flex justify-content-between align-items-center"
                                                            onClick={() => toggleDropdown(entry.id)}

                                                        >
                                                            <span>
                                                                {entry.labourName}{" "}
                                                                <span>{generateAttendanceText(attendanceRecord)}</span>
                                                            </span>
                                                            <span>{expandedLabour === entry.id ? "▲" : "▼"}</span>
                                                        </div>
                                                        {expandedLabour === entry.id && (
                                                            <div className="p-3 d-flex gap-4" style={{
                                                                marginTop: "4px",
                                                                border: "1px solid white",
                                                                borderRadius: "10px",
                                                                color: "white",
                                                                background: "rgb(42 102 160)",
                                                            }}>
                                                                <div className="">
                                                                    <label className="">Overtime (Hours):</label>
                                                                    <input
                                                                        type="number"
                                                                        className="button_details"
                                                                        min="0"
                                                                        value={attendanceRecord?.overtime || 0}
                                                                        onChange={(e) =>
                                                                            handleAttendanceChange(entry.id, "overtime", parseInt(e.target.value, 10))
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className=" flex">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={attendanceRecord?.dayShift || false}
                                                                        onChange={(e) =>
                                                                            handleAttendanceChange(entry.id, "dayShift", e.target.checked)
                                                                        }
                                                                    />
                                                                    <label className="form-check-label">Day Shift</label>
                                                                </div>
                                                                <div className="flex">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"

                                                                        checked={attendanceRecord?.nightShift || false}
                                                                        onChange={(e) =>
                                                                            handleAttendanceChange(entry.id, "nightShift", e.target.checked)
                                                                        }
                                                                    />
                                                                    <label className="form-check-label">Night Shift</label>
                                                                </div>

                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            );
                                        })
                                    )}
                                    <div className="text-center mt-3">
                                        <button className="btn btn-primary" onClick={handleSubmit}>
                                            Submit Attendance
                                        </button>
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

export default AddLabourAttendences;








