// import React, { useState } from 'react';

// const CreateUser = ({ onClose, employee, onUpdate }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [username, setUsername] = useState(employee ? employee.employeeName : '');
//     const [email, setEmail] = useState(employee ? employee.employeeEmail : '');
//     const [employeeId, setemployeeId] = useState(employee ? employee.id : '');
//     const [projectId, setprojectId] = useState(employee ? employee.projectId : '');
//     const [password, setPassword] = useState('');
//     const [userType, setUserType] = useState('user'); // Default to 'user'
//     console.log("employee", employee);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setIsLoading(true);
//         try {
//             const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/signup`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ username, email, password, userType, employeeId,	projectId }),
//             });
//             const data = await response.json();
//             // Check if user creation is successful
//             if (response.ok) {
//                 onUpdate();
//                 setTimeout(() => {
//                     onClose();
//                     window.location.reload();
//                 }, 1000); // 1 second delay
//             } else {
//                 console.error('Error:');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div id="add" className="modal fade show" role="dialog" style={{ display: "block", paddingRight: "17px" }}>
//             <div className="modal-dialog modal-lg">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Employee Signup</h5>
//                             <button type="button" className="close" onClick={onClose}>&times;</button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="form-group">
//                                 <label>Username (Employee Name)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={username}
//                                     onChange={(e) => setUsername(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>Email (Employee Email)</label>
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>Password</label>
//                                 <input
//                                     type="password"
//                                     className="form-control"
//                                     value={password}
//                                     placeholder='Password'
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>User Type</label>
//                                 <select
//                                     id="user-type"
//                                     className="form-control"
//                                     value={userType}
//                                     onChange={(e) => setUserType(e.target.value)}
//                                     required
//                                 >
//                                     <option value="user">User</option>
//                                     {/* <option value="manager">Manager</option>
//                                     <option value="admin">Admin</option> */}
//                                 </select>
//                             </div>
//                         </div>
//                         <div className="modal-footer">
//                             <button type="submit" className="btn btn-primary" disabled={isLoading}>
//                                 {isLoading ? 'Loading...' : 'Signup'}
//                             </button>
//                             <button type="button" className="btn btn-default" onClick={onClose}>Close</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateUser;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

// const CreateUser = ({ onClose, employee, onUpdate }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         password: '',
//         userType: 'user',
//     });

//     // Pre-fill form data if editing
//     useEffect(() => {
//         if (employee) {
//             setFormData({
//                 ...formData,
//                 employeeName: employee.employeeName,
//                 employeeEmail: employee.employeeEmail,
//                 supervisorId: employee.supervisorId,
//                 projectId: employee.projectId,
//             });
//         }
//     }, [employee]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // Check if projectId exists in the table
//         setIsLoading(true);
//         try {
//             const { data } = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/signupdetails/${formData.projectId}`);

//             if (data.exists) {
//                 // Project ID already exists, show error toast
//                 toast.error('User with this project ID already exists!');
//                 setIsLoading(false);
//                 return;
//             }

//             // If project ID doesn't exist, proceed with form submission
//             const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/signup`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: formData.employeeName,
//                     email: formData.employeeEmail,
//                     password: formData.password,
//                     userType: formData.userType, // Ensure userType is included
//                     employeeId: formData.supervisorId,
//                     projectId: formData.projectId,
//                 }),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 // Successfully created user
//                 onUpdate();
//                 setTimeout(() => {
//                     onClose();
//                     // window.location.reload();
//                 }, 1000); // 1-second delay
//             } else {
//                 // Handle server error
//                 console.error(result.error || 'Failed to create user');
//                 toast.error('Failed to create user');
//             }

//         } catch (error) {
//             console.error('Error:', error);
//             toast.error('Error occurred during form submission');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div id="employeesignup" className="modal fade show" role="dialog" style={{ display: 'block' }}>
//             <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
//                         <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
//                             <h5 className="modal-title">Employee Signup</h5>
//                             <button type="button" className="button_details" onClick={onClose}>
//                                 <i className="fa-solid fa-xmark"></i>
//                             </button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="form-group">
//                                 <label>Username (Employee Name)</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={formData.employeeName}
//                                     required
//                                     readOnly
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>Email (Employee Email)</label>
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     value={formData.employeeEmail}
//                                     required
//                                     readOnly
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>Password</label>
//                                 <input
//                                     type="password"
//                                     className="form-control"
//                                     name="password"
//                                     value={formData.password}
//                                     placeholder='Password'
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>User Type</label>
//                                 <select
//                                     id="user-type"
//                                     className="form-control"
//                                     name="userType"
//                                     value={formData.userType}
//                                     onChange={handleChange}
//                                     required
//                                 >
//                                     <option value="user">User</option>
//                                 </select>
//                             </div>
//                         </div>

//                         <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-footer">
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

// export default CreateUser;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateUser = ({ onClose, employee, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        userType: 'user',
    });

    // Pre-fill form data if editing
    useEffect(() => {
        if (employee) {
            setFormData({
                ...formData,
                employeeName: employee.employeeName,
                employeeEmail: employee.employeeEmail,
                supervisorId: employee.supervisorId,
                projectId: employee.projectId,
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Check if projectId exists
            const { data } = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/signupdetails/${formData.projectId}`);

            if (data.exists) {
                // If projectId exists, show error toast and stop the form submission
                toast.error('User with this project ID already exists!');
                setIsLoading(false);
                return;
            }

            // If projectId does not exist, proceed with the signup
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/signup`, {
                username: formData.employeeName,
                email: formData.employeeEmail,
                password: formData.password,
                userType: formData.userType,
                employeeId: formData.supervisorId,
                projectId: formData.projectId,
            });

            if (response.status === 201) {
                // User successfully created
                onUpdate(); // Trigger any parent update method if required
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                toast.error('Failed to create user');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            toast.error('An error occurred while creating the user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="employeesignup" className="modal fade show" role="dialog" style={{ display: 'block' }}>
            <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
                            <h5 className="modal-title">Employee Signup</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Username (Employee Name)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.employeeName}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Email (Employee Email)</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.employeeEmail}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    placeholder='Password'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>User Type</label>
                                <select
                                    id="user-type"
                                    className="form-control"
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="user">User</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-footer">
                            <button type="submit" className="button_details" disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Submit'}
                            </button>
                            <button type="button" className="button_details" onClick={onClose}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
