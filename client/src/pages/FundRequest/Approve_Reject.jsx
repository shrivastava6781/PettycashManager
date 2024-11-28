// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

// const Approve_Reject = ({ fundRequest, onClose, onUpdate }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         projectId: '',
//         supervisorId: '',
//         projectName: '',
//         supervisorName: '',
//         employeeName: '',
//         requestdate: '', // Fixed field name to match the backend
//         requestAmount: '',
//         paidAmount: '',
//         paymentDate: '',
//         reason: '',
//         status: '', // New field for status (Approve/Reject)
//     });
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         if (fundRequest) {
//             setFormData({ ...fundRequest });
//         }
//     }, [fundRequest]);

//     // Handle input change for form fields
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     // Validate form fields
//     const validate = () => {
//         const newErrors = {};
//         if (!formData.status) newErrors.status = 'Status is required';
//         if (!formData.reason) newErrors.reason = 'Reason is required';
//         if (!formData.paidAmount) newErrors.paidAmount = 'Paid Amount is required';
//         if (!formData.paymentDate) newErrors.paymentDate = 'Payment Date is required';
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validate()) return;

//         setIsLoading(true);

//         try {
//             // Make the API call for approval/rejection
//             const approveRejectResponse = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/approvereject/${formData.id}`, {
//                 status: formData.status,
//                 reason: formData.reason,
//                 paidAmount: formData.paidAmount,
//                 paymentDate: formData.paymentDate,
//             });
//             console.log('Fund request submitted successfully:', approveRejectResponse.data);

//             onUpdate(); // Trigger parent component update
//             toast.success('Fund request submitted successfully!');
//             // Delay to close the modal after a short interval
//             setTimeout(() => {
//                 onClose(); // Close modal
//             }, 1000);
//         } catch (error) {
//             console.error('Error submitting fund request:', error);
//             toast.error('Failed to submit fund request');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
//     };

//     return (
//         <div id="addfundrequestmodal" className="modal fade show" role="dialog" style={{ display: 'block' }}>
//             <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} autoComplete="off" noValidate>
//                         <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
//                             <h5 className="modal-title">Approve / Reject</h5>
//                             <button type="button" className="button_details" onClick={onClose}>
//                                 <i className="fa-solid fa-xmark"></i>
//                             </button>
//                         </div>
//                         <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//                             <div className="row">
//                                 <div className="form-group col-md-6">
//                                     <label>Project Name<span style={{ color: 'red' }}>*</span></label>
//                                     <input
//                                         name="projectName"
//                                         type="text"
//                                         className="form-control"
//                                         readOnly
//                                         value={formData.projectName}
//                                     />
//                                 </div>
//                                 <div className="form-group col-md-6">
//                                     <label>Supervisor Name<span style={{ color: 'red' }}>*</span></label>
//                                     <input
//                                         name="supervisorName"
//                                         type="text"
//                                         className="form-control"
//                                         readOnly
//                                         value={formData.supervisorName}
//                                     />
//                                 </div>
//                                 <div className="form-group col-md-6">
//                                     <label>Date<span style={{ color: 'red' }}>*</span></label>
//                                     <input
//                                         name="requestdate"
//                                         type="text"
//                                         className="form-control"
//                                         readOnly
//                                         value={formatDate(formData.requestdate)}
//                                     />
//                                     {errors.date && <div className="invalid-feedback">{errors.date}</div>}
//                                 </div>
//                                 <div className="form-group col-md-6">
//                                     <label>Request Amount<span style={{ color: 'red' }}>*</span></label>
//                                     <input
//                                         name="requestAmount"
//                                         type="number"
//                                         className="form-control"
//                                         required
//                                         placeholder="Request Amount"
//                                         onChange={handleChange}
//                                         value={formData.requestAmount}
//                                         readOnly
//                                     />
//                                 </div>
//                                 <div className="form-group col-md-4">
//                                     <label>Payment Date<span style={{ color: 'red' }}>*</span></label>
//                                     <input
//                                         name="paymentDate"
//                                         type="date"
//                                         className={`form-control ${errors.paymentDate ? 'is-invalid' : ''}`}
//                                         required
//                                         onChange={handleChange}
//                                         value={formData.paymentDate}
//                                     />
//                                     {errors.paymentDate && <div className="invalid-feedback">{errors.paymentDate}</div>}
//                                 </div>
//                                 <div className="form-group col-md-4">
//                                     <label>Paid Amount<span style={{ color: 'red' }}>*</span></label>
//                                     <input
//                                         name="paidAmount"
//                                         type="number"
//                                         className="form-control"
//                                         required
//                                         placeholder="Paid Amount"
//                                         onChange={handleChange}
//                                         value={formData.paidAmount}
//                                     />
//                                     {errors.paidAmount && <div className="invalid-feedback">{errors.paidAmount}</div>}
//                                 </div>
//                                 <div className="form-group col-md-4">
//                                     <label>Status<span style={{ color: 'red' }}>*</span></label>
//                                     <select
//                                         name="status"
//                                         className={`form-control ${errors.status ? 'is-invalid' : ''}`}
//                                         required
//                                         onChange={handleChange}
//                                         value={formData.status}
//                                     >
//                                         <option value="">Select Action</option>
//                                         <option value="Approved">Approve</option>
//                                         <option value="Rejected">Reject</option>
//                                     </select>
//                                     {errors.status && <div className="invalid-feedback">{errors.status}</div>}
//                                 </div>
//                             </div>
//                             <div className="form-group">
//                                 <label>Reason<span style={{ color: 'red' }}>*</span></label>
//                                 <textarea
//                                     name="reason"
//                                     className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
//                                     required
//                                     placeholder="Reason"
//                                     onChange={handleChange}
//                                     value={formData.reason}
//                                 />
//                                 {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
//                             </div>
//                         </div>
//                         <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-footer">
//                             <button type="submit" className="btn btn-light" disabled={isLoading}>
//                                 {isLoading ? 'Submitting...' : 'Submit'}
//                             </button>
//                             <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Approve_Reject;








import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const Approve_Reject = ({ fundRequest, onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectId: '',
        supervisorId: '',
        projectName: '',
        supervisorName: '',
        employeeName: '',
        requestdate: '', // Fixed field name to match the backend
        requestAmount: '',
        paidAmount: '',
        paymentDate: '',
        reason: '',
        status: '', // New field for status (Approve/Reject)
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (fundRequest) {
            setFormData({ ...fundRequest });
        }
    }, [fundRequest]);

    // Handle input change for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

// Validate form fields
const validate = () => {
    const newErrors = {};
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (!formData.status) newErrors.status = 'Status is required'; // Corrected line
    if (!formData.paidAmount) newErrors.paidAmount = 'Paid Amount is required';
    if (!formData.paymentDate) newErrors.paymentDate = 'Payment Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            // Make the API call for approval/rejection
            const approveRejectResponse = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/approvereject/${formData.id}`, {
                status: formData.status,
                reason: formData.reason,
                paidAmount: formData.paidAmount,
                paymentDate: formData.paymentDate,
            });
            console.log('Fund request submitted successfully:', approveRejectResponse.data);

            onUpdate(); // Trigger parent component update
            // Delay to close the modal after a short interval
            setTimeout(() => {
                onClose();
                window.location.reload(); // Reload the page after submission
              }, 1000);
        } catch (error) {
            console.error('Error submitting fund request:', error);
            toast.error('Failed to submit fund request');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    return (
        <div id="addfundrequestmodal" className="modal fade show" role="dialog" style={{ display: 'block' }}>
            <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
                            <h5 className="modal-title">Approve / Reject</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Project Name<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="projectName"
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={formData.projectName}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Supervisor Name<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="supervisorName"
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={formData.supervisorName}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Date<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="requestdate"
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={new Date(formData.requestdate).toLocaleDateString('en-GB')}
                                    />
                                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Request Amount<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="requestAmount"
                                        type="number"
                                        className="form-control"
                                        required
                                        placeholder="Request Amount"
                                        onChange={handleChange}
                                        value={formData.requestAmount}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group col-md-4">
                                    <label>Payment Date<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="paymentDate"
                                        type="date"
                                        className={`form-control ${errors.paymentDate ? 'is-invalid' : ''}`}
                                        required
                                        onChange={handleChange}
                                        value={formData.paymentDate}
                                    />
                                    {errors.paymentDate && <div className="invalid-feedback">{errors.paymentDate}</div>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Paid Amount<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="paidAmount"
                                        type="number"
                                        className={`form-control ${errors.paidAmount ? 'is-invalid' : ''}`}
                                        required
                                        placeholder="Paid Amount"
                                        onChange={handleChange}
                                        value={formData.paidAmount}
                                    />
                                    {errors.paidAmount && <div className="invalid-feedback">{errors.paidAmount}</div>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Status<span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        name="status"
                                        className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                        required
                                        onChange={handleChange}
                                        value={formData.status}
                                    >
                                        <option value="">Select Action</option>
                                        <option value="Approved">Approve</option>
                                        <option value="Rejected">Reject</option>
                                    </select>
                                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Reason<span style={{ color: 'red' }}>*</span></label>
                                    <textarea
                                        name="reason"
                                        className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                                        required
                                        placeholder="Reason"
                                        onChange={handleChange}
                                        value={formData.reason}
                                    />
                                    {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-footer">
                            <button type="submit" className="btn btn-light" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Approve_Reject;


