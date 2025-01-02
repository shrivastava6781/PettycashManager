import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const MakeEntry = ({ onClose, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    headId: '',
    description: '',
    amount: '',
    picture: null,
  });
  const [errors, setErrors] = useState({});
  const [selectedCash, setSelectedCash] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [heads, setHeads] = useState([]);
  const projectId = localStorage.getItem('projectId');

  useEffect(() => {
    if (projectId) {
      fetchCashDetails(projectId);
      fetchSupervisorDetails(projectId);
    }
  }, [projectId]);

  const fetchCashDetails = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/cash/${projectId}`);
      if (response.data.length > 0) {
        const cash = response.data[0];
        setSelectedCash(cash);
      }
    } catch (error) {
      console.error('Error fetching cash details:', error);
      toast.error('Failed to load cash details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupervisorDetails = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/supervisor/${projectId}`);
      if (response.data.length > 0) {
        const supervisor = response.data[0];
        setSelectedSupervisor(supervisor);
      }
    } catch (error) {
      console.error('Error fetching supervisor details:', error);
      toast.error('Failed to load supervisor details');
    } finally {
      setIsLoading(false);
    }
  };

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

    formDataToSend.append('projectId', projectId);
    formDataToSend.append('projectName', selectedSupervisor?.projectName || '');
    formDataToSend.append('projectShortName', selectedSupervisor?.projectShortName || '');
    formDataToSend.append('supervisorId', selectedSupervisor?.supervisorId || '');
    formDataToSend.append('supervisorName', selectedSupervisor?.employeeName || '');
    console.log("formData",formData)
    console.log("formDataToSend",formDataToSend)

    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/makeEntry`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpdate();
      onClose();
      // setTimeout(() => {
      //   onClose();
      //   window.location.reload(); // Reload the page after submission
      // }, 1000);
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
                    value={selectedSupervisor ? selectedSupervisor.projectName : ''}
                    required
                    readOnly
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Supervisor Name<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedSupervisor ? selectedSupervisor.employeeName : ''}
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
