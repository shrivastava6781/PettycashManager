// import React, { useState, useEffect } from 'react';
// import { ThreeDots } from 'react-loader-spinner'; // <-- Correct import for spinner
// import axios from 'axios';

// const EditCompany = ({ onClose, onUpdate,company }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         companyName: '',
//         companyAddress: '',
//         companyEmail: '',
//         companyPhone: '',
//         username: localStorage.getItem('username'),
//     });
//     const [errors, setErrors] = useState({});
//     // Pre-fill form data if editing
//     useEffect(() => {
//         if (company) {
//             setFormData({ ...company });
//         }
//     }, [company]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     const validate = () => {
//         let formErrors = {};
//         setErrors(formErrors);
//         return Object.keys(formErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         console.log('Form submitted:', formData);
//         if (!validate()) {
//             setIsLoading(false);
//             return;
//         }
//         try {
//             const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/updateCompany/${formData.id}`, formData);
//             console.log('Data updated successfully:', response.data);
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
//         <div id="addModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
//             <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
//                         <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
//                             <h5 className="modal-title">Add Company</h5>
//                             <button type="button" className="button_details " onClick={handleClose}>
//                                 <i className="fa-solid fa-xmark"></i>
//                             </button>
//                         </div>
//                         <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//                             <div className="form-group">
//                                 <label>Company Name<span style={{ color: "red" }}>*</span></label>
//                                 <input
//                                     name="companyName"
//                                     type="text"
//                                     className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
//                                     required
//                                     value={formData.companyName}
//                                     placeholder="Company Name"
//                                     onChange={handleChange}
//                                 />
//                                 {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
//                             </div>
//                             <div className="form-row">
//                                 <div className="form-group col-md-6">
//                                     <label>Company Email<span style={{ color: "red" }}>*</span></label>
//                                     <input
//                                         name="companyEmail"
//                                         type="email"
//                                         className={`form-control ${errors.companyEmail ? 'is-invalid' : ''}`}
//                                         required
//                                         value={formData.companyEmail}
//                                         placeholder="Company Email"
//                                         onChange={handleChange}
//                                     />
//                                     {errors.companyEmail && <div className="invalid-feedback">{errors.companyEmail}</div>}
//                                 </div>
//                                 <div className="form-group col-md-6">
//                                     <label>Company Phone<span style={{ color: "red" }}>*</span></label>
//                                     <input
//                                         name="companyPhone"
//                                         type="text"
//                                         className={`form-control ${errors.companyPhone ? 'is-invalid' : ''}`}
//                                         required
//                                         value={formData.companyPhone}
//                                         placeholder="Company Phone"
//                                         onChange={handleChange}
//                                     />
//                                     {errors.companyPhone && <div className="invalid-feedback">{errors.companyPhone}</div>}
//                                 </div>
//                             </div>
//                             <div className="form-group">
//                                 <label>Company Address<span style={{ color: "red" }}>*</span></label>
//                                 <input
//                                     name="companyAddress"
//                                     type="text"
//                                     className={`form-control ${errors.companyAddress ? 'is-invalid' : ''}`}
//                                     required
//                                     value={formData.companyAddress}
//                                     placeholder="Company Address"
//                                     onChange={handleChange}
//                                 />
//                                 {errors.companyAddress && <div className="invalid-feedback">{errors.companyAddress}</div>}
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

// export default EditCompany;



import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';

const EditCompany = ({ onClose, onUpdate, company }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        companyAddress: '',
        companyEmail: '',
        companyPhone: '',
        username: localStorage.getItem('username'),
    });
    const [errors, setErrors] = useState({});

    // Pre-fill form data if editing
    useEffect(() => {
        if (company) {
            setFormData({ ...company });
        }
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let formErrors = {};
        if (!formData.companyName.trim()) formErrors.companyName = 'Company name is required';
        if (!formData.companyEmail.trim()) formErrors.companyEmail = 'Company email is required';
        if (!formData.companyPhone.trim()) formErrors.companyPhone = 'Company phone is required';
        if (!formData.companyAddress.trim()) formErrors.companyAddress = 'Company address is required';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!validate()) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/updateCompany/${formData.id}`, formData);
            console.log('Data updated successfully:', response.data);
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
        <div id="addModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Add Company</h5>
                            <button type="button" className="button_details" onClick={handleClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label>Company Name<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="companyName"
                                    type="text"
                                    className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                    value={formData.companyName}
                                    placeholder="Company Name"
                                    onChange={handleChange}
                                />
                                {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Company Email<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="companyEmail"
                                        type="email"
                                        className={`form-control ${errors.companyEmail ? 'is-invalid' : ''}`}
                                        value={formData.companyEmail}
                                        placeholder="Company Email"
                                        onChange={handleChange}
                                    />
                                    {errors.companyEmail && <div className="invalid-feedback">{errors.companyEmail}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Company Phone<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="companyPhone"
                                        type="text"
                                        className={`form-control ${errors.companyPhone ? 'is-invalid' : ''}`}
                                        value={formData.companyPhone}
                                        placeholder="Company Phone"
                                        onChange={handleChange}
                                    />
                                    {errors.companyPhone && <div className="invalid-feedback">{errors.companyPhone}</div>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Company Address<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="companyAddress"
                                    type="text"
                                    className={`form-control ${errors.companyAddress ? 'is-invalid' : ''}`}
                                    value={formData.companyAddress}
                                    placeholder="Company Address"
                                    onChange={handleChange}
                                />
                                {errors.companyAddress && <div className="invalid-feedback">{errors.companyAddress}</div>}
                            </div>
                        </div>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
                            <button type="submit" className="button_details" disabled={isLoading}>
                                {isLoading ? <ThreeDots height="20" width="20" color="white" /> : 'Submit'}
                            </button>
                            <button type="button" className="button_details" onClick={handleClose}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCompany;
