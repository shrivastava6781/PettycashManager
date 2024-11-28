// import React, { useState } from 'react';
// import axios from 'axios';
// import { ThreeDots } from 'react-loader-spinner';

// const AddDepartmentModal = ({ onClose, onUpdate }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');

//     const { name, description } = formData;

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/departments`, {
//                 name,
//                 description
//             });
//             console.log('Added department successfully:', response.data);

//             onUpdate();
//             setTimeout(() => {
//                 onClose();
//                 window.location.reload();
//             }, 1000); // 1 second delay
//         } catch (error) {
//             console.error('Error adding department:', error);
//             setError('Failed to add department');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleClose = () => {
//         onClose();
//     };

//     return (
//         <div id="addDepartmentModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
//             <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
//                 <div className="modal-content">
//                     <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
//                         <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
//                             <h5 className="modal-title">Add Department</h5>
//                             <button type="button" className="button_details " onClick={handleClose}><i class="fa-solid fa-xmark"></i></button>
//                         </div>
//                         <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//                             {error && <div className="alert alert-danger">{error}</div>}
//                             <div className="form-group">
//                                 <label>Department Name<span style={{ color: "red" }}>*</span></label>
//                                 <input name="name" value={name} onChange={handleChange} type="text" className="form-control" required placeholder="Department Name" />
//                             </div>
//                             <div className="form-group">
//                                 <label>Description</label>
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

// export default AddDepartmentModal;






import React, { useState } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const AddDepartmentModal = ({ onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { name, description } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({ ...errors, [name]: '' }); // Clear error for the current field on change
    };

    const validate = () => {
        const formErrors = {};
        if (!formData.name) formErrors.name = 'Name is required';
        if (!formData.description) formErrors.description = 'Description is required';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        try {
            await axios.post(`${process.env.REACT_APP_LOCAL_URL}/departments`, {
                name,
                description,
            });
            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000); // 1 second delay
        } catch (error) {
            console.error('Error adding department:', error);
            setErrors({ apiError: 'Failed to add department' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="addDepartmentModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg overflow-hidden" style={{ borderRadius: "20px" }}>
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        <div className="modal-header" style={{ backgroundColor: "#00509d", color: "white" }}>
                            <h5 className="modal-title">Add Department</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            {errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}
                            <div className="form-group">
                                <label>Department Name<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Department Name"
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label>Description<span style={{ color: "red" }}>*</span></label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={handleChange}
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    placeholder="Description"
                                ></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                        </div>
                        <div className="modal-footer" style={{ backgroundColor: "#00509d", color: "white" }}>
                            <button type="submit" className="button_details" disabled={isLoading}>
                                {isLoading ? <ThreeDots color="#fff" height={10} width={40} /> : 'Submit'}
                            </button>
                            <button type="button" className="button_details" onClick={onClose}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDepartmentModal;



