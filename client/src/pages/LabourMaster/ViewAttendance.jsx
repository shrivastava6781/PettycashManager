// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import Sidebar from '../../components/sidebar/Sidebar';
// import SearchBar from '../../components/sidebar/SearchBar';
// import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner

// function ViewAttendance({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [labour, setLabour] = useState([]);
//     const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showSearchBar, setShowSearchBar] = useState(true);
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [filteredAttendance, setFilteredAttendance] = useState([]);
//     const [daysInMonth, setDaysInMonth] = useState(31); // Default to 31, will be updated based on month
//     const [combinedData, setCombinedData] = useState([]);

//     useEffect(() => {
//         const fetchProjects = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
//                 setProjects(response.data);
//             } catch (error) {
//                 console.error("Error fetching projects:", error.message);
//                 toast.error("Failed to load projects.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProjects();
//     }, []);


//     const fetchLabourByProject = async (projectId) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`);
//             setLabour(response.data);
//             resetAttendanceData(response.data);
//         } catch (error) {
//             console.error("Error fetching labour:", error.message);
//             toast.error("Failed to load labour data.");
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
//             const existing = response.data;
//             setExistingAttendance(existing);

//             // Update attendance data with existing records
//             setAttendanceData(
//                 labour.map((lab) => {
//                     const record = existing.find((att) => att.labourId === lab.id);
//                     return record
//                         ? {
//                             labourId: lab.id,
//                             dayShift: record.day_shift === 1,
//                             nightShift: record.night_shift === 1,
//                             overtime: record.overtime_hours || 0,
//                         }
//                         : {
//                             labourId: lab.id,
//                             dayShift: false,
//                             nightShift: false,
//                             overtime: 0,
//                         };
//                 })
//             );
//         } catch (error) {
//             console.error("Error fetching attendance:", error.message);
//             toast.error("Failed to fetch attendance records.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
//         setDaysInMonth(getDaysInMonth(selectedMonth, selectedYear));
//     }, [selectedMonth, selectedYear]);

//     const resetAttendanceData = (labourList = labour) => {
//         setAttendanceData(
//             labourList.map((lab) => ({
//                 labourId: lab.id,
//                 dayShift: false,
//                 nightShift: false,
//                 overtime: 0,
//             }))
//         );
//     };

//     const getAttendanceForDay = (employeeId, day) => {
//         const record = filteredAttendance.find(record => {
//             const recordDate = new Date(record.date);
//             return record.employee_id === employeeId && recordDate.getDate() === day;
//         });
//         return record ? statusMap[record.status.toLowerCase()] || '' : '';
//     };

//     return (
//         <div className='d-flex w-100 h-100 bg-white'>
//             {showSidebar && <Sidebar />}
//             <div className='w-100'>
//                 {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
//                 <div className="container-fluid">
//                     <ToastContainer />
//                     <div className="row">
//                         <div className="col-xl-12">
//                             <div className="card shadow mb-4">
//                                 <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
//                                     <h6 className="m-0 font-weight-bold text-primary">Department Attendance</h6>
//                                     <div className='d-flex align-items-center justify-content-center gap-1'>
//                                         <label className="nunito text-white p-0 m-0">Project:</label>
//                                         <select
//                                             className="button_details overflow-hidden"
//                                             value={selectedProject}
//                                             onChange={(e) => handleProjectChange(e.target.value)}
//                                         >
//                                             <option value="">Select Project</option>
//                                             {projects.map((proj) => (
//                                                 <option key={proj.id} value={proj.id}>
//                                                     {proj.projectName}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className='d-flex align-items-center justify-content-center gap-1'>
//                                         <label className='pt-2 text-black fw-bolder'>Filter:</label>
//                                         <select
//                                             id="monthSelect"
//                                             value={selectedMonth}
//                                             onChange={e => setSelectedMonth(Number(e.target.value))}
//                                             className="form-select"
//                                         >
//                                             {[...Array(12).keys()].map(month => (
//                                                 <option key={month} value={month}>
//                                                     {new Date(0, month).toLocaleString('default', { month: 'long' })}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <select
//                                             id="yearSelect"
//                                             value={selectedYear}
//                                             onChange={e => setSelectedYear(Number(e.target.value))}
//                                             className="form-select"
//                                         >
//                                             {[...Array(5).keys()].map(offset => (
//                                                 <option key={offset} value={new Date().getFullYear() - offset}>
//                                                     {new Date().getFullYear() - offset}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="card-body form-row ">
//                                     <div className='col-md-12'>
//                                         <div style={{ maxHeight: "450px", overflowY: "auto" }}>

//                                             <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                                                 <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                                     <tr>
//                                                         <th style={{ fontSize: "10px" }}>Name</th>
//                                                         {[...Array(daysInMonth).keys()].map(day => (
//                                                             <th style={{ fontSize: "10px" }} key={day}>{day + 1}</th>
//                                                         ))}
//                                                         <th style={{ fontSize: "10px" }}>Present</th>
//                                                         <th style={{ fontSize: "10px" }}>Absent</th>
//                                                         <th style={{ fontSize: "10px" }}>Paid Leave</th>
//                                                         <th style={{ fontSize: "10px" }}>Half Day</th>
//                                                         <th style={{ fontSize: "10px" }}>Unpaid Leave</th>
//                                                         <th style={{ fontSize: "10px" }}>Overtime</th>
//                                                         <th style={{ fontSize: "10px" }}>Weekly Off</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {isLoading ? (<div className="d-flex justify-content-center align-items-center">
//                                                         {/* Correct usage of spinner */}
//                                                         <ThreeDots
//                                                             color="#00BFFF"
//                                                             height={80}
//                                                             width={80}
//                                                         />
//                                                     </div>
//                                                     ) : (employees.length === 0 ? (
//                                                         <tr>
//                                                             <td colSpan="12" className="text-center">Thier is No Attendance.</td>
//                                                         </tr>
//                                                     ) : (labours.map(labour => (
//                                                         <tr key={labour.id}>
//                                                             <td style={{ fontSize: "10px" }}>{labour.labourName}</td>
//                                                             {[...Array(daysInMonth).keys()].map(day => {
//                                                                 const attendance = getAttendanceForDay(labour.id, day + 1);

//                                                                 // Define styles based on attendance status
//                                                                 const styles = {
//                                                                     'D': { backgroundColor: 'yellow', color: 'black' },
//                                                                     'N': { backgroundColor: 'lightgreen', color: 'black' },
//                                                                     'OT': { backgroundColor: 'red', color: 'white' },
//                                                                 };

//                                                                 // Merge specific styles with default styles
//                                                                 const cellStyle = {
//                                                                     fontSize: "10px",
//                                                                     ...styles[attendance] // Apply styles based on attendance, default is an empty object if not found
//                                                                 };

//                                                                 return (
//                                                                     <td className='text-center' key={day} style={cellStyle}>
//                                                                         {attendance}
//                                                                     </td>
//                                                                 );
//                                                             })}
//                                                             <td className='text-center' style={{ fontSize: "10px" }}>{combinedData.find(data => data.id === labour.id)?.dayshift || 0}</td>
//                                                             <td className='text-center' style={{ fontSize: "10px" }}>{combinedData.find(data => data.id === labour.id)?.nightshift || 0}</td>
//                                                             <td className='text-center' style={{ fontSize: "10px" }}>{combinedData.find(data => data.id === labour.id)?.overtimehours || 0}</td>
//                                                         </tr>
//                                                     ))))}
//                                                 </tbody>
//                                             </table>
//                                         </div>

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

// export default ViewAttendance;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";

function ViewAttendance({ handleLogout, username }) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [labour, setLabour] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(31);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL_URL}/projects`
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        toast.error("Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const fetchLabourByProject = async (projectId) => {
    setIsLoading(true);
    try {
      const labourResponse = await axios.get(
        `${process.env.REACT_APP_LOCAL_URL}/labours/${projectId}`
      );
      const attendanceResponse = await axios.get(
        `${process.env.REACT_APP_LOCAL_URL}/viewattendance/${projectId}?month=${
          selectedMonth + 1
        }&year=${selectedYear}`
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
    <div className="d-flex w-100 h-100 bg-white">
      <Sidebar />
      <div className="w-100">
        <SearchBar username={username} handleLogout={handleLogout} />
        <ToastContainer />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="card shadow mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Department Attendance
                  </h6>
                  <div className="d-flex align-items-center gap-2">
                    <label>Project:</label>
                    <select
                      className="form-select"
                      value={selectedProject}
                      onChange={(e) => handleProjectChange(e.target.value)}
                    >
                      <option value="">Select Project</option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <label>Month:</label>
                    <select
                      className="form-select"
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
                    <label>Year:</label>
                    <select
                      className="form-select"
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
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          {[...Array(daysInMonth).keys()].map((day) => (
                            <th key={day + 1}>{day + 1}</th>
                          ))}
                          <th>Total Day Shift</th>
                          <th>Total Night Shift</th>
                          <th>Total Over Night</th>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAttendance;
