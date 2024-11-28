// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const UpdateProjectEntry = ({ onClose, onUpdate, ledgerChanges }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     date: '',
//     headId: '',
//     description: '',
//     amount: '',
//     picture: null,
//   });
//   const [heads, setHeads] = useState([]);
//   const [errors, setErrors] = useState({}); // To manage form validation errors

//   useEffect(() => {
//     if (ledgerChanges) {
//       const dateFromDb = new Date(ledgerChanges.date);
//       const localDate = new Date(dateFromDb.getTime() + (dateFromDb.getTimezoneOffset() * 60000));
//       const adjustedLocalDate = new Date(localDate);
//       adjustedLocalDate.setDate(localDate.getDate() + 1);
//       const formattedDate = adjustedLocalDate.toISOString().split('T')[0];

//       setFormData({
//         ...ledgerChanges,
//         date: formattedDate,
//       });
//     }
//   }, [ledgerChanges]);

//   useEffect(() => {
//     const fetchHeads = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/heads`);
//         setHeads(response.data);
//       } catch (error) {
//         console.error('Error fetching heads:', error);
//       }
//     };
//     fetchHeads();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "headId") {
//       const selectedhead = heads.find(head => head.id === parseInt(value));
//       setFormData((prevData) => ({
//         ...prevData,
//         headId: value,
//         headName: selectedhead ? selectedhead.headName : "",
//       }));
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       picture: e.target.files[0],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       formDataToSend.append(key, formData[key]);
//     });

//     try {
//       const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/changeentries/${formData.id}`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log('Data uploaded successfully:', response.data);
//       onUpdate();
//       setTimeout(() => {
//         onClose();
//         window.location.reload(); // Reload the page after submission
//       }, 1000);
//     } catch (error) {
//       console.error('Error uploading data:', error);
//       toast.error('Failed to submit entry');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div id="UpdateProjectEntryModal" className="modal fade show" role="dialog" style={{ display: 'block' }}>
//       <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
//         <div className="modal-content">
//           <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
//             <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
//               <h5 className="modal-title">Update Project Entry</h5>
//               <button type="button" className="button_details" onClick={onClose}>
//                 <i className="fa-solid fa-xmark"></i>
//               </button>
//             </div>
//             <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//               <div className="row">
//                 <div className="form-group col-md-6">
//                   <label>Project Name<span style={{ color: 'red' }}>*</span></label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={formData.projectName || ''}
//                     required
//                     readOnly
//                   />
//                 </div>
//                 <div className="form-group col-md-6">
//                   <label>Supervisor Name<span style={{ color: 'red' }}>*</span></label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={formData.supervisorName || ''}
//                     required
//                     readOnly
//                   />
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="form-group col-md-4">
//                   <label>Date<span style={{ color: 'red' }}>*</span></label>
//                   <input
//                     name="date"
//                     type="date"
//                     className={`form-control ${errors.date ? 'is-invalid' : ''}`}
//                     value={formData.date}
//                     onChange={handleChange}
//                     required
//                   />
//                   {errors.date && <div className="invalid-feedback">{errors.date}</div>}
//                 </div>
//                 <div className="form-group col-md-4">
//                   <label>Head<span style={{ color: 'red' }}>*</span></label>
//                   <select
//                     name="headId"
//                     className={`form-control ${errors.headId ? 'is-invalid' : ''}`}
//                     onChange={handleChange}
//                     value={formData.headId}
//                     required
//                   >
//                     <option value="">Select head</option>
//                     {heads.map((head) => (
//                       <option key={head.id} value={head.id}>
//                         {head.headName}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.headId && <div className="invalid-feedback">{errors.headId}</div>}
//                 </div>
//                 <div className="form-group col-md-4">
//                   <label>Amount<span style={{ color: 'red' }}>*</span></label>
//                   <input
//                     name="amount"
//                     type="number"
//                     className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
//                     value={formData.amount}
//                     onChange={handleChange}
//                     required
//                     placeholder="Amount"
//                   />
//                   {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Description<span style={{ color: 'red' }}>*</span></label>
//                 <textarea
//                   name="description"
//                   className={`form-control ${errors.description ? 'is-invalid' : ''}`}
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                   placeholder="Entry Description"
//                 />
//                 {errors.description && <div className="invalid-feedback">{errors.description}</div>}
//               </div>
//               <div className="form-group">
//                 <label>Picture<span style={{ color: 'red' }}>*</span></label>
//                 <input
//                   name="picture"
//                   type="file"
//                   className="form-control"
//                   onChange={handleFileChange}
//                   required
//                 />
//                 {errors.picture && <div className="invalid-feedback">{errors.picture}</div>}
//               </div>
//             </div>
//             <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-footer">
//               <button type="submit" className="btn btn-light" disabled={isLoading}>
//                 {isLoading ? 'Submitting...' : 'Submit'}
//               </button>
//               <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateProjectEntry;









import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const MakeEntry = ({ onClose, onUpdate, ledgerChanges }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    headId: '',
    description: '',
    amount: '',
    picture: null,
  });

  useEffect(() => {
    if (ledgerChanges) {
      const dateFromDb = new Date(ledgerChanges.date);
      const localDate = new Date(dateFromDb.getTime() + (dateFromDb.getTimezoneOffset() * 60000));
      const adjustedLocalDate = new Date(localDate);
      adjustedLocalDate.setDate(localDate.getDate() + 1);
      const formattedDate = adjustedLocalDate.toISOString().split('T')[0];
      setFormData({
        ...ledgerChanges,
        date: formattedDate,
      });
    }
  }, [ledgerChanges]);

  const [errors, setErrors] = useState({});
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    const fetchHeads = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/heads`);
        setHeads(response.data);
      } catch (error) {
        console.error('Error fetching heads:', error);
      }
    };
    fetchHeads();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "headId") {
      const selectedhead = heads.find(head => head.id === parseInt(value));
      setFormData((prevData) => ({
        ...prevData,
        headId: value,
        headName: selectedhead ? selectedhead.headName : "",
      }));
    } else
      setFormData({
        ...formData,
        [name]: value,
      });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.2, // Set to 0.5MB for compressed size, adjust as needed
        maxWidthOrHeight: 500, // Adjust dimensions to control quality
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setFormData({
          ...formData,
          picture: compressedFile, // Set compressed file
        });
        toast.success('Image compressed successfully');
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Failed to compress image');
      }
    }
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.date) formErrors.date = 'Date is required';
    if (!formData.headId) formErrors.headId = 'Head is required';
    if (!formData.description) formErrors.description = 'Description is required';
    if (!formData.amount || isNaN(formData.amount)) formErrors.amount = 'Valid amount is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    console.log("formData", formData)
    console.log("formDataToSend", formDataToSend)
    try {
      const response = await axios.put(`${process.env.REACT_APP_LOCAL_URL}/changeentries/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate();
      setTimeout(() => {
        onClose();
        window.location.reload(); // Reload the page after submission
      }, 1000);
    } catch (error) {
      console.error('Error uploading data:', error);
      toast.error('Failed to submit entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="makeentrymodal" className="modal fade show" role="dialog" style={{ display: "block" }}>
      <div style={{ borderRadius: "20px" }} className="modal-dialog modal-lg overflow-hidden">
        <div className="modal-content">
          <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" noValidate>
            <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-header">
              <h5 className="modal-title">Make Entry</h5>
              <button type="button" className="button_details" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label>Project Name<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.projectName || ''}
                    required
                    readOnly
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Supervisor Name<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.supervisorName || ''}
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label>Date<span style={{ color: "red" }}>*</span></label>
                  <input
                    name="date"
                    type="date"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    required
                    value={new Date(formData.date).toLocaleDateString('en-GB')}
                    placeholder='Date'
                    onChange={handleChange}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>
                <div className="form-group col-md-4">
                  <label>Head<span style={{ color: "red" }}>*</span></label>
                  <select
                    name="headId"
                    className={`form-control ${errors.headId ? 'is-invalid' : ''}`}
                    required
                    onChange={handleChange}
                    value={formData.headId}
                  >
                    <option value="">Select head</option>
                    {heads.map((head) => (
                      <option key={head.id} value={head.id}>
                        {head.headName}
                      </option>
                    ))}
                  </select>
                  {errors.headId && <div className="invalid-feedback">{errors.headId}</div>}
                </div>
                <div className="form-group col-md-4">
                  <label>Amount<span style={{ color: "red" }}>*</span></label>
                  <input
                    name="amount"
                    type="number"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    required
                    value={formData.amount}
                    placeholder="Amount"
                    onChange={handleChange}
                  />
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>
              </div>

              <div className="form-group">
                <label>Description<span style={{ color: "red" }}>*</span></label>
                <textarea
                  name="description"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  required
                  value={formData.description}  
                  placeholder="Entry Description"
                  onChange={handleChange}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
              <div className="form-group">
                <label>Picture</label>
                <input
                  name="picture"
                  type="file"
                  className="form-control"
                  required
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div style={{ backgroundColor: "#00509d", color: "white" }} className="modal-footer">
              <button
                type="submit"
                className="btn btn-light"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeEntry;
