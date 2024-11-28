import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const AdminMakeEntry = ({ onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        headId: '',
        description: '',
        amount: '',
        picture: null,
        projectId: '',
        projectName: '',
        supervisorId: '',
        supervisorName: '',
    });
    const [errors, setErrors] = useState({});
    const [heads, setHeads] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [projects, setProjects] = useState([]);

    // Fetch all projects
    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all supervisors
    const fetchSupervisors = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/supervisors`);
            setSupervisors(response.data);
        } catch (error) {
            console.error("Error fetching supervisors:", error);
            toast.error('Failed to fetch supervisors');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch heads
    const fetchHeads = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/heads`);
            setHeads(response.data);
        } catch (error) {
            console.error('Error fetching heads:', error);
            toast.error('Failed to fetch heads');
        }
    };

    useEffect(() => {
        fetchHeads();
        fetchProjects();
        fetchSupervisors();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "headId") {
            const selectedHead = heads.find(head => head.id === parseInt(value));
            setFormData((prevData) => ({
                ...prevData,
                headName: selectedHead ? selectedHead.headName : "",
            }));
        }
    };

    // Handle project selection to check for supervisor association and set projectName
    const handleProjectChange = (e) => {
        const selectedProjectId = e.target.value;
        const selectedProject = projects.find(project => project.id === parseInt(selectedProjectId));

        setFormData(prevData => ({
            ...prevData,
            projectId: selectedProjectId,
            projectName: selectedProject ? selectedProject.projectName : '',
        }));

        // Check if there's a supervisor for the selected project
        const supervisorForProject = supervisors.find(sup => sup.projectId === parseInt(selectedProjectId));

        if (supervisorForProject) {
            setFormData(prevData => ({
                ...prevData,
                supervisorId: supervisorForProject.supervisorId,
                supervisorName: supervisorForProject.employeeName,
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                supervisorId: "",
                supervisorName: 'Admin',
            }));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.2, // Set to 0.2MB for compressed size, adjust as needed
                maxWidthOrHeight: 500, // Adjust dimensions to control quality
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                setFormData({
                    ...formData,
                    picture: compressedFile, // Set compressed file
                });
                toast.success('Image compressed successfully');
            } catch (error) {
                console.error('Error compressing image:', error);
                toast.error('Failed to compress image');
            }
        }
    };
    // Validate the form
    const validateForm = () => {
        const newErrors = {};
        // Add validation logic as needed
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.headId) newErrors.headId = 'Head is required';
        if (!formData.amount) newErrors.amount = 'Amount is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.projectId) newErrors.projectId = 'Project is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if there are no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/makeEntry`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Data uploaded successfully:', response.data);
            toast.success('Entry submitted successfully!');

            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload(); // Reload the page after submission
            }, 1000);
        } catch (error) {
            console.error('Error uploading data:', error);
            toast.error('Failed to submit entry');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="makeentrymodal" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Make Entry</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Select Project<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        name="projectId"
                                        className={`form-control ${errors.projectId ? 'is-invalid' : ''}`}
                                        value={formData.projectId}
                                        onChange={handleProjectChange}
                                        required
                                    >
                                        <option value="" disabled>Select Project</option>
                                        {projects.map(project => (
                                            <option key={project.id} value={project.id}>{project.projectName}</option>
                                        ))}
                                    </select>
                                    {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Supervisor</label>
                                    <input
                                        type="text"
                                        name="supervisorName"
                                        className="form-control"
                                        placeholder='Selected Supervisor'
                                        value={formData.supervisorName}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label>Date<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="date"
                                        type="date"
                                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                        required
                                        placeholder='date'
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Head<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        name="headId"
                                        className={`form-control ${errors.headId ? 'is-invalid' : ''}`}
                                        required
                                        onChange={handleChange}
                                        value={formData.headId}
                                    >
                                        <option value="">Select head</option>
                                        {heads.map((head) => (
                                            <option key={head.id} value={head.id}>
                                                {head.headName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.headId && <div className="invalid-feedback">{errors.headId}</div>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Amount<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="amount"
                                        type="number"
                                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                        required
                                        placeholder='Amount'
                                        value={formData.amount}
                                        onChange={handleChange}
                                    />
                                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description<span style={{ color: "red" }}>*</span></label>
                                <textarea
                                    name="description"
                                    rows="2"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    required
                                    placeholder='Description'
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                            <div className="form-group">
                                <label>Picture</label>
                                <input
                                    name="picture"
                                    type="file"
                                    className="form-control"
                                    required
                                    onChange={handleFileChange}
                                />
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

export default AdminMakeEntry;

