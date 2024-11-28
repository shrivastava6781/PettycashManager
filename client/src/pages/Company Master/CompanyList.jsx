import React, { useState, useEffect } from "react";
import axios from "axios";
import CompanyDesc from "./CompanyDesc";
import EditCompany from "./EditCompany";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCompany from "./AddCompany";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner


function CompanyList({ handleLogout, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyDetails, setShowCompanyDetails] = useState(false);
    const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCompany, setEditCompany] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [deleteCompany, setDeleteCompany] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/companies`);
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCompany = () => {
        setIsAddCompanyModalOpen(true);
    };

    const handleCloseCompanyModal = () => {
        setIsAddCompanyModalOpen(false);
        setIsEditModalOpen(false);
    };

    const handleCompanyDetails = (company) => {
        setSelectedCompany(company);
        setShowCompanyDetails(true);
    };

    const handleEditCompanyClick = (company) => {
        setEditCompany(company);
        setSelectedCompany(company);
        setIsEditModalOpen(true);
    };

    const handleEditCompanyClose = () => {
        setSelectedCompany(null);
    };

    const handleBackToTable = () => {
        setSelectedCompany(null);
        setShowCompanyDetails(false);
    };

    const handleDeleteCompany = (company) => {
        setDeleteCompany(company);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_LOCAL_URL}/companies/${deleteCompany.id}`);
            setCompanies((prevCompanies) =>
                prevCompanies.filter((company) => company.id !== deleteCompany.id)
            );
            setIsDeleteModalOpen(false);
            toast.success("Successfully Delete");
            console.log("Company deleted successfully");
        } catch (error) {
            console.error("Error deleting company:", error);
        }
    };

    const handleUpdateCompanies = () => {
        toast.success("Successfully uploaded");
        fetchCompanies();
        setIsAddCompanyModalOpen(false); // Ensure the modal is closed after updating companies
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = companies.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            {<Sidebar />}
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid">
                    <ToastContainer />
                    {!showCompanyDetails && (
                        <div className="row">
                            <div className="col-xl-12">
                                <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white" >Company List
                                                </div>
                                                <button style={{whiteSpace:"nowrap"}} onClick={handleAddCompany} className="button_details">
                                                <i className="fa fa-plus"></i> Add New Company
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
                                                                <th>Company Name</th>
                                                                <th>Contact No.</th>
                                                                <th>Email</th>
                                                                <th>Address</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <style>
                                                                {`.hyperlink:hover { color: #00509d; }`}
                                                            </style>
                                                            {companies && (
                                                                <>
                                                                    {currentItems.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan="12" className="text-center">There are No Employees.</td>
                                                                        </tr>
                                                                    ) : (
                                                                        currentItems.map((company, index) => (
                                                                            <tr key={index}>
                                                                                <td className='hyperlink' style={{ cursor: "pointer" }} onClick={() => handleCompanyDetails(company)}>{company.companyName}</td>
                                                                                <td>{company.companyPhone}</td>
                                                                                <td>{company.companyEmail}</td>
                                                                                <td>{company.companyAddress}</td>
                                                                                <td>
                                                                                    <div className="btn-group">
                                                                                        <button className="button_action" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <div className="dropdown-menu actionmenu" x-placement="bottom-start">
                                                                                            <a className="dropdown-item" href="#" style={{whiteSpace:"nowrap"}} onClick={() => handleCompanyDetails(company)}><i className="fa fa-file"></i> Detail</a>
                                                                                            <a className="dropdown-item" href="#" style={{whiteSpace:"nowrap"}} onClick={() => handleEditCompanyClick(company)}><i className="fas fa-edit"></i> Edit</a>
                                                                                            <a className="dropdown-item" href="#" style={{whiteSpace:"nowrap"}} onClick={() => handleDeleteCompany(company)}><i className="fa fa-trash"></i> Delete</a>
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
                                                        {Array.from({ length: Math.ceil(companies.length / itemsPerPage) }, (_, i) => (<li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                                                            <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1} </a></li>
                                                        ))}
                                                        <li className={`page-item ${currentPage === Math.ceil(companies.length / itemsPerPage) && "disabled"}`}>
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
                    {showCompanyDetails && selectedCompany && (
                        <CompanyDesc
                            company={selectedCompany}
                            onClose={handleBackToTable}
                        />
                    )}
                    {selectedCompany && !showCompanyDetails && (
                        <EditCompany company={selectedCompany} onClose={handleEditCompanyClose} onUpdate={handleUpdateCompanies} />
                    )}
                    {isAddCompanyModalOpen && <AddCompany onClose={handleCloseCompanyModal} onUpdate={handleUpdateCompanies} />}
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        itemName={deleteCompany ? deleteCompany.companyName : ""}
                        onDelete={handleDeleteConfirmation}
                        onClose={() => setIsDeleteModalOpen(false)}
                        deleteReason={deleteReason}
                        setDeleteReason={setDeleteReason}
                    />
                </div>
            </div>
        </div>
    );
}

export default CompanyList;




