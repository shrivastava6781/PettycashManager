import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEmployeeTable from "./AddEmployeeTable";
import EmployeeDetails from "./EmployeeDetails";
import EditEmployeeModal from "./EditEmployeeModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CreateUser from "./CreateUser";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myImage from '../../images/employee_profile.png';
import EmployeePrint from "./EmployeePrint";
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
import { Link } from "react-router-dom";

function Employeelist({ handleLogout, username }) {
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTransferEmployeeOpen, setIsAddTransferEmployeeOpen] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false); // State for ActiveInactiveModal 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
  // showresigntermination
  const [showresigntermination, setshowresigntermination] = useState(false); // Added state to control visibility of RenewalInsurance modal
  // Show EmployeePint 
  const [printEmployeeData, setPrintEmployeeData] = useState(null);
  const [showEmployeePrint, setShowEmployeePrint] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees`);
      const filteredEmployees = response.data.filter(
        employee => employee.status !== 'resign_terminate'
      );
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddEmployee = () => {
    setIsEmployeeModalOpen(true);
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
  };

  const handleEditEmployee = (employee) => {
    setEditEmployeeData(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
    setDeleteEmployee(employee);
    setIsDeleteModalOpen(true);
  };


  // Transfer modal   

  const handleAddTransfer = (employee) => {
    setIsAddTransferEmployeeOpen(true);
    setEmployeeData(employee)
  };

  const handleCloseTransferModal = () => {
    setIsAddTransferEmployeeOpen(false);
  };


  const handleDeleteConfirmation = async () => {
    if (!deleteEmployee?.id) return; // Ensure there's an employee selected to delete
  
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_LOCAL_URL}/employees/${deleteEmployee.id}`
      );
  
      // Check if the deletion was successful based on status code (200 or 204 is typical for a successful DELETE request)
      if (response.status === 200 || response.status === 204) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== deleteEmployee.id)
        );
        setIsDeleteModalOpen(false); // Close the modal after successful deletion
        console.log("Employee deleted successfully");
      } else {
        console.error("Failed to delete employee:", response);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };
    
  const handleEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const handleUpdateEmployees = () => {
    toast.success('Data uploaded successfully');
    fetchEmployees();
  };

  const handleCreateEmployee = (employee) => {
    setSelectedEmployee(employee); // Set selected employee for creation
    setIsCreateModalOpen(true); // Open create modal
  };

  const handleStatusModalOpen = (employee) => {
    setEditEmployeeData(employee); // Set the selected employee
    setIsStatusModalOpen(true); // Open the modal
  };
  const handleEmployeePrint = (employee) => {
    setPrintEmployeeData(employee)
    setShowSidebar(false); // Set to false to hide sidebar
    setShowSearchBar(false);
    setShowEmployeePrint(true);
  };

  const handleClosePreview = () => {
    setShowSidebar(true); // Set to true to hide sidebar
    setShowSearchBar(true);
    setShowEmployeePrint(false);
  };

  const getToggleClass = (status) => {
    return status === 'active' ? 'toggle active' : 'toggle inactive';
  };
  return (
    <div className='d-flex w-100 h-100 bg-white '>
      {showSidebar && <Sidebar />}
      <div className='w-100'>
        {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
        <div className="container-fluid">
          <ToastContainer />
          {showEmployeeDetails ? (
            <EmployeeDetails
              employee={selectedEmployee}
              onClose={() => setShowEmployeeDetails(false)}
            />
          ) : (
            showEmployeePrint ? (
              <EmployeePrint
                record={printEmployeeData}
                onClose={handleClosePreview}
              />
            ) : (
              <div className="row">
                <div className="col-xl-12">
                  <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                      <div className="col">
                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                          <div className="nunito text-white" >Employee List
                          </div>
                          <button style={{whiteSpace:"nowrap"}} onClick={handleAddEmployee} className="button_details">
                          <i className="fa fa-plus"></i> Add New Employee
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
                                  <th>Employee Picture</th>
                                  <th>Employee Name/Designation</th>
                                  <th>Employee Code</th>
                                  <th>Phone No.</th>
                                  <th>Email Id.</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <style>
                                  {`.hyperlink:hover { color: #00509d; }`}
                                </style>
                                {employees && (
                                  <>
                                    {currentItems.length === 0 ? (
                                      <tr>
                                        <td colSpan="12" className="text-center">There are No Employees.</td>
                                      </tr>
                                    ) : (
                                      currentItems.map((employee) => (
                                        <tr key={employee.id}>
                                          <td>
                                            <img
                                              src={employee.picture
                                                ? `${process.env.REACT_APP_LOCAL_URL}/uploads/employees/${employee.picture}`
                                                : myImage}
                                              style={{ width: "90px" }}
                                              className="employee-image"
                                            />
                                          </td>
                                          <td>
                                            {employee.employeeName}
                                            <hr />
                                            {employee.designationName}
                                            <br />
                                            {employee.departmentName}
                                          </td>
                                          <td>{employee.employeeCode}</td>
                                          <td>{employee.employeePhone}</td>
                                          <td>{employee.employeeEmail}</td>
                                          <td>
                                            <div className="d-flex align-items-center justify-content-start gap-3">
                                              <div className="btn-group">
                                                <button
                                                  className="button_action"
                                                  type="button"
                                                  data-toggle="dropdown"
                                                  aria-haspopup="true"
                                                  aria-expanded="false"
                                                >
                                                  <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                </button>
                                                <div className="dropdown-menu actionmenu">
                                                 
                                                  <a className="dropdown-item" href="#" onClick={() => handleEditEmployee(employee)}>
                                                    <i className="fas fa-edit"></i> Edit
                                                  </a>
                                                  
                                                  <a className="dropdown-item" href="#" onClick={() => handleDeleteEmployee(employee)}>
                                                    <i className="fa fa-trash"></i> Delete
                                                  </a>
                                                </div>
                                              </div>
                                              
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                    )}
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
                              {Array.from({ length: Math.ceil(employees.length / itemsPerPage) }, (_, i) => (<li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                                <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1} </a></li>
                              ))}
                              <li className={`page-item ${currentPage === Math.ceil(employees.length / itemsPerPage) && "disabled"}`}>
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
            ))}
          {isEditModalOpen && (
            <EditEmployeeModal
              employee={editEmployeeData}
              onClose={() => setIsEditModalOpen(false)}
              onUpdate={handleUpdateEmployees}
            />
          )}

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            itemName={deleteEmployee ? deleteEmployee.employeeName : "dd"}
            onDelete={handleDeleteConfirmation}
            onClose={() => setIsDeleteModalOpen(false)}
            deleteReason={deleteReason}
            setDeleteReason={setDeleteReason}
          />
          {/* Employee Creation Modal */}
          {isCreateModalOpen && (
            <CreateUser
              employee={selectedEmployee}
              onClose={() => setIsCreateModalOpen(false)}
              onUpdate={handleUpdateEmployees}
            />
          )}
          {isEmployeeModalOpen && <AddEmployeeTable
            onClose={handleCloseEmployeeModal}
            onUpdate={handleUpdateEmployees} />
          }
        </div>
      </div>
    </div>
  );
}

export default Employeelist;

