import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; // Spinner
import ProjectCreditDebitReportPreview from "./ProjectCreditDebitReportPreview";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/sidebar/SearchBar";

function ProjectCreditDebitReport({ handleLogout, username }) {
    // sidebar SearchBar 
    const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
    const [showSearchBar, setShowSearchBar] = useState(true); // State to control search bar visibility
    const [detailsVisible, setDetailsVisible] = useState(false); // State for details modal
    const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record
    const [isLoading, setIsLoading] = useState(false);
    const [monthlyProjects, setMonthlyProjects] = useState([]);
    const [availableProjects, setAvailableProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedYearProject, setSelectedYearProject] = useState('');
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [grandTotals, setGrandTotals] = useState({ totalCredit: 0, totalDebit: 0 });

    useEffect(() => {
        fetchProjectReports();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchCreditDebit(selectedProject);
        }
    }, [selectedProject, selectedYearProject]);

    const fetchProjectReports = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
            setAvailableProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCreditDebit = async (projectId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projectcreditdebit/${projectId}`);
            const formattedData = formatLedgerData(response.data);

            // Filter data based on selected financial year
            const filteredData = formattedData.filter(entry => {
                const entryDate = new Date(entry.date);
                const entryFinancialYear = getFinancialYear(entryDate);
                return !selectedYearProject || entryFinancialYear === selectedYearProject;
            });

            setMonthlyProjects(filteredData);
            const summary = calculateMonthlySummary(filteredData);
            setMonthlySummary(summary);

            if (summary.length === 0) {
                setGrandTotals({ totalCredit: 0, totalDebit: 0 });
            }
        } catch (error) {
            console.error("Error fetching ledger entries:", error);
            toast.error("Failed to fetch ledger entries");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
    };

    const formatLedgerData = (data) => {
        return data.map(entry => ({
            ...entry,
            monthYear: getMonthYear(entry.date),
        }));
    };

    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    const getFinancialYear = (date) => {
        const year = date.getFullYear();
        const startOfFinancialYear = new Date(year, 3, 1); // 1st April
        if (date >= startOfFinancialYear) {
            return `${year}-${year + 1}`;
        } else {
            return `${year - 1}-${year}`;
        }
    };

    const calculateMonthlySummary = (data) => {
        const summary = {};

        data.forEach(entry => {
            const monthYear = entry.monthYear;
            if (!summary[monthYear]) {
                summary[monthYear] = { credit: 0, debit: 0 };
            }
            if (entry.type === 'Credit') {
                summary[monthYear].credit += entry.amount;
            } else if (entry.type === 'Debit') {
                summary[monthYear].debit += entry.amount;
            }
        });

        return Object.keys(summary).map(monthYear => {
            const { credit, debit } = summary[monthYear];
            return {
                monthYear,
                credit,
                debit,
                balance: credit - debit,
            };
        });
    };

    useEffect(() => {
        if (monthlySummary.length > 0) {
            calculateProjectTotals();
        } else {
            setGrandTotals({ totalCredit: 0, totalDebit: 0 });
        }
    }, [monthlySummary]);

    const calculateProjectTotals = () => {
        const totals = monthlySummary.reduce((acc, record) => {
            acc.totalCredit += record.credit || 0;
            acc.totalDebit += record.debit || 0;
            return acc;
        }, { totalCredit: 0, totalDebit: 0 });

        setGrandTotals(totals);
    };

    const handleDetails = () => {
        console.log("Selected Project ID:", selectedProject);
        console.log("Projects Array:", monthlyProjects); // Log the projects array to inspect

        if (monthlyProjects.length === 0) {
            toast.error("No projects available");
            return; // Exit if there are no projects
        }

        const selectedId = Number(selectedProject); // Convert selectedProject to a number
        const selectedProjectData = monthlyProjects.find(project => project.id === selectedId); // Match with the numeric id

        console.log("selectedProjectData", selectedProjectData); // Log to check if data was found

        // Update the record setting to correctly access properties
        setSelectedRecord({
            projectName: selectedProjectData ? selectedProjectData.projectName : '', // Correctly access projectName
            status: monthlySummary.length > 0 ? monthlySummary[0].status : '', // Make sure this status exists in your monthlySummary
            recordData: monthlySummary,
            selectedYear: selectedYearProject // Set selectedYear correctly
        });

        setDetailsVisible(true);
        setShowSidebar(false);
        setShowSearchBar(false);
    };

    const handleClosePreview = () => {
        setShowSidebar(true); // Show sidebar when closing preview
        setShowSearchBar(true); // Show search bar when closing preview
        setDetailsVisible(false); // Hide details
    };

    return (
        <div className='d-flex w-100 h-100 bg-white'>
            {showSidebar && <Sidebar />}
            <div className='w-100'>
                {showSearchBar && <SearchBar className="searchbarr" username={username} handleLogout={handleLogout} />}
                <div className="container-fluid">
                    <ToastContainer />
                    {detailsVisible ? (
                        <ProjectCreditDebitReportPreview
                            record={selectedRecord}
                            onClose={handleClosePreview}
                        />
                    ) : (
                        <div className="row">
                            <div className="col-xl-12">
                                <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                    <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                        <div className="col">
                                            <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                                <div className="nunito text-white">Monthly Report</div>
                                                <div className="d-flex gap-3">
                                                    <div className='d-flex align-items-center justify-content-center gap-2'>
                                                        <label className='nunito text-white p-0 m-0'>Project:</label>
                                                        <select
                                                            className="button_details overflow-hidden"
                                                            value={selectedProject}
                                                            onChange={(e) => handleProjectChange(e.target.value)}
                                                        >
                                                            <option value="">Select Project</option>
                                                            {availableProjects.map(proj => (
                                                                <option key={proj.id} value={proj.id}>{proj.projectName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <label className='nunito text-white p-0 m-0'>Filter:</label>
                                                        <select
                                                            className="button_details"
                                                            value={selectedYearProject}
                                                            onChange={(e) => setSelectedYearProject(e.target.value)}
                                                        >
                                                            <option value="">Select Financial Year</option>
                                                            {Array.from({ length: 10 }, (_, i) => {
                                                                const startYear = new Date().getFullYear() - i;
                                                                const financialYear = `${startYear}-${startYear + 1}`;
                                                                return (
                                                                    <option key={i} value={financialYear}>{financialYear}</option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    <button onClick={handleDetails} className="button_details">
                                                        PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='m-0 p-0' />
                                    <div className=''>
                                        <div className="card-body">
                                            <div style={{ maxHeight: "550px", overflowY: "auto" }}>
                                                {isLoading ? (
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <ThreeDots color="#00BFFF" height={80} width={80} />
                                                    </div>
                                                ) : (
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Month-Year</th>
                                                                <th>Total Credit</th>
                                                                <th>Total Debit</th>
                                                                <th>Balance</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {monthlySummary.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="4" className="text-center">No Monthly Summary.</td>
                                                                </tr>
                                                            ) : (
                                                                monthlySummary.map((summary, index) => (
                                                                    <tr key={index}>
                                                                        <td>{summary.monthYear}</td>
                                                                        <td className="text-end">&#x20B9;{summary.credit.toFixed(2)}</td>
                                                                        <td className="text-end">&#x20B9;{summary.debit.toFixed(2)}</td>
                                                                        <td className={`text-end ${summary.balance < 0 ? 'text-danger' : ''}`}>
                                                                            &#x20B9;{summary.balance.toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <th>Totals</th>
                                                                <th className="text-success text-end">&#x20B9;{grandTotals.totalCredit.toFixed(2)}</th>
                                                                <th className="text-danger text-end">&#x20B9;{grandTotals.totalDebit.toFixed(2)}</th>
                                                                <th className="text-end">&#x20B9;{(grandTotals.totalCredit - grandTotals.totalDebit).toFixed(2)}</th>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectCreditDebitReport;















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ThreeDots } from 'react-loader-spinner'; // Spinner

// function ProjectCreditDebitReport({ handleLogout, username }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [monthlyProjects, setMonthlyProjects] = useState([]);
//     const [availableProjects, setAvailableProjects] = useState([]);
//     const [selectedProject, setSelectedProject] = useState('');
//     const [selectedYearProject, setSelectedYearProject] = useState('');
//     const [monthlySummary, setMonthlySummary] = useState([]);
//     const [grandTotals, setGrandTotals] = useState({ totalCredit: 0, totalDebit: 0 });

//     useEffect(() => {
//         fetchProjectReports();
//     }, []);

//     useEffect(() => {
//         if (selectedProject) {
//             fetchCreditDebit(selectedProject);
//         }
//     }, [selectedProject, selectedYearProject]);

//     const fetchProjectReports = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`);
//             setAvailableProjects(response.data);
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//             toast.error("Failed to fetch projects");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchCreditDebit = async (projectId) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/projectcreditdebit/${projectId}`);
//             const formattedData = formatLedgerData(response.data);

//             // Filter data based on selected financial year
//             const filteredData = formattedData.filter(entry => {
//                 const entryDate = new Date(entry.date);
//                 const entryFinancialYear = getFinancialYear(entryDate);
//                 return !selectedYearProject || entryFinancialYear === selectedYearProject;
//             });

//             setMonthlyProjects(filteredData);
//             const summary = calculateMonthlySummary(filteredData);
//             setMonthlySummary(summary);

//             if (summary.length === 0) {
//                 setGrandTotals({ totalCredit: 0, totalDebit: 0 });
//             }
//         } catch (error) {
//             console.error("Error fetching ledger entries:", error);
//             toast.error("Failed to fetch ledger entries");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleProjectChange = (projectId) => {
//         setSelectedProject(projectId);
//     };

//     const formatLedgerData = (data) => {
//         return data.map(entry => ({
//             ...entry,
//             monthYear: getMonthYear(entry.date),
//         }));
//     };

//     const getMonthYear = (dateString) => {
//         const date = new Date(dateString);
//         const options = { year: 'numeric', month: 'long' };
//         return date.toLocaleDateString('en-US', options);
//     };

//     const getFinancialYear = (date) => {
//         const year = date.getFullYear();
//         const startOfFinancialYear = new Date(year, 3, 1); // 1st April
//         if (date >= startOfFinancialYear) {
//             return `${year}-${year + 1}`;
//         } else {
//             return `${year - 1}-${year}`;
//         }
//     };

//     const calculateMonthlySummary = (data) => {
//         const summary = {};

//         data.forEach(entry => {
//             const monthYear = entry.monthYear;
//             if (!summary[monthYear]) {
//                 summary[monthYear] = { credit: 0, debit: 0 };
//             }
//             if (entry.type === 'Credit') {
//                 summary[monthYear].credit += entry.amount;
//             } else if (entry.type === 'Debit') {
//                 summary[monthYear].debit += entry.amount;
//             }
//         });

//         return Object.keys(summary).map(monthYear => {
//             const { credit, debit } = summary[monthYear];
//             return {
//                 monthYear,
//                 credit,
//                 debit,
//                 balance: credit - debit,
//             };
//         });
//     };

//     useEffect(() => {
//         if (monthlySummary.length > 0) {
//             calculateProjectTotals();
//         } else {
//             setGrandTotals({ totalCredit: 0, totalDebit: 0 });
//         }
//     }, [monthlySummary]);

//     const calculateProjectTotals = () => {
//         const totals = monthlySummary.reduce((acc, record) => {
//             acc.totalCredit += record.credit || 0;
//             acc.totalDebit += record.debit || 0;
//             return acc;
//         }, { totalCredit: 0, totalDebit: 0 });

//         setGrandTotals(totals);
//     };

//     return (
//         <div className="row px-3 mb-3">
//             <div style={{ width: "100%" }} className='p-0 d-flex justify-content-between'>
//                 <div style={{ width: "100%", borderRadius: "20px", border: "1px solid #0077b6" }} className='overflow-hidden'>
//                     <div style={{ background: "linear-gradient(9deg, #00509d 19%, #00509d 93%)" }} className="row no-gutters align-items-center px-4 py-2">
//                         <div className="col">
//                             <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
//                                 <div className="nunito text-white">
//                                     Project Report
//                                 </div>
//                                 <div className="d-flex gap-3">
//                                     <div className='d-flex align-items-center justify-content-center gap-2'>
//                                         <label className='nunito text-white p-0 m-0'>Project:</label>
//                                         <select
//                                             className="button_details overflow-hidden"
//                                             value={selectedProject}
//                                             onChange={(e) => handleProjectChange(e.target.value)}
//                                         >
//                                             <option value="">Select Project</option>
//                                             {availableProjects.map(proj => (
//                                                 <option key={proj.id} value={proj.id}>{proj.projectName}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className="d-flex align-items-center justify-content-center gap-2">
//                                         <label className='nunito text-white p-0 m-0'>Filter:</label>
//                                         <select
//                                             className="button_details"
//                                             value={selectedYearProject}
//                                             onChange={(e) => setSelectedYearProject(e.target.value)}
//                                         >
//                                             <option value="">Select Financial Year</option>
//                                             {Array.from({ length: 10 }, (_, i) => {
//                                                 const startYear = new Date().getFullYear() - i;
//                                                 const financialYear = `${startYear}-${startYear + 1}`;
//                                                 return (
//                                                     <option key={i} value={financialYear}>{financialYear}</option>
//                                                 );
//                                             })}
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <hr className='m-0 p-0' />
//                     <div className="card-body">
//                         <div style={{ maxHeight: "550px", overflowY: "auto" }}>
//                             {isLoading ? (
//                                 <div className="d-flex justify-content-center align-items-center">
//                                     <ThreeDots color="#00BFFF" height={80} width={80} />
//                                 </div>
//                             ) : (
//                                 <table className="table table-bordered">
//                                     <thead>
//                                         <tr>
//                                             <th>Month-Year</th>
//                                             <th>Total Credit</th>
//                                             <th>Total Debit</th>
//                                             <th>Balance</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {monthlySummary.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan="4" className="text-center">No Monthly Summary.</td>
//                                             </tr>
//                                         ) : (
//                                             monthlySummary.map((summary, index) => (
//                                                 <tr key={index}>
//                                                     <td>{summary.monthYear}</td>
//                                                     <td className="text-end">&#x20B9;{summary.credit.toFixed(2)}</td>
//                                                     <td className="text-end">&#x20B9;{summary.debit.toFixed(2)}</td>
//                                                     <td className={`text-end ${summary.balance < 0 ? 'text-danger' : ''}`}>
//                                                         &#x20B9;{summary.balance.toFixed(2)}
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                     <tfoot>
//                                         <tr>
//                                             <th>Totals</th>
//                                             <th className="text-success text-end">&#x20B9;{grandTotals.totalCredit.toFixed(2)}</th>
//                                             <th className="text-danger text-end">&#x20B9;{grandTotals.totalDebit.toFixed(2)}</th>
//                                             <th className="text-end">&#x20B9;{(grandTotals.totalCredit - grandTotals.totalDebit).toFixed(2)}</th>
//                                         </tr>
//                                     </tfoot>
//                                 </table>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProjectCreditDebitReport;
