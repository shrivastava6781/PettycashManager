import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const AddFundRequest = ({ onClose, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [formData, setFormData] = useState({
    projectId: '',
    supervisorId: '',
    projectName: '',
    supervisorName: '',
    employeeName: '',
    requestdate: '',
    requestAmount: '',
    requestdescription: '',
    status: 'Request',
  });
  const [errors, setErrors] = useState({});
  const projectId = localStorage.getItem('projectId');

  // Fetch supervisor details when the component mounts or when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchSupervisorDetails(projectId);
    }
  }, [projectId]);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchSupervisorDetails = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/api/supervisor/${projectId}`);
      if (response.data.length > 0) {
        const supervisor = response.data[0];
        setSelectedSupervisor(supervisor);
        // Set the form data with supervisor details
        setFormData((prevData) => ({
          ...prevData,
          projectId: projectId,
          projectName: supervisor.projectName,
          supervisorId: supervisor.supervisorId,
          supervisorName: supervisor.employeeName,
        }));
      } else {
        toast.error('No supervisor found for this project');
      }
    } catch (error) {
      console.error('Error fetching supervisor details:', error);
      toast.error('Failed to load supervisor details');
    } finally {
      setIsLoading(false);
    }
  };

  // Validate form inputs
  const validate = () => {
    let formErrors = {};
    if (!formData.requestdate) formErrors.requestdate = 'Date is required';
    if (!formData.requestAmount || isNaN(formData.requestAmount) || formData.requestAmount <= 0) 
      formErrors.requestAmount = 'Valid request amount is required';
    if (!formData.requestdescription) formErrors.requestdescription = 'Description is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/addFundRequest`, formData);
      console.log('Fund request submitted successfully:', response.data);
      onUpdate(); // Trigger parent update
      setTimeout(() => {
        onClose();
        window.location.reload();
    }, 1000); // 1 second delay
    } catch (error) {
      console.error('Error submitting fund request:', error);
      toast.error('Failed to submit fund request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="addfundrequestmodal" className="modal fade show" role="dialog" style={{ display: 'block' }}>
      <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
        <div className="modal-content">
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
              <h5 className="modal-title">Add Fund Request</h5>
              <button type="button" className="button_details" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label>Date<span style={{ color: 'red' }}>*</span></label>
                  <input
                    name="requestdate"
                    type="date"
                    className={`form-control ${errors.requestdate ? 'is-invalid' : ''}`}
                    required
                    onChange={handleChange}
                  />
                  {errors.requestdate && <div className="invalid-feedback">{errors.requestdate}</div>}
                </div>
                <div className="form-group col-md-6">
                  <label>Request Amount<span style={{ color: 'red' }}>*</span></label>
                  <input
                    name="requestAmount"
                    type="number"
                    className={`form-control ${errors.requestAmount ? 'is-invalid' : ''}`}
                    required
                    placeholder="Request Amount"
                    onChange={handleChange}
                  />
                  {errors.requestAmount && <div className="invalid-feedback">{errors.requestAmount}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Description<span style={{ color: 'red' }}>*</span></label>
                <textarea
                  name="requestdescription"
                  className={`form-control ${errors.requestdescription ? 'is-invalid' : ''}`}
                  required
                  placeholder="Request Description"
                  onChange={handleChange}
                />
                {errors.requestdescription && <div className="invalid-feedback">{errors.requestdescription}</div>}
              </div>
            </div>
            <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-footer">
              <button type="submit" className="btn btn-light" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFundRequest;
