import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProject from "./EditProject";
import myImage from '../../images/employee_profile.png';

const ProjectDesc = ({ project, onClose }) => {
    const [projectHistory, setProjectHistory] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchProjectHistory = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_LOCAL_URL}/api/project/history/${project.id}`
                );
                setProjectHistory(response.data);
            } catch (error) {
                console.error("Error fetching project history:", error);
            }
        };

        fetchProjectHistory();
    }, [project]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleEditProject = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };
    const handleDownload = async (fileUrl, fileName) => {
        console.log(fileUrl);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/download/${fileUrl}`, {
                responseType: 'blob' // Ensure response is treated as binary data
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = projectHistory.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="card-body p-4 rounded bg-white shadow-sm">
                <div className="row">
                    <div className="col-md-9 d-flex  justify-content-between px-3">
                        <div>
                            <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder font-bold m-0">
                                {project.projectName}
                            </h2>
                            <small>Created By - {project.username || "N/A"}</small>
                        </div>

                        <div>
                            <p className="m-0">
                                <i className="fa fa-building"></i> <span> code: {project.projectCode || "N/A"}</span>
                            </p>
                            <p className="m-0">
                                <i class="fas fa-users"></i> <span> Employeer Name: {project.employeerName || "N/A"}</span>
                            </p>
                            <p className="m-0">
                                <i className="fa fa-building"></i> <span> Project Type: {project.projectType || "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-2 barcode-inner d-flex align-items-center justify-content-center">
                            <div>
                                <button onClick={onClose} className="btn btn-outline-primary">
                                    <i className="fa fa-arrow-left"></i>  Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a
                                    className="nav-link active show"
                                    id="details-tab"
                                    data-toggle="tab"
                                    href="#details"
                                    role="tab"
                                    aria-controls="details"
                                    aria-selected="true"
                                >
                                    Project Details
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div
                                className="tab-pane fade active show"
                                id="details"
                                role="tabpanel"
                                aria-labelledby="details-tab"
                            >
                                <div className="row">
                                    <div className="col-md-9" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto", overflowX: "hidden" }}>
                                        <table className="table table-bordered" cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Project Name</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.projectName || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Project Code</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.projectCode || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Company Name</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.companyName || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Project Employeer Name</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.employeerName || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Project Type</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.projectType || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                {/* <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Company Name</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.companyName || "N/A"}</p>
                                                    </td>
                                                </tr> */}
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Project Address</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.projectAddress || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">City</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.projectcity || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">State</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.projectstate || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Pincode</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">: {project.projectpincode || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                {/* <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Project Document</p>
                                                    </td>
                                                    <td>
                                                        {project.picture ? (
                                                            <div>
                                                                : <a href="#" onClick={() => handleDownload(project.picture, 'projectdocument.pdf')}>
                                                                    Download Project Document
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <p className="mb-0">: N/A</p>
                                                        )}
                                                    </td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-3 text-center border">
                                        <img
                                            src={project.picture
                                                ? `${process.env.REACT_APP_LOCAL_URL}/uploads/project/${project.picture}`
                                                : myImage}
                                            style={{ width: "200px" }}
                                           
                                        />
                                    </div>

                                </div>
                            </div>
                            {/* Project History */}
                            <div className="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
                                <div className="row">
                                    <div className="col-md-12">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Event</th>
                                                    <th>Date</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.map((entry) => (
                                                    <tr key={entry.event_id}>
                                                        <td>: {entry.event}</td>
                                                        <td>: {new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                                        <td>: {entry.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Pagination */}
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                                                <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>Previous</a>
                                            </li>
                                            {Array.from({ length: Math.ceil(projectHistory.length / itemsPerPage) || 1 }, (_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                                                    <a className="page-link" href="#" onClick={() => paginate(i + 1)}>: {i + 1}</a>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === Math.ceil(projectHistory.length / itemsPerPage) && 'disabled'}`}>
                                                <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>Next</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && <EditProject
                project={project}
                onClose={handleCloseEditModal}
            />}
        </div>
    );
};

export default ProjectDesc;
