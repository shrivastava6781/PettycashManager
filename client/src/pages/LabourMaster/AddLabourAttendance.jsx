// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "../../components/sidebar/Sidebar";
// import SearchBar from "../../components/sidebar/SearchBar";
// import { ThreeDots } from "react-loader-spinner"; // Spinner

// function AddLabourAttendance({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [labour, setLabour] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [selectedProject, setSelectedProject] = useState("");
//     const [selectedDate, setSelectedDate] = useState("");
//     const [attendanceData, setAttendanceData] = useState([]);

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     useEffect(() => {
//         if (selectedProject) {
//             fetchLabourByProject(selectedProject);
//         }
//     }, [selectedProject]);

//     const fetchProjects = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
//             setProjects(response.data);
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchLabourByProject = async (projectId) => {
//         setIsLoading(true);
//         try {
//             // Fetch labours data from the API
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours`);

//             // Filter records based on the selected project ID
//             const filteredLabours = response.data.filter((record) => {
//                 const isProjectMatch = projectId ? record.projectId === parseInt(projectId) : true;
//                 return isProjectMatch;
//             });

//             // Update state with filtered labours
//             setLabour(filteredLabours);

//             // Set attendance data for each labour
//             setAttendanceData(
//                 filteredLabours.map((labour) => ({
//                     labourId: labour.id,
//                     dayShift: false,
//                     nightShift: false,
//                     overtime: false,
//                     due: false,
//                 }))
//             );
//         } catch (error) {
//             console.error("Error fetching labours:", error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };


//     const handleAttendanceChange = (labourId, field) => {
//         setAttendanceData((prevData) =>
//             prevData.map((record) =>
//                 record.labourId === labourId ? { ...record, [field]: !record[field] } : record
//             )
//         );
//     };

//     const handleSubmit = async () => {
//         if (!selectedDate || !selectedProject) {
//             toast.error("Please select a project and date.");
//             return;
//         }

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
//                 projectId: selectedProject,
//                 date: selectedDate,
//                 attendance: attendanceData,
//             });
//             toast.success(response.data.message || "Attendance submitted successfully!");
//         } catch (error) {
//             console.error("Error submitting attendance:", error);
//             toast.error("Failed to submit attendance.");
//         }
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
//                             <div
//                                 style={{ borderRadius: "20px", border: "1px solid #00509d" }}
//                                 className="overflow-hidden"
//                             >
//                                 <div
//                                     style={{ backgroundColor: "#00509d" }}
//                                     className="row no-gutters align-items-center p-3"
//                                 >
//                                     <div className="col">
//                                         <div
//                                             className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between"
//                                             style={{ fontSize: "1.5rem" }}
//                                         >
//                                             <div className="nunito text-white">Add Attendance</div>
//                                             <div className="d-flex gap-3">
//                                                 <div className="d-flex align-items-center gap-2">
//                                                     <label className="nunito text-white">Project:</label>
//                                                     <select
//                                                         className="button_details"
//                                                         value={selectedProject}
//                                                         onChange={(e) => setSelectedProject(e.target.value)}
//                                                     >
//                                                         <option value="">Select Project</option>
//                                                         {projects.map((proj) => (
//                                                             <option key={proj.id} value={proj.id}>
//                                                                 {proj.projectName}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <label className="text-white">
//                                                         Date <span style={{ color: "red" }}>*</span>
//                                                     </label>
//                                                     <input
//                                                         type="date"
//                                                         className="form-control"
//                                                         value={selectedDate}
//                                                         onChange={(e) => setSelectedDate(e.target.value)}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <hr className="m-0 p-0" />
//                                 <div className="card-body">
//                                     <div style={{ maxHeight: "610px", overflowY: "auto" }}>
//                                         {isLoading ? (
//                                             <div className="d-flex justify-content-center align-items-center">
//                                                 <ThreeDots color="#00BFFF" height={80} width={80} />
//                                             </div>
//                                         ) : (
//                                             <table className="table table-bordered" style={{ width: "100%" }}>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Project Name</th>
//                                                         <th>Labor Name</th>
//                                                         <th>Labour ID</th>
//                                                         <th>Mobile No.</th>
//                                                         <th>Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {labour.length === 0 ? (
//                                                         <tr>
//                                                             <td colSpan="4" className="text-center">
//                                                                 No Labor Found.
//                                                             </td>
//                                                         </tr>
//                                                     ) : (
//                                                         labour.map((entry) => {
//                                                             const attendanceRecord = attendanceData.find((record) => record.labourId === entry.id);
//                                                             return (
//                                                                 <tr key={entry.id}>
//                                                                     <td>{entry.projectShortName}</td>
//                                                                     <td>{entry.labourName}</td>
//                                                                     <td>{entry.labourId}</td>
//                                                                     <td>{entry.mobileNo}</td>
//                                                                     <td>
//                                                                         <label>
//                                                                             <span>Day Shift</span>
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 checked={attendanceRecord?.dayShift || false}
//                                                                                 onChange={() => handleAttendanceChange(entry.id, "dayShift")}
//                                                                             />
//                                                                         </label>
//                                                                         <label>
//                                                                             <span>Night Shift</span>
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 checked={attendanceRecord?.nightShift || false}
//                                                                                 onChange={() => handleAttendanceChange(entry.id, "nightShift")}
//                                                                             />
//                                                                         </label>
//                                                                         <label>
//                                                                             <span>Overtime</span>
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 checked={attendanceRecord?.overtime || false}
//                                                                                 onChange={() => handleAttendanceChange(entry.id, "overtime")}
//                                                                             />
//                                                                         </label>
//                                                                         <label>
//                                                                             <span>Due</span>
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 checked={attendanceRecord?.due || false}
//                                                                                 onChange={() => handleAttendanceChange(entry.id, "due")}
//                                                                             />
//                                                                         </label>
//                                                                     </td>
//                                                                 </tr>
//                                                             );
//                                                         })
//                                                     )}
//                                                 </tbody>
//                                             </table>
//                                         )}
//                                     </div>
//                                     <div className="mt-3 text-right">
//                                         <button className="btn btn-primary" onClick={handleSubmit}>
//                                             Submit Attendance
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AddLabourAttendance;















import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from "react-loader-spinner"; // Spinner

function AddLabourAttendance({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [labour, setLabour] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchLabourByProject(selectedProject);
        }
    }, [selectedProject]);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLabourByProject = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours`);
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

    const handleSubmit = async () => {
        if (!selectedDate || !selectedProject) {
            toast.error("Please select a project and date.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
                projectId: selectedProject,
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
            <Sidebar />
            <div className="w-100">
                <SearchBar username={username} handleLogout={handleLogout} />
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
                                                <div className="d-flex align-items-center gap-2">
                                                    <label className="nunito text-white">Project:</label>
                                                    <select
                                                        className="button_details"
                                                        value={selectedProject}
                                                        onChange={(e) => setSelectedProject(e.target.value)}
                                                    >
                                                        <option value="">Select Project</option>
                                                        {projects.map((proj) => (
                                                            <option key={proj.id} value={proj.id}>
                                                                {proj.projectName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="text-white">
                                                        Date <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={selectedDate}
                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="m-0 p-0" />
                                <div className="card-body">
                                    <div style={{ maxHeight: "610px", overflowY: "auto" }}>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                <ThreeDots color="#00BFFF" height={80} width={80} />
                                            </div>
                                        ) : (
                                            <table className="table table-bordered" style={{ width: "100%" }}>
                                                <thead>
                                                    <tr>
                                                        <th>Project Name</th>
                                                        <th>Labor Name</th>
                                                        <th>Labour ID</th>
                                                        <th>Mobile No.</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {labour.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className="text-center">
                                                                No Labour Found.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        labour.map((entry) => {
                                                            const attendanceRecord = attendanceData.find(
                                                                (record) => record.labourId === entry.id
                                                            );
                                                            return (
                                                                <tr key={entry.id}>
                                                                    <td>{entry.projectShortName}</td>
                                                                    <td>{entry.labourName}</td>
                                                                    <td>{entry.labourId}</td>
                                                                    <td>{entry.mobileNo}</td>
                                                                    <td>
                                                                        <div className="d-flex gap-3">
                                                                            <label>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={attendanceRecord?.dayShift || false}
                                                                                    onChange={() =>
                                                                                        handleAttendanceChange(entry.id, "dayShift", !attendanceRecord.dayShift)
                                                                                    }
                                                                                />
                                                                                Day Shift
                                                                            </label>
                                                                            <label>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={attendanceRecord?.nightShift || false}
                                                                                    onChange={() =>
                                                                                        handleAttendanceChange(entry.id, "nightShift", !attendanceRecord.nightShift)
                                                                                    }
                                                                                />
                                                                                Night Shift
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                placeholder="Overtime (hrs)"
                                                                                value={attendanceRecord?.overtime || ""}
                                                                                onChange={(e) =>
                                                                                    handleAttendanceChange(entry.id, "overtime", e.target.value)
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    <div className="mt-3 text-right">
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

export default AddLabourAttendance;
