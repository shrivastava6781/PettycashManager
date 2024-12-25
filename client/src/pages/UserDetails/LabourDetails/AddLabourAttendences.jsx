// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
// // import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

// // function AddLabourAttendences({ handleLogout, username }) {
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [labour, setLabour] = useState([]);
// //     const [selectedDate, setSelectedDate] = useState("");
// //     const [attendanceData, setAttendanceData] = useState([]);
// //     const [existingAttendance, setExistingAttendance] = useState([]);
// //     const [expandedLabour, setExpandedLabour] = useState(null);
// //     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Initialize with current month
// //     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year

// //     const projectId = localStorage.getItem("projectId");

// //     useEffect(() => {
// //         if (projectId) {
// //             fetchLabourByProject(projectId);
// //         }
// //     }, [projectId]);

// //     useEffect(() => {
// //         if (selectedDate && projectId) {
// //             fetchExistingAttendance(projectId, selectedDate);
// //         } else {
// //             setExistingAttendance([]);
// //             resetAttendanceData(); // Reset attendance data if no date is selected
// //         }
// //     }, [selectedDate, projectId]);

// //     const fetchLabourByProject = async (projectId) => {
// //         setIsLoading(true);
// //         try {
// //             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
// //             setLabour(response.data);
// //             resetAttendanceData(response.data); // Initialize attendance data
// //         } catch (error) {
// //             console.error("Error fetching labours:", error.message);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const fetchExistingAttendance = async (projectId, date) => {
// //         setIsLoading(true);
// //         try {
// //             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
// //                 params: { projectId, date },
// //             });
// //             setExistingAttendance(response.data);

// //             // Update attendance data with existing attendance
// //             setAttendanceData((prevData) =>
// //                 labour.map((labour) => {
// //                     const existingRecord = response.data.find((att) => att.labourId === labour.id);
// //                     return existingRecord
// //                         ? {
// //                             labourId: labour.id,
// //                             dayShift: existingRecord.day_shift === 1,
// //                             nightShift: existingRecord.night_shift === 1,
// //                             overtime: existingRecord.overtime_hours || 0,
// //                         }
// //                         : {
// //                             labourId: labour.id,
// //                             dayShift: false,
// //                             nightShift: false,
// //                             overtime: 0,
// //                         };
// //                 })
// //             );
// //         } catch (error) {
// //             console.error("Error fetching attendance:", error.message);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const resetAttendanceData = (labourList = labour) => {
// //         setAttendanceData(
// //             labourList.map((labour) => ({
// //                 labourId: labour.id,
// //                 dayShift: false,
// //                 nightShift: false,
// //                 overtime: 0,
// //             }))
// //         );
// //     };

// //     const handleAttendanceChange = (labourId, field, value) => {
// //         setAttendanceData((prevData) =>
// //             prevData.map((record) =>
// //                 record.labourId === labourId
// //                     ? { ...record, [field]: value }
// //                     : record
// //             )
// //         );
// //     };

// //     const toggleDropdown = (labourId) => {
// //         setExpandedLabour((prevId) => (prevId === labourId ? null : labourId));
// //     };

// //     const generateAttendanceText = (record) => {
// //         const parts = [];
// //         if (record.dayShift) parts.push("D");
// //         if (record.nightShift) parts.push("N");
// //         if (record.overtime > 0) parts.push(record.overtime);
// //         return parts.length > 0 ? `(${parts.join(" | ")})` : "";
// //     };

// //     const getBackgroundColor = (record) => {
// //         if (record.dayShift || record.nightShift || record.overtime > 0) {
// //             return "green";
// //         }
// //         return "#00509D";
// //     };

// //     const handleSubmit = async () => {
// //         if (!selectedDate || !projectId) {
// //             toast.error("Please select a project and date.");
// //             return;
// //         }
// //         try {
// //             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
// //                 projectId,
// //                 date: selectedDate,
// //                 attendance: attendanceData,
// //             });
// //             toast.success(response.data.message || "Attendance submitted successfully!");
// //             fetchExistingAttendance(projectId, selectedDate); // Refresh attendance
// //         } catch (error) {
// //             console.error("Error submitting attendance:", error);
// //             toast.error("Failed to submit attendance.");
// //         }
// //     };

// //     return (
// //         <div className="d-flex w-100 h-100 bg-white">
// //             <SidebarEmployee />
// //             <div className="w-100">
// //                 <SearchBarEmployee username={username} handleLogout={handleLogout} />
// //                 <div className="container-fluid">
// //                     <ToastContainer />
// //                     <div className="row">
// //                         <div className="col-xl-12">
// //                             <div
// //                                 style={{ borderRadius: "20px", border: "1px solid #00509d" }}
// //                                 className="overflow-hidden">
// //                                 <div
// //                                     style={{ backgroundColor: "#00509d" }}
// //                                     className="row no-gutters align-items-center p-3"
// //                                 >
// //                                     <div className="col">
// //                                         <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
// //                                             <div className="nunito text-white">Payment Report</div>
// //                                             <div className=" d-flex gap-3">
// //                                                 <div className="d-flex align-items-center justify-content-center gap-2">
// //                                                     <label className='nunito text-white p-0 m-0'>Filter:</label>
// //                                                     <select
// //                                                         className="button_details"
// //                                                         value={selectedMonth}
// //                                                         onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
// //                                                     >
// //                                                         <option value="">Select Month</option>
// //                                                         {Array.from({ length: 12 }, (_, i) => (
// //                                                             <option key={i} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
// //                                                         ))}
// //                                                     </select>
// //                                                     <select
// //                                                         className="button_details"
// //                                                         value={selectedYear}
// //                                                         onChange={(e) => setSelectedYear(parseInt(e.target.value))}
// //                                                     >
// //                                                         <option value="">Select Year</option>
// //                                                         {Array.from({ length: 10 }, (_, i) => (
// //                                                             <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
// //                                                         ))}
// //                                                     </select>
// //                                                 </div>
// //                                                 <div className="">
// //                                                 <label className='nunito text-white '>Date: </label>
// //                                                     <input
// //                                                         type="date"
// //                                                         style={{padding:"1px 4px"}}
// //                                                         className="button_details m-0"
// //                                                         value={selectedDate}
// //                                                         onChange={(e) => setSelectedDate(e.target.value)}
// //                                                     />
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                                 <hr className="m-0 p-0" />
// //                                 <div className="p-3">
// //                                     {labour.map((entry) => {
// //                                         const attendanceRecord = attendanceData.find(
// //                                             (record) => record.labourId === entry.id
// //                                         );
// //                                         return (
// //                                             <div
// //                                                 key={entry.id}
// //                                                 className="mb-3"
// //                                                 style={{
// //                                                     cursor: "pointer",
// //                                                     border: "1px solid #00509d",
// //                                                     borderRadius: "10px",
// //                                                     padding: "10px",
// //                                                     color: "white",
// //                                                     background: getBackgroundColor(attendanceRecord),
// //                                                 }}
// //                                             >
// //                                                 <div
// //                                                     className="d-flex justify-content-between align-items-center"
// //                                                     onClick={() => toggleDropdown(entry.id)}
// //                                                 >
// //                                                     <span>
// //                                                         {entry.labourName}{" "}
// //                                                         <span>{generateAttendanceText(attendanceRecord)}</span>
// //                                                     </span>
// //                                                     <span>{expandedLabour === entry.id ? "▲" : "▼"}</span>
// //                                                 </div>
// //                                                 {expandedLabour === entry.id && (
// //                                                     <div
// //                                                         className="p-3 d-flex gap-4"
// //                                                         style={{
// //                                                             marginTop: "4px",
// //                                                             border: "1px solid white",
// //                                                             borderRadius: "10px",
// //                                                             color: "white",
// //                                                             background: "rgb(42 102 160)",
// //                                                         }}
// //                                                     >
// //                                                         <div className="flex">
// //                                                             <input
// //                                                                 type="checkbox"
// //                                                                 className="form-check-input"
// //                                                                 checked={attendanceRecord?.dayShift || false}
// //                                                                 onChange={(e) =>
// //                                                                     handleAttendanceChange(entry.id, "dayShift", e.target.checked)
// //                                                                 }
// //                                                             />
// //                                                             <label className="form-check-label">Day Shift</label>
// //                                                         </div>
// //                                                         <div className="flex">
// //                                                             <input
// //                                                                 type="checkbox"
// //                                                                 className="form-check-input"
// //                                                                 checked={attendanceRecord?.nightShift || false}
// //                                                                 onChange={(e) =>
// //                                                                     handleAttendanceChange(entry.id, "nightShift", e.target.checked)
// //                                                                 }
// //                                                             />
// //                                                             <label className="form-check-label">Night Shift</label>
// //                                                         </div>
// //                                                         <div className="flex">
// //                                                             <label className="">Overtime (Hours):</label>
// //                                                             <input
// //                                                                 type="number"
// //                                                                 className="button_details"
// //                                                                 min="0"
// //                                                                 value={attendanceRecord?.overtime || 0}
// //                                                                 onChange={(e) =>
// //                                                                     handleAttendanceChange(entry.id, "overtime", parseInt(e.target.value, 10))
// //                                                                 }
// //                                                             />
// //                                                         </div>
// //                                                     </div>
// //                                                 )}
// //                                             </div>
// //                                         );
// //                                     })}
// //                                     <div className="text-center mt-3">
// //                                         <button className="btn btn-primary" onClick={handleSubmit}>
// //                                             Submit Attendance
// //                                         </button>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default AddLabourAttendences;







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
// import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

// function AddLabourAttendences({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [labour, setLabour] = useState([]);
//     const [selectedDate, setSelectedDate] = useState("");
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [existingAttendance, setExistingAttendance] = useState([]);
//     const [expandedLabour, setExpandedLabour] = useState(null);
//     const projectId = localStorage.getItem("projectId");

//     useEffect(() => {
//         if (projectId) {
//             fetchLabourByProject(projectId);
//         }
//     }, [projectId]);

//     useEffect(() => {
//         if (selectedDate && projectId) {
//             fetchExistingAttendance(projectId, selectedDate);
//         } else {
//             setExistingAttendance([]);
//             resetAttendanceData(); // Reset attendance data if no date is selected
//         }
//     }, [selectedDate, projectId]);

//     const fetchLabourByProject = async (projectId) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
//             setLabour(response.data);
//             resetAttendanceData(response.data); // Initialize attendance data
//         } catch (error) {
//             console.error("Error fetching labours:", error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchExistingAttendance = async (projectId, date) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
//                 params: { projectId, date },
//             });
//             setExistingAttendance(response.data);

//             // Update attendance data with existing attendance
//             setAttendanceData((prevData) =>
//                 labour.map((labour) => {
//                     const existingRecord = response.data.find((att) => att.labourId === labour.id);
//                     return existingRecord
//                         ? {
//                             labourId: labour.id,
//                             dayShift: existingRecord.day_shift === 1,
//                             nightShift: existingRecord.night_shift === 1,
//                             overtime: existingRecord.overtime_hours || 0,
//                         }
//                         : {
//                             labourId: labour.id,
//                             dayShift: false,
//                             nightShift: false,
//                             overtime: 0,
//                         };
//                 })
//             );
//         } catch (error) {
//             console.error("Error fetching attendance:", error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const resetAttendanceData = (labourList = labour) => {
//         setAttendanceData(
//             labourList.map((labour) => ({
//                 labourId: labour.id,
//                 dayShift: false,
//                 nightShift: false,
//                 overtime: 0,
//             }))
//         );
//     };

//     const handleAttendanceChange = (labourId, field, value) => {
//         setAttendanceData((prevData) =>
//             prevData.map((record) =>
//                 record.labourId === labourId
//                     ? { ...record, [field]: value }
//                     : record
//             )
//         );
//     };

//     const toggleDropdown = (labourId) => {
//         setExpandedLabour((prevId) => (prevId === labourId ? null : labourId));
//     };

//     const generateAttendanceText = (record) => {
//         const parts = [];
//         if (record.dayShift) parts.push("D");
//         if (record.nightShift) parts.push("N");
//         if (record.overtime > 0) parts.push(record.overtime);
//         return parts.length > 0 ? `(${parts.join(" | ")})` : "";
//     };

//     const getBackgroundColor = (record) => {
//         return record.dayShift || record.nightShift || record.overtime > 0 ? "green" : "#00509D";
//     };


//     const handleSubmit = async () => {
//         if (!selectedDate || !projectId) {
//             toast.error("Please select a project and date.");
//             return;
//         }
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
//                 projectId,
//                 date: selectedDate,
//                 attendance: attendanceData,
//             });
//             toast.success(response.data.message || "Attendance submitted successfully!");
//             fetchExistingAttendance(projectId, selectedDate); // Refresh attendance
//         } catch (error) {
//             console.error("Error submitting attendance:", error);
//             toast.error("Failed to submit attendance.");
//         }
//     };

//     return (
//         <div className="d-flex w-100 h-100 bg-white">
//             <SidebarEmployee />
//             <div className="w-100">
//                 <SearchBarEmployee username={username} handleLogout={handleLogout} />
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     {/* Laptop use  */}
//                     <div className="row laptop">
//                         <div className="col-xl-12 p-0 mt-2">
//                             <div
//                                 style={{ borderRadius: "20px", border: "1px solid #00509d" }}
//                                 className="overflow-hidden">
//                                 <div
//                                     style={{ backgroundColor: "#00509d" }}
//                                     className="row no-gutters align-items-center p-3"
//                                 >
//                                     <div className="col">
//                                         <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
//                                             <div className="nunito text-white">Payment Report</div>
//                                             <div className=" d-flex gap-3">
//                                                 <div className="">
//                                                     <label className='nunito text-white '>Date: </label>
//                                                     <input
//                                                         type="date"
//                                                         style={{ padding: "1px 4px" }}
//                                                         className="button_details m-0"
//                                                         value={selectedDate}
//                                                         onChange={(e) => setSelectedDate(e.target.value)}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <hr className="m-0 p-0" />
//                                 <div className="p-3">
//                                     {labour.map((entry) => {
//                                         const attendanceRecord = attendanceData.find(
//                                             (record) => record.labourId === entry.id
//                                         );
//                                         return (
//                                             <div
//                                                 key={entry.id}
//                                                 className="mb-3 attendanceColumn"
//                                                 style={{
//                                                     cursor: "pointer",
//                                                     border: "1px solid #00509d",
//                                                     borderRadius: "10px",
//                                                     padding: "10px",
//                                                     color: "white",
//                                                     // backgroundColor: "red"
//                                                     background: getBackgroundColor(attendanceRecord),
//                                                 }}
//                                             >
//                                                 <div
//                                                     className="d-flex justify-content-between align-items-center"
//                                                     onClick={() => toggleDropdown(entry.id)}
//                                                 >
//                                                     <span>
//                                                         {entry.labourName}{" "}
//                                                         <span>{generateAttendanceText(attendanceRecord)}</span>
//                                                     </span>
//                                                     <span>{expandedLabour === entry.id ? "▲" : "▼"}</span>
//                                                 </div>
//                                                 {expandedLabour === entry.id && (
//                                                     <div
//                                                         style={{
//                                                             marginTop: "4px",
//                                                             border: "1px solid white",
//                                                             borderRadius: "10px",
//                                                             color: "white",
//                                                             padding: "10px 30px",
//                                                             // backgroundColor: "purple",
//                                                             display: "flex",
//                                                             gap: "3vw"
//                                                         }}>
//                                                         <div style={{ display: "flex", alignItems: "center", width: "200px", justifyContent: "space-between" }} className="">
//                                                             <div className="">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     className="form-check-input"
//                                                                     checked={attendanceRecord?.dayShift || false}
//                                                                     onChange={(e) =>
//                                                                         handleAttendanceChange(entry.id, "dayShift", e.target.checked)
//                                                                     }
//                                                                 />
//                                                                 <label className="form-check-label">Day Shift</label>
//                                                             </div>
//                                                             <div className="">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     className="form-check-input"
//                                                                     checked={attendanceRecord?.nightShift || false}
//                                                                     onChange={(e) =>
//                                                                         handleAttendanceChange(entry.id, "nightShift", e.target.checked)
//                                                                     }
//                                                                 />
//                                                                 <label className="form-check-label">Night Shift</label>
//                                                             </div>
//                                                         </div>
//                                                         <div className="p-0 m-0 ">
//                                                             <label className="p-0 m-0"> Overtime : </label>
//                                                             <input
//                                                                 type="number"
//                                                                 className="button_details py-0 px-1"
//                                                                 min="0"
//                                                                 value={attendanceRecord?.overtime || 0}
//                                                                 onChange={(e) =>
//                                                                     handleAttendanceChange(entry.id, "overtime", parseInt(e.target.value, 10))
//                                                                 }
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                     <div className="text-center mt-3">
//                                         <button className="btn btn-primary" onClick={handleSubmit}>
//                                             Submit Attendance
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Phone USe  */}
//                     <div className="row phone">
//                         <div className="col-xl-12 p-0 mt-2">
//                             <div
//                                 style={{ borderRadius: "20px", border: "1px solid #00509d" }}
//                                 className="overflow-hidden">
//                                 <div
//                                     style={{ backgroundColor: "#00509d" }}
//                                     className="row no-gutters align-items-center p-3"
//                                 >

//                                     <div className="col">
//                                         <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" >
//                                             <div className="nunito tablefont text-white userfont">Labour Attendance</div>
//                                             <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
//                                                 <label className='nunito tablefont text-white p-0 m-0 userfont '>Filter:</label>
//                                                 <input
//                                                     type="date"
//                                                     style={{ padding: "1px 4px" }}
//                                                     className="button_details mx-1"
//                                                     value={selectedDate}
//                                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <hr className="m-0 p-0" />
//                                 <div className="p-3">
//                                     {labour.map((entry) => {
//                                         const attendanceRecord = attendanceData.find(
//                                             (record) => record.labourId === entry.id
//                                         );
//                                         return (
//                                             <div
//                                                 key={entry.id}
//                                                 className="mb-3 attendanceColumn"
//                                                 style={{
//                                                     cursor: "pointer",
//                                                     border: "1px solid #00509d",
//                                                     borderRadius: "10px",
//                                                     padding: "10px",
//                                                     color: "white",
//                                                     // backgroundColor: "red"
//                                                     background: getBackgroundColor(attendanceRecord),
//                                                 }}
//                                             >
//                                                 <div
//                                                     className="d-flex flex justify-content-between align-items-center"
//                                                     onClick={() => toggleDropdown(entry.id)}
//                                                 >
//                                                     <span>
//                                                         {entry.labourName}{" "}
//                                                         <span>{generateAttendanceText(attendanceRecord)}</span>
//                                                     </span>
//                                                     <span>{expandedLabour === entry.id ? "▲" : "▼"}</span>
//                                                 </div>
//                                                 {expandedLabour === entry.id && (
//                                                     <div
//                                                         style={{
//                                                             marginTop: "4px",
//                                                             border: "1px solid white",
//                                                             borderRadius: "10px",
//                                                             color: "white",
//                                                             padding: "5px",
//                                                             // backgroundColor: "purple",
//                                                             display: "flex",
//                                                             flexDirection:"column",
//                                                             // gap: "3vw"
//                                                         }}>
//                                                         <div style={{ display: "flex",flexDirection:"column",paddingLeft:"30px", alignItems: "start", width: "200px", justifyContent: "space-between" }} className="">
//                                                             <div className="">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     className="form-check-input tablefont nunito"
//                                                                     checked={attendanceRecord?.dayShift || false}
//                                                                     onChange={(e) =>
//                                                                         handleAttendanceChange(entry.id, "dayShift", e.target.checked)
//                                                                     }
//                                                                 />
//                                                                 <label className="form-check-label">Day Shift</label>
//                                                             </div>
//                                                             <div className="">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     className="form-check-input tablefont nunito"
//                                                                     checked={attendanceRecord?.nightShift || false}
//                                                                     onChange={(e) =>
//                                                                         handleAttendanceChange(entry.id, "nightShift", e.target.checked)
//                                                                     }
//                                                                 />
//                                                                 <label className="form-check-label">Night Shift</label>
//                                                             </div>
//                                                         </div>
//                                                         <div className="px-2 m-0 ">
//                                                             <label className="p-0 m-0"> Overtime : </label>
//                                                             <input
//                                                                 type="number"
//                                                                 className="button_details py-0 px-3 tablefont nunito"
//                                                                 min="0"
//                                                                 value={attendanceRecord?.overtime || 0}
//                                                                 onChange={(e) =>
//                                                                     handleAttendanceChange(entry.id, "overtime", parseInt(e.target.value, 10))
//                                                                 }
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                     <div className="text-center mt-3">
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

// export default AddLabourAttendences;
























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
// import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

// function AddLabourAttendences({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [labour, setLabour] = useState([]);
//     const [selectedDate, setSelectedDate] = useState("");
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [existingAttendance, setExistingAttendance] = useState([]);
//     const [expandedLabour, setExpandedLabour] = useState(null);
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Initialize with current month
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with current year

//     const projectId = localStorage.getItem("projectId");

//     useEffect(() => {
//         if (projectId) {
//             fetchLabourByProject(projectId);
//         }
//     }, [projectId]);

//     useEffect(() => {
//         if (selectedDate && projectId) {
//             fetchExistingAttendance(projectId, selectedDate);
//         } else {
//             setExistingAttendance([]);
//             resetAttendanceData(); // Reset attendance data if no date is selected
//         }
//     }, [selectedDate, projectId]);

//     const fetchLabourByProject = async (projectId) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
//             setLabour(response.data);
//             resetAttendanceData(response.data); // Initialize attendance data
//         } catch (error) {
//             console.error("Error fetching labours:", error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchExistingAttendance = async (projectId, date) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
//                 params: { projectId, date },
//             });
//             setExistingAttendance(response.data);

//             // Update attendance data with existing attendance
//             setAttendanceData((prevData) =>
//                 labour.map((labour) => {
//                     const existingRecord = response.data.find((att) => att.labourId === labour.id);
//                     return existingRecord
//                         ? {
//                             labourId: labour.id,
//                             dayShift: existingRecord.day_shift === 1,
//                             nightShift: existingRecord.night_shift === 1,
//                             overtime: existingRecord.overtime_hours || 0,
//                         }
//                         : {
//                             labourId: labour.id,
//                             dayShift: false,
//                             nightShift: false,
//                             overtime: 0,
//                         };
//                 })
//             );
//         } catch (error) {
//             console.error("Error fetching attendance:", error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const resetAttendanceData = (labourList = labour) => {
//         setAttendanceData(
//             labourList.map((labour) => ({
//                 labourId: labour.id,
//                 dayShift: false,
//                 nightShift: false,
//                 overtime: 0,
//             }))
//         );
//     };

//     const handleAttendanceChange = (labourId, field, value) => {
//         setAttendanceData((prevData) =>
//             prevData.map((record) =>
//                 record.labourId === labourId
//                     ? { ...record, [field]: value }
//                     : record
//             )
//         );
//     };

//     const toggleDropdown = (labourId) => {
//         setExpandedLabour((prevId) => (prevId === labourId ? null : labourId));
//     };

//     const generateAttendanceText = (record) => {
//         const parts = [];
//         if (record.dayShift) parts.push("D");
//         if (record.nightShift) parts.push("N");
//         if (record.overtime > 0) parts.push(record.overtime);
//         return parts.length > 0 ? `(${parts.join(" | ")})` : "";
//     };

//     const getBackgroundColor = (record) => {
//         if (record.dayShift || record.nightShift || record.overtime > 0) {
//             return "green";
//         }
//         return "#00509D";
//     };

//     const handleSubmit = async () => {
//         if (!selectedDate || !projectId) {
//             toast.error("Please select a project and date.");
//             return;
//         }
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
//                 projectId,
//                 date: selectedDate,
//                 attendance: attendanceData,
//             });
//             toast.success(response.data.message || "Attendance submitted successfully!");
//             fetchExistingAttendance(projectId, selectedDate); // Refresh attendance
//         } catch (error) {
//             console.error("Error submitting attendance:", error);
//             toast.error("Failed to submit attendance.");
//         }
//     };

//     return (
//         <div className="d-flex w-100 h-100 bg-white">
//             <SidebarEmployee />
//             <div className="w-100">
//                 <SearchBarEmployee username={username} handleLogout={handleLogout} />
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     <div className="row">
//                         <div className="col-xl-12">
//                             <div
//                                 style={{ borderRadius: "20px", border: "1px solid #00509d" }}
//                                 className="overflow-hidden">
//                                 <div
//                                     style={{ backgroundColor: "#00509d" }}
//                                     className="row no-gutters align-items-center p-3"
//                                 >
//                                     <div className="col">
//                                         <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
//                                             <div className="nunito text-white">Payment Report</div>
//                                             <div className=" d-flex gap-3">
//                                                 <div className="d-flex align-items-center justify-content-center gap-2">
//                                                     <label className='nunito text-white p-0 m-0'>Filter:</label>
//                                                     <select
//                                                         className="button_details"
//                                                         value={selectedMonth}
//                                                         onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                                                     >
//                                                         <option value="">Select Month</option>
//                                                         {Array.from({ length: 12 }, (_, i) => (
//                                                             <option key={i} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
//                                                         ))}
//                                                     </select>
//                                                     <select
//                                                         className="button_details"
//                                                         value={selectedYear}
//                                                         onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                                                     >
//                                                         <option value="">Select Year</option>
//                                                         {Array.from({ length: 10 }, (_, i) => (
//                                                             <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div className="">
//                                                 <label className='nunito text-white '>Date: </label>
//                                                     <input
//                                                         type="date"
//                                                         style={{padding:"1px 4px"}}
//                                                         className="button_details m-0"
//                                                         value={selectedDate}
//                                                         onChange={(e) => setSelectedDate(e.target.value)}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <hr className="m-0 p-0" />
//                                 <div className="p-3">
//                                     {labour.map((entry) => {
//                                         const attendanceRecord = attendanceData.find(
//                                             (record) => record.labourId === entry.id
//                                         );
//                                         return (
//                                             <div
//                                                 key={entry.id}
//                                                 className="mb-3"
//                                                 style={{
//                                                     cursor: "pointer",
//                                                     border: "1px solid #00509d",
//                                                     borderRadius: "10px",
//                                                     padding: "10px",
//                                                     color: "white",
//                                                     background: getBackgroundColor(attendanceRecord),
//                                                 }}
//                                             >
//                                                 <div
//                                                     className="d-flex justify-content-between align-items-center"
//                                                     onClick={() => toggleDropdown(entry.id)}
//                                                 >
//                                                     <span>
//                                                         {entry.labourName}{" "}
//                                                         <span>{generateAttendanceText(attendanceRecord)}</span>
//                                                     </span>
//                                                     <span>{expandedLabour === entry.id ? "▲" : "▼"}</span>
//                                                 </div>
//                                                 {expandedLabour === entry.id && (
//                                                     <div
//                                                         className="p-3 d-flex gap-4"
//                                                         style={{
//                                                             marginTop: "4px",
//                                                             border: "1px solid white",
//                                                             borderRadius: "10px",
//                                                             color: "white",
//                                                             background: "rgb(42 102 160)",
//                                                         }}
//                                                     >
//                                                         <div className="flex">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 className="form-check-input"
//                                                                 checked={attendanceRecord?.dayShift || false}
//                                                                 onChange={(e) =>
//                                                                     handleAttendanceChange(entry.id, "dayShift", e.target.checked)
//                                                                 }
//                                                             />
//                                                             <label className="form-check-label">Day Shift</label>
//                                                         </div>
//                                                         <div className="flex">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 className="form-check-input"
//                                                                 checked={attendanceRecord?.nightShift || false}
//                                                                 onChange={(e) =>
//                                                                     handleAttendanceChange(entry.id, "nightShift", e.target.checked)
//                                                                 }
//                                                             />
//                                                             <label className="form-check-label">Night Shift</label>
//                                                         </div>
//                                                         <div className="flex">
//                                                             <label className="">Overtime (Hours):</label>
//                                                             <input
//                                                                 type="number"
//                                                                 className="button_details"
//                                                                 min="0"
//                                                                 value={attendanceRecord?.overtime || 0}
//                                                                 onChange={(e) =>
//                                                                     handleAttendanceChange(entry.id, "overtime", parseInt(e.target.value, 10))
//                                                                 }
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                     <div className="text-center mt-3">
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

// export default AddLabourAttendences;







import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import SidebarEmployee from "../../../components/sidebar/SidebarEmployee";
import SearchBarEmployee from "../../../components/sidebar/SearchBarEmployee";

function AddLabourAttendences({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [labour, setLabour] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [existingAttendance, setExistingAttendance] = useState([]);
    const [expandedLabour, setExpandedLabour] = useState(null);
    const [overtimeModal, setOvertimeModal] = useState({ isOpen: false, labourId: null, overtime: 0 });

    const projectId = localStorage.getItem("projectId");

    useEffect(() => {
        if (projectId) {
            fetchLabourByProject(projectId);
        }
    }, [projectId]);

    useEffect(() => {
        if (selectedDate && projectId) {
            fetchExistingAttendance(projectId, selectedDate);
        } else {
            setExistingAttendance([]);
            resetAttendanceData(); // Reset attendance data if no date is selected
        }
    }, [selectedDate, projectId]);

    const fetchLabourByProject = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
            setLabour(response.data);
            resetAttendanceData(response.data); // Initialize attendance data
        } catch (error) {
            console.error("Error fetching labours:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExistingAttendance = async (projectId, date) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/attendance`, {
                params: { projectId, date },
            });
            setExistingAttendance(response.data);

            // Update attendance data with existing attendance
            setAttendanceData((prevData) =>
                labour.map((labour) => {
                    const existingRecord = response.data.find((att) => att.labourId === labour.id);
                    return existingRecord
                        ? {
                            labourId: labour.id,
                            dayShift: existingRecord.day_shift === 1,
                            nightShift: existingRecord.night_shift === 1,
                            halfDayShift: existingRecord.halfday_shift === 1,
                            absentShift: existingRecord.absent_shift === 1,
                            overtime: existingRecord.overtime_hours || 0,
                        }
                        : {
                            labourId: labour.id,
                            dayShift: false,
                            nightShift: false,
                            halfDayShift: false,
                            absentShift: false,
                            overtime: 0,
                        };
                })
            );
        } catch (error) {
            console.error("Error fetching attendance:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetAttendanceData = (labourList = labour) => {
        setAttendanceData(
            labourList.map((labour) => ({
                labourId: labour.id,
                dayShift: false,
                nightShift: false,
                halfDayShift: false,
                absentShift: false,
                overtime: 0,
            }))
        );
    };

    const handleAttendanceChange = (labourId, field, value) => {
        setAttendanceData((prevData) =>
            prevData.map((record) => {
                if (record.labourId === labourId) {
                    if (field === "absentShift" && value) {
                        // If "Absent" is selected, reset all other fields
                        return {
                            ...record,
                            dayShift: false,
                            nightShift: false,
                            halfDayShift: false,
                            overtime: 0,
                            [field]: value,
                        };
                    } else if (field !== "absentShift") {
                        // If any other field is selected, deselect "Absent"
                        return {
                            ...record,
                            absentShift: false,
                            [field]: value,
                        };
                    }
                    return { ...record, [field]: value };
                }
                return record;
            })
        );
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
            fetchExistingAttendance(projectId, selectedDate); // Refresh attendance
        } catch (error) {
            console.error("Error submitting attendance:", error);
            toast.error("Failed to submit attendance.");
        }
    };


    // ovetime Modal 
    const openOvertimeModal = (labourId, currentOvertime) => {
        setOvertimeModal({ isOpen: true, labourId, overtime: currentOvertime });
    };

    const closeOvertimeModal = () => {
        setOvertimeModal({ isOpen: false, labourId: null, overtime: 0 });
    };

    const saveOvertime = () => {
        handleAttendanceChange(overtimeModal.labourId, "overtime", overtimeModal.overtime);
        closeOvertimeModal();
    };


    return (
        <div className="d-flex w-100 h-100 bg-white">
            <SidebarEmployee />
            <div className="w-100">
                <SearchBarEmployee username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    {/* Laptop use  */}
                    <div className="row laptop">
                        <div className="col-xl-12 p-0 mt-2">
                            <div
                                style={{ borderRadius: "20px", border: "1px solid #00509d" }}
                                className="overflow-hidden">
                                <div
                                    style={{ backgroundColor: "#00509d" }}
                                    className="row no-gutters align-items-center p-3"
                                >
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white">Add Labour Attendance</div>
                                            <div className=" d-flex gap-3">
                                                <div className="">
                                                    <label className='nunito text-white '>Date: </label>
                                                    <input
                                                        type="date"
                                                        style={{ padding: "1px 4px" }}
                                                        className="button_details m-0"
                                                        value={selectedDate}
                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="m-0 p-0" />
                                <div>
                                    <div className="card-body">
                                        <div className="forresponsive">
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : labour.length === 0 ? (
                                                <p className="nunito tablefont text-black text-center text-muted">
                                                    No Labour Found
                                                </p>
                                            ) : (
                                                labour.map((entry) => {
                                                    const attendanceRecord = attendanceData.find(
                                                        (record) => record.labourId === entry.id
                                                    );

                                                    return (
                                                        <div
                                                            key={entry.id}
                                                            style={{
                                                                border: "1px solid #00509d",
                                                                borderRadius: "10px",
                                                                backgroundColor: "#00509D",
                                                            }}
                                                            className="p-1 m-1 text-white"
                                                        >
                                                            <div className=" p-1 ">
                                                                <div className="w-100 d-flex align-items-center justify-content-between">
                                                                    <p className="tablefont nunito m-0 p-0">
                                                                        {entry.labourName} - ({entry.labourId})
                                                                    </p>
                                                                    <div className=" d-flex gap-2">
                                                                        {/* Day Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.dayShift
                                                                                    ? "btn-success"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "dayShift",
                                                                                        !attendanceRecord?.dayShift
                                                                                    )
                                                                                }

                                                                            >
                                                                                {attendanceRecord?.dayShift ? "Day Shift" : "Day Shift"}
                                                                            </button>
                                                                        </div>

                                                                        {/* Night Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.nightShift
                                                                                    ? "btn-success"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "nightShift",
                                                                                        !attendanceRecord?.nightShift
                                                                                    )
                                                                                }

                                                                            >
                                                                                {attendanceRecord?.nightShift
                                                                                    ? "Night Shift"
                                                                                    : "Night Shift"}
                                                                            </button>
                                                                        </div>

                                                                        {/* halfDay Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.halfDayShift
                                                                                    ? "btn-success"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "halfDayShift",
                                                                                        !attendanceRecord?.halfDayShift
                                                                                    )
                                                                                }

                                                                            >
                                                                                {attendanceRecord?.halfDayShift
                                                                                    ? "half Day Shift"
                                                                                    : "half Day Shift"}
                                                                            </button>
                                                                        </div>

                                                                        {/* absent Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.absentShift
                                                                                    ? "btn-danger"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "absentShift",
                                                                                        !attendanceRecord?.absentShift
                                                                                    )
                                                                                }
                                                                            >
                                                                                {attendanceRecord?.absentShift
                                                                                    ? "Absent"
                                                                                    : "Absent"}
                                                                            </button>
                                                                        </div>



                                                                        {/* Overtime Button */}
                                                                        <button
                                                                            className={`btn ${attendanceRecord?.overtime
                                                                                ? "btn-success"
                                                                                : "btn-outline-light"
                                                                                }`}
                                                                            onClick={() => openOvertimeModal(entry.id, attendanceRecord?.overtime || 0)}

                                                                        >
                                                                            OT
                                                                        </button>

                                                                        {/* Overtime Modal */}
                                                                        {overtimeModal.isOpen && (
                                                                            <div className="modal show d-block" tabIndex="-1" role="dialog">
                                                                                <div className="modal-dialog" role="document">
                                                                                    <div className="modal-content">
                                                                                        <div className="modal-header " >
                                                                                            <h5 className="modal-title text-black">Overtime (HRs)</h5>
                                                                                            <button type="button" className="btn-close" onClick={closeOvertimeModal}></button>
                                                                                        </div>
                                                                                        <div className="modal-body">
                                                                                            <input
                                                                                                type="number"
                                                                                                className="form-control"
                                                                                                value={overtimeModal.overtime}
                                                                                                onChange={(e) =>
                                                                                                    setOvertimeModal({ ...overtimeModal, overtime: parseInt(e.target.value, 10) })
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                        <div className="modal-footer">
                                                                                            <button className="btn btn-primary" onClick={saveOvertime}>
                                                                                                Save
                                                                                            </button>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })

                                            )}
                                        </div>
                                        <div className="text-center mt-3">
                                            <button style={{ backgroundColor: "#00509D" }} className="btn btn-primary" onClick={handleSubmit}>
                                                Submit Attendance
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Phone use  */}
                    <div className="row phone">
                        <div className="col-xl-12 p-0 mt-2">
                            <div
                                style={{ borderRadius: "20px", border: "1px solid #00509d" }}
                                className="overflow-hidden">
                                <div
                                    style={{ backgroundColor: "#00509d" }}
                                    className="row no-gutters align-items-center p-3"
                                >










                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase userledgertable" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white userfont">Add Labour Attendance</div>
                                            <div className="d-flex align-items-center justify-content-center gap-2 mobileline">
                                                <label className='nunito text-white p-0 m-0 userfont '>Date:</label>
                                                <input
                                                    type="date"
                                                    style={{ padding: "1px 4px" }}
                                                    className="button_details"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="m-0 p-0" />
                                <div>
                                    <div className="card-body">
                                        <div className="forresponsive">
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : labour.length === 0 ? (
                                                <p className="nunito tablefont text-black text-center text-muted">
                                                    No Amount Received
                                                </p>
                                            ) : (
                                                labour.map((entry) => {
                                                    const attendanceRecord = attendanceData.find(
                                                        (record) => record.labourId === entry.id
                                                    );

                                                    return (
                                                        <div
                                                            key={entry.id}
                                                            style={{
                                                                border: "1px solid #00509d",
                                                                borderRadius: "10px",
                                                                backgroundColor: "#00509D",
                                                            }}
                                                            className="p-1 m-1 text-white"
                                                        >
                                                            <div className=" p-1 ">
                                                                <div className="w-100 d-flex flex-column">
                                                                    <p className="tablefont nunito m-0 p-0">
                                                                        {entry.labourName} - ({entry.labourId})
                                                                    </p>
                                                                    <div className=" d-flex gap-2 mt-2">
                                                                        {/* Day Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.dayShift
                                                                                    ? "btn-success"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "dayShift",
                                                                                        !attendanceRecord?.dayShift
                                                                                    )
                                                                                }

                                                                            >
                                                                                {attendanceRecord?.dayShift ? "Day" : "Day"}
                                                                            </button>
                                                                        </div>

                                                                        {/* Night Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.nightShift
                                                                                    ? "btn-success"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "nightShift",
                                                                                        !attendanceRecord?.nightShift
                                                                                    )
                                                                                }

                                                                            >
                                                                                {attendanceRecord?.nightShift
                                                                                    ? "Night"
                                                                                    : "Night"}
                                                                            </button>
                                                                        </div>

                                                                        {/* halfDay Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.halfDayShift
                                                                                    ? "btn-success"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "halfDayShift",
                                                                                        !attendanceRecord?.halfDayShift
                                                                                    )
                                                                                }

                                                                            >
                                                                                {attendanceRecord?.halfDayShift
                                                                                    ? "half"
                                                                                    : "half"}
                                                                            </button>
                                                                        </div>

                                                                        {/* absent Shift Button */}
                                                                        <div>
                                                                            <button
                                                                                className={`btn ${attendanceRecord?.absentShift
                                                                                    ? "btn-danger"
                                                                                    : "btn-outline-light"
                                                                                    } w-100`}
                                                                                onClick={() =>
                                                                                    handleAttendanceChange(
                                                                                        entry.id,
                                                                                        "absentShift",
                                                                                        !attendanceRecord?.absentShift
                                                                                    )
                                                                                }
                                                                            >
                                                                                {attendanceRecord?.absentShift
                                                                                    ? "Absent"
                                                                                    : "Absent"}
                                                                            </button>
                                                                        </div>



                                                                        {/* Overtime Button */}
                                                                        <button
                                                                            className={`btn ${attendanceRecord?.overtime
                                                                                ? "btn-success"
                                                                                : "btn-outline-light"
                                                                                }`}
                                                                            onClick={() => openOvertimeModal(entry.id, attendanceRecord?.overtime || 0)}

                                                                        >
                                                                            OT
                                                                        </button>

                                                                        {/* Overtime Modal */}
                                                                        {overtimeModal.isOpen && (
                                                                            <div className="modal show d-block" tabIndex="-1" role="dialog">
                                                                                <div className="modal-dialog" role="document">
                                                                                    <div className="modal-content">
                                                                                        <div className="modal-header " >
                                                                                            <h5 className="modal-title text-black">Overtime (HRs)</h5>
                                                                                            <button type="button" className="btn-close" onClick={closeOvertimeModal}></button>
                                                                                        </div>
                                                                                        <div className="modal-body">
                                                                                            <input
                                                                                                type="number"
                                                                                                className="form-control"
                                                                                                value={overtimeModal.overtime}
                                                                                                onChange={(e) =>
                                                                                                    setOvertimeModal({ ...overtimeModal, overtime: parseInt(e.target.value, 10) })
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                        <div className="modal-footer">
                                                                                            <button className="btn btn-primary" onClick={saveOvertime}>
                                                                                                Save
                                                                                            </button>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })

                                            )}
                                        </div>
                                        <div className="text-center mt-3">
                                            <button style={{ backgroundColor: "#00509D" }} className="btn btn-primary" onClick={handleSubmit}>
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
        </div>
    );
}

export default AddLabourAttendences;
