import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/sidebar/SearchBar";
import Sidebar from "../components/sidebar/Sidebar";

function DeleteList({ handleLogout, username }) {
  const [deletedItems, setDeletedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("Assets"); // Default to showing Assets

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  const fetchDeletedItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/deleted_items`);
      setDeletedItems(response.data);
    } catch (error) {
      console.error('Error fetching deleted items:', error);
    }
  };

  // Logic to get current items based on selected category
  const currentItems = deletedItems.filter(item => {
    switch (selectedCategory) {
      case "Assets":
        return item.asset_name !== null;
      case "Employees":
        return item.employee_name !== null;
      case "Clients":
        return item.client_name !== null;
      case "Sites":
        return item.site_name !== null;
      case "Vendors":
        return item.vendor_name !== null;
      default:
        return false; // Show no items for unknown category
    }
  });

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle dropdown change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset page number when category changes
  };

  return (
    <div className='d-flex w-100 h-100 bg-white '>
      <Sidebar />
      <div className='w-100'>
      <SearchBar username={username} handleLogout={handleLogout} /> {/* Pass username and handleLogout props */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Deleted Items List</h6>
                  <div className='d-flex align-items-center'>
                    <label className='me-2 black-font-color'>Filter:</label>
                    <select className="form-select black-font-color" onChange={handleCategoryChange} value={selectedCategory}>
                      <option className='black-font-color' value="Assets">Assets</option>
                      <option className='black-font-color' value="Employees">Employees</option>
                      <option className='black-font-color' value="Clients">Clients</option>
                      <option className='black-font-color' value="Sites">Sites</option>
                      <option className='black-font-color' value="Vendors">Vendors</option>
                    </select>
                  </div>
                </div>
                <div className="card-body">
                  <table className="table table-striped table-bordered" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Delete Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.id}>
                          <td>{selectedCategory === "Assets" ? item.asset_name : selectedCategory === "Employees" ? item.employee_name : selectedCategory === "Clients" ? item.client_name : selectedCategory === "Sites" ? item.site_name : selectedCategory === "Vendors" ? item.vendor_name : "N/A"}</td>
                          <td>{item.description}</td>
                          <td>{item.deleted_at.substring(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination */}
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                      <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: Math.ceil(currentItems.length / itemsPerPage) }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                        <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === Math.ceil(currentItems.length / itemsPerPage) && 'disabled'}`}>
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
  );
}

export default DeleteList;