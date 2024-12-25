


import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentForm = ({ onClose, record, onUpdate }) => {
  const [formData, setFormData] = useState({
    month: record.selectedMonth || "",
    year: record.selectedYear || "",
    projectId: record.selectedProject || "",
    totalAmount: record.totalAmount || 0,
    dueAmount: record.dueAmount || 0,
    id: record.labourId || 0,
    labourName: record.labourer.labourName || "",
    amountPaid: "",
    amountDate: "",
    paymentModeId: "",
    paymentDescription: "",
  });

  console.log("record",record)
  console.log("Formdata",formData)


  const [paymentModes, setPaymentModes] = useState([]);
  const [labour, setLabour] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch payment modes
  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/addPaymentModes`);
        setPaymentModes(response.data);
      } catch (error) {
        console.error("Error fetching payment modes:", error);
      }
    };

    fetchPaymentModes();
  }, []);

  // Fetch labour data
  useEffect(() => {
    const fetchLabour = async () => {
      if (formData.id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourdetails/${formData.id}`);
          console.log(response.data);
          
          // Check if the response data is an array and extract the first item
          const labourData = response.data[0]; // Assuming the first item in the array is the correct one
  
          // Set the labour data and formData state
          setLabour(labourData);
          setFormData((prev) => ({
            ...prev,
            labourName: labourData.labourName, // Assuming the name field is `labourName`
          }));
        } catch (error) {
          console.error("Error fetching labour:", error);
        }
      }
    };
  
    fetchLabour();
  }, [formData.labourId]);
  

  // Fetch payment details
  useEffect(() => {
    const fetchPaymentForm = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/paymentform/${record.id}`);
        const paymentDetails = response.data;
        setPaymentDetails(paymentDetails);
        const totalPaidAmount = paymentDetails.reduce((sum, payment) => sum + payment.amountPaid, 0);
        const remaining = formData.dueAmount - totalPaidAmount;
        setRemainingAmount(remaining.toFixed(2));
      } catch (error) {
        console.error("Error fetching payment form:", error);
      }
    };

    fetchPaymentForm();
  }, [record.id, formData.dueAmount]);

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


  useEffect(() => {
    console.log("formData",formData)
  }, [])
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.amountPaid) > remainingAmount) {
      setErrorMessage("Amount Paid cannot be greater than Remaining Amount.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/submitPayment`, formData);
      console.log("Payment submitted:", response.data);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div>
      <div id="paymentModal" className="modal fade show" role="dialog" style={{ display: "block", paddingRight: "17px" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="modal-header">
                <h5 className="modal-title">Payment Form</h5>
                <button type="button" className="close" onClick={handleClose}>&times;</button>
              </div>
              <div className="modal-body" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
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
                    <input name="dueAmount" type="text" className="form-control" value={formData.dueAmount} readOnly />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Amount Paid</label>
                    <input name="amountPaid" type="number" className="form-control" placeholder="Enter amount paid" onChange={handleChange} value={formData.amountPaid} required />
                    <small className="text-danger">Remaining amount: {remainingAmount}</small>
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
                      {paymentModes.map((mode) => (
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
                <button type="submit" className="btn btn-primary" disabled={!!errorMessage}>Save</button>
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
