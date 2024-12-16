import React, { useEffect, useState } from 'react';
import myLogo from '../../images/CashBackground.jpg'; // Updated image reference for bonuses
import axios from 'axios';
import { spacing } from '@mui/system';

const ProjectCreditDebitReportPreview = ({ record, onClose }) => {
    const { recordData = [] } = record || {};
    const filteredProjects = recordData;
    const [setting, setSetting] = useState({});
    const year = record.selectedYear;
    const [grandTotals, setGrandTotals] = useState({ totalcredit: 0, totaldebit: 0 }); // State for grand totals
    console.log("record", record)
    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);
                setSetting(response.data);
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };
        fetchSetting();
    }, []);

    useEffect(() => {
        if (filteredProjects.length > 0) {
            calculateTotals();
        } else {
            setGrandTotals({ totalcredit: 0, totaldebit: 0 }); // Reset grand totals to zero if no summary
        }
    }, [filteredProjects]);

    const calculateTotals = () => {
        if (filteredProjects.length === 0) {
            setGrandTotals({ totalcredit: 0, totaldebit: 0 }); // Reset to 0 if no data
        } else {
            const totals = filteredProjects.reduce((acc, record) => {
                acc.totalcredit += record.credit ? parseFloat(record.credit) : 0;
                acc.totaldebit += record.debit ? parseFloat(record.debit) : 0;
                return acc;
            }, {
                totalcredit: 0,
                totaldebit: 0,
            });

            setGrandTotals(totals);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container-fluid">
            <div className="row p-1">
                <div className="modal-content">
                    <div className="modal-header m-0 p-2 d-flex align-items-center justify-content-between px-3">
                        <div>
                            <div style={{ height: "50px", width: "100%" }} className='logo p-1'>
                                <img
                                    src={setting.landingPageLogo
                                        ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${setting.landingPageLogo}`
                                        : myLogo}
                                    style={{ height: "100%", objectFit: "cover" }}
                                    alt="LOGO"
                                />
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-center flex-column'>
                            <h4 style={{ color: "#00509d" }} className='title-detail text-uppercase fw-bolder font-bold m-0'>Monthly Project Report</h4>
                            <small>{record.projectName}</small>
                        </div>
                        <div className='d-flex align-items-center justify-content-center flex-column '>
                            <h5
                                style={{ color: "#00509d" }}
                                className="title-detail text-uppercase fw-bolder font-bold m-0"
                            >
                                {setting.title || "PETTY CASH MANAGER"}
                            </h5>
                            <small
                                style={{ color: "#00509d" }}
                                className="title-detail text-uppercase fw-bolder font-bold m-0"
                            >
                                {/* <span>{getMonthName(month) || ""}</span> */}
                                <span>{` ${year || ""}`}</span>
                            </small>

                        </div>
                    </div>
                    <div className="card-body form-row">
                        <div className='col-md-12'>
                            <table className="table table-striped table-bordered rounded border">
                                <thead>
                                    <tr>
                                        <th>Month-Year</th>
                                        <th>Total Credit</th>
                                        <th>Total Debit</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProjects.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">No Monthly Summary.</td>
                                        </tr>
                                    ) : (
                                        filteredProjects.map((summary, index) => (
                                            <tr key={index}>
                                                <td>{summary.monthYear}</td>
                                                <td className='text-end'>&#x20B9;{summary.credit != null ? summary.credit.toFixed(2) : '0.00'}</td>
                                                <td className='text-end'>&#x20B9;{summary.debit != null ? summary.debit.toFixed(2) : '0.00'}</td>
                                                <td className='text-end'>&#x20B9;{summary.balance != null ? summary.balance.toFixed(2) : '0.00'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Totals</th>
                                        <th className="text-success text-end">&#x20B9;{grandTotals.totalcredit != null ? grandTotals.totalcredit.toFixed(2) : '0.00'}</th>
                                        <th className="text-danger text-end">&#x20B9;{grandTotals.totaldebit != null ? grandTotals.totaldebit.toFixed(2) : '0.00'}</th>
                                        <th className='text-end'>&#x20B9;{(grandTotals.totalcredit - grandTotals.totaldebit).toFixed(2)}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer p-1 d-flex align-items-center justify-content-between">
                        <div>
                            <small className='p-0 m-0'>Powered By - Petty Cash Manager</small>
                        </div>
                        <div className='d-flex gap-2'>
                            <button onClick={handlePrint} className="btn btn-success print-button">
                                <i className="fa fa-download"></i> Print
                            </button>
                            <button onClick={onClose} className="btn btn-danger print-button">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCreditDebitReportPreview;
