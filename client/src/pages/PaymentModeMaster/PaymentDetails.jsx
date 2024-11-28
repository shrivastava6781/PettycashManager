import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentDetails = ({ paymentMode, onClose }) => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/download/${fileUrl}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = paymentHistory.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="card-body p-4 rounded bg-white shadow-sm">
                <div className="row">
                    <div className="col-md-9 d-flex justify-content-between px-3">
                        <div>
                            <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder font-bold m-0">
                                Payment Details
                            </h2>
                            <small>Processed By - {paymentMode.username || "N/A"}</small>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <p className="m-0">
                                <i className="fa fa-money-bill-alt"></i> <span> Payment Type: {paymentMode.paymentType || "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-2 barcode-inner d-flex align-items-center justify-content-center">
                            <div>
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
                                    Payment Details
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
                                                        <p className="mb-0 font-bold">Payment Mode</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0  ">: {paymentMode.paymentModeName || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Payment Type</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0  ">: {paymentMode.paymentType || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Account Name</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 ">: {paymentMode.accountName || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Account Number</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0  ">: {paymentMode.accountNumber || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Bank Name</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0  ">: {paymentMode.bankName || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Branch</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0  ">: {paymentMode.branch || "N/A"}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">IFSC Code</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0  ">: {paymentMode.ifscCode || "N/A"}</p>
                                                    </td>
                                                </tr>

                                                {/* <tr>
                                                <td bgcolor="#f2f3f4" width="200">
                                                    <p className="mb-0 font-bold">Payment Amount</p>
                                                </td>
                                                <td>
                                                    <p className="mb-0 ">: {paymentMode.amount || "N/A"}</p>
                                                </td>
                                            </tr> */}

                                                <tr>
                                                    <td bgcolor="#f2f3f4" width="200">
                                                        <p className="mb-0 font-bold">Created At</p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0  ">: {formatDate(paymentMode.createdAt) || "N/A"}</p>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* Payment History */}
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
                                                        <td>: {formatDate(entry.date)}</td>
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
                                            {Array.from({ length: Math.ceil(paymentHistory.length / itemsPerPage) || 1 }, (_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                                                    <a className="page-link" href="#" onClick={() => paginate(i + 1)}>: {i + 1}</a>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === Math.ceil(paymentHistory.length / itemsPerPage) && 'disabled'}`}>
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
        </div>

    );
};

export default PaymentDetails;
