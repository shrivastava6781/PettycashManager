import React, { useState } from 'react';
import axios from 'axios';

const AddPaymentMode = ({ onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        paymentModeName: '',
        paymentType: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        branch: '',
        username: localStorage.getItem('username'),
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
        if (!formData.paymentModeName) formErrors.paymentModeName = 'Payment Mode Name is required';
        if (!formData.paymentType) formErrors.paymentType = 'Payment Type is required';
        if (formData.paymentType === 'Bank') {
            if (!formData.bankName) formErrors.bankName = 'Bank Name is required';
            if (!formData.accountName) formErrors.accountName = 'Account Name is required';
            if (!formData.accountNumber) formErrors.accountNumber = 'Account Number is required';
            if (!formData.ifscCode) formErrors.ifscCode = 'IFSC Code is required';
            if (!formData.branch) formErrors.branch = 'Branch is required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!validate()) {
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/addPaymentMode`, formData);
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
        <div id="add" className="modal fade show" role="dialog" style={{ display: "block", paddingRight: "17px" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Payment Mode</h5>
                            <button type="button" className="close" onClick={handleClose}>&times;</button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label>Payment Mode Name<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="paymentModeName"
                                    type="text"
                                    className="form-control"
                                    required
                                    placeholder="Payment Mode Name"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Payment Type<span style={{ color: "red" }}>*</span></label>
                                <select
                                    name="paymentType"
                                    className="form-control"
                                    required
                                    onChange={handleChange}
                                >
                                    <option value="">Select Payment Type</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank">Bank</option>
                                </select>
                            </div>
                            {formData.paymentType === 'Bank' && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label>Bank Name<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="bankName"
                                                type="text"
                                                className="form-control"
                                                required
                                                placeholder="Bank Name"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Account Name<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="accountName"
                                                type="text"
                                                className="form-control"
                                                required
                                                placeholder="Account Name"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Account Number<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="accountNumber"
                                                type="text"
                                                className="form-control"
                                                required
                                                placeholder="Account Number"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>IFSC Code<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="ifscCode"
                                                type="text"
                                                className="form-control"
                                                required
                                                placeholder="IFSC Code"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Branch<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="branch"
                                                type="text"
                                                className="form-control"
                                                required
                                                placeholder="Branch"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Submit'}
                            </button>
                            <button type="button" className="btn btn-default" onClick={handleClose}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPaymentMode;
