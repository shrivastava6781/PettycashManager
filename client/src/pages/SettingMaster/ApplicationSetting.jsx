import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from '../../components/sidebar/SearchBar';
import Sidebar from '../../components/sidebar/Sidebar';

const ApplicationSetting = ({ handleLogout, username }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        address: '',
        email: '',
        phone: '',
        assetTagPrefix: '',
        description: '',
    });

    const [favicon, setFavicon] = useState('');
    const [landingPageLogo, setLandingPageLogo] = useState('');
    const [dashboardLogo, setDashboardLogo] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);
            const data = response.data;
            if (data) {
                setFormData(data);
                setFavicon(data.favicon ? data.favicon : ''); // Handle null favicon value
                setLandingPageLogo(data.landingPageLogo ? data.landingPageLogo : ''); // Handle null landingPageLogo value
                setDashboardLogo(data.dashboardLogo ? data.dashboardLogo : ''); // Handle null dashboardLogo value
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFaviconChange = (e) => {
        const file = e.target.files[0];
        setFavicon(file);
    }

    const handleLandingPageLogoChange = (e) => {
        const file = e.target.files[0];
        setLandingPageLogo(file);
    }

    const handleDashboardLogoChange = (e) => {
        const file = e.target.files[0];
        setDashboardLogo(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();

        // Append other form data fields
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Append image files if they exist
        if (favicon) formDataToSend.append('favicon', favicon);
        if (landingPageLogo) formDataToSend.append('landingPageLogo', landingPageLogo);
        if (dashboardLogo) formDataToSend.append('dashboardLogo', dashboardLogo);

        try {
            const response = await axios.post(`${process.env.REACT_APP_LOCAL_URL}/settings/upload`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchData();
            toast.success('Data saved successfully');
            setTimeout(() => {
                window.location.reload();
            }, 1000); // 1 second delay
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Failed to save data');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='d-flex w-100 h-100 bg-white '>
            <Sidebar />
            <div className='w-100'>
                <SearchBar username={username} handleLogout={handleLogout} />
                <div className="container-fluid ">
                    <ToastContainer /> {/* Toast container */}
                    <div className="se-pre-con" style={{ display: 'none' }}></div>
                    <div className="row shadow-lg rounded p-2">
                        <div className="col-sm-12 col-md-12 p-0">
                            <div className="panel panel-bd">
                                <div className="panel-heading">
                                    <div className="panel-title">
                                        <div style={{ borderRadius: "10px", background: "rgb(33,131,128)", background: "linear-gradient(9deg, rgba(64,163,160,1) 19%, #00509d 93%)", }} className="d-sm-flex align-items-center justify-content-between shadow-sm mb-2 p-3 ">
                                            <h4 style={{ color: "white" }} className="title-detail fw-bolder font-bold m-0">
                                                Application Settings
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel-body  shadow-sm rounded p-2" style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto", overflowX: "hidden" }}>
                                    <form onSubmit={handleSubmit} className="form-inner" encType="multipart/form-data" acceptCharset="utf-8">
                                        <input type="hidden" name="id" value={formData.id} autoComplete="off" />
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="title" className="col-xs-3 col-form-label">Application Title <span style={{ color: "red" }}>*</span></label>
                                                <div className="col-xs-9">
                                                    <input name="title" type="text" className="form-control" id="title" placeholder="Application Title" value={formData.title} onChange={handleInputChange} autoComplete="off" />
                                                </div>
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="phone" className="col-xs-3 col-form-label">Phone<span style={{ color: "red" }}>*</span></label>
                                                <div className="col-xs-9">
                                                    <input name="phone" type="number" className="form-control" id="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="email" className="col-xs-3 col-form-label">Email Address<span style={{ color: "red" }}>*</span></label>
                                                <div className="col-xs-9">
                                                    <input name="email" type="text" className="form-control" id="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} autoComplete="off" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="address" className="col-xs-3 col-form-label">Address<span style={{ color: "red" }}>*</span></label>
                                            <div className="col-xs-9">
                                                <input name="address" type="text" className="form-control" id="address" placeholder="Address" value={formData.address} onChange={handleInputChange} autoComplete="off" />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-xs-3 col-form-label">Favicon<span style={{ color: "red" }}>*</span></label>
                                            <div className="col-xs-9  d-flex">
                                                <div className="me-2" style={{ width: "90px" }}>
                                                    <img src={`${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${favicon}`} alt="Favicon" className="img-thumbnail" />
                                                </div>
                                                <input type="file" name="favicon" id="favicon" autoComplete="off" onChange={handleFaviconChange} />
                                                <input type="hidden" name="old_favicon" value="" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xs-3 col-form-label">Landing Page Logo<span style={{ color: "red" }}>*</span></label>
                                            <div className="col-xs-9  d-flex">
                                                <div className="me-2 employee-image" style={{ width: "120px" }}>
                                                    <img src={`${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${landingPageLogo}`} alt="Picture" className="img-thumbnail" />
                                                </div>
                                                <input type="file" name="landingPageLogo" id="landingPageLogo" autoComplete="off" onChange={handleLandingPageLogoChange} />
                                                <input type="hidden" name="old_landingPageLogo" value="" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xs-3 col-form-label">Dashboard Logo<span style={{ color: "red" }}>*</span></label>
                                            <div className="col-xs-9  d-flex">
                                                <div className="me-2 employee-image" style={{ width: "120px" }}>
                                                    <img src={`${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${dashboardLogo}`} alt="Picture" className="img-thumbnail" />
                                                </div>
                                                {/* <img src={ dashboardLogo} alt="Picture" className="img-thumbnail" /> */}
                                                <input type="file" name="dashboardLogo" id="dashboardLogo" autoComplete="off" onChange={handleDashboardLogoChange} />
                                                <input type="hidden" name="old_dashboardLogo" value="" autoComplete="off" />
                                            </div>
                                        </div>
                                        {/* <div className="form-group form-group-margin text-left">
                                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                                {isLoading ? 'Loading...' : 'Submit'}
                                            </button>
                                        </div> */}
                                        <div style={{ backgroundColor: '#00509d', color: 'white' ,borderRadius:"5px" }} className="p-2">
                                            <button type="submit" className="button_details" disabled={isLoading}>
                                                {isLoading ? 'Loading...' : 'Submit'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationSetting;
