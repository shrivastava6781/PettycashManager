import React, { useState, useEffect } from "react";
import axios from "axios";

const EditLabour = ({ onClose, onUpdate, labourDetails }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectId: "",
        projectName: "",
        labourId: "",
        labourName: "",
        fatherName: "",
        mobileNo: "",
        gender: "",
        dayShift: "",
        nightShift: "",
        overtimeHrs: "",
        username: localStorage.getItem("username"),
    });
    const [errors, setErrors] = useState({});

    // Pre-fill form data if editing
    useEffect(() => {
        if (labourDetails) {
            setFormData((prevData) => ({ ...prevData, ...labourDetails }));
        }
    }, [labourDetails]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validate form inputs
    const validate = () => {
        const formErrors = {};
        if (!formData.labourName) formErrors.labourName = "Labour Name is required";
        if (!formData.fatherName) formErrors.fatherName = "Father Name is required";
        if (!formData.mobileNo) formErrors.mobileNo = "Mobile Number is required";
        if (!formData.gender) formErrors.gender = "Gender is required";

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
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_LOCAL_URL}/editLabour/${formData.id}`,
                formData
            );
            console.log("Data updated successfully:", response.data);
            onUpdate(); // Refresh parent component data
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000); // 1-second delay
        } catch (error) {
            console.error("Error updating labour:", error);
            setErrors(error.response?.data?.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            id="editLabourModal"
            className="modal fade show"
            role="dialog"
            style={{ display: "block" }}
        >
            <div
                style={{ borderRadius: "20px" }}
                className="modal-dialog modal-lg overflow-hidden"
            >
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        <div
                            style={{ backgroundColor: "#00509d", color: "white" }}
                            className="modal-header"
                        >
                            <h5 className="modal-title">Edit Labour</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div
                            className="modal-body"
                            style={{
                                maxHeight: "calc(100vh - 200px)",
                                overflowY: "auto",
                            }}
                        >
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>
                                        Project Name<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        name="projectName"
                                        type="text"
                                        className="form-control"
                                        value={formData.projectName}
                                        placeholder="Project Name"
                                        readOnly
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Labour ID</label>
                                    <input
                                        name="labourId"
                                        type="text"
                                        className="form-control"
                                        placeholder="Labour Id"
                                        value={formData.labourId}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Labour Details */}
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>
                                        Labour Name<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        name="labourName"
                                        type="text"
                                        className={`form-control ${errors.labourName ? "is-invalid" : ""
                                            }`}
                                        value={formData.labourName}
                                        placeholder="Labour Name"
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.labourName && (
                                        <div className="invalid-feedback">{errors.labourName}</div>
                                    )}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>
                                        Father Name<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        name="fatherName"
                                        type="text"
                                        className={`form-control ${errors.fatherName ? "is-invalid" : ""
                                            }`}
                                        value={formData.fatherName}
                                        placeholder="Father's Name"
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.fatherName && (
                                        <div className="invalid-feedback">{errors.fatherName}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>
                                        Mobile Number<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        name="mobileNo"
                                        type="text"
                                        className={`form-control ${errors.mobileNo ? "is-invalid" : ""
                                            }`}
                                        value={formData.mobileNo}
                                        placeholder="Mobile Number"
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.mobileNo && (
                                        <div className="invalid-feedback">{errors.mobileNo}</div>
                                    )}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>
                                        Gender<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        className={`form-control ${errors.gender ? "is-invalid" : ""
                                            }`}
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled hidden>
                                            Select Gender
                                        </option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.gender && (
                                        <div className="invalid-feedback">{errors.gender}</div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label>Day Shift (Amt)</label>
                                    <input
                                        name="dayShift"
                                        type="number"
                                        className="form-control"
                                        value={formData.dayShift}
                                        placeholder="Amount"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Night Shift (Amt)</label>
                                    <input
                                        name="nightShift"
                                        type="number"
                                        className="form-control"
                                        value={formData.nightShift}
                                        placeholder="Amount"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Overtime Hours</label>
                                    <input
                                        name="overtimeHrs"
                                        type="number"
                                        className="form-control"
                                        value={formData.overtimeHrs}
                                        placeholder='Amount'
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            style={{ backgroundColor: "#00509d", color: "white" }}
                            className="modal-footer"
                        >
                            <button
                                type="submit"
                                className="button_details"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Submit"}
                            </button>
                            <button
                                type="button"
                                className="button_details"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditLabour;
