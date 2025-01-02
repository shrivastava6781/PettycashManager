import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCash = ({ onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectId: '',
        projectName: '',
        paymentModeId: '',
        paymentMode: '',
        paidTo: '',
        amount: '',
        date: '',
        description: '',
        username: localStorage.getItem('username'),
    });

    const [projects, setProjects] = useState([]);
    const [paymentModes, setPaymentModes] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetching projects and payment modes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, paymentModesResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`),
                    axios.get(`${process.env.REACT_APP_LOCAL_URL}/paymentModes`),
                ]);
                setProjects(projectsResponse.data);
                setPaymentModes(paymentModesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Handling form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'paymentModeId') {
            const selectedPaymentMode = paymentModes.find((mode) => mode.id === parseInt(value, 10));
            setFormData((prevData) => ({
                ...prevData,
                paymentModeId: value,
                paymentMode: selectedPaymentMode ? selectedPaymentMode.paymentModeName : '',
            }));
        } else if (name === 'projectId') {
            const selectedProject = projects.find((project) => project.id === parseInt(value, 10));
            setFormData((prevData) => ({
                ...prevData,
                projectId: value,
                projectName: selectedProject ? selectedProject.projectName : '',
                projectShortName: selectedProject ? selectedProject.projectShortName : '',
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Validation function
    const validate = () => {
        const formErrors = {};
        if (!formData.projectId) formErrors.projectId = 'Project Name is required';
        if (!formData.paymentModeId) formErrors.paymentModeId = 'Payment Mode is required';
        if (!formData.paidTo) formErrors.paidTo = 'Paid To is required';
        if (!formData.amount || formData.amount <= 0) formErrors.amount = 'Amount must be greater than 0';
        if (!formData.date) formErrors.date = 'Date is required';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_LOCAL_URL}/addCashPayment`, formData);
            onUpdate();  // Refresh parent component data
            // setTimeout(() => {
            //     onClose();
            //     window.location.reload();
            // }, 1000); // 1 second delay
            onclose();
        } catch (error) {
            console.error('Error adding cash payment:', error);
            setErrors(error.response?.data?.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="addCashModal" className="modal fade show" role="dialog" style={{ display: 'block' }}>
            <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
                            <h5 className="modal-title">Add Cash Payment</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label>Project Name<span style={{ color: 'red' }}>*</span></label>
                                <select
                                    name="projectId"
                                    className={`form-control ${errors.projectId ? 'is-invalid' : ''}`}
                                    value={formData.projectId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled hidden>Select Project</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.projectName}</option>
                                    ))}
                                </select>
                                {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Payment Mode<span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        name="paymentModeId"
                                        className={`form-control ${errors.paymentModeId ? 'is-invalid' : ''}`}
                                        value={formData.paymentModeId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled hidden>Select Payment Mode</option>
                                        {paymentModes.map(mode => (
                                            <option key={mode.id} value={mode.id}>{mode.paymentModeName}</option>
                                        ))}
                                    </select>
                                    {errors.paymentModeId && <div className="invalid-feedback">{errors.paymentModeId}</div>}
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Paid To<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="paidTo"
                                        type="text"
                                        className={`form-control ${errors.paidTo ? 'is-invalid' : ''}`}
                                        value={formData.paidTo}
                                        onChange={handleChange}
                                        required
                                        placeholder="Recipient Name"
                                    />
                                    {errors.paidTo && <div className="invalid-feedback">{errors.paidTo}</div>}
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Amount<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="amount"
                                        type="number"
                                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        placeholder="Amount"
                                    />
                                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Date<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="date"
                                        type="date"
                                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description of the transaction"
                                />
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

export default AddCash;
