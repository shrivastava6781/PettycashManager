<div className="mt-3 laptop">
<ToastContainer />
<div className="bg-white rounded shadow-sm card-body p-4">
    <div className="row">
        <div className="col-md-9 d-flex justify-content-between px-3">
            <div className="w-100">
                <h2 style={{ color: "#00509d" }} className="title-detail fw-bolder m-0">
                    Labour Dashboard
                </h2>
                <hr className="m-0 p-0" />
                <div className="mt-2 w-100 d-flex justify-content-between">
                    <div>
                        <h6 className="nunito text-black">Name: <span className="text-dark">{labour.labourName}</span></h6>
                        <h6 className="nunito text-black">Project: <span className="text-dark">{labour.projectShortName}</span></h6>
                        <h6 className="nunito text-black">Labour Code: <span className="text-dark">{labour.labourId}</span></h6>
                    </div>
                    <div>
                        <h6 className="nunito text-black">Father's Name: <span className="text-dark">{labour.fatherName}</span></h6>
                        <h6 className="nunito text-black">Mobile Number: <span className="text-dark">{labour.mobileNo}</span></h6>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-3 d-flex align-items-center justify-content-center">
            <button type="button" className="button_action" onClick={onClose}>Close</button>
        </div>
    </div>
    <div className="row">
        <div className="col-xl-12">
            <div style={{ borderRadius: "10px", border: "1px solid #00509d" }} className='overflow-hidden'>
                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                    <div className="col">
                        <div className="text-xs p-0 font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between">
                            <div className="nunito text-white m-0 p-0" > Labour Payment Details
                            </div>
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
                                            <th className="text-center">Day Shift</th>
                                            <th className="text-center">Night Shift</th>
                                            <th className="text-center">Overtime Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='text-end'>&#x20B9;{labour.dayShift != null ? labour.dayShift.toFixed(2) : '0.00'}</td>
                                            <td className='text-end'>&#x20B9;{labour.nightShift != null ? labour.nightShift.toFixed(2) : '0.00'}</td>
                                            <td className='text-end'>&#x20B9;{labour.overtimeHrs != null ? labour.overtimeHrs.toFixed(2) : '0.00'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr />

    <div className="row">
        <div className="col-md-12">
            <ul style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px", backgroundColor: "#00509D", padding: "7px" }} className="nav nav-tabs px-2 " id="myTab" role="tablist">
                <li className="nav-item">
                    <a
                        className="nav-link-labour active show"
                        id="details-tab"
                        data-toggle="tab"
                        href="#details"
                        role="tab"
                        aria-controls="details"
                        aria-selected="true"
                    >
                        Labour Attendance
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className="nav-link-labour"
                        id="checkin-tab"
                        data-toggle="tab"
                        href="#checkin"
                        role="tab"
                        aria-controls="checkin"
                        aria-selected="false"
                    >
                        Payment Ledger
                    </a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade active show" id="details" role="tabpanel"
                    aria-labelledby="details-tab"
                >
                    {/* Attendance Records */}
                    <div className="row p-1">
                        <div className="col-md-12">
                            <div style={{ borderRadius: "15px", border: "1px solid #00509d" }} className='overflow-hidden'>
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between">
                                            <div className="nunito text-white m-0 p-0">Labour Attendance</div>
                                            <div>
                                                <label className="nunito text-white m-0 p-0">Month:</label>
                                                <select className="button_details mx-1" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                                    ))}
                                                </select>
                                                <label className="nunito text-white m-0 p-0">Year:</label>
                                                <select className="button_details mx-1" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className='m-0 p-0' />
                                <div>
                                    <div className="card-body">
                                        <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : (
                                                <table className="table table-bordered" style={{ width: "100%" }}>
                                                    <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                        <tr>
                                                            <th className="text-center">Date</th>
                                                            <th className="text-center">Attendance</th>
                                                            <th className="text-center">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {attendanceRecords.map((record) => {
                                                            const { attendance, amount } = calculateAttendanceAmount(record);
                                                            return (
                                                                <tr key={record.id}>
                                                                    <td className="text-center">{new Date(record.date).toLocaleDateString()}</td>
                                                                    <td className="text-center">{attendance}</td>
                                                                    <td className="text-center">Rs {amount.toFixed(2)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            )}
                                            <div className="d-flex justify-content-end">
                                                <strong>Total Attendance: D-{attendanceSummary.dayShift} N-{attendanceSummary.nightShift} OT-{attendanceSummary.overtime}</strong>
                                                <strong className="ml-3">Total: Rs {totalAmount.toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Check-in/out history */}
                <div className="tab-pane fade" id="checkin" role="tabpanel" aria-labelledby="checkin-tab">
                    <div className="row">
                        <div className="col-xl-12">
                            <div style={{ borderRadius: "20px", border: "1px solid #00509d" }} className="overflow-hidden">
                                <div style={{ backgroundColor: "#00509d" }} className="row no-gutters align-items-center p-3">
                                    <div className="col">
                                        <div className="text-xs font-weight-bold text-white text-uppercase d-flex align-items-center justify-content-between" style={{ fontSize: '1.5rem' }}>
                                            <div className="nunito text-white">Labour Details List</div>
                                            <div className="d-flex align-items-center justify-content-center gap-4">
                                                <div>
                                                    <label className="nunito text-white">Filter:</label>
                                                    <select
                                                        className="button_details mx-1"
                                                        value={selectedMonth}
                                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                                    >
                                                        <option value="">Month</option>
                                                        {monthNames.map((month, index) => (
                                                            <option key={index} value={index + 1}>{month}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="button_details mx-1"
                                                        value={selectedYear}
                                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                                    >
                                                        <option value="">Year</option>
                                                        {Array.from({ length: 10 }, (_, i) => (
                                                            <option key={i} value={new Date().getFullYear() - i}>
                                                                {new Date().getFullYear() - i}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="m-0 p-0" />
                                <div>
                                    <div className="card-body">
                                        <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <ThreeDots color="#00BFFF" height={80} width={80} />
                                                </div>
                                            ) : (
                                                <table className="table table-bordered" style={{ width: "100%" }}>
                                                    <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
                                                        <tr>
                                                            <th>Labour Name</th>
                                                            <th>Month</th>
                                                            <th>Total Amount</th>
                                                            <th>Paid</th>
                                                            <th>Due</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredPayroll.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="6" className="text-center">No records found</td>
                                                            </tr>
                                                        ) : (
                                                            filteredPayroll.map(record => {
                                                                const amountPaid = paymentDetails[record.id] || 0;
                                                                const amountDue = (record.totalAmount || 0) - amountPaid;
                                                                return (
                                                                    <tr key={record.id}>
                                                                        <td>{record.labourName}</td>
                                                                        <td>{monthNames[new Date(record.month).getMonth()]} {new Date(record.month).getFullYear()}</td>
                                                                        <td>₹{record.totalAmount?.toFixed(2)}</td>
                                                                        <td>₹{amountPaid.toFixed(2)}</td>
                                                                        <td>₹{amountDue.toFixed(2)}</td>
                                                                        <td>
                                                                            <button className="m-1 btn btn-outline-info btn-sm" onClick={() => handlePaymentHistory(record)}>
                                                                                <i className="fa fa-eye" aria-hidden="true"></i>
                                                                            </button>
                                                                            {amountDue > 0 && (
                                                                                <button
                                                                                    className="btn btn-primary btn-sm"
                                                                                    onClick={() => handlePaymentForm(record)}
                                                                                >
                                                                                    Add Payment
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {isPaymentForm && (
            <PaymentForm
                record={paymentForm}
                onClose={() => setIsPaymentForm(false)}
                onUpdate={handleUpdate}
            />
        )}
        {isPaymentHistory && (
            <PaymentHistory
                record={paymentFormHistory}
                onClose={() => setIsPaymentHistory(false)}
            />
        )}
    </div>
</div>
</div>