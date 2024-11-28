import React, { useEffect, useState } from 'react';
import myLogo from '../../images/CashBackground.jpg'; // Updated image reference for bonuses
import axios from 'axios';

const HeadReportPreview = ({ record, onClose }) => {
    // Correctly access filteredRecords from record.recordData
    const { recordData = [] } = record || {};
    const filteredRecords = recordData;
    const month = record.selectedMonth;
    const year = record.selectedYear;

    const [setting, setSetting] = useState({});
    const [grandTotals, setGrandTotals] = useState({
        totalEmployees: 0,
        totalAmount: 0,
    });

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
        calculateTotals();
    }, [filteredRecords]);

    const calculateTotals = () => {
        const totals = filteredRecords.reduce((acc, record) => {
            acc.totalEmployees += 1;
            acc.totalAmount += record.amount ? parseFloat(record.amount) : 0;
            return acc;
        }, {
            totalEmployees: 0,
            totalAmount: 0,
        });

        setGrandTotals(totals);
    };

    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1]; // monthNumber is 1-based, array is 0-based
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
                        <h4 style={{ color: "#00509d" }} className='title-detail text-uppercase fw-bolder font-bold m-0'>Head Report</h4>
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
                                <span>{getMonthName(month) || ""}</span>
                                <span>{` ${year || ""}`}</span>
                            </small>

                        </div>
                    </div>

                    <div className="card-body form-row">
                        <div className='col-md-12'>
                            <table className="table table-striped table-bordered rounded border">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Date</th>
                                        <th>head</th>
                                        <th>Project</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">No Head Entries.</td>
                                        </tr>
                                    ) : (
                                        filteredRecords.map((entry, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td> {/* Serial number */}
                                                <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                                <td>{entry.headName}</td>
                                                <td>{entry.projectShortName}</td>
                                                <td>{entry.description}</td>
                                                <td className='text-end'>&#x20B9;{entry.amount != null ? entry.amount.toFixed(2) : '0.00'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Totals {grandTotals.totalEmployees}</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th className='text-end'>&#x20B9;{grandTotals.totalAmount != null ? grandTotals.totalAmount.toFixed(2) : '0.00'}</th>

                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer p-1 d-flex align-items-center justify-content-between">
                        <div>
                            <small className='p-0 m-0'>Powered By - PETTY CASH MANAGER</small>
                        </div>
                        <div className='d-flex gap-2'>
                            <button onClick={handlePrint} className="btn btn-success print-button"><i className="fa fa-download"></i> Print</button>
                            <button onClick={onClose} className="btn btn-danger print-button">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadReportPreview;