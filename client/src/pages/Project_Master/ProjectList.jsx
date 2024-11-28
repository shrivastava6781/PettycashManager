import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectDetails from "./ProjectDetails";
import EditProject from "./EditProject";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import AddProjectModal from "./AddProjectModal";
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner


function ProjectList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectDetails, setShowProjectDetails] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [deleteProject, setDeleteProject] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProject = () => {
        setIsAddProjectModalOpen(true);
    };

    const handleCloseProjectModal = () => {
        setIsAddProjectModalOpen(false);
        setIsEditModalOpen(false);
    };

    const handleProjectDetails = (project) => {
        setSelectedProject(project);
        setShowProjectDetails(true);
    };

    const handleEditProjectClick = (project) => {
        setEditProject(project);
        setSelectedProject(project);
        setIsEditModalOpen(true);
    };

    const handleEditProjectClose = () => {
        setSelectedProject(null);
    };

    const handleBackToTable = () => {
        setSelectedProject(null);
        setShowProjectDetails(false);
    };

    const handleDeleteProject = (project) => {
        setDeleteProject(project);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateProject = async (updatedProject) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/projects/${updatedProject.id}`, updatedProject);
            console.log("Project updated:", response.data);
            const updatedProjects = projects.map(project => (project.id === updatedProject.id ? response.data : project));
            setProjects(updatedProjects);
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL}/projects/${deleteProject.id}`);
            const deletedProject = { ...deleteProject, reason: deleteReason };
            await axios.post(`${process.env.REACT_APP_LOCAL_URL}/delete_details`, deletedProject);
            setProjects((prevProjects) =>
                prevProjects.filter((project) => project.id !== deleteProject.id)
            );
            setIsDeleteModalOpen(false);
            toast.success("Successfully delete");
            console.log("Project deleted successfully");
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleUpdateProjects = () => {
        toast.success("Successfully updated");
        fetchProjects();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {<Sidebar />}
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    {!showProjectDetails && (
                        <div className="row">
                            <div className="col-xl-12">
                                <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >Project List
                                                </div>
                                                <button style={{ whiteSpace: "nowrap" }} onClick={handleAddProject} className="button_details">
                                                    <i className="fa fa-plus"></i> Add New Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className=''>
                                        <div className="card-body">
                                            <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
                                                {isLoading ? (
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        {/* Correct usage of spinner */}
                                                        <ThreeDots color="#00BFFF" height={80} width={80} />
                                                    </div>
                                                ) : (
                                                    <table className="table table-bordered" style={{ width: "100%" }}>
                                                        <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Short Name</th>
                                                                <th>Project Type</th>
                                                                <th>company Name </th>
                                                                <th>Address</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <style>
                                                                {`.hyperlink:hover { color: #00509d; }`}
                                                            </style>
                                                            {projects && (
                                                                <>
                                                                    {currentProjects.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan="12" className="text-center">There are No Employees.</td>
                                                                        </tr>
                                                                    ) : (
                                                                        currentProjects.map((project, index) => (
                                                                            <tr key={index}>
                                                                                <td className='hyperlink' style={{ cursor: "pointer" }} onClick={() => handleProjectDetails(project)}>{project.projectName}</td>
                                                                                <td>{project.projectShortName}</td>
                                                                                <td>{project.projectType}</td>
                                                                                <td>{project.companyName}</td>
                                                                                <td>{project.projectAddress},{project.projectstate},{project.projectcity}</td>
                                                                                <td>
                                                                                    <div className="btn-group">
                                                                                        <button className="button_action" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <div className="dropdown-menu actionmenu" x-placement="bottom-start">
                                                                                            <a className="dropdown-item" href="#" onClick={() => handleProjectDetails(project)}><i className="fa fa-file"></i> Detail</a>
                                                                                            <a className="dropdown-item" href="#" onClick={() => handleEditProjectClick(project)}><i className="fas fa-edit"></i> Edit</a>
                                                                                            <a className="dropdown-item" href="#" onClick={() => handleDeleteProject(project)}><i className="fa fa-trash"></i> Delete</a>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )))}
                                                                </>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}
                                                <div className="mt-2">
                                                    <ul className="pagination">
                                                        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                                                            <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>Previous</a>
                                                        </li>
                                                        {Array.from({ length: Math.ceil(projects.length / itemsPerPage) }, (_, i) => (<li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                                                            <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1} </a></li>
                                                        ))}
                                                        <li className={`page-item ${currentPage === Math.ceil(projects.length / itemsPerPage) && "disabled"}`}>
                                                            <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>Next </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {showProjectDetails && selectedProject && (
                        <ProjectDetails
                            project={selectedProject}
                            onClose={handleBackToTable}
                        />
                    )}
                    {selectedProject && !showProjectDetails && (
                        <EditProject project={selectedProject} onClose={handleEditProjectClose} onUpdate={handleUpdateProjects} />
                    )}
                    {isAddProjectModalOpen && <AddProjectModal onClose={handleCloseProjectModal} onUpdate={handleUpdateProjects} />}
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        itemName={deleteProject ? deleteProject.projectName : ""}
                        onDelete={handleDeleteConfirmation}
                        onClose={() => setIsDeleteModalOpen(false)}
                        deleteReason={deleteReason}
                        setDeleteReason={setDeleteReason}
                    />
                </div>
            </div>
        </div >
    );
}

export default ProjectList;




