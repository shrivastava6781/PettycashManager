import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Paper, TextField, Typography } from '@mui/material';
import './Resetpassword.css'; // Import your external CSS file

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('');
        toast.success('Password reset successfully');
        navigate('/');
      } else {
        setMessage(data.error);
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to reset password');
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-between align-items-center bg-body-tertiary" style={{ minHeight: "100vh" }}>
      <ToastContainer /> {/* Toast container */}
      <div className="d-flex flex-column justify-content-between align-items-center gap-3">
        <h1 className='text-black ml-3'>Reset Password</h1>
        <Paper className="reset-password-paper p-4" style={{borderRadius:"10px" }} elevation={3}>
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="reset-password-button"
            >
              Reset Password
            </Button>
          </form>
          {message && (
            <Typography variant="body2" className='text-center m-4' style={{ color: "red" }}>
              {message}
            </Typography>
          )}
        </Paper>
      </div>
      {/* Footer */}
      <footer class="my-2">
        <p class="text-center text-body-secondary border-top pt-3 ">Version 1.0 &copy; Developed by Prospect Digital</p>
      </footer>
    </div>
  );
};

export default ResetPassword;
