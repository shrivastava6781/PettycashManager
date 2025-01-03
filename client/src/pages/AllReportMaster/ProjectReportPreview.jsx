import React, { useEffect, useState } from 'react';
import myLogo from '../../images/CashBackground.jpg'; // Updated image reference for bonuses
import axios from 'axios';
import { spacing } from '@mui/system';

const ProjectReportPreview = ({ record, onClose }) => {
    const { recordData = [] } = record || {};
    const filteredProjects = recordData;
    const [setting, setSetting] = useState({});

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL}/settings`);
                setSetting(response.data);
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };
        fetchSetting();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container-fluid">
            <div className="row p-1">
                <div className="modal-content">
                    <div className="modal-header m-0 p-2 d-flex align-items-center justify-content-between px-3">
                        <div>
                            <div style={{ height: "50px", width: "100%" }} className='logo p-1'>
                                <img
                                    src={setting.landingPageLogo
                                        ? `${process.env.REACT_APP_LOCAL_URL}/uploads/settings/${setting.landingPageLogo}`
                                        : myLogo}
                                    style={{ height: "100%", objectFit: "cover" }}
                                    alt="LOGO"
                                />
                            </div>
                        </div>
                        <h4 style={{ color: "#00509d" }} className='title-detail text-uppercase fw-bolder font-bold m-0'>All Project Report</h4>
                        <div className='d-flex align-items-center justify-content-center flex-column '>
                            <h5
                                style={{ color: "#00509d" }}
                                className="title-detail text-uppercase fw-bolder font-bold m-0"
                            >
                                {setting.title || "PETTY CASH MANAGER"}
                            </h5>
                            <small
                                style={{ color: "#00509d" }}
                                className="title-detail text-uppercase fw-bolder font-bold m-0"
                            >
                                {/* <span>{getMonthName(month) || ""}</span> */}
                                {/* <span>{` ${year || ""}`}</span> */}
                            </small>
                        </div>
                    </div>
                    <div className="card-body form-row">
                        <div className='col-md-12'>
                            <table className="table table-striped table-bordered rounded border">
                                <thead>
                                    <tr>
                                        <th style={{ whiteSpace: "nowrap" }}>S.No</th>
                                        <th style={{ whiteSpace: "nowrap" }}>Project Name</th>
                                        <th style={{ whiteSpace: "nowrap" }}>Project Type</th>
                                        <th style={{ whiteSpace: "nowrap" }}>Company Name</th>
                                        <th style={{ whiteSpace: "nowrap" }}>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProjects.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">There are No Projects.</td>
                                        </tr>
                                    ) : (
                                        filteredProjects.map((project, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td> {/* Serial number */}
                                                <td>{project.projectName}</td>
                                                <td>{project.projectType}</td>
                                                <td>{project.employeerName}</td>
                                                <td>{`${project.projectAddress}, ${project.projectstate}, ${project.projectcity}`}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer p-1 d-flex align-items-center justify-content-between">
                        <div>
                            <small className='p-0 m-0'>Powered By - Petty Cash Manager</small>
                        </div>
                        <div className='d-flex gap-2'>
                            <button onClick={handlePrint} className="btn btn-success print-button">
                                <i className="fa fa-download"></i> Print
                            </button>
                            <button onClick={onClose} className="btn btn-danger print-button">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectReportPreview;
