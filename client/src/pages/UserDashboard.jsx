import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';  // <-- Correct import for spinner
import SidebarEmployee from '../components/sidebar/SidebarEmployee';
import SearchBarEmployee from '../components/sidebar/SearchBarEmployee';
import MakeEntry from './UserDetails/EntryLedger/MakeEntry';
import AddFundRequest from './UserDetails/FundRequest/AddFundRequest';

function UserDashboard({ handleLogout, username }) {
    const [selectedCash, setSelectedCash] = useState(0);  // Holds the number of records
    const [selectedCashSpend, setSelectedCashSpend] = useState(0);  // Holds the number of records
    const [remainingAmount, setRemainingAmount] = useState(0);  // Holds the remaining amount
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    // Add button  
    const [isEntryModalOpen, setIsAddEntryModalOpen] = useState(false); // State to manage modal open/close
    const [isAddFundRequestModalOpen, setIsAddFundRequestModalOpen] = useState(false); // State to manage modal open/close
    // Add button  
    const [isLoading, setIsLoading] = useState(true);
    const projectId = localStorage.getItem('projectId');  // Retrieve projectId from localStorage

    useEffect(() => {
        if (projectId) {
            fetchCashDetails(projectId);
            fetchCashSpendDetails(projectId);
            fetchLedgerEntries(projectId);
            fetchProjectDetails(projectId);
        }
    }, [projectId]);

    const fetchProjectDetails = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/project/${projectId}`);
            console.log("response.datajb", response.data); // Log the entire response to understand its structure
            // Assuming the response is an array and you want the first element's projectName
            if (response.data.length > 0) {
                setProjectDetails(response.data[0]); // Set project details to the first object in the array
            } else {
                setProjectDetails(null); // Handle the case where the array is empty
            }
        } catch (error) {
            console.error("Error fetching project details:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchCashDetails = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/cash/${projectId}`);
            // Check if the response data is an array or an object containing `records` and `totalAmount`
            const { data } = response;
            console.log("response", data);
            if (Array.isArray(data)) {
                // If the data is an array, assuming it contains the cash records directly  
                const totalAmount = data.reduce((sum, record) => sum + record.amount, 0); // Calculate total amount
                setSelectedCash(totalAmount);
            } else if (data.records && typeof data.totalAmount !== 'undefined') {
                // If data contains `records` and `totalAmount` as separate fields
                setSelectedCash(data.totalAmount); // Set the total amount
            } else {
                console.warn('Unexpected data format:', data);
            }

        } catch (error) {
            console.error('Error fetching cash details:', error);
            toast.error('Failed to load cash details');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchCashSpendDetails = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/cashspend/${projectId}`);
            // Check if the response data is an array or an object containing `records` and `totalAmount`
            const { data } = response;
            console.log("response", data);
            if (Array.isArray(data)) {
                // If the data is an array, assuming it contains the cash records directly  
                const totalAmount = data.reduce((sum, record) => sum + record.amount, 0); // Calculate total amount
                setSelectedCashSpend(totalAmount);
            } else if (data.records && typeof data.totalAmount !== 'undefined') {
                // If data contains `records` and `totalAmount` as separate fields
                setSelectedCashSpend(data.totalAmount); // Set the total amount
            } else {
                console.warn('Unexpected data format:', data);
            }
        } catch (error) {
            console.error('Error fetching cash details:', error);
            toast.error('Failed to load cash details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Calculate remaining amount whenever selectedCash or selectedCashSpend changes
        setRemainingAmount(selectedCash - selectedCashSpend);
    }, [selectedCash, selectedCashSpend]);


    // View total Spend 
    const fetchLedgerEntries = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/viewledger/${projectId}`);
            setLedgerEntries(response.data);
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // View total Spend 

    // Add Entery
    const handleAddEntryModal = () => {
        setIsAddEntryModalOpen(true);
    };

    const handleCloseEntryModal = () => {
        setIsAddEntryModalOpen(false);
    };

    // Fund Request
    const handleAddFundRequestModal = () => {
        setIsAddFundRequestModalOpen(true);
    };

    const handleCloseFundRequestModal = () => {
        setIsAddFundRequestModalOpen(false);
    };

    //   Handle Update 
    const handleUpdate = () => {
        toast.success("successfully uploaded");
        // window.location.reload();
    }
    return (
        <div className='d-flex w-100 h-100 bg-white '>
            <SidebarEmployee />
            <div className='w-100'>
                <SearchBarEmployee username={username} handleLogout={handleLogout} /> {/* Pass username and handleLogout props */}
                <div style={{overflow:"hidden"}} className=" container-fluid dashboardmain">
                    <ToastContainer />
                    <div className='rounded shadow dashboardcontainer'>
                        <div style={{ borderRadius: "10px", background: "#00509d", color: "white", background: "linear-gradient(9deg, #00509d 19%, rgb(3 86 166) 93%)", }} className="shadow-sm mb-3 usedashboardheading">
                            <div className='dashboardProjectHeading'>
                                <span className="p border-bottom m-0">
                                    Project Name
                                </span>
                                <span style={{}} className=" border-bottom h4 m-0">
                                    {projectDetails.projectName}
                                </span>
                                <span className="small m-0">
                                    {projectDetails.companyName}
                                </span>
                            </div>
                            <div className='p-1 dashboardProjectButton'>
                                <button type="button" className='button_details' onClick={handleAddEntryModal} >
                                    <i className="fa fa-plus"></i>   Make Entry
                                </button>
                                <button type="button" className='button_details' onClick={handleAddFundRequestModal} >
                                    <i class="fa-solid fa-bell"></i> Request Fund
                                </button>
                            </div>
                        </div>
                        {/* Content Row */}
                        <div className="row px-3 mb-3 totalcashdetailsbig">
                            <div style={{ width: "100%" }} className='p-0 d-flex align-items-center justify-content-between topbox'>
                                <div style={{ borderRadius: "20px", backgroundColor: "#0D7C66" }} className='topinnerbox p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <i class="fa-solid fa-hand-holding-dollar"></i>
                                                <span><Link className='text-white' to="/totalrecived"><i style={{ rotate: "45deg" }} className=" fa-solid fa-circle-arrow-up"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="nunito text-white userfont" >
                                                Total Amount Recevied
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="text-end text-white fw-bolder m-0 userfont">

                                                &#x20B9;{selectedCash.toFixed(2)}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#F95454", borderRadius: "20px" }} className='topinnerbox p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <i class="fa-solid fa-sack-dollar"></i>
                                                <span><Link className='text-white' to="/viewledger"><i style={{ rotate: "45deg" }} className=" fa-solid fa-circle-arrow-up"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="nunito text-white userfont" >
                                                Total cash spend
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="text-end text-white fw-bolder m-0 userfont">
                                                &#x20B9;{selectedCashSpend.toFixed(2)}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#F3C623", borderRadius: "20px" }} className='topinnerbox p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <i class="fa-solid fa-sack-dollar"></i>
                                                <span><Link className='text-white' to="/userprojectledger"><i style={{ rotate: "45deg" }} className=" fa-solid fa-circle-arrow-up"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="nunito text-white userfont" >
                                                Cash In Hand
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="text-end text-white fw-bolder m-0 userfont">
                                                &#x20B9;{remainingAmount.toFixed(2)}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row px-3 mb-3 totalcashdetailssmall">
                            <div style={{ width: "100%" }} className='p-0 d-flex align-items-center justify-content-between topbox'>
                                <div style={{ borderRadius: "20px", backgroundColor: "#0D92F4" }} className='topinnerbox p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold mb-2 d-flex align-items-center justify-content-between">
                                                <div className="nunito text-white userfont" >
                                                    Total Amount Recevied
                                                </div>
                                                <span style={{ fontSize: "1.5rem" }}><Link className='text-white' to="/totalrecived"><i class="fa-solid fa-hand-holding-dollar"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="text-end text-white fw-bolder m-0 userfont">
                                                &#x20B9;{selectedCash.toFixed(2)}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#F95454", borderRadius: "20px" }} className='topinnerbox p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold  mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white userfont" >
                                                    Total cash spend
                                                </div>
                                                <span><Link className='text-white' to="/viewledger"><i class="fa-solid fa-sack-dollar"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="text-end text-white fw-bolder m-0 userfont">
                                                &#x20B9;{selectedCashSpend.toFixed(2)}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#F3C623", borderRadius: "20px" }} className='topinnerbox p-3'>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white userfont" >
                                                    Cash In Hand
                                                </div>

                                                <span><Link className='text-white' to="/userprojectledger"><i class="fa-solid fa-sack-dollar"></i></Link></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='mt-2'>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                {/* Correct usage of spinner */}
                                                <ThreeDots
                                                    color="#00BFFF"
                                                    height={80}
                                                    width={80}
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="text-end text-white fw-bolder m-0 userfont">
                                                &#x20B9;{remainingAmount.toFixed(2)}
                                            </h3>)} {/* Updated amount */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Add Button */}
                        <div className="userentry shadow-sm mx-1 mb-3 p-2 ">
                            <button type="button" className="button_details userbutton" onClick={handleAddEntryModal} >
                                Make Entry
                            </button>
                            <button type="button" className="button_details userbutton" onClick={handleAddFundRequestModal} >
                                Request Fund
                            </button>
                        </div>
                        {/* Add Button */}
                        {/* content row   */}
                        <div className="row px-3">
                            <div style={{ width: "100%" }} className='p-0 d-flex align-items-center justify-content-between'>
                                <div style={{ width: "100%", borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ background: "#00509d", background: "linear-gradient(9deg, #00509d 19%, rgb(3 86 166) 93%)" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white userfont" >
                                                    <i class="fa-solid fa-list-check"></i>  Expenses Ledger
                                                </div>
                                                <span><Link className='text-white' to="/viewledger"><i style={{ rotate: "45deg" }} className=" fa-solid fa-circle-arrow-up"></i></Link></span>
                                                {/* <i style={{ rotate: "45deg" }} className=" fa-solid fa-circle-arrow-up"></i> */}
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className='p-1'>
                                        <div className='forresponsive'
                                        //  style={{ height: "270px", overflowY: "auto", overflowX: "hidden" }}
                                        >
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    {/* Correct usage of spinner */}
                                                    <ThreeDots
                                                        color="#00BFFF"
                                                        height={80}
                                                        width={80}
                                                    />
                                                </div>
                                            ) : ledgerEntries.length === 0 ? (
                                                <p className="text-black text-center text-muted">No ExpensesLedger</p>
                                            ) : (
                                                ledgerEntries.map((request, index) => (
                                                    <div key={index}
                                                        style={{ border: "1px solid #00509d", borderRadius: "10px", background: "#00509d", background: "linear-gradient(9deg, #00509d 19%, rgb(3 86 166) 93%)" }}
                                                        className="p-1 m-1 text-white"
                                                    >
                                                        <div className="d-flex align-items-start p-1 ">
                                                            <div className='w-100'>
                                                                <div className='tabledetails'>
                                                                    <div className='tableinnerdata'>
                                                                        <p className="tablefont nunito m-0 p-0">
                                                                            {/* <span>Date: </span>{formatDate(request.date)} */}
                                                                            <span>Date: </span>{new Date(request.date).toLocaleDateString('en-GB')}
                                                                        </p>
                                                                        <p className="tablefont nunito m-0 p-0">
                                                                            <span>Head: </span>{request.headName}
                                                                        </p>
                                                                    </div>
                                                                    <p className="tablefont nunito m-0 p-0">
                                                                        <span>Amt: </span>&#x20B9;{request.amount}
                                                                    </p>
                                                                </div>
                                                                <p className="nunito mb-0 lh-1 fs-14 fw-medium tablefont mt-1">
                                                                    <span className='fw-bolder '>Description: </span>{request.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isEntryModalOpen && <MakeEntry onClose={handleCloseEntryModal} onUpdate={handleUpdate} />}
            {isAddFundRequestModalOpen && <AddFundRequest onClose={handleCloseFundRequestModal} onUpdate={handleUpdate} />}

        </div>
    )
}
export default UserDashboard;









