// import React from 'react'

// const PaymentHistory = ({ onClose, record, onUpdate }) => {
//     const [formData, setFormData] = useState({
//       month: record.selectedMonth || "",
//       year: record.selectedYear || "",
//       projectId: record.selectedProject || "",
//       totalAmount: record.totalAmount || 0,
//       dueAmount: record.dueAmount || 0,
//       id: record.labourer.id || 0,
//       labourName: record.labourer.labourName || "",
//       amountPaid: "",
//       amountDate: "",
//       paymentModeId: "",
//       paymentDescription: "",
//       dayShiftRate: record.labourer.dayShift || 0, // Example: Rs 5000 for Day Shift
//       nightShiftRate: record.labourer.nightShift || 0, // Example: Rs 6000 for Night Shift
//       overtimeRate: record.labourer.overtimeHrs || 0, // Example: Rs 100 per overtime hour
//     });
//   const [paymentDetails, setPaymentDetails] = useState([]);
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [dueAmount, setDueAmount] = useState(0);
//   // Fetch payment details when labour is selected
//   useEffect(() => {
//     if (labour.id) {
//       fetchPaymentDetails(labour.id, selectedMonth, selectedYear);
//     }
//   }, [labour.id, selectedMonth, selectedYear]);


//   const fetchPaymentDetails = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/checklabour`, {
//         params: {
//           labourId: labour.id,
//           year: selectedYear,
//           month: selectedMonth,
//         },
//       });

//       // Set payment details for the selected month and year
//       setPaymentDetails(response.data);

//       // Calculate paid amount for the selected month and year
//       const totalPaid = response.data.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
//       setPaidAmount(totalPaid);

//     } catch (error) {
//       console.error("Error fetching payment details:", error);
//       toast.error("Failed to fetch payment details");
//     }
//   };
//   return (
//     <div>
//       <div className="card-body">
//         <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
//           {isLoading ? (
//             <div className="d-flex justify-content-center align-items-center">
//               <ThreeDots color="#00BFFF" height={80} width={80} />
//             </div>
//           ) : (
//             <table className="table table-bordered" style={{ width: "100%" }}>
//               <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#fff" }}>
//                 <tr>
//                   <th>Payment Date</th>
//                   <th>Paid Amount</th>
//                   <th>Mode</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paymentDetails.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center text-dark">No Data</td>
//                   </tr>
//                 ) : (
//                   paymentDetails.map((entry, index) => (
//                     <tr key={index}>
//                       <td> {new Date(entry.amountDate).toLocaleDateString('en-GB')}</td>
//                       <td className='text-end'>&#x20B9;{entry.amountPaid != null ? entry.amountPaid.toFixed(2) : '0.00'}</td>
//                       <td>{entry.paymentModeName}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PaymentHistory









import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

const PaymentHistory = ({ onClose, record, onUpdate }) => {
  const [formData, setFormData] = useState({
    month: record.selectedMonth || "",
    year: record.selectedYear || "",
    projectId: record.selectedProject || "",
    totalAmount: record.totalAmount || 0,
    dueAmount: record.dueAmount || 0,
    id: record.labourer.id || 0,
    labourName: record.labourer.labourName || ""
  });

  const [paymentDetails, setPaymentDetails] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch payment details when labour is selected
  useEffect(() => {
    if (formData.id && formData.month && formData.year) {
      fetchPaymentDetails();
    }
  }, [formData.id, formData.month, formData.year]);

  const fetchPaymentDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_URL}/labourpaymentlist/checklabour`,
        {
          params: {
            labourId: formData.id,
            year: formData.year,
            month: formData.month,
          },
        }
      );

      // Set payment details for the selected month and year
      const data = response.data || [];
      setPaymentDetails(data);

      // Calculate paid amount for the selected month and year
      const totalPaid = data.reduce(
        (sum, payment) => sum + (payment.amountPaid || 0),
        0
      );
      setPaidAmount(totalPaid);

      // Update due amount
      const calculatedDue = formData.totalAmount - totalPaid;
      setDueAmount(calculatedDue);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Failed to fetch payment details");
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    onClose();
  };
  
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
          <div className="card-body">
            <div className="" style={{ maxHeight: "610px", overflowY: "auto" }}>
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <ThreeDots color="#00BFFF" height={80} width={80} />
                </div>
              ) : (
                <table className="table table-bordered" style={{ width: "100%" }}>
                  <thead
                    style={{
                      position: "sticky",
                      top: "0",
                      zIndex: "1",
                      backgroundColor: "#fff",
                    }}
                  >
                    <tr>
                      <th>Payment Date</th>
                      <th>Paid Amount</th>
                      <th>Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentDetails.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-dark">
                          No Data
                        </td>
                      </tr>
                    ) : (
                      paymentDetails.map((entry, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(entry.amountDate).toLocaleDateString("en-GB")}
                          </td>
                          <td className="text-end">
                            &#x20B9;
                            {entry.amountPaid != null
                              ? entry.amountPaid.toFixed(2)
                              : "0.00"}
                          </td>
                          <td>{entry.paymentModeName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              )}
            </div>
          </div>
          <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
            <button type="button" className="button_details" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
    // <div className="card">
    //   <div className="card-header d-flex justify-content-between align-items-center">
    //     <h5>Payment History</h5>
    //     <button className="btn btn-close" onClick={onClose}></button>
    //   </div>
    //   <div className="card-body">
    //     <div style={{ maxHeight: "610px", overflowY: "auto" }}>
    //       {isLoading ? (
    //         <div className="d-flex justify-content-center align-items-center">
    //           <ThreeDots color="#00BFFF" height={80} width={80} />
    //         </div>
    //       ) : (
    //         <table
    //           className="table table-bordered"
    //           style={{ width: "100%" }}
    //         >
    //           <thead
    //             style={{
    //               position: "sticky",
    //               top: "0",
    //               zIndex: "1",
    //               backgroundColor: "#fff",
    //             }}
    //           >
    //             <tr>
    //               <th>Payment Date</th>
    //               <th>Paid Amount</th>
    //               <th>Mode</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {paymentDetails.length === 0 ? (
    //               <tr>
    //                 <td colSpan="3" className="text-center text-dark">
    //                   No Data
    //                 </td>
    //               </tr>
    //             ) : (
    //               paymentDetails.map((entry, index) => (
    //                 <tr key={index}>
    //                   <td>
    //                     {new Date(entry.amountDate).toLocaleDateString("en-GB")}
    //                   </td>
    //                   <td className="text-end">
    //                     &#x20B9;
    //                     {entry.amountPaid != null
    //                       ? entry.amountPaid.toFixed(2)
    //                       : "0.00"}
    //                   </td>
    //                   <td>{entry.paymentModeName}</td>
    //                 </tr>
    //               ))
    //             )}
    //           </tbody>
    //         </table>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default PaymentHistory;
