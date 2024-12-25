// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { ThreeDots } from "react-loader-spinner"; // Correct import for spinner

// const LabourAttendanceperMonth = ({ onClose, record, onUpdate }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     month: record.selectedMonth || "",
//     year: record.selectedYear || "",
//     projectId: record.selectedProject || "",
//     totalAmount: record.totalAmount || 0,
//     dueAmount: record.dueAmount || 0,
//     id: record.labourer.id || 0,
//     labourName: record.labourer.labourName || "",
//     amountPaid: "",
//     amountDate: "",
//     paymentModeId: "",
//     paymentDescription: "",
//     dayShiftRate: record.labourer.dayShift || 0, // Example: Rs 5000 for Day Shift
//     nightShiftRate: record.labourer.nightShift || 0, // Example: Rs 6000 for Night Shift
//     overtimeRate: record.labourer.overtimeHrs || 0, // Example: Rs 100 per overtime hour
//   });

//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [attendanceSummary, setAttendanceSummary] = useState({
//     dayShift: 0,
//     nightShift: 0,
//     overtime: 0,
//   });
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [totalAttendance, setTotalAttendance] = useState(0);

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   useEffect(() => {
//     fetchAttendance();
//   }, [formData.month, formData.year]);

//   const fetchAttendance = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_LOCAL_URL}/labourattendance`,
//         {
//           params: {
//             labourId: formData.id,
//             year: formData.year,
//             month: formData.month,
//           },
//         }
//       );

//       setAttendanceRecords(response.data.data);
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//       toast.error("Failed to fetch attendance records");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const calculateAttendanceAmount = (record) => {
//     let attendance = "";
//     let amount = 0;

//     // Day Shift Calculation
//     if (record.dayShift > 0) {
//       attendance += `D - ${record.dayShift}`;
//       amount += record.dayShift * formData.dayShiftRate;
//     }

//     // Night Shift Calculation
//     if (record.nightShift > 0) {
//       if (attendance) attendance += ", ";
//       attendance += `N - ${record.nightShift}`;
//       amount += record.nightShift * formData.nightShiftRate;
//     }

//     // Overtime Calculation
//     if (record.overtimeHours > 0) {
//       if (attendance) attendance += ", ";
//       attendance += `OT - ${record.overtimeHours} Hrs`;
//       amount += record.overtimeHours * formData.overtimeRate;
//     }

//     return { attendance, amount, dayShift: record.dayShift, nightShift: record.nightShift, overtime: record.overtimeHours };
//   };

//   const calculateTotalAmount = () => {
//     return attendanceRecords.reduce((total, record) => {
//       const { amount } = calculateAttendanceAmount(record);
//       return total + amount;
//     }, 0);
//   };

//   const calculateTotalAttendance = () => {
//     return attendanceRecords.reduce((total, record) => {
//       const totalAttendanceForRecord =
//         record.dayShift + record.nightShift + record.overtimeHours;
//       return total + totalAttendanceForRecord;
//     }, 0);
//   };

//   useEffect(() => {
//     let dayShiftTotal = 0;
//     let nightShiftTotal = 0;
//     let overtimeTotal = 0;

//     attendanceRecords.forEach((record) => {
//       const { dayShift, nightShift, overtime } = calculateAttendanceAmount(record);
//       dayShiftTotal += dayShift;
//       nightShiftTotal += nightShift;
//       overtimeTotal += overtime;
//     });

//     setAttendanceSummary({
//       dayShift: dayShiftTotal,
//       nightShift: nightShiftTotal,
//       overtime: overtimeTotal,
//     });

//     setTotalAmount(calculateTotalAmount());
//     setTotalAttendance(calculateTotalAttendance());
//   }, [attendanceRecords]);

//   return (
//     <div>
//       <ToastContainer />
//       <div className="card-body">
//         <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
//           {isLoading ? (
//             <div className="d-flex justify-content-center align-items-center">
//               <ThreeDots color="#00BFFF" height={80} width={80} />
//             </div>
//           ) : (
//             <table className="table table-bordered" style={{ width: "100%" }}>
//               <thead
//                 style={{
//                   position: "sticky",
//                   top: "0",
//                   zIndex: "1",
//                   backgroundColor: "#fff",
//                 }}
//               >
//                 <tr>
//                   <th className="text-center">Date</th>
//                   <th className="text-center">Attendance</th>
//                   <th className="text-center">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendanceRecords.map((record) => {
//                   const { attendance, amount } = calculateAttendanceAmount(record);
//                   return (
//                     <tr key={record.id}>
//                       <td className="text-center">
//                         {new Date(record.date).toLocaleDateString()}
//                       </td>
//                       <td className="text-center">{attendance}</td>
//                       <td className="text-center">Rs {amount.toFixed(2)}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//           <div className="d-flex justify-content-end">
//             <strong>
//               Total Attendance: D-{attendanceSummary.dayShift} N-
//               {attendanceSummary.nightShift} OT-{attendanceSummary.overtime}
//             </strong>
//             <strong className="ml-3">Total: Rs {totalAmount.toFixed(2)}</strong>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LabourAttendanceperMonth;




































import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner"; // Correct import for spinner

const LabourAttendanceperMonth = ({ onClose, record, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: record.selectedMonth || "",
    year: record.selectedYear || "",
    projectId: record.selectedProject || "",
    totalAmount: record.totalAmount || 0,
    dueAmount: record.dueAmount || 0,
    id: record.labourer.id || 0,
    labourName: record.labourer.labourName || "",
    amountPaid: "",
    amountDate: "",
    paymentModeId: "",
    paymentDescription: "",
    dayShiftRate: record.labourer.dayShift || 0, // Example: Rs 5000 for Day Shift
    nightShiftRate: record.labourer.nightShift || 0, // Example: Rs 6000 for Night Shift
    halfDayShiftRate: record.labourer.halfDayShift || 0, // Example: Rs 6000 for Night Shift
    absentShiftRate: 0, // Example: Rs 6000 for Night Shift
    overtimeRate: record.labourer.overtimeHrs || 0, // Example: Rs 100 per overtime hour
  });

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    dayShift: 0,
    nightShift: 0,
    halfDayShift: 0,
    absentShift: 0,
    overtime: 0
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchAttendance();
  }, [formData.month, formData.year]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_URL}/labourattendance`,
        {
          params: {
            labourId: formData.id,
            year: formData.year,
            month: formData.month,
          },
        }
      );

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
      amount += record.dayShift * formData.dayShiftRate;
    }

    // Night Shift Calculation
    if (record.nightShift > 0) {
      if (attendance) attendance += ", ";
      attendance += `N - ${record.nightShift}`;
      amount += record.nightShift * formData.nightShiftRate;
    }

    // halfday Shift Calculation
    if (record.halfDayShift > 0) {
      if (attendance) attendance += ", ";
      attendance += `HD - ${record.halfDayShift}`;
      amount += record.halfDayShift * formData.halfDayShiftRate;
    }

    // absent Shift Calculation
    if (record.absentShift > 0) {
      if (attendance) attendance += ", ";
      attendance += `A - ${record.absentShift}`;
      amount += record.absentShift * formData.absentShiftRate;
    }


    // Overtime Calculation
    if (record.overtimeHours > 0) {
      if (attendance) attendance += ", ";
      attendance += `OT - ${record.overtimeHours} Hrs`;
      amount += record.overtimeHours * formData.overtimeRate;
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

  const handleClose = () => {
    onClose();
  };


  return (
    <div id="addModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
      <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
        <div className="modal-content">

          <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
            <h5 className="modal-title">Check Attendance</h5>
            <button type="button" className="button_details " onClick={handleClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="card-body">
            <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <ThreeDots color="#00BFFF" height={80} width={80} />
                </div>
              ) : (
                <table className="table table-bordered" style={{ width: "100%" }}>
                  <thead
                    style={{
                      position: "sticky",
                      top: "0",
                      zIndex: "1",
                      backgroundColor: "#fff",
                    }}
                  >
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
                          <td className="text-center">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="text-center">{attendance}</td>
                          <td className="text-center">Rs {amount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="text-center">Total</th>
                      <th className="text-center">D-{attendanceSummary.dayShift} N-{attendanceSummary.nightShift} H-{attendanceSummary.halfDayShift} A-{attendanceSummary.absentShift} OT-{attendanceSummary.overtime}</th>
                      <th className='text-end'>&#x20B9;{totalAmount != null ? totalAmount.toFixed(2) : '0.00'}</th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
          <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
            <button type="button" className="button_details" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourAttendanceperMonth;

