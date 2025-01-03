import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const AddSupervisor = ({ onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        projectId: '',
        supervisorId: '',
        appointmentDate: '',
        projectName: '',
        projectShortName: '',
        projectCode: '',
        employeerName: '',
        projectType: '',
        projectAddress: '',
        projectstate: '',
        projectcity: '',
        projectpincode: '',
        employeeName: '',
        employeeCode: '',
        employeeEmail: '',
        employeePhone: '',
        fatherName: '',
        employeePanAddhar: '',
        departmentName: '',
        departmentId: '',
        designationName: '',
        designationId: '',
        username: localStorage.getItem('username'),
    });
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projectDetails, setProjectDetails] = useState(null);
    const [supervisorDetails, setSupervisorDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch all data in parallel
            const [projectResponse, employeeResponse, supervisorResponse] = await Promise.all([
              axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`),
              axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`),
              axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/supervisors`) // Fetch supervisors with projectId and supervisorId
            ]);
      
            const allProjects = projectResponse.data;     // All projects
            const allEmployees = employeeResponse.data;   // All employees
            const supervisors = supervisorResponse.data;  // Supervisors data with projectId and supervisorId
      
            // Filter projects and employees based on supervisors' assignments
            const availableProjects = allProjects.filter((project) =>
              !supervisors.some((supervisor) => supervisor.projectId === project.id)
            );
      
            const availableEmployees = allEmployees.filter((employee) =>
              !supervisors.some((supervisor) => supervisor.supervisorId === employee.id)
            );
      
            // Set the filtered projects and employees in state
            setProjects(availableProjects);
            setEmployees(availableEmployees);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);
      

      
    const handleProjectChange = (e) => {
        const selectedProjectId = e.target.value;
        const selectedProject = projects.find(project => String(project.id) === selectedProjectId);

        if (selectedProject) {
            setFormData({
                ...formData,
                projectId: selectedProjectId,
                projectName: selectedProject.projectName,
                projectShortName: selectedProject.projectShortName,
                projectCode: selectedProject.projectCode,
                employeerName: selectedProject.employeerName,
                projectType: selectedProject.projectType,
                projectAddress: selectedProject.projectAddress,
                projectstate: selectedProject.projectstate,
                projectcity: selectedProject.projectcity,
                projectpincode: selectedProject.projectpincode,
                employeePicture: selectedProject.picture
            });
            setProjectDetails(selectedProject);
        }
    };

    const handleSupervisorChange = (e) => {
        const selectedEmployeeId = e.target.value;
        const selectedEmployee = employees.find(employee => String(employee.id) === selectedEmployeeId);

        if (selectedEmployee) {
            setFormData({
                ...formData,
                supervisorId: selectedEmployeeId,
                employeeName: selectedEmployee.employeeName,
                employeeCode: selectedEmployee.employeeCode,
                employeeEmail: selectedEmployee.employeeEmail,
                employeePhone: selectedEmployee.employeePhone,
                fatherName: selectedEmployee.fatherName,
                employeePanAddhar: selectedEmployee.employeePanAddhar,
                departmentName: selectedEmployee.departmentName,
                departmentId: selectedEmployee.departmentId,
                designationName: selectedEmployee.designationName,
                designationId: selectedEmployee.designationId,
                projectPicture: selectedEmployee.picture,
            });
            setSupervisorDetails(selectedEmployee);
        }
    };

    const handleDateChange = (e) => {
        setFormData({ ...formData, appointmentDate: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectId) newErrors.projectId = 'Project is required';
        if (!formData.supervisorId) newErrors.supervisorId = 'Supervisor is required';
        if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            await axios.post(`${process.env.REACT_APP_LOCAL_URL}/assignSupervisor`, formData);
            onUpdate();
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div id="addSupervisorModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
            <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
                            <h5 className="modal-title">Assign Supervisor</h5>
                            <button type="button" className="button_details" onClick={handleClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
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
                                    <label>Select Supervisor<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        name="supervisorId"
                                        className={`form-control ${errors.supervisorId ? 'is-invalid' : ''}`}
                                        value={formData.supervisorId}
                                        onChange={handleSupervisorChange}
                                        required
                                    >
                                        <option value="" disabled>Select Supervisor</option>
                                        {employees.map(employee => (
                                            <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
                                        ))}
                                    </select>
                                    {errors.supervisorId && <div className="invalid-feedback">{errors.supervisorId}</div>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    {projectDetails && (
                                        <div style={{ borderRadius: "20px" }} className="project-details border p-3">
                                            <h6 className='fw-bolder border-bottom pb-1'>Project Details</h6>
                                            <div className='lh-base'>
                                                <p className='p-0 m-0'><strong>Code:</strong> {projectDetails.projectCode}</p>
                                                <p className='p-0 m-0'><strong>Type:</strong> {projectDetails.projectType}</p>
                                                <p className='p-0 m-0'><strong>Employeer Name:</strong> {projectDetails.employeerName}</p>
                                                <p className='p-0 m-0'><strong>Address:</strong> {projectDetails.projectAddress}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="form-group col-md-6">
                                    {supervisorDetails && (
                                        <div style={{ borderRadius: "20px" }} className="supervisor-details border p-3">
                                            <h6 className='fw-bolder border-bottom pb-1'>Supervisor Details</h6>
                                            <div className='lh-base'>
                                                <p className='p-0 m-0'><strong>Code:</strong> {supervisorDetails.employeeCode}</p>
                                                <p className='p-0 m-0'><strong>Department:</strong> {supervisorDetails.departmentName}</p>
                                                <p className='p-0 m-0'><strong>Email:</strong> {supervisorDetails.employeeEmail}</p>
                                                <p className='p-0 m-0'><strong>Phone:</strong> {supervisorDetails.employeePhone}</p>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Appointment Date<span style={{ color: "red" }}>*</span></label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                                    value={formData.appointmentDate}
                                    onChange={handleDateChange}
                                    required
                                />
                                {errors.appointmentDate && <div className="invalid-feedback">{errors.appointmentDate}</div>}
                            </div>
                        </div>
                        <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
                            <button type="submit" className="button_details" disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Submit'}
                            </button>
                            <button type="button" className="button_details" onClick={handleClose}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSupervisor;














