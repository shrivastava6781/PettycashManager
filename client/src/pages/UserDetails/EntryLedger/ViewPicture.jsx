import React, { } from 'react';
import defaultimg from '../../../images/brand_images/default.jpg';
const AddFundRequest = ({ onClose, ViewPicture }) => {
    return (
        <div id="addfundrequestmodal" className="modal fade show" role="dialog" style={{ display: 'block' }}>
            <div style={{ borderRadius: '20px' }} className="modal-dialog modal-lg overflow-hidden">
                <div className="modal-content">
                    <form autoComplete="off" noValidate>
                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-header">
                            <h5 className="modal-title">Add Fund Request</h5>
                            <button type="button" className="button_details" onClick={onClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body ">
                            <div className="row">
                                <div className='d-flex align-items-center justify-content-center'>
                                    <img
                                        src={ViewPicture.picture
                                            ? `${process.env.REACT_APP_LOCAL_URL}/uploads/makeentry/${ViewPicture.picture}`
                                            : defaultimg}
                                        className="useremployee-image"
                                       
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#00509d', color: 'white' }} className="modal-footer">
                            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFundRequest;
