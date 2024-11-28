// import axios from 'axios';
// import React from 'react';
// import { useEffect, useState } from 'react';
// import "./EmployeePrint.css"
// import logo from '../../images/CashBackground.jpg';
// import myImage from '../../images/employee_profile.png';
// import { Hidden } from '@mui/material';

// function EmployeePrint({ record, onClose }) {
//     console.log("record", record);
//     const [setting, setSetting] = useState({});

//     useEffect(() => {
//         const fetchSetting = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);

//                 setSetting(response.data);
//             } catch (error) {
//                 console.error('Error fetching Dashboard Logo', error);
//             }
//         };
//         fetchSetting();
//     }, []);

//     const handlePrint = () => {
//         window.print();
//     };
//     // Helper function to format the date
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
//     };

//     return (
//         <div className="container-fluid p-1" >
//             <div className="row py-3 px-0 rounded shadow-sm  bg-white">
//                 {/* <div className="d-flex bg-danger gap-1 m-1 "> */}
//                 <div style={{ height: "150px" }} className="gap-1 mt-3">
//                     <div style={{ width: "100%", height: "100%", border: "1px dotted #D3D4D6", borderRadius: "20px", }} className='d-flex align-items-center justify-content-between'>
//                         <div style={{ width: "80%", height: "100%" }} className=' d-flex align-items-center'>
//                             <div className='employee-picture p-1'>
//                                 <div className='logoo'>
//                                     <img
//                                         src={record.passportSizePhoto
//                                             ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${record.passportSizePhoto}`
//                                             : myImage}
//                                         alt="Employee"
//                                         className='img-logo '
//                                     />
//                                 </div>
//                             </div>
//                             <div style={{ width: "80%", height: "100%" }} className='p-1'>
//                                 <h2 className="title-detai text-black fw-bolder font-bold m-0">
//                                     {record.employeeName}
//                                 </h2>
//                                 <hr />
//                                 <p style={{ color: "#5A5C69" }} className="m-0">
//                                     <i style={{ color: "#5A5C69" }} className="fa fa-code"></i> <span style={{ color: "#5A5C69" }}> Employee code: {record.departmentName || "N/A"}</span>
//                                 </p>

//                                 <p style={{ color: "#5A5C69" }} className="m-0">
//                                     <i style={{ color: "#5A5C69" }} class="fa fa-envelope" aria-hidden="true"></i> <span style={{ color: "#5A5C69" }}> {record.employeeEmail || "N/A"}</span>
//                                 </p>
//                                 <p style={{ color: "#5A5C69" }} className="m-0">
//                                     <i style={{ rotate: "90deg", color: "#5A5C69" }} class="fa fa-phone" aria-hidden="true"></i><span style={{ color: "#5A5C69" }}> {record.employeePhone || "N/A"}</span>
//                                 </p>
//                             </div>
//                         </div>
//                         <div style={{ width: "20%", height: "100%" }} className='d-flex align-items-center justify-content-center flex-column'>
//                             <div style={{    width: "100%",height: "70%"}} className='logoo'>
//                                 <img
//                                     src={setting.landingPageLogo
//                                         ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${setting.landingPageLogo}`
//                                         : logo}
//                                     alt="Logo"
//                                     className='img-logo'
//                                 />

//                             </div>
//                             <h5 className='fw-bolder text-black text-uppercase m-0'>Salary - <span style={{ fontSize: "25px", color: "red", width: "100%", height: "80%" }}>फल</span></h5>
//                         </div>
//                     </div>
//                 </div>

//                 <div className='gap-1 mt-3  '>
//                     <div className=''>
//                         <div style={{ border: "1px dotted #D3D4D6", borderRadius: "20px" }} className=' bg-success w-100 p-4 shadow-sm bg-light'>
//                             <h1 className='fw-bolder'>Basic Info</h1>
//                             <hr />
//                             <div className='d-flex align-items-center justify-content-between'>
//                                 <div className='w-50 '>
//                                     <h5>Name : <span style={{ fontSize: "18px" }}>{record.employeeName || "N/A"}</span></h5>
//                                     <h5>Phone No. : <span style={{ fontSize: "18px" }}>{record.employeePhone || "N/A"}</span></h5>
//                                     <h5>Email : <span style={{ fontSize: "18px" }}>{record.employeeEmail || "N/A"}</span></h5>
//                                     <h5>Gender : <span style={{ fontSize: "18px" }}>{record.employeeGender || "N/A"}</span></h5>
//                                     <h5>PAN No. : <span style={{ fontSize: "18px" }}>{record.employeePan || "N/A"}</span></h5>
//                                 </div>
//                                 <div className='w-50 '>
//                                     <h5>Employee code : <span style={{ fontSize: "18px" }}>{record.employeeCode || "N/A"}</span></h5>
//                                     <h5>Alternative Phone : <span style={{ fontSize: "18px" }}>{record.employeeAltPhone || "N/A"}</span></h5>
//                                     <h5>DOB : <span style={{ fontSize: "18px" }}>{formatDate(record.employeeDOB) || "N/A"}</span></h5>
//                                     <h5>Blood Group : <span style={{ fontSize: "18px" }}>{record.employeeBloodGroup || "N/A"}</span></h5>
//                                     <h5>Adhar Card No. : <span style={{ fontSize: "18px" }}>{record.employeeAadhar || "N/A"}</span></h5>
//                                 </div>
//                             </div>
//                             <h4 className='fw-bolder'>Current Address :</h4>
//                             <div className='d-flex  justify-content-between'>
//                                 <div className='w-50 '>
//                                     <h5>Address : <span style={{ fontSize: "18px" }}>{record.employeeAddress1 || "N/A"}</span></h5>
//                                     {/* <h5>State : <span style={{ fontSize: "18px" }}>{record.employeeState1 || "N/A"}</span></h5> */}
//                                 </div>
//                                 <div className='w-50 '>
//                                     <h5>City : <span style={{ fontSize: "18px", textAlign: "start" }}>{record.employeeCity1 || "N/A"}</span></h5>
//                                     {/* <h5>Pincode : <span style={{ fontSize: "18px" }}>{record.employeePincode1 || "N/A"}</span></h5> */}
//                                 </div>
//                             </div>
//                             <div className='d-flex align-items-center justify-content-between'>
//                                 <div className='w-50 '>
//                                     {/* <h5>Address : <span style={{ fontSize: "18px" }}>{record.employeeAddress1 || "N/A"}</span></h5> */}
//                                     <h5>State : <span style={{ fontSize: "18px" }}>{record.employeeState1 || "N/A"}</span></h5>
//                                 </div>
//                                 <div className='w-50 '>
//                                     {/* <h5>city : <span style={{ fontSize: "18px" }}>{record.employeeCity1 || "N/A"}</span></h5> */}
//                                     <h5>Pincode : <span style={{ fontSize: "18px" }}>{record.employeePincode1 || "N/A"}</span></h5>
//                                 </div>
//                             </div>
//                             <h4 className='fw-bolder'>Permanent Address : </h4>
//                             <div className='d-flex  justify-content-between'>
//                                 <div className='w-50 '>
//                                     <h5>Address : <span style={{ fontSize: "18px" }}>{record.employeeAddress2 || "N/A"}</span></h5>
//                                     {/* <h5>State : <span style={{ fontSize: "18px" }}>{record.employeeState2 || "N/A"}</span></h5> */}
//                                 </div>
//                                 <div className='w-50 '>
//                                     <h5>City : <span style={{ fontSize: "18px" }}>{record.employeeCity2 || "N/A"}</span></h5>
//                                     {/* <h5>Pincode : <span style={{ fontSize: "18px" }}>{record.employeePincode1 || "N/A"}</span></h5> */}
//                                 </div>
//                             </div>
//                             <div className='d-flex align-items-center justify-content-between'>
//                                 <div className='w-50 '>
//                                     {/*<h5>Address : <span style={{ fontSize: "18px" }}>{record.employeeAddress2 || "N/A"}</span></h5> */}
//                                     <h5>State : <span style={{ fontSize: "18px" }}>{record.employeeState2 || "N/A"}</span></h5>
//                                 </div>
//                                 <div className='w-50 '>
//                                     {/* <h5>city : <span style={{ fontSize: "18px" }}>{record.employeeCity1 || "N/A"}</span></h5> */}
//                                     <h5>Pincode : <span style={{ fontSize: "18px" }}>{record.employeePincode2 || "N/A"}</span></h5>
//                                 </div>
//                             </div>
//                         </div>
//                         <div style={{ width: "100%" }} className=' d-flex justify-content-center mt-3  gap-3 '>
//                             <div className='bg-light shadow-sm p-4' style={{ width: "50%", border: "1px dotted #D3D4D6", borderRadius: "20px" }} >
//                                 <h1 className='fw-bolder'>Job Details</h1>
//                                 <hr />
//                                 <h5>Department Name : <span style={{ fontSize: "18px" }}>{record.departmentName || "N/A"}</span></h5>
//                                 <h5>Designation Name  : <span style={{ fontSize: "18px" }}>{record.positionName || "N/A"}</span></h5>
//                                 <h5>Joining Company  : <span style={{ fontSize: "18px" }}>{record.joiningCompany || "N/A"}</span></h5>
//                                 <h5>Joining Office   : <span style={{ fontSize: "18px" }}>{record.joiningOffice || "N/A"}</span></h5>
//                                 <h5>Employee Type  : <span style={{ fontSize: "18px" }}>{record.employeeType || "N/A"}</span></h5>
//                                 <h5>Joining Date  : <span style={{ fontSize: "18px" }}>{formatDate(record.joiningDate) || "N/A"}</span></h5>
//                                 <h5>Inter/Contractual End Date : <span style={{ fontSize: "18px" }}>{formatDate(record.interncontractual) || "N/A"}</span></h5>
//                             </div>
//                             <div className='bg-light shadow-sm p-4' style={{ width: "50%", border: "1px dotted #D3D4D6", borderRadius: "20px" }} >
//                                 <h1 className='fw-bolder'>Family Details</h1>
//                                 <hr />
//                                 <h5>Father Name : <span style={{ fontSize: "18px" }}>{record.fatherName || "N/A"}</span></h5>
//                                 <h5>Mother Name : <span style={{ fontSize: "18px" }}>{record.motherName || "N/A"}</span></h5>
//                                 <h5>Marital Status: <span style={{ fontSize: "18px" }}>{record.employeeMaritalStatus || "N/A"}</span></h5>

//                                 {record.employeeMaritalStatus === 'married' && (
//                                     <>
//                                         {record.spouseName && (
//                                             <h5>Spouse Name: <span style={{ fontSize: "18px" }}>{record.spouseName || "N/A"}</span></h5>
//                                         )}

//                                         {record.haveChildren === 'yes' && record.children && (
//                                             <>
//                                                 <h5>Children:</h5>
//                                                 {JSON.parse(record.children).map((child, index) => (
//                                                     <p key={index} style={{ marginLeft: "20px" }}>
//                                                         <span style={{ fontSize: "16px" }}>Name: {child.name}, DOB: {child.dob}</span>
//                                                     </p>
//                                                 ))}
//                                             </>
//                                         )}
//                                     </>
//                                 )}

//                                 {(record.employeeMaritalStatus === 'widowed' || record.employeeMaritalStatus === 'divorced') && (
//                                     <>
//                                         {record.haveChildren === 'yes' && record.children && (
//                                             <>
//                                                 <h5>Children:</h5>
//                                                 {JSON.parse(record.children).map((child, index) => (
//                                                     <p key={index} style={{ marginLeft: "20px" }}>
//                                                         <span style={{ fontSize: "16px" }}>Name: {child.name}, DOB: {child.dob}</span>
//                                                     </p>
//                                                 ))}
//                                             </>
//                                         )}
//                                     </>
//                                 )}

//                                 <h5>Contact Name 1: <span style={{ fontSize: "18px" }}>{record.emergencyContactName1 || "N/A"}</span></h5>
//                                 <h5>Contact Number 1: <span style={{ fontSize: "18px" }}>{record.emergencyContactNumber1 || "N/A"}</span></h5>
//                                 <h5>Contact Relation 1: <span style={{ fontSize: "18px" }}>{record.emergencyContactRelation1 || "N/A"}</span></h5>

//                                 <h5>Contact Name 2: <span style={{ fontSize: "18px" }}>{record.emergencyContactName2 || "N/A"}</span></h5>
//                                 <h5>Contact Number 2: <span style={{ fontSize: "18px" }}>{record.emergencyContactNumber2 || "N/A"}</span></h5>
//                                 <h5>Contact Relation 2: <span style={{ fontSize: "18px" }}>{record.emergencyContactRelation2 || "N/A"}</span></h5>
//                             </div>
//                         </div>
//                     </div>
//                     <div style={{ border: "1px dotted #D3D4D6", borderRadius: "20px" }} className=' mt-3 w-100 p-4 shadow-sm bg-light'>
//                         <div className=''>
//                             <h1 className='fw-bolder'>Account Details</h1>
//                             <hr />
//                             <h5>Account Holder Name  : <span style={{ fontSize: "18px" }}>{record.accountHolderName || "N/A"}</span></h5>
//                             <h5>Account Number  : <span style={{ fontSize: "18px" }}>{record.accountNumber || "N/A"}</span></h5>
//                             <h5>Bank Name  : <span style={{ fontSize: "18px" }}>{record.bankName || "N/A"}</span></h5>
//                             <h5>IFSC Code  : <span style={{ fontSize: "18px" }}>{record.ifscCode || "N/A"}</span></h5>
//                             <h5>Branch Name   : <span style={{ fontSize: "18px" }}>{record.branchName || "N/A"}</span></h5>
//                         </div>
//                     </div >
//                 </div>
//                 <div className="modal-footer">
//                     <button onClick={handlePrint} className="btn btn-success print-button"><i className="fa fa-download"></i> Print</button>
//                     <button onClick={onClose} className="btn btn-danger print-button">Close</button>
//                 </div>
//             </div>

//         </div>

//     );
// }

// export default EmployeePrint;

import React from 'react'

const EmployeePrint = () => {
  return (
    <div>
      
    </div>
  )
}

export default EmployeePrint
