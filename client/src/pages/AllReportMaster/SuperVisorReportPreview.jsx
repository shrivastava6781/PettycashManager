// import React, { useEffect, useState } from 'react';
// import myLogo from '../../images/CashBackground.jpg'; // Updated image reference for bonuses
// import axios from 'axios';

// const SuperVisorReportPreview = ({ record, onClose }) => {
//     const { recordData = [] } = record || {};
//     const filteredSuperVisor = recordData;
//     const [setting, setSetting] = useState({});
//     const [supervisors, setSupervisors] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         const fetchSetting = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);
//                 setSetting(response.data);
//             } catch (error) {
//                 console.error('Error fetching settings', error);
//             }
//         };

//         const fetchSupervisors = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/supervisors`);
//                 const supervisorData = response.data;
//                 setSupervisors(supervisorData);
//             } catch (error) {
//                 console.error("Error fetching supervisors:", error);
//                 // Optionally display a toast error message here
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchSetting();
//         fetchSupervisors();
//     }, []);

//     const handlePrint = () => {
//         window.print();
//     };

//     const getProjectNameForEmployee = (employeeId) => {
//         const supervisor = supervisors.find(supervisor => supervisor.employeeCode === employeeId);
//         return supervisor ? supervisor.projectName : "N/A"; // Use project name if supervisor found, else "N/A"
//     };

//     return (
//         <div className="container-fluid">
//             <div className="row p-1">
//                 <div className="modal-content">
//                     <div className="modal-header m-0 p-2 d-flex align-items-center justify-content-between px-3">
//                         <div>
//                             <div style={{ height: "50px", width: "100%" }} className='logo p-1'>
//                                 <img
//                                     src={setting.landingPageLogo
//                                         ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${setting.landingPageLogo}`
//                                         : myLogo}
//                                     style={{ height: "100%", objectFit: "cover" }}
//                                     alt="LOGO"
//                                 />
//                             </div>
//                         </div>
//                         <h4 style={{ color: "#00509d" }} className='title-detail text-uppercase fw-bolder font-bold m-0'>All SuperVisor Report</h4>
//                         <div>
//                             <h5 style={{ color: "#00509d" }} className='title-detail text-uppercase fw-bolder font-bold m-0'>{setting.title || 'PETTY CASH '}</h5>
//                         </div>
//                     </div>
//                     <div className="card-body form-row">
//                         <div className='col-md-12'>
//                             <table className="table table-bordered" style={{ width: "100%" }}>
//                                 <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                                     <tr>
//                                         <th>Employee Name/Designation</th>
//                                         <th>Employee Code</th>
//                                         <th>Phone No.</th>
//                                         <th>Project Name</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredSuperVisor.length === 0 ? (
//                                         <tr>
//                                             <td colSpan="4" className="text-center">There are No Projects.</td>
//                                         </tr>
//                                     ) : (
//                                         filteredSuperVisor.map((employee, index) => (
//                                             <tr key={index}>
//                                                 <td>
//                                                     {employee.employeeName}
//                                                     <hr />
//                                                     {employee.designationName}
//                                                     <br />
//                                                     {employee.departmentName}
//                                                 </td>
//                                                 <td>{employee.employeeCode}</td>
//                                                 <td>{employee.employeePhone}</td>
//                                                 <td>{getProjectNameForEmployee(employee.employeeCode.trim())}</td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     <div className="modal-footer p-1 d-flex align-items-center justify-content-between">
//                         <div>
//                             <small className='p-0 m-0'>Powered By - Petty Cash Manager</small>
//                         </div>
//                         <div className='d-flex gap-2'>
//                             <button onClick={handlePrint} className="btn btn-success print-button">
//                                 <i className="fa fa-download"></i> Print
//                             </button>
//                             <button onClick={onClose} className="btn btn-danger print-button">Close</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SuperVisorReportPreview;





import React, { useEffect, useState } from 'react';
import myLogo from '../../images/CashBackground.jpg'; // Updated image reference for bonuses
import axios from 'axios';

const SuperVisorReportPreview = ({ record, onClose }) => {
    const { recordData = [] } = record || {};
    const filteredSupervisor = recordData;
    const [setting, setSetting] = useState({});

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);
                setSetting(response.data);
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };
        fetchSetting();
    }, []);

    const handlePrint = () => {
        window.print();
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} `;
    };

    return (
        <div className="container-fluid">
            <div className="row p-1">
                <div className="modal-content">
                    <div className="modal-header m-0 p-2 d-flex align-items-center justify-content-between px-3">
                        <div>
                            <div style={{ height: "50px", width: "100%" }} className='logo p-1'>
                                <img
                                    src={setting.landingPageLogo
                                        ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${setting.landingPageLogo}`
                                        : myLogo}
                                    style={{ height: "100%", objectFit: "cover" }}
                                    alt="LOGO"
                                />
                            </div>
                        </div>
                        <h4 style={{ color: "#00509d" }} className='title-detail text-uppercase fw-bolder font-bold m-0'>Active Supervisor Report</h4>
                        <div>
                            <h5 style={{ color: "#00509d" }} className='title-detail text-uppercase fw-bolder font-bold m-0'>{setting.title || 'PETTY CASH MANAGER'}</h5>
                        </div>
                    </div>
                    <div className="card-body form-row">
                        <div className='col-md-12'>
                            <table className="table table-striped table-bordered rounded border">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Supervisor Name</th>
                                        <th>Department Name</th>
                                        <th>Contact No.</th>
                                        <th>Appoitment Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSupervisor && (
                                        <>
                                            {filteredSupervisor.length === 0 ? (
                                                <tr>
                                                    <td colSpan="12" className="text-center">There are No filteredSupervisor.</td>
                                                </tr>
                                            ) : (
                                                filteredSupervisor.map((supervisor, index) => (
                                                    <tr key={index}>
                                                        <td>{supervisor.projectShortName}</td>
                                                        <td>{supervisor.employeeName}</td>
                                                        <td>{supervisor.departmentName}</td>
                                                        <td>{supervisor.employeePhone}</td>
                                                        {/* <td>{formatDate(supervisor.appointmentDate)}</td> */}
                                                        <td>{new Date(supervisor.appointmentDate).toLocaleDateString('en-GB')}</td>

                                                    </tr>
                                                )))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer p-1 d-flex align-items-center justify-content-between">
                        <div>
                            <small className='p-0 m-0'>Powered By - Petty Cash Manager</small>
                        </div>
                        <div className='d-flex gap-2'>
                            <button onClick={handlePrint} className="btn btn-success print-button">
                                <i className="fa fa-download"></i> Print
                            </button>
                            <button onClick={onClose} className="btn btn-danger print-button">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuperVisorReportPreview;
