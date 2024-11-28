// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EditPayment = ({ paymentMode, onClose, onUpdate }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         paymentModeName: '',
//         paymentType: '',
//         bankName: '',
//         accountName: '',
//         accountNumber: '',
//         ifscCode: '',
//         branch: '',
//         username: localStorage.getItem('username'),
//     });
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         if (paymentMode) {
//             setFormData({ ...paymentMode });  // Initialize form data with paymentMode prop
//         }
//     }, [paymentMode]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     const validate = () => {
//         let formErrors = {};
//         if (!formData.paymentModeName) formErrors.paymentModeName = 'Payment Mode Name is required';
//         if (!formData.paymentType) formErrors.paymentType = 'Payment Type is required';
//         if (formData.paymentType === 'Bank') {
//             if (!formData.bankName) formErrors.bankName = 'Bank Name is required';
//             if (!formData.accountName) formErrors.accountName = 'Account Name is required';
//             if (!formData.accountNumber) formErrors.accountNumber = 'Account Number is required';
//             if (!formData.ifscCode) formErrors.ifscCode = 'IFSC Code is required';
//             if (!formData.branch) formErrors.branch = 'Branch is required';
//         }

//         setErrors(formErrors);
//         return Object.keys(formErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         if (!validate()) {
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/EditPayment/${paymentMode.id}`, formData);
//             console.log('Data uploaded successfully:', response.data);

//             onUpdate();
//             setTimeout(() => {
//                 onClose();
//                 window.location.reload();
//             }, 1000); // 1 second delay
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
//         <div id="add" className="modal fade show" role="dialog" style={{ display: "block", paddingRight: "17px" }}>
//             <div className="modal-dialog modal-lg">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Edit Payment Mode</h5>
//                             <button type="button" className="close" onClick={handleClose}>&times;</button>
//                         </div>
//                         <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//                             <div className="form-group">
//                                 <label>Payment Mode Name<span style={{ color: "red" }}>*</span></label>
//                                 <input
//                                     name="paymentModeName"
//                                     type="text"
//                                     className="form-control"
//                                     required
//                                     placeholder="Payment Mode Name"
//                                     value={formData.paymentModeName} // Bind value to formData
//                                     onChange={handleChange}
//                                 />
//                                 {errors.paymentModeName && <small className="invalid-feedback">{errors.paymentModeName}</small>}
//                             </div>
//                             <div className="form-group">
//                                 <label>Payment Type<span style={{ color: "red" }}>*</span></label>
//                                 <select
//                                     name="paymentType"
//                                     className="form-control"
//                                     required
//                                     value={formData.paymentType} // Bind value to formData
//                                     onChange={handleChange}
//                                 >
//                                     <option value="">Select Payment Type</option>
//                                     <option value="Cash">Cash</option>
//                                     <option value="Bank">Bank</option>
//                                 </select>
//                                 {errors.paymentType && <small className="invalid-feedback">{errors.paymentType}</small>}
//                             </div>
//                             {formData.paymentType === 'Bank' && (
//                                 <>
//                                     <div className="form-row">
//                                         <div className="form-group col-md-6">
//                                             <label>Bank Name<span style={{ color: "red" }}>*</span></label>
//                                             <input
//                                                 name="bankName"
//                                                 type="text"
//                                                 className="form-control"
//                                                 required
//                                                 placeholder="Bank Name"
//                                                 value={formData.bankName} // Bind value to formData
//                                                 onChange={handleChange}
//                                             />
//                                             {errors.bankName && <small className="invalid-feedback">{errors.bankName}</small>}
//                                         </div>
//                                         <div className="form-group col-md-6">
//                                             <label>Account Name<span style={{ color: "red" }}>*</span></label>
//                                             <input
//                                                 name="accountName"
//                                                 type="text"
//                                                 className="form-control"
//                                                 required
//                                                 placeholder="Account Name"
//                                                 value={formData.accountName} // Bind value to formData
//                                                 onChange={handleChange}
//                                             />
//                                             {errors.accountName && <small className="invalid-feedback">{errors.accountName}</small>}
//                                         </div>
//                                         <div className="form-group col-md-6">
//                                             <label>Account Number<span style={{ color: "red" }}>*</span></label>
//                                             <input
//                                                 name="accountNumber"
//                                                 type="text"
//                                                 className="form-control"
//                                                 required
//                                                 placeholder="Account Number"
//                                                 value={formData.accountNumber} // Bind value to formData
//                                                 onChange={handleChange}
//                                             />
//                                             {errors.accountNumber && <small className="invalid-feedback">{errors.accountNumber}</small>}
//                                         </div>
//                                         <div className="form-group col-md-6">
//                                             <label>IFSC Code<span style={{ color: "red" }}>*</span></label>
//                                             <input
//                                                 name="ifscCode"
//                                                 type="text"
//                                                 className="form-control"
//                                                 required
//                                                 placeholder="IFSC Code"
//                                                 value={formData.ifscCode} // Bind value to formData
//                                                 onChange={handleChange}
//                                             />
//                                             {errors.ifscCode && <small className="invalid-feedback">{errors.ifscCode}</small>}
//                                         </div>
//                                         <div className="form-group col-md-6">
//                                             <label>Branch<span style={{ color: "red" }}>*</span></label>
//                                             <input
//                                                 name="branch"
//                                                 type="text"
//                                                 className="form-control"
//                                                 required
//                                                 placeholder="Branch"
//                                                 value={formData.branch} // Bind value to formData
//                                                 onChange={handleChange}
//                                             />
//                                             {errors.branch && <small className="invalid-feedback">{errors.branch}</small>}
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                         <div className="modal-footer">
//                             <button type="submit" className="btn btn-primary" disabled={isLoading}>
//                                 {isLoading ? 'Loading...' : 'Update'}
//                             </button>
//                             <button type="button" className="btn btn-default" onClick={handleClose}>Close</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPayment;









import React, { useState,useEffect } from 'react';
import axios from 'axios';

const EditPayment = ({ paymentMode, onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        paymentModeName: '',
        paymentType: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        branch: '',
        username: localStorage.getItem('username') || '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    useEffect(() => {
        if (paymentMode) {
            setFormData({ ...paymentMode });  // Initialize form data with paymentMode prop
        }
    }, [paymentMode]);

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
        if (!validate()) return;

        setIsLoading(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/EditPayment/${paymentMode.id}`, formData);
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

    return (
        <div id="add" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg" style={{ borderRadius: "20px" }}>
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        <div className="modal-header" style={{ backgroundColor: "#00509d", color: "white" }}>
                            <h5 className="modal-title">Add Payment Mode</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label>Payment Mode Name<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="paymentModeName"
                                    type="text"
                                    className={`form-control ${errors.paymentModeName ? 'is-invalid' : ''}`}
                                    placeholder="Payment Mode Name"
                                    onChange={handleChange}
                                    value={formData.paymentModeName}
                                />
                                {errors.paymentModeName && <div className="invalid-feedback">{errors.paymentModeName}</div>}
                            </div>
                            <div className="form-group">
                                <label>Payment Type<span style={{ color: "red" }}>*</span></label>
                                <select
                                    name="paymentType"
                                    className={`form-control ${errors.paymentType ? 'is-invalid' : ''}`}
                                    onChange={handleChange}
                                    value={formData.paymentType}
                                >
                                    <option value="">Select Payment Type</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank">Bank</option>
                                </select>
                                {errors.paymentType && <div className="invalid-feedback">{errors.paymentType}</div>}
                            </div>
                            {formData.paymentType === 'Bank' && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label>Bank Name<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="bankName"
                                                type="text"
                                                className={`form-control ${errors.bankName ? 'is-invalid' : ''}`}
                                                placeholder="Bank Name"
                                                onChange={handleChange}
                                                value={formData.bankName}
                                            />
                                            {errors.bankName && <div className="invalid-feedback">{errors.bankName}</div>}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Account Name<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="accountName"
                                                type="text"
                                                className={`form-control ${errors.accountName ? 'is-invalid' : ''}`}
                                                placeholder="Account Name"
                                                onChange={handleChange}
                                                value={formData.accountName}
                                            />
                                            {errors.accountName && <div className="invalid-feedback">{errors.accountName}</div>}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>Account Number<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="accountNumber"
                                                type="text"
                                                className={`form-control ${errors.accountNumber ? 'is-invalid' : ''}`}
                                                placeholder="Account Number"
                                                onChange={handleChange}
                                                value={formData.accountNumber}
                                            />
                                            {errors.accountNumber && <div className="invalid-feedback">{errors.accountNumber}</div>}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>IFSC Code<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="ifscCode"
                                                type="text"
                                                className={`form-control ${errors.ifscCode ? 'is-invalid' : ''}`}
                                                placeholder="IFSC Code"
                                                onChange={handleChange}
                                                value={formData.ifscCode}
                                            />
                                            {errors.ifscCode && <div className="invalid-feedback">{errors.ifscCode}</div>}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>Branch<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                name="branch"
                                                type="text"
                                                className={`form-control ${errors.branch ? 'is-invalid' : ''}`}
                                                placeholder="Branch"
                                                onChange={handleChange}
                                                value={formData.branch}
                                            />
                                            {errors.branch && <div className="invalid-feedback">{errors.branch}</div>}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer" style={{ backgroundColor: "#00509d", color: "white" }}>
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

export default EditPayment;




