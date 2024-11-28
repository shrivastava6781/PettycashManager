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





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import AddDataModal from './AssetMaster/AddDataModal'; // Import your AddDataModal component
// import './Dashboard.css';
// import AddEmployeeTable from './EmployeeMaster/AddEmployeeTable';
// import AddVendor from './VendorMaster/AddVendor';
// import AddSiteModal from './SiteMaster/AddSiteModal';
// import AddClientModal from './ClientMaster/AddClientModal';
// import AssetLost from '../pages/AssetMaster/AssetLost';
// import AddCategory from './CategoryMaster/AddCategory';

// function DeleteList() {
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close
//   const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
//   const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
//   const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
//   const [isAddAssetLostModalOpen, setIsAddAssetLostModalOpen] = useState(false);
//   // for DeleteList
//   const [totalAssetCount, setTotalAssetCount] = useState(0);
//   const [totalComponentCount, setTotalComponentCount] = useState(0);
//   const [totalSiteCount, setTotalSiteCount] = useState(0);
//   const [totalMaintenanceCount, setTotalMaintenanceCount] = useState(0);
//   // delete List
//   const [deletedItems, setDeletedItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [selectedCategory, setSelectedCategory] = useState("Assets"); // Default to showing Assets


//   useEffect(() => {
//     fetchCounts();
//   }, []);

//   const fetchCounts = async () => {
//     try {
//       const assetResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/assets`);

//       const componentResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/components`);

//       const siteResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/sites`);

//       const maintenanceResponse = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/maintenance`);

//       console.log('Asset response:', assetResponse.data);
//       console.log('Component response:', componentResponse.data);
//       console.log('Site response:', siteResponse.data);
//       console.log('Maintenance response:', maintenanceResponse.data);

//       if (Array.isArray(assetResponse.data)) {
//         setTotalAssetCount(assetResponse.data.length);
//       } else {
//         console.error('Invalid response format for total asset count');
//       }

//       if (Array.isArray(componentResponse.data)) {
//         setTotalComponentCount(componentResponse.data.length);
//       } else {
//         console.error('Invalid response format for total component count');
//       }

//       if (Array.isArray(siteResponse.data)) {
//         setTotalSiteCount(siteResponse.data.length);
//       } else {
//         console.error('Invalid response format for total site count');
//       }

//       if (Array.isArray(maintenanceResponse.data)) {
//         setTotalMaintenanceCount(maintenanceResponse.data.length);
//       } else {
//         console.error('Invalid response format for total maintenance count');
//       }
//     } catch (error) {
//       console.error('Error fetching counts:', error);
//     }
//   };
//   const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

//   const changeStyle = () => {
//     if (style == "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
//       setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
//     }
//     else {
//       setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion")
//     }
//   };
//   const changeStyle1 = () => {
//     if (style == "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
//       setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1");
//     }
//     else {
//       setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion")
//     }
//   };

//   // handle
//   const handleAddAsset = () => {
//     setIsModalOpen(true); // Open the modal when "Add new Asset" button is clicked
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false); // Close the modal
//   };
//   const handleAddEmployee = () => {
//     setIsEmployeeModalOpen(true);
//   };

//   const handleAddVendor = () => {
//     setIsVendorModalOpen(true);
//   };

//   const handleAddCategory = () => {
//     setIsCategoryModalOpen(true);
//   };

//   const handleCloseCategoryModal = () => {
//     setIsCategoryModalOpen(false);
//   };

//   const handleCloseEmployeeModal = () => {
//     setIsEmployeeModalOpen(false);
//   };

//   const handleCloseVendorModal = () => {
//     setIsVendorModalOpen(false);
//   };

//   // clientmodal

//   const handleAddClient = () => {
//     setIsAddClientModalOpen(true);
//   };

//   const handleCloseClientModal = () => {
//     setIsAddClientModalOpen(false);
//   };

//   // Asset Lost

//   const handleAddAssetLost = () => {
//     setIsAddAssetLostModalOpen(true);
//   };

//   const handleCloseAssetLostModal = () => {
//     setIsAddAssetLostModalOpen(false);
//   };

//   // site Modal

//   const handleAddSite = () => {
//     setIsAddSiteModalOpen(true)
//   };

//   const handleCloseSiteModal = () => {
//     setIsAddSiteModalOpen(false);
//   };

//   // delete histroy
//   useEffect(() => {
//     fetchDeletedItems();
//   }, []);

//   const fetchDeletedItems = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/deleted_items`);
//       setDeletedItems(response.data);
//     } catch (error) {
//       console.error('Error fetching deleted items:', error);
//     }
//   };

//   // Logic to get current items based on selected category
//   const currentItems = deletedItems.filter(item => {
//     switch (selectedCategory) {
//       case "Assets":
//         return item.asset_name !== null;
//       case "Employees":
//         return item.employee_name !== null;
//       case "Clients":
//         return item.client_name !== null;
//       case "Sites":
//         return item.site_name !== null;
//       case "Vendors":
//         return item.vendor_name !== null;
//       default:
//         return false; // Show no items for unknown category
//     }
//   });

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Function to handle dropdown change
//   const handleCategoryChange = (event) => {
//     setSelectedCategory(event.target.value);
//     setCurrentPage(1); // Reset page number when category changes
//   };


//   return (
//     <div>
//       <body id="page-top">

//         {/*  <!-- Page Wrapper --> */}
//         <div id="wrapper">

//           {/*  <!-- Sidebar --> */}
//           <ul className={style} id="accordionSidebar">

//             {/*  <!-- Sidebar - Brand --> */}
//             <a className="sidebar-brand d-flex align-items-center justify-content-center" href="#">
//               <div className="sidebar-brand-icon rotate-n-15">
//               </div>
//               <div className="sidebar-brand-text mx-3">Prospect Legal</div>
//               <div className="text-center d-none d-md-inline">
//                 <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
//               </div>
//             </a>

//             {/*   <!-- Divider --> */}
//             <hr className="sidebar-divider my-0" />

//             {/*  <!-- Nav Item - DeleteList --> */}
//             <li className="nav-item active">
//               <Link to="/dashboard" className="nav-link" href="index.html">
//                 <i className="fas fa-fw fa-tachometer-alt"></i>
//                 <span>DeleteList</span></Link>
//             </li>

//             {/*  <!-- Divider --> */}
//             <hr className="sidebar-divider" />

//             {/*   <!-- Heading --> */}
//             <div className="sidebar-heading">
//               Interface
//             </div>

//             {/*  <!-- Nav Item - Pages Collapse Menu --> */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
//                 aria-expanded="true" aria-controls="collapseTwo">
//                 <i className="fas fa-fw fa-cog"></i>
//                 <span>Asset Master</span>
//               </a>
//               <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">Assets</h6>
//                   <a className="collapse-item" href="#" onClick={handleAddAsset}>Add new Asset <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></a>
//                   <Link className="collapse-item" to="/assetlist">Total Asset <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Transfer Asset <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <h6 className="collapse-header">Asset on Maintainence:</h6>
//                   <Link className="collapse-item" to="/assetMaintenance" >Total Maintenance <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <Link className="collapse-item" to="/finishedmaintenance" >Finished Maintenance <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <Link className="collapse-item" to="/unfinishedmaintenance" >UnFinished Maintenance <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <h6 className="collapse-header">Asset on Insurence:</h6>
//                   <Link className="collapse-item" to="/assetinsurence" >Asset Insurence <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <h6 className="collapse-header">Asset Lost:</h6>
//                   <a className="collapse-item" href="#" onClick={handleAddAssetLost}>Add Asset Lost <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></a>
//                   <Link className="collapse-item" to="/assetlostlist" >Asset Lost List <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Asset Hold <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                 </div>
//               </div>
//             </li>
//             {/* <!-- Nav Item - Employee --> */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseEmployee"
//                 aria-expanded="true" aria-controls="collapseEmployee">
//                 <i className="fas fa-fw fa-chart-area"></i>
//                 <span>Employee</span>
//               </a>
//               <div id="collapseEmployee" className="collapse" aria-labelledby="headingEmployee" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">Employees:</h6>
//                   <a className="collapse-item" href="#" onClick={handleAddEmployee} >Add new Employee <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></a>
//                   <Link className="collapse-item" to="/employelist">Total Employee <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Transfer Employee <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Employee on Maintainence <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Employee Insurence <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Employee Lost <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Employee Hold <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                 </div>
//               </div>
//             </li>
//             {/*  <!-- Nav Item - Site Master --> */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseSite"
//                 aria-expanded="true" aria-controls="collapseSite">
//                 <i className="fas fa-fw fa-table"></i>
//                 <span>Site Master</span>
//               </a>
//               <div id="collapseSite" className="collapse" aria-labelledby="headingSite" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">Sites:</h6>
//                   <a className="collapse-item" onClick={handleAddSite}>Add new Site <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></a>
//                   <Link className="collapse-item" to="/sitelist">Total Sites <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Update Site Details<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Delete Site<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Site Status<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Site Reports<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                 </div>
//               </div>
//             </li>

//             {/* <!-- Nav Item - Client Master --> */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseClient"
//                 aria-expanded="true" aria-controls="collapseClient">
//                 <i className="fas fa-fw fa-users"></i>
//                 <span>Client Master</span>
//               </a>
//               <div id="collapseClient" className="collapse" aria-labelledby="headingClient" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">Clients:</h6>
//                   <a className="collapse-item" onClick={handleAddClient}>Add new Client <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></a>
//                   <Link className="collapse-item" to="/clientlist">Total Clients <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Update Client Details <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Delete Client <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Client Status <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">Client Reports <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                 </div>
//               </div>
//             </li>
//             {/* Nav Item - vendor Master */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsevendor"
//                 aria-expanded="true" aria-controls="collapsevendor">
//                 <i className="fas fa-fw fa-chart-area"></i>
//                 <span>vendor master</span>
//               </a>
//               <div id="collapsevendor" className="collapse" aria-labelledby="headingvendor" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">vendors:</h6>
//                   <a className="collapse-item" href="#" onClick={handleAddVendor}>Add new vendor <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></a>
//                   <Link className="collapse-item" to="/vendorlist" >Total vendor <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Transfer vendor <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">vendor on Maintainence <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">vendor Insurence <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">vendor Lost <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">vendor Hold <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                 </div>
//               </div>
//             </li>
//             {/* Nav Item - Category Master */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsecategory"
//                 aria-expanded="true" aria-controls="collapsecategory">
//                 <i className="fas fa-fw fa-chart-area"></i>
//                 <span>Category master</span>
//               </a>
//               <div id="collapsecategory" className="collapse" aria-labelledby="headingcategory" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">Category:</h6>
//                   <a className="collapse-item" href="#" onClick={handleAddCategory}>Add new category<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></a>
//                   <Link className="collapse-item" to="/categorylist" >Total Category <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Transfer category<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category on Maintainence<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category Insurence<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category Lost<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category Hold<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                 </div>
//               </div>
//             </li>
//             {/* Nav Item - Total Component */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsecomponent"
//                 aria-expanded="true" aria-controls="collapsecomponent">
//                 <i className="fas fa-fw fa-chart-area"></i>
//                 <span>Component master</span>
//               </a>
//               <div id="collapsecomponent" className="collapse" aria-labelledby="headingcategory" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">Component:</h6>
//                   <Link className="collapse-item" to="/componentlist" >Total head component<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <Link className="collapse-item" to="/fullcomponentlist">Total Component<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                   <a className="collapse-item" href="#">Transfer category<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category on Maintainence<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category Insurence<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category Lost<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                   <a className="collapse-item" href="#">category Hold<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red' }}>` `</span></a>
//                 </div>
//               </div>
//             </li>
//             {/* Nav Item - Total history */}
//             <li className="nav-item">
//               <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsedelete"
//                 aria-expanded="true" aria-controls="collapsedelete">
//                 <i className="fas fa-fw fa-chart-area"></i>
//                 <span>history master</span>
//               </a>
//               <div id="collapsedelete" className="collapse" aria-labelledby="headingcategory" data-parent="#accordionSidebar">
//                 <div className="bg-white py-2 collapse-inner rounded">
//                   <h6 className="collapse-header">Delete:</h6>
//                   <Link className="collapse-item" to="/deletelist" >Delete<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green' }}>` `</span></Link>
//                 </div>
//               </div>
//             </li>


//             {/* <!-- Divider --> */}
//             <hr className="sidebar-divider d-none d-md-block" />
//           </ul>
//           {/*  <!-- End of Sidebar --> */}

//           {/*  <!-- Content Wrapper --> */}
//           <div id="content-wrapper" className="d-flex flex-column">

//             {/*  <!-- Main Content --> */}
//             <div id="content">

//               {/*  <!-- Topbar --> */}
//               <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

//                 {/*  <!-- Sidebar Toggle (Topbar) --> */}
//                 <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={changeStyle1}>
//                   <i className="fa fa-bars"></i>
//                 </button>

//                 {/*  <!-- Topbar Search --> */}
//                 <form
//                   className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
//                   <div className="input-group">
//                     <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
//                       aria-label="Search" aria-describedby="basic-addon2" />
//                     <div className="input-group-append">
//                       <button className="btn btn-primary" type="button">
//                         <i className="fas fa-search fa-sm"></i>
//                       </button>
//                     </div>
//                   </div>
//                 </form>

//                 {/*  <!-- Topbar Navbar --> */}
//                 <ul className="navbar-nav ml-auto">

//                   {/*  <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
//                   <li className="nav-item dropdown no-arrow d-sm-none">
//                     <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
//                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                       <i className="fas fa-search fa-fw"></i>
//                     </a>
//                     {/*   <!-- Dropdown - Messages --> */}
//                     <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
//                       aria-labelledby="searchDropdown">
//                       <form className="form-inline mr-auto w-100 navbar-search">
//                         <div className="input-group">
//                           <input type="text" className="form-control bg-light border-0 small"
//                             placeholder="Search for..." aria-label="Search"
//                             aria-describedby="basic-addon2" />
//                           <div className="input-group-append">
//                             <button className="btn btn-primary" type="button">
//                               <i className="fas fa-search fa-sm"></i>
//                             </button>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </li>
//                   <div className="topbar-divider d-none d-sm-block"></div>
//                   {/* <!-- Nav Item - User Information --> */}
//                   <li className="nav-item dropdown no-arrow">

//                     <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
//                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                       <span className="mr-2 d-none d-lg-inline text-gray-600 small">Aditya Shrivastava</span>
//                       <img className="img-profile rounded-circle"
//                         src="img/undraw_profile.svg" />
//                     </a>

//                     {/*  <!-- Dropdown - User Information --> */}
//                     <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
//                       aria-labelledby="userDropdown">
//                       <Link
//                         to="/profile"

//                         id="userDropdown"
//                         role="button"
//                         data-toggle="dropdown"
//                         aria-haspopup="true"
//                         aria-expanded="false"
//                       >
//                         <a className="dropdown-item" href="#">
//                           <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
//                           Profile
//                         </a>
//                       </Link>
//                       <a className="dropdown-item" href="#">
//                         <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
//                         Settings
//                       </a>
//                       <a className="dropdown-item" href="#">
//                         <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
//                         Activity Log
//                       </a>
//                       <div className="dropdown-divider"></div>
//                       <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
//                         <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
//                         Logout
//                       </a>
//                     </div>
//                   </li>
//                 </ul>
//               </nav>
//               {/*  <!-- End of Topbar --> */}

//               {/* <!-- Begin Page Content --> */}
//               <div className="container-fluid">
//                 <div className="row">
//                   <div className="col-xl-12">
//                     <div className="card shadow mb-4">
//                       <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
//                         <h6 className="m-0 font-weight-bold text-primary">Deleted Items List</h6>
//                         <div className='d-flex align-items-center'>
//                           <label className='me-2 black-font-color'>Filter:</label>
//                           <select className="form-select black-font-color" onChange={handleCategoryChange} value={selectedCategory}>
//                             <option className='black-font-color' value="Assets">Assets</option>
//                             <option className='black-font-color' value="Employees">Employees</option>
//                             <option className='black-font-color' value="Clients">Clients</option>
//                             <option className='black-font-color' value="Sites">Sites</option>
//                             <option className='black-font-color' value="Vendors">Vendors</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="card-body">
//                         <table className="table table-striped table-bordered" style={{ width: "100%" }}>
//                           <thead>
//                             <tr>
//                               <th>Item Name</th>
//                               <th>Item Description</th>
//                               <th>Delete Date</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {currentItems.map((item) => (
//                               <tr key={item.id}>
//                                 <td>{selectedCategory === "Assets" ? item.asset_name : selectedCategory === "Employees" ? item.employee_name : selectedCategory === "Clients" ? item.client_name : selectedCategory === "Sites" ? item.site_name : selectedCategory === "Vendors" ? item.vendor_name : "N/A"}</td>
//                                 <td>{item.description}</td>
//                                 <td>{item.deleted_at.substring(0, 10)}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                         {/* Pagination */}
//                         <ul className="pagination">
//                           <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
//                             <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
//                           </li>
//                           {Array.from({ length: Math.ceil(currentItems.length / itemsPerPage) }, (_, i) => (
//                             <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
//                               <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
//                             </li>
//                           ))}
//                           <li className={`page-item ${currentPage === Math.ceil(currentItems.length / itemsPerPage) && 'disabled'}`}>
//                             <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
//                           </li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <a className="scroll-to-top rounded" href="#page-top">
//           <i className="fas fa-angle-up"></i>
//         </a>

//         {/*  <!-- Logout Modal--> */}
//         <div className="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
//           aria-hidden="true">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
//                 <button className="close" type="button" data-dismiss="modal" aria-label="Close">
//                   <span aria-hidden="true">×</span>
//                 </button>
//               </div>
//               <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
//                 <a className="btn btn-primary" href="login.html">Logout</a>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Add Modal Tables*/}
//         {isModalOpen && <AddDataModal onClose={handleCloseModal} />}
//         {isEmployeeModalOpen && <AddEmployeeTable onClose={handleCloseEmployeeModal} />}
//         {isVendorModalOpen && <AddVendor onClose={handleCloseVendorModal} />}
//         {isCategoryModalOpen && <AddCategory onClose={handleCloseCategoryModal} />}
//         {isAddSiteModalOpen && <AddSiteModal onClose={handleCloseSiteModal} />}
//         {isAddClientModalOpen && <AddClientModal onClose={handleCloseClientModal} />}
//         {isAddAssetLostModalOpen && <AssetLost onClose={handleCloseAssetLostModal} />}
//       </body>
//     </div>
//   )
// }

// export default DeleteList;
