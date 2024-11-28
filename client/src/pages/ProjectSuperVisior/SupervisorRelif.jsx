import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const SupervisorRelif = ({ onClose, onUpdate, supervisorRelif }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        leavedate: '',
        relifDescription: '',
    });

    // Pre-fill form data if supervisorRelif exists
    useEffect(() => {
        if (supervisorRelif) {
            setFormData({ ...supervisorRelif });
        }
    }, [supervisorRelif]);

    // Handle input change for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading state
    
        try {
            // Update supervisor
            await axios.put(`${process.env.REACT_APP_LOCAL_URL}/updateSupervisor/${formData.id}`, formData);
    
            // Delete project signup
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL}/projectsignup/${formData.projectId}`);
    
            // Call the onUpdate function if needed
            onUpdate();
    
            // Close the modal and refresh the page after a short delay
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error submitting form:', error);
            // Optionally: you could show an error message to the user here
        } finally {
            // Always stop loading state, even if an error occurred
            setIsLoading(false);
        }
    };
    
    

    // Format the date for display in the form
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} `;
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div id="addSupervisorModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Relief Supervisor</h5>
                            <button type="button" className="button_details" onClick={handleClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Project Name<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
                                        value={formData.projectName}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Supervisor Name<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="supervisorName"
                                        className={`form-control ${errors.supervisorName ? 'is-invalid' : ''}`}
                                        value={formData.employeeName}
                                        readOnly
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <div style={{ borderRadius: "20px" }} className="project-details border p-3">
                                        <h6 className='fw-bolder border-bottom pb-1'>Project Details</h6>
                                        <div className='lh-base '>
                                            <p className='p-0 m-0'><strong>Code:</strong> {formData.projectCode}</p>
                                            <p className='p-0 m-0'><strong>Type:</strong> {formData.projectType}</p>
                                            <p className='p-0 m-0'><strong>Employeer Name:</strong> {formData.employeerName}</p>
                                            <p className='p-0 m-0'><strong>Address:</strong> {formData.projectAddress}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <div style={{ borderRadius: "20px" }} className="supervisor-details border p-3">
                                        <h6 className='fw-bolder border-bottom pb-1'>Supervisor Details</h6>
                                        <div className='lh-base'>
                                            <p className='p-0 m-0'><strong>Code:</strong> {formData.employeeCode}</p>
                                            <p className='p-0 m-0'><strong>Department:</strong> {formData.departmentName}</p>
                                            <p className='p-0 m-0'><strong>Email:</strong> {formData.employeeEmail}</p>
                                            <p className='p-0 m-0'><strong>Phone:</strong> {formData.employeePhone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Appointment Date<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="appointmentDate"
                                        className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                                        value={formatDate(formData.appointmentDate)}
                                        required
                                        readOnly
                                    />
                                    {errors.appointmentDate && <div className="invalid-feedback">{errors.appointmentDate}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Relif Date<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="date"
                                        name="leavedate"
                                        className={`form-control ${errors.leavedate ? 'is-invalid' : ''}`}
                                        value={formData.leavedate}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.leavedate && <div className="invalid-feedback">{errors.leavedate}</div>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description<span style={{ color: 'red' }}>*</span></label>
                                <textarea
                                    name="relifDescription"
                                    className={`form-control ${errors.relifDescription ? 'is-invalid' : ''}`}
                                    required
                                    placeholder="Description"
                                    onChange={handleChange}
                                    value={formData.relifDescription}
                                />
                                {errors.relifDescription && <div className="invalid-feedback">{errors.relifDescription}</div>}
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

export default SupervisorRelif;
