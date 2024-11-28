// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AddPositionModal = ({ onClose, onUpdate }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         departmentId: '', // Will store the selected department ID
//         departmentName: '', // Will store the selected department Name
//     });
//     const [departments, setDepartments] = useState([]); // State to store departments fetched from the database
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         fetchDepartments();
//     }, []);

//     const fetchDepartments = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/departments`);
//             setDepartments(response.data); // Assuming response.data is an array of departments
//         } catch (error) {
//             console.error('Error fetching departments:', error);
//         }
//     };

//     const { name, description, departmentId, departmentName } = formData;

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });

//         if (name === 'departmentName') {
//             const selectedDepartment = departments.find(department => department.name === value);
//             setFormData({
//                 ...formData,
//                 departmentId: selectedDepartment ? selectedDepartment.id : '',
//                 [name]: value,
//             });
//         }
//     };

//     const validate = () => {
//         let formErrors = {};
//         if (!formData.departmentName) formErrors.date = 'Department Name is required';
//         if (!formData.designation) formErrors.designation = 'Designation is required';
//         if (!formData.description) formErrors.description = 'Description is required';

//         setErrors(formErrors);
//         return Object.keys(formErrors).length === 0;
//       };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;

//         setIsLoading(true);

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/positions`, {
//                 name,
//                 description,
//                 departmentId,
//                 departmentName,
//             });
//             console.log('Added position successfully:', response.data);

//             onUpdate();
//             setTimeout(() => {
//                 onClose();
//                 window.location.reload();
//             }, 1000); // 1 second delay
//         } catch (error) {
//             console.error('Error adding position:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleClose = () => {
//         onClose();
//     };

//     return (
//         <div id="addPositionModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
//             <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
//                         <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
//                             <h5 className="modal-title">Add Designation</h5>
//                             <button type="button" className="button_details " onClick={handleClose}><i class="fa-solid fa-xmark"></i></button>
//                         </div>
//                         <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//                             <div className="form-group">
//                                 <label>Department<span style={{ color: "red" }}>*</span></label>
//                                 <select name="departmentName" value={departmentName} onChange={handleChange} className="form-control" required>
//                                     <option value="" disabled>Select Department</option>
//                                     {departments.map(department => (
//                                         <option key={department.id} value={department.name}>{department.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="form-group">
//                                 <label>Designation Name<span style={{ color: "red" }}>*</span></label>
//                                 <input name="designation" value={name} onChange={handleChange} type="text" className="form-control" required placeholder="Designation Name" />
//                             </div>
//                             <div className="form-group">
//                                 <label>Description<span style={{ color: "red" }}>*</span></label>
//                                 <textarea name="description" value={description} onChange={handleChange} className="form-control" placeholder="Description"></textarea>
//                             </div>
//                         </div>
//                         <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
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

// export default AddPositionModal;




import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddPositionModal = ({ onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        departmentId: '', // Selected department ID
        departmentName: '', // Selected department name
    });
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/departments`);
            setDepartments(response.data); // Assumes response.data is an array of departments
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'departmentName') {
            const selectedDepartment = departments.find(dept => dept.name === value);
            setFormData({
                ...formData,
                departmentId: selectedDepartment ? selectedDepartment.id : '',
                departmentName: value,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validate = () => {
        let formErrors = {};
        if (!formData.departmentName) formErrors.departmentName = 'Department Name is required';
        if (!formData.name) formErrors.name = 'Designation Name is required';
        if (!formData.description) formErrors.description = 'Description is required';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/positions`, {
                name: formData.name,
                description: formData.description,
                departmentId: formData.departmentId,
                departmentName: formData.departmentName,
            });
            console.log('Added position successfully:', response.data);

            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error adding position:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div id="addPositionModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Add Designation</h5>
                            <button type="button" className="button_details" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label>Department<span style={{ color: "red" }}>*</span></label>
                                <select name="departmentName" value={formData.departmentName} onChange={handleChange}
                                    // className="form-control"
                                    className={`form-control ${errors.departmentName ? 'is-invalid' : ''}`}
                                    required>
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(department => (
                                        <option key={department.id} value={department.name}>{department.name}</option>
                                    ))}
                                </select>
                                {errors.departmentName && <div className="invalid-feedback">{errors.departmentName}</div>}
                            </div>
                            <div className="form-group">
                                <label>Designation Name<span style={{ color: "red" }}>*</span></label>
                                <input name="name" value={formData.name} onChange={handleChange} type="text"
                                    //  className="form-control" 
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    required placeholder="Designation Name" />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label>Description<span style={{ color: "red" }}>*</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange}
                                    //  className="form-control"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    placeholder="Description"></textarea>
                                {errors.description && <div className="text-danger">{errors.description}</div>}
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

export default AddPositionModal;



