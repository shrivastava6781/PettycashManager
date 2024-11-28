import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddHead = ({ onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        headName: '',
        description: '',
        username: localStorage.getItem('username'),  // You can keep this if you need the username
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let formErrors = {};
        if (!formData.headName) formErrors.headName = 'Head Name is required';
        if (!formData.description) formErrors.description = 'Description is required';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Form submitted:', formData);
        if (!validate()) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/addHead`, formData);
            console.log('Data uploaded successfully:', response.data);

            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000); // 1 second delay
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
        <div id="addHeadModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Add Head</h5>
                            <button type="button" className="button_details " onClick={handleClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label>Head Name<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="headName"
                                    type="text"
                                    className={`form-control ${errors.headName ? 'is-invalid' : ''}`}
                                    required
                                    placeholder="Head Name"
                                    onChange={handleChange}
                                />
                                {errors.headName && <div className="invalid-feedback">{errors.headName}</div>}
                            </div>
                            <div className="form-group">
                                <label>Description<span style={{ color: "red" }}>*</span></label>
                                <textarea
                                    name="description"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    required
                                    placeholder="Description"
                                    onChange={handleChange}
                                />
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
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

export default AddHead;
