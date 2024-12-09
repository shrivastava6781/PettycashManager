import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

function ViewLabourAttendance({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
    const [labour, setLabour] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [daysInMonth, setDaysInMonth] = useState(31);
    const projectId = localStorage.getItem("projectId");

    useEffect(() => {
        if (projectId) {
            fetchLabourByProject(projectId);
        }
    }, [projectId]);


    const fetchLabourByProject = async (projectId) => {
        setIsLoading(true);
        try {
            const labourResponse = await axios.get(
                `${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`
            );
            const attendanceResponse = await axios.get(
                `${process.env.REACT_APP_LOCAL_URL}/viewattendance/${projectId}?month=${selectedMonth + 1}&year=${selectedYear}`
            );
            setLabour(labourResponse.data);
            setAttendanceData(attendanceResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            toast.error("Failed to load labour or attendance data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getDaysInMonth = (month, year) =>
            new Date(year, month + 1, 0).getDate();
        setDaysInMonth(getDaysInMonth(selectedMonth, selectedYear));
    }, [selectedMonth, selectedYear]);

    const getAttendanceForDay = (labourId, day) => {
        const record = attendanceData.find((rec) => {
            const recordDate = new Date(rec.date);
            return (
                rec.labourId === labourId &&
                recordDate.getDate() === day &&
                recordDate.getMonth() === selectedMonth &&
                recordDate.getFullYear() === selectedYear
            );
        });

        if (record) {
            const shifts = [];
            if (record.day_shift) shifts.push("D");
            if (record.night_shift) shifts.push("N");
            if (record.overtime_hours) shifts.push(record.overtime_hours);
            return shifts.join("/");
        }
        return "";
    };

    const calculateTotalShifts = (labourId, shiftType) => {
        return attendanceData.reduce((total, rec) => {
            if (rec.labourId === labourId) {
                if (shiftType === "day" && rec.day_shift) total++;
                if (shiftType === "night" && rec.night_shift) total++;
                if (shiftType === "overtime") total += rec.overtime_hours || 0;
            }
            return total;
        }, 0);
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
        if (projectId) {
            fetchLabourByProject(projectId);
        } else {
            setLabour([]);
            setAttendanceData([]);
        }
    };

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {<SidebarEmployee />}
            <div className='w-100'>
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    <div className="row ">
                        <div className="col-xl-12 p-0 mt-2">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Project Attendance</div>
                                            <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
                                                <label className='nunito text-white p-0 m-0 userfont '>Filter:</label>
                                                <select
                                                    className="button_details mx-1"
                                                    value={selectedMonth}
                                                    onChange={(e) =>
                                                        setSelectedMonth(Number(e.target.value))
                                                    }
                                                >
                                                    {[...Array(12).keys()].map((month) => (
                                                        <option key={month} value={month}>
                                                            {new Date(0, month).toLocaleString("default", {
                                                                month: "long",
                                                            })}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/* <label className="nunito text-white">Year:</label> */}
                                                <select
                                                    className="button_details mx-1"
                                                    value={selectedYear}
                                                    onChange={(e) =>
                                                        setSelectedYear(Number(e.target.value))
                                                    }
                                                >
                                                    {[...Array(5).keys()].map((offset) => (
                                                        <option
                                                            key={offset}
                                                            value={new Date().getFullYear() - offset}
                                                        >
                                                            {new Date().getFullYear() - offset}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className='m-0 p-0' />
                                <div className=''>
                                    {/* <div className="card-body">
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center">
                                                <ThreeDots color="#00BFFF" height={80} width={80} />
                                            </div>
                                        ) : labour.length === 0 ? (
                                            <div className="text-center">
                                                No labour data available for the selected project.
                                            </div>
                                        ) : (
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        {[...Array(daysInMonth).keys()].map((day) => (
                                                            <th key={day + 1}>{day + 1}</th>
                                                        ))}
                                                        <th> Day Shift</th>
                                                        <th> Night Shift</th>
                                                        <th> Over Night</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {labour.map((lab) => (
                                                        <tr key={lab.id}>
                                                            <td>{lab.labourName}</td>
                                                            {[...Array(daysInMonth).keys()].map((day) => (
                                                                <td key={day + 1}>
                                                                    {getAttendanceForDay(lab.id, day + 1)}
                                                                </td>
                                                            ))}
                                                            <td>
                                                                {calculateTotalShifts(lab.id, "day")}
                                                            </td>
                                                            <td>
                                                                {calculateTotalShifts(lab.id, "night")}
                                                            </td>
                                                            <td>
                                                                {calculateTotalShifts(lab.id, "overtime")}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div> */}
                                    <div className="card-body">
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center">
                                                <ThreeDots color="#00BFFF" height={80} width={80} />
                                            </div>
                                        ) : labour.length === 0 ? (
                                            <div className="text-center">
                                                No labour data available for the selected project.
                                            </div>
                                        ) : (
                                            <div style={{ overflowX: 'auto' }}>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            {[...Array(daysInMonth).keys()].map((day) => (
                                                                <th key={day + 1}>{day + 1}</th>
                                                            ))}
                                                            <th>Day Shift</th>
                                                            <th>Night Shift</th>
                                                            <th>Over Night</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {labour.map((lab) => (
                                                            <tr key={lab.id}>
                                                                <td>{lab.labourName}</td>
                                                                {[...Array(daysInMonth).keys()].map((day) => (
                                                                    <td key={day + 1}>
                                                                        {getAttendanceForDay(lab.id, day + 1)}
                                                                    </td>
                                                                ))}
                                                                <td>{calculateTotalShifts(lab.id, "day")}</td>
                                                                <td>{calculateTotalShifts(lab.id, "night")}</td>
                                                                <td>{calculateTotalShifts(lab.id, "overtime")}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
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

export default ViewLabourAttendance;


















