import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import axios from 'axios';

const AddLabour = ({ onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectId: '',
        projectName: '',
        labourId: '',
        labourName: '',
        fatherName: '',
        mobileNo: '',
        gender: '',
        dayShift: '',
        nightShift: '',
        halfDayShift: '',
        overtimeHrs: '',
        picture: null,
        username: localStorage.getItem('username'),
    });

    const [projects, setProjects] = useState([]);
    const [errors, setErrors] = useState({});
    const [lastLabourId, setLastLabourId] = useState(0);

    // Fetch projects and labour last ID
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, labourResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`),
                    axios.get(`${process.env.REACT_APP_LOCAL_URL}/labours/lastId`),
                ]);
                setProjects(projectsResponse.data);
                const lastId = labourResponse.data.lastId || 0;
                setLastLabourId(lastId);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Update Labour ID based on the last ID
    useEffect(() => {
        const newLabourId = `LAB${String(lastLabourId + 1).padStart(3, '0')}`;
        setFormData((prevData) => ({
            ...prevData,
            labourId: newLabourId,
        }));
    }, [lastLabourId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'projectId') {
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                setFormData((prevData) => ({
                    ...prevData,
                    picture: compressedFile,
                }));
                toast.success('Image compressed successfully');
            } catch (error) {
                console.error('Error compressing image:', error);
                toast.error('Failed to compress image');
            }
        }
    };

    // Validate form inputs
    const validate = () => {
        const formErrors = {};
        if (!formData.projectId) formErrors.projectId = 'Project is required';
        if (!formData.labourName) formErrors.labourName = 'Labour Name is required';
        if (!formData.fatherName) formErrors.fatherName = 'Father Name is required';
        if (!formData.mobileNo) formErrors.mobileNo = 'Mobile Number is required';
        if (!formData.gender) formErrors.gender = 'Gender is required';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // Handle form submission


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validate()) {
            setIsLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/addLabour`, formDataToSend);
            console.log('Data uploaded successfully:', response.data);
            onUpdate();
            onClose();
            setTimeout(() => {
                onClose();
                window.location.reload(); // Reload the page after submission
            }, 1000);
        } catch (error) {
            console.error('Error uploading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="addLabourModal" className="modal fade show" role="dialog" style={{ display: 'block' }}>
            <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
                            <h5 className="modal-title">Add Labour</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            {/* Project Selection */}
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Project Name<span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        name="projectId"
                                        className={`form-control ${errors.projectId ? 'is-invalid' : ''}`}
                                        value={formData.projectId}
                                        onChange={handleChange}
                                        placeholder='Project Name'
                                        required
                                    >
                                        <option value="" disabled hidden>Select Project</option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.projectName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Labour ID</label>
                                    <input
                                        name="labourId"
                                        type="text"
                                        className="form-control"
                                        placeholder='Labour Id'
                                        value={formData.labourId}
                                        readOnly
                                    />
                                </div>
                            </div>


                            {/* Labour Details */}
                            <div className="row">

                                <div className="form-group col-md-6">
                                    <label>Labour Name<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="labourName"
                                        type="text"
                                        className={`form-control ${errors.labourName ? 'is-invalid' : ''}`}
                                        value={formData.labourName}
                                        placeholder='Labour Name'
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.labourName && <div className="invalid-feedback">{errors.labourName}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Father Name<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="fatherName"
                                        type="text"
                                        className={`form-control ${errors.fatherName ? 'is-invalid' : ''}`}
                                        value={formData.fatherName}
                                        placeholder="Father's Name"
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.fatherName && <div className="invalid-feedback">{errors.fatherName}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Mobile Number<span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        name="mobileNo"
                                        type="text"
                                        className={`form-control ${errors.mobileNo ? 'is-invalid' : ''}`}
                                        value={formData.mobileNo}
                                        placeholder='Mobile Number'
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.mobileNo && <div className="invalid-feedback">{errors.mobileNo}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Gender<span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        name="gender"
                                        className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled hidden>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="row">
                                <div className="form-group col-md-3">
                                    <label>Day Shift (Amt)</label>
                                    <input
                                        name="dayShift"
                                        type="number"
                                        className="form-control"
                                        value={formData.dayShift}
                                        placeholder='Amount'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Night Shift (Amt)</label>
                                    <input
                                        name="nightShift"
                                        type="number"
                                        className="form-control"
                                        value={formData.nightShift}
                                        placeholder='Amount'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Half Day (Amt)</label>
                                    <input
                                        name="halfDayShift"
                                        type="number"
                                        className="form-control"
                                        value={formData.halfDayShift}
                                        placeholder='Amount'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Overtime (Amt per Hrs)</label>
                                    <input
                                        name="overtimeHrs"
                                        type="number"
                                        className="form-control"
                                        value={formData.overtimeHrs}
                                        placeholder='Amount'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-12">
                                    <label>Labour Image</label>
                                    <input name="picture" type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
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

export default AddLabour;
