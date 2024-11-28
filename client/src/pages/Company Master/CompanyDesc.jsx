import React, { useState, useEffect } from "react";
import axios from "axios";
import EditCompany from "./EditCompany"; // Assuming you have an EditCompany component
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyDesc = ({ company, onClose }) => {
    const [companyHistory, setCompanyHistory] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

 
        const fetchCompanyHistory = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_LOCAL_URL}/api/company/history/${company.id}`
                );
                setCompanyHistory(response.data);
            } catch (error) {
                console.error("Error fetching company history:", error);
            }
        };

        useEffect(() => {
        fetchCompanyHistory();
    }, [company]);

    const handleEditCompany = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleUpdateCompanies = () => {
        toast.success("Successfully uploaded");
        fetchCompanyHistory();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = companyHistory.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <ToastContainer/>
            <div className="bg-white rounded shadow-sm card-body p-4">
                <div className="row">
                    <div className="col-md-9 d-flex  justify-content-between px-3">
                        <div>
                            <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder font-bold m-0">
                                {company.companyName}
                            </h2>
                            <small>Created By - {company.username || "N/A"}</small>
                        </div>   
                        <div>                        
                            <p className="m-0">
                                <i class="fa fa-envelope" aria-hidden="true"></i> <span> Email: {company.companyEmail || "N/A"}</span>
                            </p>
                            <p className="m-0">
                                <i class="fa fa-phone"></i> <span> Phone: {company.companyPhone  || "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3 ">
                        <div className="p-2 barcode-inner ">
                            <div className="  d-flex align-items-center justify-content-center gap-2">
                                <button onClick={onClose} className="btn btn-outline-primary">
                                <i className="fa fa-arrow-left"></i> Back
                                </button>
                                <button onClick={handleEditCompany} className="btn btn-outline-primary">
                                <i className="fas fa-edit"></i> Edit
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
                                    Company Details
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
                                    <div className="col-md-12" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto", overflowX:"hidden" }}>
                                        <table className="table table-hover" cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Company Name</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">: {company.companyName || "N/A"}</p>
                                                    </td>
                                                </tr>
                                               
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Phone</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">: {company.companyPhone || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Email</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">: {company.companyEmail || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Address</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">: {company.companyAddress || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">GST</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">: {company.companyGST || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">PAN</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">: {company.companyPAN || "N/A"}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>
                            </div>
                            {/* Company History */}
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
                                                        {/* <td>: {formatDate(entry.date)}</td> */}
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
                                            {Array.from({ length: Math.ceil(companyHistory.length / itemsPerPage) || 1 }, (_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                                                    <a className="page-link" href="#" onClick={() => paginate(i + 1)}>: {i + 1}</a>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === Math.ceil(companyHistory.length / itemsPerPage) && 'disabled'}`}>
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
            {isEditModalOpen && <EditCompany
                company={company}
                onUpdate={handleUpdateCompanies}
                onClose={handleCloseEditModal}
            />}
        </div>
    );
};

export default CompanyDesc;
