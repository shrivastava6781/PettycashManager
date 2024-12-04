
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PaymentForm = ({ onClose, record, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     ...record,
//     amountPaid: '',
//     amountDate: '',
//     paymentModeId: '',
//     paymentDescription: '',
//   });
//   console.log("record",record)

//   const [paymentModes, setPaymentModes] = useState([]);
//   const [paymentDetails, setPaymentDetails] = useState([]);
//   const [remainingAmount, setRemainingAmount] = useState(0);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     fetchPaymentModes();
//     fetchPaymentForm();
//   }, []);

//   const fetchPaymentModes = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/addPaymentModes`);
//       setPaymentModes(response.data);
//     } catch (error) {
//       console.error('Error fetching payment modes:', error);
//     }
//   };

//   const fetchPaymentForm = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/paymentform/${formData.id}`);
//       const paymentDetails = response.data;
//       setPaymentDetails(paymentDetails);
//       const totalPaidAmount = paymentDetails.reduce((sum, payment) => sum + payment.amountPaid, 0);
//       const remaining = formData.netSalaryPayableMonth - totalPaidAmount;
//       setRemainingAmount(remaining.toFixed(2));
//     } catch (error) {
//       console.error('Error fetching payment form:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'paymentModeId') {
//       const paymentMode = paymentModes.find(mode => mode.id === parseInt(value, 10));
//       setFormData({
//         ...formData,
//         paymentModeId: value,
//         paymentModeName: paymentMode ? paymentMode.paymentModeName : '',
//       });
//     } else {
//       if (name === 'amountPaid') {
//         if (parseFloat(value) > remainingAmount) {
//           setErrorMessage('Amount Paid cannot be greater than Remaining Amount.');
//         } else {
//           setErrorMessage('');
//         }
//       }
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (parseFloat(formData.amountPaid) > remainingAmount) {
//       setErrorMessage('Amount Paid cannot be greater than Remaining Amount.');
//       return;
//     }
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/submitPayment`, formData);
//       console.log('Payment submitted:', response.data);
//       // onClose(); // Close modal on successful submission
//       onUpdate();
//       setTimeout(() => {
//         onClose();
//         window.location.reload();
//     }, 1000); // 1 second delay
//     } catch (error) {
//       console.error('Error submitting payment:', error);
//     }
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   return (
//     <div>
//       <div id="paymentModal" className="modal fade show" role="dialog" style={{ display: "block", paddingRight: "17px" }}>
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content">
//             <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate="novalidate">
//               <div className="modal-header">
//                 <h5 className="modal-title">Payment Form</h5>
//                 <button type="button" className="close" onClick={handleClose}>&times;</button>
//               </div>
//               <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//                 <div className="form-row">
//                   <div className="form-group col-md-6">
//                     <label>Project Name <span style={{ color: "red" }}>*</span></label>
//                     <input name="departmentName" type="text" className="form-control" value={formData.departmentName} readOnly />
//                   </div>
//                   <div className="form-group col-md-6">
//                     <label>Labour Name <span style={{ color: "red" }}>*</span></label>
//                     <input name="employeeName" type="text" className="form-control" value={formData.employeeName} readOnly />
//                   </div>
//                   <div className="form-group col-md-6">
//                     <label>Month <span style={{ color: "red" }}>*</span></label>
//                     <input name="month" type="text" className="form-control" value={monthNames[formData.month - 1]} readOnly />
//                   </div>
//                   <div className="form-group col-md-6">
//                     <label>Year <span style={{ color: "red" }}>*</span></label>
//                     <input name="year" type="text" className="form-control" value={formData.year} readOnly />
//                   </div>
//                   <div className="form-group col-md-4">
//                     <label>Amount Paid <span style={{ color: "red" }}>*</span></label>
//                     <input name="amountPaid" type="number" className="form-control" placeholder="Enter amount paid" onChange={handleChange} value={formData.amountPaid} required />
//                     <small className='text-danger'>Remaining amount: {remainingAmount}</small>
//                     {errorMessage && <small className="text-danger">{errorMessage}</small>}
//                   </div>
//                   <div className="form-group col-md-4">
//                     <label>Amount Date <span style={{ color: "red" }}>*</span></label>
//                     <input name="amountDate" type="date" className="form-control" onChange={handleChange} value={formData.amountDate} required />
//                   </div>
//                   <div className="form-group col-md-4">
//                     <label>Payment Mode<span style={{ color: "red" }}>*</span></label>
//                     <select className="form-control" name="paymentModeId" value={formData.paymentModeId} onChange={handleChange} required>
//                       <option value="">Select Payment Mode</option>
//                       {paymentModes.map(mode => (
//                         <option key={mode.id} value={mode.id}>{mode.paymentModeName}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="form-group col-md-12">
//                     <label>Payment Description</label>
//                     <textarea name="paymentDescription" type="text" className="form-control" placeholder="Enter Description" onChange={handleChange} value={formData.paymentDescription} required />
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button type="submit" className="btn btn-primary" disabled={errorMessage}>Save</button>
//                 <button type="button" className="btn btn-default" onClick={handleClose}>Close</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentForm;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = ({ onClose, record, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: record.id || '',
    labourName: record.labourName || '',
    month: record.month || '',
    year: new Date(record.createdAt).getFullYear() || '',
    projectId: record.projectId || '',
    paymentAmount: record.paymentAmount || '',
    totalAmount: record.totalAmount || 0,
    amountPaid: '',
    amountDate: '',
    paymentModeId: '',
    paymentDescription: '',
  });

  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPaymentModes();
    fetchPaymentForm();
  }, []);

  const fetchPaymentModes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/addPaymentModes`);
      setPaymentModes(response.data);
    } catch (error) {
      console.error('Error fetching payment modes:', error);
    }
  };

  const fetchPaymentForm = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/paymentform/${formData.id}`);
      const paymentDetails = response.data;
      setPaymentDetails(paymentDetails);
      const totalPaidAmount = paymentDetails.reduce((sum, payment) => sum + payment.amountPaid, 0);
      const remaining = formData.totalAmount - totalPaidAmount;
      setRemainingAmount(remaining.toFixed(2));
    } catch (error) {
      console.error('Error fetching payment form:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'paymentModeId') {
      const paymentMode = paymentModes.find(mode => mode.id === parseInt(value, 10));
      setFormData({
        ...formData,
        paymentModeId: value,
        paymentModeName: paymentMode ? paymentMode.paymentModeName : '',
      });
    } else {
      if (name === 'amountPaid') {
        if (parseFloat(value) > remainingAmount) {
          setErrorMessage('Amount Paid cannot be greater than Remaining Amount.');
        } else {
          setErrorMessage('');
        }
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.amountPaid) > remainingAmount) {
      setErrorMessage('Amount Paid cannot be greater than Remaining Amount.');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/submitPayment`, formData);
      console.log('Payment submitted:', response.data);
      onUpdate();
      onClose();
    //   setTimeout(() => {
    //     onClose();
    //     window.location.reload();
    //   }, 1000);
    } catch (error) {
      console.error('Error submitting payment:', error);
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
    <div>
      <div id="paymentModal" className="modal fade show" role="dialog" style={{ display: "block", paddingRight: "17px" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit} autoComplete="off" noValidate="novalidate">
              <div className="modal-header">
                <h5 className="modal-title">Payment Form</h5>
                <button type="button" className="close" onClick={handleClose}>&times;</button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Labour Name</label>
                    <input name="labourName" type="text" className="form-control" value={formData.labourName} readOnly />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Month</label>
                    <input name="month" type="text" className="form-control" value={formData.month} readOnly />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Year</label>
                    <input name="year" type="text" className="form-control" value={formData.year} readOnly />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Total Amount</label>
                    <input name="totalAmount" type="text" className="form-control" value={formData.totalAmount} readOnly />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Amount Paid</label>
                    <input name="amountPaid" type="number" className="form-control" placeholder="Enter amount paid" onChange={handleChange} value={formData.amountPaid} required />
                    <small className='text-danger'>Remaining amount: {remainingAmount}</small>
                    {errorMessage && <small className="text-danger">{errorMessage}</small>}
                  </div>
                  <div className="form-group col-md-4">
                    <label>Amount Date</label>
                    <input name="amountDate" type="date" className="form-control" onChange={handleChange} value={formData.amountDate} required />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Payment Mode</label>
                    <select className="form-control" name="paymentModeId" value={formData.paymentModeId} onChange={handleChange} required>
                      <option value="">Select Payment Mode</option>
                      {paymentModes.map(mode => (
                        <option key={mode.id} value={mode.id}>{mode.paymentModeName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-12">
                    <label>Payment Description</label>
                    <textarea name="paymentDescription" className="form-control" placeholder="Enter Description" onChange={handleChange} value={formData.paymentDescription} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={errorMessage}>Save</button>
                <button type="button" className="btn btn-default" onClick={handleClose}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
