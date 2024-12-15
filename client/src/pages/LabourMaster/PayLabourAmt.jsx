// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PayLabourAmt = ({ onClose, onUpdate }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [formData, setFormData] = useState({
//         projectId: '',
//         labourId: '',
//         month: '',
//         totalAmount: 0,
//         username: localStorage.getItem('username'),
//     });
//     const [projects, setProjects] = useState([]);
//     const [labours, setLabours] = useState([]);
//     const [attendanceRecords, setAttendanceRecords] = useState([]);
//     const [totalAmount, setTotalAmount] = useState(0);

//     // Fetch projects on component mount
//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
//                 setProjects(response.data);
//             } catch (error) {
//                 console.error('Error fetching projects:', error);
//             }
//         };
//         fetchProjects();
//     }, []);

//     const handleProjectChange = async (e) => {
//         const selectedProjectId = e.target.value;
//         setFormData({ ...formData, projectId: selectedProjectId, labourId: '', totalAmount: 0, paymentAmount: '' });

//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${selectedProjectId}`);
//             setLabours(response.data);
//         } catch (error) {
//             console.error('Error fetching labours:', error);
//         }
//     };

//     const handleLabourChange = (e) => {
//         const selectedLabourId = e.target.value;
//         const selectedLabour = labours.find((labour) => labour.id === parseInt(selectedLabourId));
    
//         setFormData((prev) => ({
//             ...prev,
//             labourId: selectedLabourId,
//             labourName: selectedLabour ? selectedLabour.labourName : '',
//             totalAmount: 0,
//             paymentAmount: ''
//         }));
    
//         setAttendanceRecords([]);
//         setTotalAmount(0);
//     };
    

//     const handleMonthChange = async (e) => {
//         const selectedMonth = e.target.value;
//         console.log("Selected month:", selectedMonth);
    
//         setFormData((prev) => ({
//             ...prev,
//             month: selectedMonth,
//             totalAmount: 0,
//             paymentAmount: '',
//         }));
    
//         if (formData.labourId && selectedMonth) {
//             try {
//                 console.log("Fetching data for Labour ID:", formData.labourId, "Month:", selectedMonth);
    
//                 // Fetch attendance data
//                 const attendanceResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/totalattendance`, {
//                     params: { labourId: formData.labourId, month: selectedMonth },
//                 });
//                 console.log("Attendance data fetched:", attendanceResponse.data);
    
//                 // Check for existing payment records
//                 const paymentResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpayment`, {
//                     params: { labourId: formData.labourId, month: selectedMonth },
//                 });
//                 console.log("Payment data fetched:", paymentResponse.data);
    
//                 if (paymentResponse.data.length > 0) {
//                     alert('Payment record for this labour and month already exists.');
//                     setFormData((prev) => ({ ...prev, paymentdate: '' }));
//                     return;
//                 }
    
//                 // Process attendance data
//                 setAttendanceRecords(attendanceResponse.data);
    
//                 // Fetch labour details
//                 const labourResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/${formData.projectId}`);
//                 console.log("Labour details fetched:", labourResponse.data);
    
//                 const labourDetails = labourResponse.data.find(
//                     (labour) => labour.id === parseInt(formData.labourId)
//                 );
//                 console.log("Labour details for ID:", formData.labourId, labourDetails);
    
//                 if (labourDetails) {
//                     const { dayShift, nightShift, overtimeHrs } = labourDetails;
    
//                     const total = attendanceResponse.data.reduce((sum, record) => {
//                         let dailyTotal = 0;
//                         if (record.day_shift) dailyTotal += dayShift;
//                         if (record.night_shift) dailyTotal += nightShift;
//                         if (record.overtime_hours) dailyTotal += record.overtime_hours * overtimeHrs;
//                         return sum + dailyTotal;
//                     }, 0);
    
//                     console.log("Calculated total amount:", total);
    
//                     setTotalAmount(total || 0);
//                     setFormData((prev) => ({ ...prev, totalAmount: total || 0 }));
//                 }
//             } catch (error) {
//                 console.error('Error fetching attendance or labour details:', error);
//                 if (error.response) {
//                     console.log("Error response data:", error.response.data);
//                     console.log("Error response status:", error.response.status);
//                 }
//                 if (error.response && error.response.status === 404) {
//                     console.error('No records found for this labour and month.');
//                 }
//             }
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.projectId) newErrors.projectId = 'Project is required';
//         if (!formData.labourId) newErrors.labourId = 'Labour is required';
//         if (!formData.month) newErrors.month = 'Month is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//         setIsLoading(true);
//         try {
//             await axios.post(`${process.env.REACT_APP_LOCAL_URL}/payLabour`, formData);
//             onUpdate();
//             onClose();
//         } catch (error) {
//             console.error('Error submitting payment:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div id="makeentrymodal" className="modal fade show" role="dialog" style={{ display: "block" }}>
//             <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
//                         <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
//                             <h5 className="modal-title">Pay Labour Payment</h5>
//                             <button type="button" className="button_details" onClick={onClose}>
//                                 <i className="fa-solid fa-xmark"></i>
//                             </button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="row">
//                                 {/* Project Dropdown */}
//                                 <div className="form-group col-md-6">
//                                     <label>Project<span className="text-danger">*</span></label>
//                                     <select
//                                         name="projectId"
//                                         className={`form-control ${errors.projectId ? 'is-invalid' : ''}`}
//                                         value={formData.projectId}
//                                         onChange={handleProjectChange}
//                                     >
//                                         <option value="" disabled>Select Project</option>
//                                         {projects.map((project) => (
//                                             <option key={project.id} value={project.id}>{project.projectName}</option>
//                                         ))}
//                                     </select>
//                                     {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
//                                 </div>

//                                 {/* Labour Dropdown */}
//                                 <div className="form-group col-md-6">
//                                     <label>Labour<span className="text-danger">*</span></label>
//                                     <select
//                                         name="labourId"
//                                         className={`form-control ${errors.labourId ? 'is-invalid' : ''}`}
//                                         value={formData.labourId}
//                                         onChange={handleLabourChange}
//                                     >
//                                         <option value="" disabled>Select Labour</option>
//                                         {labours.map((labour) => (
//                                             <option key={labour.id} value={labour.id}>{labour.labourName}</option>
//                                         ))}
//                                     </select>
//                                     {errors.labourId && <div className="invalid-feedback">{errors.labourId}</div>}
//                                 </div>
//                             </div>

//                             <div className="row">
//                                 {/* Month Input */}
//                                 <div className="form-group col-md-6">
//                                     <label>Month<span className="text-danger">*</span></label>
//                                     <input
//                                         type="month"
//                                         name="month"
//                                         className={`form-control ${errors.month ? 'is-invalid' : ''}`}
//                                         value={formData.month}
//                                         onChange={handleMonthChange}
//                                     />
//                                     {errors.month && <div className="invalid-feedback">{errors.month}</div>}
//                                 </div>

//                                 {/* Total Amount */}
//                                 <div className="form-group col-md-6">
//                                     <label>Total Amount</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         value={totalAmount || 0}
//                                         readOnly
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
//                             <button type="submit" className="button_details" disabled={isLoading}>
//                                 {isLoading ? 'Loading...' : 'Submit'}
//                             </button>
//                             <button type="button" className="button_details" onClick={onClose}>Close</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PayLabourAmt;























