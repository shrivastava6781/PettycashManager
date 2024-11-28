import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications

const AddProjectModal = ({ onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectName: '',
        projectShortName: '',
        projectCode: '',
        employeerName: '',
        companyName: '',
        projectType: '',
        projectAddress: '',
        projectstate: '',
        projectcity: '',
        projectpincode: '',
        picture: null,
        username: localStorage.getItem('username'),
    });

    const [errors, setErrors] = useState({});
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeeResponse, companyResponse, stateResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`),
                    axios.get(`${process.env.REACT_APP_LOCAL_URL}/companies`),
                    axios.get(`${process.env.REACT_APP_LOCAL_URL}/states`),
                ]);

                setEmployees(employeeResponse.data);
                setCompanies(companyResponse.data);
                setStates(stateResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data');
            }
        };

        fetchData();
    }, []);

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


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "companyName") {
            const selectedCompany = companies.find(company => company.companyName === value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                company_id: selectedCompany ? selectedCompany.id : "",
            }));
       } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.projectName) newErrors.projectName = 'Project Name is required';
        if (!formData.projectShortName) newErrors.projectShortName = 'Project Short Name is required';
        if (!formData.projectCode) newErrors.projectCode = 'Project Code is required';
        if (!formData.employeerName) newErrors.employeerName = 'Principal Employer Name is required';
        if (!formData.companyName) newErrors.companyName = 'Company Name is required';
        if (!formData.projectType) newErrors.projectType = 'Project Type is required';
        if (!formData.projectAddress) newErrors.projectAddress = 'Project Address is required';
        if (!formData.projectstate) newErrors.projectstate = 'State is required';
        if (!formData.projectcity) newErrors.projectcity = 'City is required';
        if (!formData.projectpincode) newErrors.projectpincode = 'Pincode is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        console.log("adjf")

        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/projectData`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Data uploaded successfully:', response.data);
            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000); // 1 second delay
        } catch (error) {
            console.error('Error uploading data:', error);
            toast.error('Failed to upload data');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="addcompanytable" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Add Project</h5>
                            <button type="button" className="button_details" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                            <div className="row">
                                <div className="form-group col-md-12">
                                    <label>Project Name<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="projectName"
                                        type="text"
                                        className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
                                        value={formData.projectName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Project Name"
                                    />
                                    {errors.projectName && <small className="invalid-feedback">{errors.projectName}</small>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Project Short Name<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="projectShortName"
                                        type="text"
                                        className={`form-control ${errors.projectShortName ? 'is-invalid' : ''}`}
                                        value={formData.projectShortName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Project Short Name"
                                    />
                                    {errors.projectShortName && <small className="invalid-feedback">{errors.projectShortName}</small>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Project Code<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="projectCode"
                                        type="text"
                                        className={`form-control ${errors.projectCode ? 'is-invalid' : ''}`}
                                        value={formData.projectCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="Project Code"
                                    />
                                    {errors.projectCode && <small className="invalid-feedback">{errors.projectCode}</small>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Company Name<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        name="companyName"
                                        className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled hidden>Select Company</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.companyName}>{company.companyName}</option>
                                        ))}
                                    </select>
                                    {errors.companyName && <small className="invalid-feedback">{errors.companyName}</small>}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Project Type<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        name="projectType"
                                        className={`form-control ${errors.projectType ? 'is-invalid' : ''}`}
                                        value={formData.projectType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled hidden>Select Project Type</option>
                                        <option value="Govt">Govt. Project</option>
                                        <option value="Private">Private Project</option>
                                    </select>
                                    {errors.projectType && <small className="invalid-feedback">{errors.projectType}</small>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Principal Employer Name<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="employeerName"
                                    type="text"
                                    className={`form-control ${errors.employeerName ? 'is-invalid' : ''}`}
                                    value={formData.employeerName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Principal Employer Name"
                                />
                                {errors.employeerName && <small className="invalid-feedback">{errors.employeerName}</small>}
                            </div>
                            <div className="form-group">
                                <label>Project Address<span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="projectAddress"
                                    type="text"
                                    className={`form-control ${errors.projectAddress ? 'is-invalid' : ''}`}
                                    value={formData.projectAddress}
                                    onChange={handleChange}
                                    required
                                    placeholder="Project Address"
                                />
                                {errors.projectAddress && <small className="invalid-feedback">{errors.projectAddress}</small>}
                            </div>
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label>State<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        name="projectstate"
                                        className={`form-control ${errors.projectstate ? 'is-invalid' : ''}`}
                                        value={formData.projectstate}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled hidden>Select State</option>
                                        {states.map(state => (
                                            <option key={state.id} value={state.statename}>{state.statename}</option>
                                        ))}
                                    </select>
                                    {errors.projectstate && <small className="invalid-feedback">{errors.projectstate}</small>}
                                </div>
                                
                                <div className="form-group col-md-4">
                                    <label>City<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="projectcity"
                                        type="text"
                                        className={`form-control ${errors.projectcity ? 'is-invalid' : ''}`}
                                        value={formData.projectcity}
                                        onChange={handleChange}
                                        required
                                        placeholder="City"
                                    />
                                    {errors.projectcity && <small className="invalid-feedback">{errors.projectcity}</small>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Pincode<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="projectpincode"
                                        type="text"
                                        className={`form-control ${errors.projectpincode ? 'is-invalid' : ''}`}
                                        value={formData.projectpincode}
                                        onChange={handleChange}
                                        required
                                        placeholder="Pincode"
                                    />
                                    {errors.projectpincode && <small className="invalid-feedback">{errors.projectpincode}</small>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Upload Picture</label>
                                <input name="picture" type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                            </div>
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

export default AddProjectModal;
















  