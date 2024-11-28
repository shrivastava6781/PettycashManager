// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import imageCompression from 'browser-image-compression';
// import { ThreeDots } from 'react-loader-spinner';

// const EditEmployeeModal = ({ onClose, onUpdate,employee }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         employeeName: '',
//         employeeCode: '',
//         employeeEmail: '',
//         employeePhone: '',
//         fatherName: '',
//         employeePanAddhar:'', 
//         departmentName: '',
//         departmentId: '',
//         designationName: '',
//         designationId: '',
//         picture: null,
//         username: localStorage.getItem('username'),
//     });
//         // Pre-fill form data if editing
//         useEffect(() => {
//             if (employee) {
//                 setFormData({ ...employee });
//             }
//         }, [employee]);

//     const [errors, setErrors] = useState({});
//     const [employees, setEmployees] = useState([]);
//     const [validationErrors, setValidationErrors] = useState({});
//     const [departments, setDepartments] = useState([]);
//     const [positions, setPositions] = useState([]);
//     const [filteredPositions, setFilteredPositions] = useState([]);
//     const [states, setStates] = useState([]);

//     useEffect(() => {
//         const fetchEmployees = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`);
//                 setEmployees(response.data);
//             } catch (error) {
//                 console.error('Error fetching employees:', error);
//             }
//         };
//         const fetchStates = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/states`);
//                 setStates(response.data);
//             } catch (error) {
//                 console.error('Error fetching states:', error);
//             }
//         };

//         const fetchDepartments = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/departments`);
//                 setDepartments(response.data);
//             } catch (error) {
//                 console.error('Error fetching departments:', error);
//             }
//         };

//         const fetchPositions = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/positions`);
//                 setPositions(response.data);
//             } catch (error) {
//                 console.error('Error fetching positions:', error);
//             }
//         };
//         fetchDepartments();
//         fetchPositions();
//         fetchEmployees();
//         fetchStates();
//     }, []);

//     useEffect(() => {
//         if (formData.department) {
//             const filtered = positions.filter(position => position.department_id === parseInt(formData.department));
//             setFilteredPositions(filtered);
//         } else {
//             setFilteredPositions([]);
//         }
//     }, [formData.department, positions]);

//     const handleImageChange = async (e) => {
//         const { name, files } = e.target;
//         const file = files[0];

//         if (file) {
//             const maxSize = 200 * 1024;
//             const allowedTypes = ['image/jpeg', 'image/png'];

//             if (!allowedTypes.includes(file.type)) {
//                 setValidationErrors((prevErrors) => ({
//                     ...prevErrors,
//                     [name]: 'Only JPG and PNG files are allowed.',
//                 }));
//                 return;
//             }

//             if (file.size > maxSize) {
//                 const options = {
//                     maxSizeMB: 0.2,
//                     maxWidthOrHeight: 500,
//                     useWebWorker: true,
//                 };
//                 try {
//                     const compressedFile = await imageCompression(file, options);
//                     setFormData((prevFormData) => ({
//                         ...prevFormData,
//                         [name]: compressedFile,
//                     }));
//                 } catch (error) {
//                     console.error('Error compressing image:', error);
//                 }
//                 return;
//             }

//             setFormData((prevFormData) => ({
//                 ...prevFormData,
//                 [name]: file,
//             }));

//             setValidationErrors((prevErrors) => ({
//                 ...prevErrors,
//                 [name]: '',
//             }));
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "department") {
//             const selectedDepartment = departments.find(department => department.id === parseInt(value));
//             setFormData((prevData) => ({
//                 ...prevData,
//                 department: value,
//                 departmentName: selectedDepartment ? selectedDepartment.name : "",
//             }));
//         } else if (name === "position") {
//             const selectedPosition = filteredPositions.find(position => position.id === parseInt(value));
//             setFormData((prevData) => ({
//                 ...prevData,
//                 designationId: value,
//                 designationName: selectedPosition ? selectedPosition.positionName : "",
//             }));
//         } else {
//             setFormData((prevData) => ({
//                 ...prevData,
//                 [name]: value,
//             }));
//         }
//     };

//     const validate = () => {
//         const newErrors = {};
//         if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
//         if (!formData.employeeEmail) newErrors.employeeEmail = 'Employee email is required';
//         // Add more validations as needed
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         if (!validate()) {
//             setIsLoading(false);
//             return;
//         }

//         const formDataToSend = new FormData();
//         Object.keys(formData).forEach((key) => {
//             formDataToSend.append(key, formData[key]);
//         });
//         try {   
//             const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/empdata/${formData.id}`, formDataToSend);
//             console.log('Data updated successfully:', response.data);
//             onUpdate();
//             onClose();
//         } catch (error) {
//             console.error('Error uploading data:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleClose = () => {
//         onClose();
//     };
//     return (
//         <div id="EditEmployeeModal" className="modal fade show" role="dialog" style={{ display: "block"}}>
//             <div style={{borderRadius:"20px"}} className="modal-dialog modal-lg overflow-hidden">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
//                         <div style={{backgroundColor:"#00509d",color:"white"}} className="modal-header">
//                             <h5 className="modal-title">Add Employee</h5>
//                             <button  type="button" className="button_details " onClick={handleClose}><i class="fa-solid fa-xmark"></i></button>
//                         </div>
//                         <div className="modal-body" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
//                             <div>
//                                 <div className="form-row">
//                                     <div className="form-group col-md-6">
//                                         <label>Employee Name <span style={{ color: "red" }}>*</span></label>
//                                         <input name="employeeName" type="text" className="form-control" placeholder="Enter Employee Name " onChange={handleChange} value={formData.employeeName} />
//                                     </div>
//                                     <div className="form-group col-md-6">
//                                         <label>Employee Code <span style={{ color: "red" }}>*</span></label>
//                                         <input name="employeeCode" type="text" className="form-control" placeholder="Enter Employee Code" onChange={handleChange} value={formData.employeeCode} />
//                                     </div>
//                                     <div className="form-group col-md-4">
//                                         <label>Father's Name <span style={{ color: "red" }}>*</span></label>
//                                         <input name="fatherName" type="text" className="form-control" placeholder="Enter Employee Name " onChange={handleChange} value={formData.fatherName} />
//                                     </div>
//                                     <div className="form-group col-md-4">
//                                         <label>Phone Number <span style={{ color: "red" }}>*</span></label>
//                                         <input name="employeePhone" type="number" className="form-control" placeholder="Enter phone number" onChange={handleChange} value={formData.employeePhone} />
//                                     </div>
//                                     <div className="form-group col-md-4">
//                                         <label>Email Id</label>
//                                         <input name="employeeEmail" type="email" className="form-control" placeholder="Enter email" onChange={handleChange} value={formData.employeeEmail} />
//                                     </div>
//                                     <div className="form-group col-md-4">
//                                         <label>Id Number</label>
//                                         <input name="employeePanAddhar" type="text" className="form-control" placeholder="Enter PAN number" onChange={handleChange} value={formData.employeePanAddhar} />
//                                     </div>
//                                     <div className="form-group col-md-4">
//                                         <label>Department <span style={{ color: "red" }}>*</span></label>
//                                         <select name="department" className="form-control" onChange={handleChange} value={formData.department}>
//                                             <option value="">Select Department</option>
//                                             {departments.map(department => (
//                                                 <option key={department.id} value={department.id}>{department.name}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className="form-group col-md-4">
//                                         <label>Designation <span style={{ color: "red" }}>*</span></label>
//                                         <select name="position" className="form-control" onChange={handleChange} value={formData.position}>
//                                             <option value="">Select Designation</option>
//                                             {filteredPositions.map(position => (
//                                                 <option key={position.id} value={position.id}>{position.positionName}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Upload Picture</label>
//                                     <input
//                                         name="picture"
//                                         type="file"
//                                         className="form-control"
//                                         onChange={handleImageChange}
//                                         required
//                                     />
//                                     {validationErrors.picture && (
//                                         <div className="invalid-feedback">{validationErrors.picture}</div>
//                                     )}
//                                 </div>

//                             </div>
//                         </div>
//                         <div style={{backgroundColor:"#00509d",color:"white"}} className="modal-footer">
//                             <button type="submit" className="button_details" disabled={isLoading}>
//                                 {isLoading ? 'Loading...' : 'Submit'}
//                             </button>
//                             <button type="button" className="button_details" onClick={handleClose}>Close</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditEmployeeModal;










import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const AddEmployeeTable = ({ onClose, onUpdate, employee }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        employeeName: '',
        employeeCode: '',
        employeeEmail: '',
        employeePhone: '',
        fatherName: '',
        employeePanAddhar: '',
        department: '',
        departmentName: '',
        designationId: '',
        designationName: '',
        picture: null,
        username: localStorage.getItem('username'),
    });
    const [errors, setErrors] = useState({});
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);

    // Pre-fill form data if editing
    useEffect(() => {
        if (employee) {
            setFormData({ ...employee });
        }
    }, [employee]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/departments`);
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        const fetchPositions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/positions`);
                setPositions(response.data);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchDepartments();
        fetchPositions();
    }, []);

    useEffect(() => {
        if (formData.department) {
            const filtered = positions.filter(position => position.department_id === parseInt(formData.department));
            setFilteredPositions(filtered);
        } else {
            setFilteredPositions([]);
        }
    }, [formData.department, positions]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                setFormData((prevData) => ({
                    ...prevData,
                    picture: compressedFile,
                }));
                toast.success('Image compressed successfully');
            } catch (error) {
                console.error('Error compressing image:', error);
                toast.error('Failed to compress image');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "department") {
            const selectedDepartment = departments.find(department => department.id === parseInt(value));
            setFormData((prevData) => ({
                ...prevData,
                department: value,
                departmentName: selectedDepartment ? selectedDepartment.name : "",
            }));
        } else if (name === "position") {
            const selectedPosition = filteredPositions.find(position => position.id === parseInt(value));
            setFormData((prevData) => ({
                ...prevData,
                designationId: value,
                designationName: selectedPosition ? selectedPosition.positionName : "",
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.employeeName) newErrors.employeeName = 'Employee Name is required';
        if (!formData.employeeCode) newErrors.employeeCode = 'Employee Code is required';
        if (!formData.fatherName) newErrors.fatherName = 'Father Name is required';
        if (!formData.employeePhone) newErrors.employeePhone = 'Phone Number is required';
        if (!formData.employeeEmail) newErrors.employeeEmail = 'Employee email is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.designationId) newErrors.position = 'Position is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validate()) {
            setIsLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/empdata/${formData.id}`, formDataToSend);
            console.log('Data updated successfully:', response.data);
            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload(); // Reload the page after submission
            }, 1000);
        } catch (error) {
            console.error('Error uploading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div id="addemployeetable" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Add Employee</h5>
                            <button type="button" className="button_details" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Employee Name <span style={{ color: "red" }}>*</span></label>
                                    <input name="employeeName" type="text"
                                        //  className="form-control"
                                        className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
                                        placeholder="Enter Employee Name" onChange={handleChange} value={formData.employeeName} />
                                    {errors.employeeName && <span className="invalid-feedback">{errors.employeeName}</span>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Employee Code <span style={{ color: "red" }}>*</span></label>
                                    <input name="employeeCode" type="text"
                                        //  className="form-control"
                                        className={`form-control ${errors.employeeCode ? 'is-invalid' : ''}`}
                                        placeholder="Enter Employee Code" onChange={handleChange} value={formData.employeeCode} />
                                    {errors.employeeCode && <span className="invalid-feedback">{errors.employeeCode}</span>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Father's Name <span style={{ color: "red" }}>*</span></label>
                                    <input name="fatherName" type="text"
                                        //  className="form-control"
                                        className={`form-control ${errors.fatherName ? 'is-invalid' : ''}`}
                                        placeholder="Enter Father's Name" onChange={handleChange} value={formData.fatherName} />
                                    {errors.fatherName && <span className="invalid-feedback">{errors.fatherName}</span>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Phone Number <span style={{ color: "red" }}>*</span></label>
                                    <input name="employeePhone" type="number"
                                        //  className="form-control"
                                        className={`form-control ${errors.employeePhone ? 'is-invalid' : ''}`}
                                        placeholder="Enter phone number" onChange={handleChange} value={formData.employeePhone} />
                                    {errors.employeePhone && <span className="invalid-feedback">{errors.employeePhone}</span>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Email Id <span style={{ color: "red" }}>*</span></label>
                                    <input name="employeeEmail" type="email"
                                        //  className="form-control"
                                        className={`form-control ${errors.employeeEmail ? 'is-invalid' : ''}`}
                                        placeholder="Enter email" onChange={handleChange} value={formData.employeeEmail} />
                                    {errors.employeeEmail && <span className="invalid-feedback">{errors.employeeEmail}</span>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Id Number</label>
                                    <input name="employeePanAddhar" type="text"
                                        className="form-control"
                                        placeholder="Enter PAN/Aadhar number" onChange={handleChange} value={formData.employeePanAddhar} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Department <span style={{ color: "red" }}>*</span></label>
                                    <select name="department"
                                        //  className="form-control"
                                        className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                                        onChange={handleChange} value={formData.department}>
                                        <option value="">Select Department</option>
                                        {departments.map(department => (
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        ))}
                                    </select>
                                    {errors.department && <span className="invalid-feedback">{errors.department}</span>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Designation <span style={{ color: "red" }}>*</span></label>
                                    <select name="position" className="form-control" onChange={handleChange} value={formData.positionName}>
                                        <option value="" disabled hidden>Select Designation</option>
                                        {filteredPositions.map(position => (
                                            <option key={position.id} value={position.id}>{position.positionName}</option>
                                        ))}
                                    </select>
                                    {errors.position && <span className="invalid-feedback">{errors.position}</span>}
                                </div>
                                <div className="form-group col-md-12">
                                    <label>Employee Image</label>
                                    <input name="picture" type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
                            <button type="submit" className="button_details" disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Submit'}
                            </button>
                            <button type="button" className="button_details" onClick={handleClose}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeTable;


