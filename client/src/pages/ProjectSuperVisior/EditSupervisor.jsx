import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const EditSupervisor = ({ onClose, onUpdate, editsupervisor }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        appointmentDate: '',
    });

    // Pre-fill form data if editing
    useEffect(() => {
        if (editsupervisor) {
            const dateFromDb = new Date(editsupervisor.appointmentDate);
            const localDate = new Date(dateFromDb.getTime() + (dateFromDb.getTimezoneOffset() * 60000));
            const adjustedLocalDate = new Date(localDate);
            adjustedLocalDate.setDate(localDate.getDate() + 1);
            const formattedDate = adjustedLocalDate.toISOString().split('T')[0];

            setFormData({
                ...editsupervisor,
                appointmentDate: formattedDate,
            });
        }
    }, [editsupervisor]);


    const handleDateChange = (e) => {
        setFormData({ ...formData, appointmentDate: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_LOCAL_URL}/assignSupervisor/${formData.id}`, formData);
            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
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
                            <h5 className="modal-title">Assign Supervisor</h5>
                            <button type="button" className="button_details" onClick={handleClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Select Project<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="projectName"
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={formData.projectName}
                                    />

                                </div>
                                <div className="form-group col-md-6">
                                    <label>Select Supervisor<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="supervisorName"
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={formData.employeeName}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <div style={{ borderRadius: "20px" }} className="project-details border p-3">
                                        <h6 className='fw-bolder border-bottom pb-1'>Project Details</h6>
                                        <div className='lh-base'>
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
                            <div className="form-group">
                                <label>Appointment Date<span style={{ color: "red" }}>*</span></label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                                    value={formData.appointmentDate}
                                    onChange={handleDateChange}
                                    required
                                />
                                {errors.appointmentDate && <div className="invalid-feedback">{errors.appointmentDate}</div>}
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

export default EditSupervisor;














