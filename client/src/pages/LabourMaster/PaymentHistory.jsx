
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentHistory = ({ onClose, record }) => {
  const [formData, setFormData] = useState({ ...record });
  const [project, setProject] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  console.log("reeee", record)

  useEffect(() => {
    fetchPaymentForm();
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/project/${record.projectId}`);
      setProject(response.data[0]); // Extract the first object
      console.log(response.data[0]);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };


  const fetchPaymentForm = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/paymentform/${formData.id}`);
      setPaymentDetails(response.data);
    } catch (error) {
      console.error('Error fetching payment modes:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div id="addModal" className="modal fade show" role="dialog" style={{ display: "block" }}>
      <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
        <div className="modal-content">
          <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
            <h5 className="modal-title">Payment History</h5>
            <button type="button" className="button_details " onClick={handleClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="modal-body p-0" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {paymentDetails.length > 0 ? paymentDetails.map((payment, index) => (
              <div className='bg-light rounded d-flex justify-content-around border m-1' key={index}>
                <div className='w-100'>
                  <div className='w-100 p-2 d-flex justify-content-between flex-column'>
                    <div className=' d-flex justify-content-between'>
                      <div>
                        <p className='p-1 m-0'><strong>Project Name:</strong> {project.projectShortName}</p>
                        <p className='p-1 m-0'><strong>Labour Name:</strong> {payment.labourName}</p>
                        <p className='p-1 m-0'><strong>Net Salary Payable for {monthNames[payment.month - 1]} {payment.year}:</strong> {payment.netSalaryPayableMonth}</p>
                      </div>
                      <div>
                        <p className='p-1 m-0'><strong>Payment Mode:</strong> {payment.paymentModeName}</p>
                        <p className='p-1 m-0'><strong>Amount Date:</strong> {new Date(payment.amountDate).toLocaleDateString()}</p>
                        <p className='p-1 m-0'><strong>Amount Paid:</strong> {payment.amountPaid}</p>
                      </div>
                    </div>
                    <div>
                      <p className='p-1 m-0'><strong className='text-black'>Payment Description:</strong> {payment.paymentDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <h5 className='text-center'>No Payment history found for this employee.</h5>
            )}
          </div>
          <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
            <button type="button" className="button_details" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;










