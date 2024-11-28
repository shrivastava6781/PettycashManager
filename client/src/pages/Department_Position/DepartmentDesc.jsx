import React, { useState, useEffect } from "react";
import axios from "axios";
// import EditDepartment from "./EditDepartment"; // Assuming you have an EditDepartment component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myImage from '../../images/employee_profile.png';

const DepartmentDesc = ({ department, onClose }) => {
    const [departmentEmployee, setEmployeeDepartment] = useState([]);
    const [positions, setPositions] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchDepartmentEmployee();
        fetchPositions();
    }, [department]);

    const fetchDepartmentEmployee = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_LOCAL_URL}/employee_department/${department.id}`
            );
            setEmployeeDepartment(response.data);
        } catch (error) {
            console.error("Error fetching department history:", error);
        }
    };

    const fetchPositions = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_LOCAL_URL}/department_positions/${department.id}`
            );
            setPositions(response.data);
        } catch (error) {
            console.error("Error fetching position history:", error);
        }
    };
    const handleEditDepartment = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleUpdateDepartments = () => {
        toast.success("Department details updated successfully");
        fetchDepartmentEmployee();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = departmentEmployee.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <ToastContainer />
            <div className=" rounded bg-white shadow-sm card-body p-4">
                <div className="row">

                    <div className="col-md-9 d-flex  justify-content-between px-3">
                        <div>
                            <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder font-bold m-0">
                                {department.name}
                            </h2>
                            <small>Created By - {department.username || "N/A"}</small>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-2 barcode-inner">
                            <div className=" d-flex gap-2 align-items-center justify-content-center">
                                <button onClick={onClose} className="btn btn-outline-primary">
                                    <i className="fa fa-arrow-left"></i> Back
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
                                    Department Details
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link "
                                    id="history-tab"
                                    data-toggle="tab"
                                    href="#history"
                                    role="tab"
                                    aria-controls="history"
                                    aria-selected="true"
                                >
                                    Department Details
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
                                    <div className="col-md-12" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto", overflowX: "hidden" }}>
                                        <table className="table table-hover" cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Department Name:</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 type2">{department.name || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Department Description:</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">{department.description || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Designation:</p>
                                                    </td>
                                                    <td>
                                                        {positions.length > 0 ? (
                                                            <ul>
                                                                {positions.map((entry) => (
                                                                    <li key={entry.id}>
                                                                        <div>
                                                                            <span style={{ fontWeight: "700" }}>{entry.positionName}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span style={{ fontWeight: "700" }}>Description: </span>{entry.description}
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="mb-0 ">No positions found</p>
                                                        )}
                                                    </td>
                                                </tr>
                                                {/* Add more fields as needed */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* Department History */}
                            <div className="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
                                <div className="row">
                                    <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                                        <table className="table table-striped table-bordered" style={{ width: "100%" }}>
                                            <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                <tr>
                                                    <th>Employee Picture</th>
                                                    <th>Employee Name</th>
                                                    <th>Employee Code</th>
                                                    <th>Employee Phone</th>
                                                    <th>Position name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.map((entry) => (
                                                    <tr key={entry.event_id}>
                                                        <td>

                                                            <img
                                                                src={entry.passportSizePhoto
                                                                    ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${entry.passportSizePhoto}`
                                                                    : myImage}
                                                                style={{ width: "90px"}} className="employee-image"
                                                                alt="Employee"
                                                            />
                                                        </td>
                                                        <td>{entry.employeeName}</td>
                                                        <td>{entry.employeeCode}</td>
                                                        <td>{entry.employeePhone}</td>
                                                        <td>{entry.positionName}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Pagination */}
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                                            </li>
                                            {Array.from({ length: Math.ceil(departmentEmployee.length / itemsPerPage) || 1 }, (_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                                                    <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === Math.ceil(departmentEmployee.length / itemsPerPage) && 'disabled'}`}>
                                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDesc;
