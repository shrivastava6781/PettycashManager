// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ThreeDots } from 'react-loader-spinner';

// const AddSupervisor = ({ onClose, onUpdate }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [formData, setFormData] = useState({
//         projectId: '',
//         supervisorId: '',
//         appointmentDate: '',
//         projectName: '',
//         projectCode: '',
//         employeerName: '',
//         projectType: '',
//         projectAddress: '',
//         projectstate: '',
//         projectcity: '',
//         projectpincode: '',
//         employeeName: '',
//         employeeCode: '',
//         employeeEmail: '',
//         employeePhone: '',
//         fatherName: '',
//         employeePanAddhar: '',
//         departmentName: '',
//         departmentId: '',
//         designationName: '',
//         designationId: '',
//         username: localStorage.getItem('username'),
//     });
//     const [projects, setProjects] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [projectDetails, setProjectDetails] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [projectResponse, employeeResponse] = await Promise.all([
//                     axios.get(`${process.env.REACT_APP_LOCAL_URL}/projects`),
//                     axios.get(`${process.env.REACT_APP_LOCAL_URL}/employees/not-supervisor`), // New route
//                 ]);
//                 setProjects(projectResponse.data);
//                 setEmployees(employeeResponse.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleProjectChange = (e) => {
//         const selectedProjectId = e.target.value;
//         const selectedProject = projects.find(project => String(project.id) === selectedProjectId);

//         if (selectedProject) {
//             setFormData({
//                 ...formData,
//                 projectId: selectedProjectId,
//                 projectName: selectedProject.projectName,
//                 projectCode: selectedProject.projectCode,
//                 employeerName: selectedProject.employeerName,
//                 projectType: selectedProject.projectType,
//                 projectAddress: selectedProject.projectAddress,
//                 projectstate: selectedProject.projectstate,
//                 projectcity: selectedProject.projectcity,
//                 projectpincode: selectedProject.projectpincode,
//                 employeePicture: selectedProject.picture
//             });
//             setProjectDetails(selectedProject);
//         }
//     };

//     const handleSupervisorChange = (e) => {
//         const selectedEmployeeId = e.target.value;
//         const selectedEmployee = employees.find(employee => String(employee.id) === selectedEmployeeId);

//         if (selectedEmployee) {
//             setFormData({
//                 ...formData,
//                 supervisorId: selectedEmployeeId,
//                 employeeName: selectedEmployee.employeeName,
//                 employeeCode: selectedEmployee.employeeCode,
//                 employeeEmail: selectedEmployee.employeeEmail,
//                 employeePhone: selectedEmployee.employeePhone,
//                 fatherName: selectedEmployee.fatherName,
//                 employeePanAddhar: selectedEmployee.employeePanAddhar,
//                 departmentName: selectedEmployee.departmentName,
//                 departmentId: selectedEmployee.departmentId,
//                 designationName: selectedEmployee.designationName,
//                 designationId: selectedEmployee.designationId,
//                 projectPicture: selectedEmployee.picture,
//             });
//         }
//     };

//     const handleDateChange = (e) => {
//         setFormData({ ...formData, appointmentDate: e.target.value });
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.projectId) newErrors.projectId = 'Project is required';
//         if (!formData.supervisorId) newErrors.supervisorId = 'Supervisor is required';
//         if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//         setIsLoading(true);

//         try {
//             await axios.post(`${process.env.REACT_APP_LOCAL_URL}/assignSupervisor`, formData);
//             onUpdate();
//             setTimeout(() => {
//                 onClose();
//                 window.location.reload();
//             }, 1000);
//         } catch (error) {
//             console.error('Error submitting form:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleClose = () => {
//         onClose();
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             {/* Form fields */}
//             {isLoading ? (
//                 <ThreeDots height="80" width="80" color="blue" />
//             ) : (
//                 <>
//                     {/* Project and Supervisor Selectors */}
//                 </>
//             )}
//         </form>
//     );
// };

// export default AddSupervisor;









import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import expressSession from 'express-session';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import cron from 'node-cron';



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Authentication Details  

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Function to generate a random token
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Function to send password reset email
const sendPasswordResetEmail = (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'prospectdigitals@gmail.com',
      pass: 'lmmh kioy ieiw plff'
    }
  });

  const mailOptions = {
    from: 'prospectdigitals@gmail.com', // Your email address
    to: email, // Recipient's email address (passed from request)
    subject: 'Password Reset',
    text: `Please use the following link to reset your password: ${process.env.REACT_APP_LOCAL_URL}/reset-password/${resetToken}`, // Ensure you're using the right environment variable for the frontend URL
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    db.query('SELECT * FROM temp_signup WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error('MySQL query error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Check if the user exists
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Validate password
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Store user session information
      req.session.user = { email: user.email, id: user.id };

      // User authenticated successfully, generate JWT token
      const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token expires in 1 hour
      });
      console.log(user.username)
      console.log(user.email)
      console.log(user.employeeId)
      // Send the token and username in response body
      res.status(200).json({ message: 'Login successful', token, username: user.username, email: user.email, employeeId: user.employeeId, userType: user.userType });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for checking authentication status
app.get('/check-auth', isAuthenticated, (req, res) => {
  res.status(200).json({ authenticated: true });
});

// Example protected route
app.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Authenticated access' });
});

// Signup Route
// app.post('/signup', async (req, res) => {
//   const { username, email, password, employeeId, userType } = req.body; // Include userType in the destructured variables
//   console.log(req.body);
//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Check if the user already exists in the database
//     db.query('SELECT * FROM temp_signup WHERE email = ?', [email], async (error, results) => {
//       if (error) {
//         console.error('MySQL query error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       if (results.length > 0) {
//         return res.status(400).json({ error: 'User already exists' });
//       }

//       // Insert the new user into the database
//       db.query(
//         'INSERT INTO temp_signup (username, email, password, employeeId, userType) VALUES (?, ?, ?, ?, ?)',
//         [username, email, hashedPassword, employeeId, userType], // Pass the userType here
//         (error, results) => {
//           if (error) {
//             console.error('MySQL query error:', error);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           res.status(201).json({ message: 'User created successfully' });
//         }
//       );
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// Signup Route /signup





app.post('/signup', async (req, res) => {
  const { username, email, password, employeeId, projectId, userType } = req.body;
  console.log(req.body);

  try {
    // Check if an admin already exists
    if (userType === 'admin') {
      db.query('SELECT * FROM temp_signup WHERE userType = ?', ['admin'], async (error, results) => {
        if (error) {
          console.error('MySQL query error:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
          // If an admin already exists, return an error
          return res.status(400).json({ error: 'Admin already exists' });
        }

        // If no admin exists, proceed to create the user
        createUser(username, email, password, employeeId, projectId, userType, res);
      });
    } else {
      // For non-admin users, simply create the user
      createUser(username, email, password, employeeId, projectId, userType, res);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to create a new user
const createUser = async (username, email, password, employeeId, projectId, userType, res) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO temp_signup (username, email, password, employeeId,projectId, userType) VALUES (?, ?, ?, ?, ? ,?)',
      [username, email, hashedPassword, employeeId, projectId, userType],
      (error, results) => {
        if (error) {
          console.error('MySQL query error:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'User created successfully' });
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Forgot Password Route
app.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    db.query('SELECT * FROM temp_signup WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error('MySQL query error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = results[0];

      // Generate password reset token and save it to the user document
      const resetToken = generateResetToken();

      // Set expiration time 1 hour from now
      const expirationDate = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ');

      // Update the user record in the database with the reset token and expiration time
      db.query('UPDATE temp_signup SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?', [resetToken, expirationDate, user.id], async (updateError, updateResults) => {
        if (updateError) {
          console.error('MySQL query error:', updateError);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Send email to user with the reset token
        sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({ message: 'Password reset instructions sent to your email' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for handling password reset
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find the user by reset token and ensure it's not expired
    db.query('SELECT * FROM temp_signup WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [token, Date.now()], async (error, results) => {
      if (error) {
        console.error('MySQL query error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      const user = results[0];

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password and clear reset token fields
      db.query('UPDATE temp_signup SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?', [hashedPassword, user.id], async (updateError, updateResults) => {
        if (updateError) {
          console.error('MySQL query error:', updateError);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Password reset successful' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch login details by email
app.get('/logindetails/:email', (req, res) => {
  const { email } = req.params;

  const query = 'SELECT * FROM temp_signup WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching temp_signup records:', err);
      res.status(500).json({ error: 'Error fetching records' });
      return;
    }
    res.json(results);
  });
});

// Authentication Details End 










// Multer configuration for handling file uploads for employees
const employeeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'employees'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const employeeUpload = multer({ storage: employeeStorage });


// Multer configuration for handling file uploads for Make Entry
const makeEntryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'makeentry'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const makeEntryUpload = multer({ storage: makeEntryStorage });


// Multer configuration for handling file uploads for assets
const vendorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'vendor'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const vendorUpload = multer({ storage: vendorStorage });

// Multer configuration for handling file uploads for settings
const settingsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'settings'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const settingsUpload = multer({ storage: settingsStorage });
// Multer configuration for handling file uploads for settings
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'profile'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }

});
const profileUpload = multer({ storage: profileStorage });



// Multer configuration for handling file uploads for offices
const officeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'office'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const officeUpload = multer({ storage: officeStorage });


// Multer configuration for handling file uploads for offices
const projectStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'project'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const projectUpload = multer({ storage: projectStorage });
// Multer configuration for handling file uploads for outward
const outwardStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public', 'uploads', 'outward'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const outwardUpload = multer({ storage: outwardStorage });
// rough company_details







app.post('/profile/upload', profileUpload.single('picture'), async (req, res) => {
  // Extract form data and uploaded file from request
  const formData = req.body;
  const { id, fullName, designation, email, phone, address, departmentName, employeeCode, state, city, pincode } = formData;
  let picture = null; // Initialize picture variable

  // Check if file was uploaded
  if (req.file) {
    picture = req.file.filename; // Get the filename of the uploaded profile picture
  }

  try {
    // Check if data already exists in the database
    const existingData = await checkExistingData();

    if (existingData) {
      // Data exists, update it
      await updateData(id);
    } else {
      // Data doesn't exist, insert new data
      await insertData();
    }

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }

  // Function to check if data already exists in the database
  async function checkExistingData() {
    return new Promise((resolve, reject) => {
      const checkSql = 'SELECT * FROM profiles WHERE id = ?';
      db.query(checkSql, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length ? result[0] : null);
        }
      });
    });
  }

  // Function to insert new data into the database
  async function insertData() {
    return new Promise((resolve, reject) => {
      const insertSql = 'INSERT INTO profiles (fullName, designation, email, phone, address ,departmentName,employeeCode,state,city,pincode, picture) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)';
      const values = [fullName, designation, email, phone, address, departmentName, employeeCode, state, city, pincode, , picture];
      db.query(insertSql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Function to update existing data in the database
  async function updateData(id) {
    return new Promise((resolve, reject) => {
      const updateSql = 'UPDATE profiles SET fullName = ?, designation = ?, email = ?, phone = ?, address = ?,departmentName= ?,employeeCode= ?,state= ?,city= ?,pincode = ?' +
        (picture ? ', picture = ?' : '') +
        ' WHERE id = ?';
      let values = [fullName, designation, email, phone, address, departmentName, employeeCode, state, city, pincode,];

      // Add picture to the values array if it is not null
      if (picture) values.push(picture);

      // Add the id to the end of the values array
      values.push(id);

      db.query(updateSql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
});

// Get the data of the Company Data for the last ID
app.get('/profile/data', (req, res) => {
  const sql = 'SELECT * FROM profiles ORDER BY id DESC LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching Company data:', err);
      return res.status(500).send(err);
    }
    res.json(results[0]); // Send the first (and only) result
  });
});




app.post('/settings/upload', settingsUpload.fields([
  { name: 'favicon', maxCount: 1 },
  { name: 'landingPageLogo', maxCount: 1 },
  { name: 'dashboardLogo', maxCount: 1 }
]), async (req, res) => {
  // Extract form data and uploaded files from request
  const formData = req.body;
  const { id, title, address, email, phone, assetTagPrefix, description } = formData;
  const files = req.files;

  // Process the uploaded files
  let favicon = null;
  let landingPageLogo = null;
  let dashboardLogo = null;

  // Check if files are uploaded and update the corresponding variables
  if (files['favicon']) {
    favicon = files['favicon'][0].filename;
  }
  if (files['landingPageLogo']) {
    landingPageLogo = files['landingPageLogo'][0].filename;
  }
  if (files['dashboardLogo']) {
    dashboardLogo = files['dashboardLogo'][0].filename;
  }

  try {
    // Check if data already exists in the database
    const existingData = await checkExistingData();

    if (existingData) {
      // Data exists, update it
      await updateData(id);
    } else {
      // Data doesn't exist, insert new data
      await insertData();
    }

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }

  // Function to check if data already exists in the database
  async function checkExistingData() {
    return new Promise((resolve, reject) => {
      const checkSql = 'SELECT * FROM company_details WHERE id = ?';
      db.query(checkSql, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length ? result[0] : null);
        }
      });
    });
  }

  // Function to insert new data into the database
  async function insertData() {
    return new Promise((resolve, reject) => {
      const insertSql = 'INSERT INTO company_details (title, address, email, phone, assetTagPrefix,description, favicon, landingPageLogo, dashboardLogo) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
      const values = [title, address, email, phone, assetTagPrefix, description, favicon, landingPageLogo, dashboardLogo];
      db.query(insertSql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Function to update existing data in the database
  async function updateData(id) {
    return new Promise((resolve, reject) => {
      const updateSql = 'UPDATE company_details SET title = ?, address = ?, email = ?, phone = ?, assetTagPrefix = ?,description = ?' +
        (favicon ? ', favicon = ?' : '') +
        (landingPageLogo ? ', landingPageLogo = ?' : '') +
        (dashboardLogo ? ', dashboardLogo = ?' : '') +
        ' WHERE id = ?';
      let values = [title, address, email, phone, assetTagPrefix, description];

      // Add values to the array only if they are not null
      if (favicon) values.push(favicon);
      if (landingPageLogo) values.push(landingPageLogo);
      if (dashboardLogo) values.push(dashboardLogo);

      // Add the id to the end of the values array
      values.push(id);

      db.query(updateSql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
});


app.post('/settings/upload', settingsUpload.fields([
  { name: 'favicon', maxCount: 1 },
  { name: 'landingPageLogo', maxCount: 1 },
  { name: 'dashboardLogo', maxCount: 1 }
]), async (req, res) => {
  // Extract form data and uploaded files from request
  const formData = req.body;
  const { id, title, address, email, phone, assetTagPrefix, description } = formData;
  const files = req.files;

  // Process the uploaded files
  let favicon = null;
  let landingPageLogo = null;
  let dashboardLogo = null;

  // Check if files are uploaded and update the corresponding variables
  if (files['favicon']) {
    favicon = files['favicon'][0].filename;
  }
  if (files['landingPageLogo']) {
    landingPageLogo = files['landingPageLogo'][0].filename;
  }
  if (files['dashboardLogo']) {
    dashboardLogo = files['dashboardLogo'][0].filename;
  }

  try {
    // Check if data already exists in the database
    const existingData = await checkExistingData();

    if (existingData) {
      // Data exists, update it
      await updateData(id);
    } else {
      // Data doesn't exist, insert new data
      await insertData();
    }

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }

  // Function to check if data already exists in the database
  async function checkExistingData() {
    return new Promise((resolve, reject) => {
      const checkSql = 'SELECT * FROM company_details WHERE id = ?';
      db.query(checkSql, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length ? result[0] : null);
        }
      });
    });
  }

  // Function to insert new data into the database
  async function insertData() {
    return new Promise((resolve, reject) => {
      const insertSql = 'INSERT INTO company_details (title, address, email, phone, assetTagPrefix,description, favicon, landingPageLogo, dashboardLogo) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
      const values = [title, address, email, phone, assetTagPrefix, description, favicon, landingPageLogo, dashboardLogo];
      db.query(insertSql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Function to update existing data in the database
  async function updateData(id) {
    return new Promise((resolve, reject) => {
      const updateSql = 'UPDATE company_details SET title = ?, address = ?, email = ?, phone = ?, assetTagPrefix = ?,description = ?' +
        (favicon ? ', favicon = ?' : '') +
        (landingPageLogo ? ', landingPageLogo = ?' : '') +
        (dashboardLogo ? ', dashboardLogo = ?' : '') +
        ' WHERE id = ?';
      let values = [title, address, email, phone, assetTagPrefix, description];

      // Add values to the array only if they are not null
      if (favicon) values.push(favicon);
      if (landingPageLogo) values.push(landingPageLogo);
      if (dashboardLogo) values.push(dashboardLogo);

      // Add the id to the end of the values array
      values.push(id);

      db.query(updateSql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
});


// states fetching  
// States fetching 
app.get('/states', (req, res) => {
  const sql = 'SELECT * FROM  states';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching States:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});
// states fetching 

// active inactive
app.post('/activeinactive', (req, res) => {
  const {
    employeeId,
    employeeName, employeeCode,
    status,
    reason,
    fromDate,
    toDate,
    description
  } = req.body;

  // SQL query to insert data into employee_status_updates table
  const sql = `
    INSERT INTO active_inactive 
      (employeeId, employeeName,employeeCode, status, reason, fromDate, toDate, description) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(sql, [employeeId, employeeName, employeeCode, status, reason, fromDate, toDate, description], (err, result) => {
    if (err) {
      console.error('Error uploading active_inactive data:', err);
      return res.status(500).send(err);
    }
    console.log('Active/Inactive data uploaded:', result);
    res.send('Active/Inactive data uploaded');
  });
});

app.get('/activeinactive', (req, res) => {
  const sql = `
    SELECT *
    FROM active_inactive
    WHERE status IN ('request_leave')
    AND (employeeId, updatedAt) IN (
        SELECT employeeId, MAX(updatedAt)
        FROM active_inactive
        WHERE status IN ('request_leave')
        GROUP BY employeeId
    );
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching active_inactive:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/activeinactive/leave', (req, res) => {
  const sql = `
    SELECT *
    FROM active_inactive
    WHERE status = 'request_leave'
    AND (employeeId, updatedAt) IN (
        SELECT employeeId, MAX(updatedAt)
        FROM active_inactive
        WHERE status = 'request_leave'
        GROUP BY employeeId
    );
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching active_inactive:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/activeinactive/resignterminate', (req, res) => {
  const sql = `
    SELECT ai.*
    FROM active_inactive ai
    INNER JOIN (
      SELECT employeeId, MAX(id) AS maxId
      FROM active_inactive
      GROUP BY employeeId
    ) latest
    ON ai.employeeId = latest.employeeId
    AND ai.id = latest.maxId
    WHERE ai.status = 'resign_terminate';
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching active_inactive:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});




app.put('/activeinactive_status/:id', (req, res) => {
  const employeeId = req.params.id;
  const { status } = req.body;

  // SQL query to get the last occurrence of the employee based on the highest id
  const selectSql = 'SELECT id FROM active_inactive WHERE employeeId = ? ORDER BY id DESC LIMIT 1';

  db.query(selectSql, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching the last occurrence of the employee:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).send('Employee not found');
    }

    const lastOccurrenceId = results[0].id;

    // SQL query to update the status of the last occurrence
    const updateSql = 'UPDATE active_inactive SET status = ? WHERE id = ?';
    const params = [status, lastOccurrenceId];

    db.query(updateSql, params, (err, updateResults) => {
      if (err) {
        console.error('Error updating active_inactive details:', err);
        return res.status(500).send(err);
      }

      res.status(200).send('Active/inactive details updated successfully');
    });
  });
});


app.get('/activeinactive_employee/:id', (req, res) => {
  const employeeId = req.params.id; // Correct parameter name to match route
  // console.log(employeeId); // Check if you're getting the correct employeeId

  const sql = 'SELECT * FROM active_inactive WHERE employeeId = ?';
  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching active_inactive history:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/activeinactive/allleave', (req, res) => {
  const sql = 'SELECT * FROM active_inactive WHERE status = ?';
  db.query(sql, ['leave'], (err, results) => {
    if (err) {
      console.error('Error fetching active_inactive data:', err);
      return res.status(500).send('Error fetching data');
    }
    // Send the results back to the client
    res.status(200).json(results);
  });
});


// active inactive 

// approve details  
app.post('/approved', (req, res) => {
  const {
    employeeId,
    employeeName, activeInactiveDetails_id,
    fromDate,
    toDate,
    status,
    description
  } = req.body;

  // SQL query to insert data into employee_status_updates table
  const sql = `
    INSERT INTO approve_details 
      (employeeId, employeeName,activeInactiveDetails_id,fromDate, toDate, status, description) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(sql, [employeeId, employeeName, activeInactiveDetails_id, fromDate, toDate, status, description], (err, result) => {
    if (err) {
      console.error('Error uploading approve_details data:', err);
      return res.status(500).send(err);
    }
    console.log('approve_details data uploaded:', result);
    res.send('approve_details data uploaded');
  });
});

app.get('/approved', (req, res) => {
  const sql = `
    SELECT ad.*
    FROM approve_details ad
    JOIN (
        SELECT employeeId, MAX(id) AS maxId
        FROM approve_details
        WHERE status = 'approved'
        GROUP BY employeeId
    ) AS latest ON ad.employeeId = latest.employeeId AND ad.id = latest.maxId
    WHERE ad.status = 'approved'
    ORDER BY ad.employeeId;`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching latest approved approve_details:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


// for reject 
// app.get('/approved/reject', (req, res) => {
//   const sql = `
//     SELECT ad.*
//     FROM approve_details ad
//     JOIN (
//         SELECT employeeId, MAX(id) AS maxId
//         FROM approve_details
//         GROUP BY employeeId
//     ) AS latest ON ad.employeeId = latest.employeeId AND ad.id = latest.maxId
//     ORDER BY ad.employeeId;`;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching latest approve_details:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

app.get('/approved/reject', (req, res) => {
  const sql = 'SELECT * FROM approve_details WHERE status = ?';
  db.query(sql, ['reject'], (err, results) => {
    if (err) {
      console.error('Error fetching approve_details data:', err);
      return res.status(500).send('Error fetching data');
    }
    // Send the results back to the client
    res.status(200).json(results);
  });
});




// approve details  

// Get the data of the Company Data for the last ID
app.get('/settings', (req, res) => {
  const sql = 'SELECT * FROM company_details ORDER BY id DESC LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching Company data:', err);
      return res.status(500).send(err);
    }
    res.json(results[0]); // Send the first (and only) result
  });
});

// Route for handling form submission and file upload for employees
// app.post('/empdata', employeeUpload.fields([
//   { name: 'panCardPhoto', maxCount: 1 },
//   { name: 'aadharCardPhoto', maxCount: 1 },
//   { name: 'passportSizePhoto', maxCount: 1 },
//   { name: 'marksheet10thPhoto', maxCount: 1 },
//   { name: 'marksheet12thPhoto', maxCount: 1 },
//   { name: 'resumePhoto', maxCount: 1 },
//   { name: 'otherPhoto', maxCount: 1 },
//   { name: 'drivinglicense', maxCount: 1 },
//   { name: 'passport', maxCount: 1 },
//   { name: 'graductionmarksheet', maxCount: 1 },
//   { name: 'postgraductionmarksheet', maxCount: 1 },
//   { name: 'professionaldegree', maxCount: 1 },
//   { name: 'offerletter', maxCount: 1 },
//   { name: 'joiningletter', maxCount: 1 },
//   { name: 'appointmentletter', maxCount: 1 },
//   { name: 'employeementletter', maxCount: 1 },
//   { name: 'experienceletter', maxCount: 1 },
//   { name: 'passbook_check', maxCount: 1 },
// ]), (req, res) => {
//   const {
//     employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
//     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
//     accountHolderName, accountNumber, bankName, ifscCode, branchName,
//     grossSalary,
//     department, position, interncontractual, joiningDate, medical, travel, insurance,
//     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactName1, emergencyContactRelation1, emergencyContactName2, emergencyContactRelation2, haveChildren,
//     username, employeeCode, children, spouseName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, status
//   } = req.body;

//   // Handling file uploads
//   const panCardPhoto = req.files['panCardPhoto'] ? req.files['panCardPhoto'][0].filename : null;
//   const aadharCardPhoto = req.files['aadharCardPhoto'] ? req.files['aadharCardPhoto'][0].filename : null;
//   const passportSizePhoto = req.files['passportSizePhoto'] ? req.files['passportSizePhoto'][0].filename : null;
//   const marksheet10thPhoto = req.files['marksheet10thPhoto'] ? req.files['marksheet10thPhoto'][0].filename : null;
//   const marksheet12thPhoto = req.files['marksheet12thPhoto'] ? req.files['marksheet12thPhoto'][0].filename : null;
//   const graductionMarksheet = req.files['graductionmarksheet'] ? req.files['graductionmarksheet'][0].filename : null;
//   const postGraductionMarksheet = req.files['postgraductionmarksheet'] ? req.files['postgraductionmarksheet'][0].filename : null;
//   const professionalDegree = req.files['professionaldegree'] ? req.files['professionaldegree'][0].filename : null;
//   const offerLetter = req.files['offerletter'] ? req.files['offerletter'][0].filename : null;
//   const joiningLetter = req.files['joiningletter'] ? req.files['joiningletter'][0].filename : null;
//   const appointmentLetter = req.files['appointmentletter'] ? req.files['appointmentletter'][0].filename : null;
//   const employeementletter = req.files['employeementletter'] ? req.files['employeementletter'][0].filename : null;
//   const experienceLetter = req.files['experienceletter'] ? req.files['experienceletter'][0].filename : null;
//   const passbook_check = req.files['passbook_check'] ? req.files['passbook_check'][0].filename : null;
//   const drivingLicense = req.files['drivinglicense'] ? req.files['drivinglicense'][0].filename : null;
//   const passport = req.files['passport'] ? req.files['passport'][0].filename : null;
//   const resumePhoto = req.files['resumePhoto'] ? req.files['resumePhoto'][0].filename : null;
//   const otherPhoto = req.files['otherPhoto'] ? req.files['otherPhoto'][0].filename : null;

//   // Insert query for employee details
//   const sql = `
//     INSERT INTO employee_details (
//       employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
//       employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
//       accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
//       departmentId, positionId, interncontractual, joiningDate, medical, travel, insurance,
//       fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactName1,emergencyContactRelation1, emergencyContactName2, emergencyContactRelation2,haveChildren,
//       panCardPhoto, aadharCardPhoto, passportSizePhoto, marksheet10thPhoto, marksheet12thPhoto, graductionMarksheet, postGraductionMarksheet, professionalDegree,
//       offerLetter, joiningLetter, appointmentLetter, employeementletter, experienceLetter,passbook_check, drivingLicense, passport, resumePhoto, otherPhoto, username, employeeCode, children, spouseName,
//       employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, status, createdAt, updatedAt
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,?, ?, ?)
//   `;

//   const values = [
//     employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
//     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
//     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
//     department, position, interncontractual, joiningDate, medical, travel, insurance,
//     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactName1, emergencyContactRelation1, emergencyContactName2, emergencyContactRelation2, haveChildren,
//     panCardPhoto, aadharCardPhoto, passportSizePhoto, marksheet10thPhoto, marksheet12thPhoto, graductionMarksheet, postGraductionMarksheet, professionalDegree,
//     offerLetter, joiningLetter, appointmentLetter, employeementletter, experienceLetter, passbook_check, drivingLicense, passport, resumePhoto, otherPhoto, username, employeeCode, children, spouseName,
//     employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, status, new Date(), new Date()
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading employee data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Employee data uploaded:', result);
//     res.send('Employee data uploaded');
//   });
// });

app.put('/updateDocumentation/:id', employeeUpload.fields([
  { name: 'panCardPhoto', maxCount: 1 },
  { name: 'aadharCardPhoto', maxCount: 1 },
  { name: 'passportSizePhoto', maxCount: 1 },
  { name: 'marksheet10thPhoto', maxCount: 1 },
  { name: 'marksheet12thPhoto', maxCount: 1 },
  { name: 'resumePhoto', maxCount: 1 },
  { name: 'otherPhoto', maxCount: 1 },
  { name: 'drivinglicense', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'graductionmarksheet', maxCount: 1 },
  { name: 'postgraductionmarksheet', maxCount: 1 },
  { name: 'professionaldegree', maxCount: 1 },
  { name: 'offerletter', maxCount: 1 },
  { name: 'joiningletter', maxCount: 1 },
  { name: 'appointmentletter', maxCount: 1 },
  { name: 'employeementletter', maxCount: 1 },
  { name: 'experienceletter', maxCount: 1 }
]), (req, res) => {
  const employeeId = req.params.id;

  const fileFields = [
    'panCardPhoto', 'aadharCardPhoto', 'passportSizePhoto', 'marksheet10thPhoto',
    'marksheet12thPhoto', 'graductionmarksheet', 'postGraductionmarksheet', 'professionaldegree',
    'offerletter', 'joiningletter', 'appointmentletter', 'employeementletter',
    'experienceletter', 'drivinglicense', 'passport', 'resumePhoto', 'otherPhoto'
  ];

  const values = fileFields.map(field => req.files[field] ? req.files[field][0].filename : null);
  values.push(employeeId); // Add employeeId as the last parameter

  const sql = `
      UPDATE employee_details SET
      panCardPhoto = COALESCE(?, panCardPhoto), aadharCardPhoto = COALESCE(?, aadharCardPhoto), passportSizePhoto = COALESCE(?, passportSizePhoto), marksheet10thPhoto = COALESCE(?, marksheet10thPhoto), marksheet12thPhoto = COALESCE(?, marksheet12thPhoto), graductionMarksheet = COALESCE(?, graductionMarksheet), postGraductionMarksheet = COALESCE(?, postGraductionMarksheet), professionalDegree = COALESCE(?, professionalDegree),
      offerLetter = COALESCE(?, offerLetter), joiningLetter = COALESCE(?, joiningLetter), appointmentLetter = COALESCE(?, appointmentLetter), employeementletter = COALESCE(?, employeementletter), experienceLetter = COALESCE(?, experienceLetter), drivingLicense = COALESCE(?, drivingLicense), passport = COALESCE(?, passport), resumePhoto = COALESCE(?, resumePhoto), otherPhoto = COALESCE(?, otherPhoto)
      WHERE id = ?
  `;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating employee data:', err);
      return res.status(500).send('Error updating employee data');
    }
    console.log('Employee data updated:', result);
    res.send('Employee data updated');
  });
});

// Function to get employee by ID
const getEmployeeById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM employee_details WHERE id = ?', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

// Function to update employee documentation
const updateEmployeeDocumentation = (id, additionalDocumentation) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE employee_details SET additionalDocumentation = ? WHERE id = ?', [JSON.stringify(additionalDocumentation), id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Route to add documentation
app.post('/addDocumentation/:id', employeeUpload.single('documentFile'), async (req, res) => {
  const employeeId = req.params.id;
  const { documentName } = req.body;
  const documentFile = req.file ? req.file.filename : null;

  console.log("Uploaded file:", documentFile);

  try {
    // Fetch the current employee details from your database
    const employee = await getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).send('Employee not found.');
    }

    let additionalDocumentation = employee.additionalDocumentation ? JSON.parse(employee.additionalDocumentation) : [];

    // Add new documentation
    additionalDocumentation.push({ [documentName]: documentFile });

    // Update the employee documentation in the database
    await updateEmployeeDocumentation(employeeId, additionalDocumentation);
    console.log("Documentation updated:", additionalDocumentation);

    res.send('Documentation updated successfully.');
  } catch (error) {
    console.error('Error updating documentation:', error);
    res.status(500).send('Error updating documentation.');
  }
});

app.put('/employees/:id', employeeUpload.fields([
  { name: 'passbook_check', maxCount: 1 },
]), (req, res) => {
  const {
    employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
    employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
    accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
    department, position, interncontractual, joiningDate, medical, travel, insurance,
    fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactName1, emergencyContactRelation1, emergencyContactName2, emergencyContactRelation2, haveChildren,
    employeeCode, children, spouseName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany
  } = req.body;

  const passbook_check = req.files.passbook_check ? req.files.passbook_check[0].filename : null;

  const sql = `
      UPDATE employee_details SET 
          passbook_check = COALESCE(?, passbook_check), employeeName = ?, departmentName = ?, positionName = ?, employeeEmail = ?, employeePhone = ?, employeeAltPhone = ?, employeeDOB = ?, employeeGender = ?, employeeMaritalStatus = ?, 
          employeePan = ?, employeeAadhar = ?, employeeAddress1 = ?, employeeCity1 = ?, employeeState1 = ?, employeePincode1 = ?, employeeAddress2 = ?, employeeCity2 = ?, employeeState2 = ?, employeePincode2 = ?, employeeType = ?, 
          accountHolderName = ?, accountNumber = ?, bankName = ?, ifscCode = ?, branchName = ?, grossSalary = ?, 
          departmentId = COALESCE(?, departmentId), positionId = COALESCE(?, positionId), interncontractual = ?, joiningDate = ?, medical = ?, travel = ?, insurance = ?, 
          fatherName = ?, motherName = ?, emergencyContactNumber1 = ?, emergencyContactNumber2 = ?, emergencyContactName1 = ?,emergencyContactRelation1 = ?, emergencyContactName2 = ?, emergencyContactRelation2 = ?,haveChildren = ?,
          employeeCode = ?, children = ?, spouseName = ?, employeeBloodGroup = ?, office_id = ?, company_id = ?, joiningOffice = ?, joiningCompany = ?
      WHERE id = ?
  `;

  db.query(sql, [passbook_check, employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
    employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
    accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
    department, position, interncontractual, joiningDate, medical, travel, insurance,
    fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactName1, emergencyContactRelation1, emergencyContactName2, emergencyContactRelation2, haveChildren,
    employeeCode, children, spouseName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, req.params.id], (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Error updating data' });
        return;
      }

      res.json({ message: 'Data updated successfully' });
    });
});






app.put('/employee_status/:id', (req, res) => {
  const employeeId = req.params.id;
  const { status } = req.body;

  // SQL query to update the employee's status
  const sql = 'UPDATE employee_details SET status = ? WHERE id= ?';
  const params = [status, employeeId];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error updating employee details:', err);
      return res.status(500).send(err);
    }
    // Check if any rows were affected (i.e., the employee was found and updated)
    if (results.affectedRows === 0) {
      return res.status(404).send('Employee not found');
    }
    res.status(200).send('Employee details updated successfully');
  });
});

// Route for fetching list of employees 
app.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM employee_details';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// employee Last ID 
// Get Laon Repayemtn API 
app.get('/employee/lastId', (req, res) => {
  const query = 'SELECT id FROM employee_details ORDER BY id DESC LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employee_details records:', err);
      res.status(500).json({ error: 'Error fetching employee_details records' });
      return;
    }
    if (results.length > 0) {
      res.json(results[0].id);
    } else {
      res.json(0); // Assuming you want to return 0 if there are no records
    }
  });
});

// Route for deleting an employee by its ID
app.delete('/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const sql = 'DELETE FROM employee_details WHERE id = ?';
  db.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).send(err);
    }
    console.log('Employee deleted:', result);
    res.send('Employee deleted');
  });
});


// Endpoint to handle file downloads
app.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  console.log(fileName)
  const filePath = path.join('public', 'uploads', 'employees', fileName);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

// transfer history 
app.put('/employees_update/:id', (req, res) => {
  const employeeId = req.params.id;
  const { transferTo, transferToId } = req.body;

  // Validate inputs
  if (!employeeId || !transferTo || !transferToId) {
    return res.status(400).send('Invalid request');
  }

  // SQL query to update the employee's status
  const sql = 'UPDATE employee_details SET joiningOffice = ?, office_id = ? WHERE id = ?';
  const params = [transferTo, transferToId, employeeId];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error updating employee details:', err);
      return res.status(500).send('Error updating employee details');
    }
    // Check if any rows were affected (i.e., the employee was found and updated)
    if (results.affectedRows === 0) {
      return res.status(404).send('Employee not found');
    }
    res.status(200).send('Employee details updated successfully');
  });
});
app.post('/transferHistory', (req, res) => {
  console.log(req.body);
  const { employeeId, employeeName, transferDate, transferFrom, transferFromId, transferTo, transferToId, description } = req.body;

  const sql = 'INSERT INTO transfer_history (employee_id, employee_name, transfer_date, transfer_from, transfer_from_id, transfer_to, transfer_to_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [employeeId, employeeName, transferDate, transferFrom, transferFromId, transferTo, transferToId, description];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading transfer_history data:', err);
      return res.status(500).send(err);
    }
    console.log('Transfer history data uploaded:', result);
    res.send('Transfer history data uploaded');
  });
});

// Route for fetching list of transfer history 
app.get('/transferHistory/:id', (req, res) => {
  const employeeId = req.params.id; // Correct parameter name to match route
  console.log(employeeId); // Check if you're getting the correct employeeId

  const sql = 'SELECT * FROM transfer_history WHERE employee_id = ?';
  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching transfer_history history:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// transfer history end  





// employee code end 

// Office Code  start
// Endpoint to handle form submission
// Endpoint to handle form submission
app.post('/officeData', officeUpload.single('picture'), (req, res) => {
  console.log(req.body);

  const { officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks } = req.body;

  // Prepare the SQL query and values based on whether a file is uploaded
  let sql;
  let values;

  if (req.file) {
    // File is uploaded
    const picturePath = req.file.originalname;
    sql = `INSERT INTO offices (officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks, picturePath];
  } else {
    // No file is uploaded
    sql = `INSERT INTO offices (officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading office data:', err);
      return res.status(500).send('Failed to add office');
    }
    console.log('Office data uploaded:', result);
    res.send('Office data uploaded');
  });
});

// Route for fetching list of offices
app.get('/offices', (req, res) => {
  const sql = 'SELECT * FROM  offices';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching offices:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.delete('/offices/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM offices WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting offices:', err);
      return res.status(500).send(err);
    }
    console.log('offices deleted:', result);
    res.send('offices deleted');
  });
});

// office Code End  
// Project Code Start 
// POST endpoint to handle project data submission

// get the data 
app.get('/projects', (req, res) => {
  const sql = 'SELECT * FROM  project_details';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


app.delete('/projects/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM project_details WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting project_details:', err);
      return res.status(500).send(err);
    }
    console.log('project_details deleted:', result);
    res.send('project_details deleted');
  });
});

// Companies code Start 
// Comapny Details  
app.post('/addCompany', (req, res) => {
  console.log(req.body)
  const { companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData } = req.body;

  const sql = 'INSERT INTO companies (companyName,username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData) VALUES (?,?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData], (err, result) => {
    if (err) {
      console.error('Error uploading company data:', err);
      return res.status(500).send(err);
    }
    console.log('Company data uploaded:', result);
    res.send('Company data uploaded');
  });
});

app.get('/companies', (req, res) => {
  const sql = 'SELECT * FROM  companies';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching companies:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// delete Company Details  
app.delete('/companies/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM companies WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting companies:', err);
      return res.status(500).send(err);
    }
    console.log('companies deleted:', result);
    res.send('companies deleted');
  });
});

// Update company details
app.put('/updateCompany/:id', (req, res) => {
  const companyId = parseInt(req.params.id);
  const updatedCompany = req.body;

  const { companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData } = req.body;

  const sql = 'UPDATE companies SET companyName=?, username=?, companyAddress=?, companyEmail=?, companyPhone=?, companyPAN=?, companyGST=?, qrCodeData=? WHERE id=?';

  db.query(sql, [companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData, companyId], (err, result) => {
    if (err) {
      console.error('Error updating company data:', err);
      return res.status(500).send(err);
    }
    console.log('Company data updated:', result);
    res.send('Company data updated');
  });
});

// companies code end

// Department and Position start 
app.post('/departments', (req, res) => {
  console.log(req.body)
  const { name, description } = req.body;

  const sql = 'INSERT INTO department_details  (name,description) VALUES (?,?)';

  db.query(sql, [name, description], (err, result) => {
    if (err) {
      console.error('Error uploading Department data:', err);
      return res.status(500).send(err);
    }
    console.log('Department data uploaded:', result);
    res.send('Department data uploaded');
  });
});

// get details 
app.get('/departments', (req, res) => {
  const sql = 'SELECT * FROM department_details';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Delete the department Details  
// delete Company Details  
app.delete('/departments/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM department_details WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting department_details:', err);
      return res.status(500).send(err);
    }
    console.log('department_details deleted:', result);
    res.send('department_details deleted');
  });
});


// POST endpoint for adding a position
app.post('/positions', (req, res) => {
  const { departmentId, departmentName, description, name } = req.body;

  const sql = 'INSERT INTO position_details (department_id, departmentName, description, positionName) VALUES (?, ?, ?, ?)';
  const values = [departmentId, departmentName, description, name];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading Position data:', err);
      return res.status(500).send(err);
    }
    console.log('Position data uploaded:', result);
    res.send('Position data uploaded');
  });
});

// get details 
app.get('/positions', (req, res) => {
  const sql = 'SELECT * FROM position_details';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching position_details:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/department_positions/:id', (req, res) => {
  const departmentId = req.params.id; // Correct parameter name to match route
  console.log(departmentId); // Check if you're getting the correct departmentId

  const sql = 'SELECT * FROM position_details WHERE department_id = ?';
  db.query(sql, [departmentId], (err, results) => {
    if (err) {
      console.error('Error fetching position_details history:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/employee_department/:id', (req, res) => {
  const departmentId = req.params.id; // Correct parameter name to match route
  console.log(departmentId); // Check if you're getting the correct departmentId

  const sql = 'SELECT * FROM employee_details WHERE departmentId = ?';
  db.query(sql, [departmentId], (err, results) => {
    if (err) {
      console.error('Error fetching position_details history:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});
// department end 

// Attendence  start 
// Endpoint to handle attendance record creation or update
app.post('/api/attendance', (req, res) => {
  const { employeeId, employeeCode, date, status, overtimeHours } = req.body;

  console.log(employeeId, employeeCode, date, status, overtimeHours);

  try {
    // Check if attendance record exists for given employeeId and date
    const checkExistingQuery = 'SELECT * FROM attendance WHERE employee_id = ? AND employeeCode = ? AND date = ?';
    db.query(checkExistingQuery, [employeeId, employeeCode, date], (error, results) => {
      if (error) {
        console.error('Error checking existing attendance record:', error);
        return res.status(500).send('Error checking existing attendance record');
      }

      if (results.length > 0) {
        // If record exists, update it
        const updateQuery = 'UPDATE attendance SET overtimeHours = ?, status = ? WHERE employee_id = ? AND employeeCode = ? AND date = ?';
        db.query(updateQuery, [overtimeHours, status, employeeId, employeeCode, date], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating attendance record:', updateError);
            return res.status(500).send('Error updating attendance record');
          }
          console.log('Attendance record updated successfully');
          res.status(200).send('Attendance record updated successfully');
        });
      } else {
        // If record doesn't exist, insert new record
        const insertQuery = 'INSERT INTO attendance (employee_id, employeeCode, date, status, overtimeHours) VALUES (?, ?, ?, ?, ?)';
        db.query(insertQuery, [employeeId, employeeCode, date, status, overtimeHours], (insertError, insertResults) => {
          if (insertError) {
            console.error('Error inserting new attendance record:', insertError);
            return res.status(500).send('Error inserting new attendance record');
          }
          console.log('Attendance record created successfully');
          res.status(201).send('Attendance record created successfully');
        });
      }
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).send('Failed to save attendance record');
  }
});




app.get('/api/attendance/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  console.log(employeeId);

  const query = 'SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching attendance records:', err);
      res.status(500).json({ error: 'Error fetching attendance records' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/employee/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM employee_details WHERE id = ?';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee_details records:', err);
      res.status(500).json({ error: 'Error fetching employee_details records' });
      return;
    }
    res.json(results);
  });
});

app.get('/attendance', (req, res) => {
  const sql = 'SELECT * FROM attendance';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Salary Details 

// POST endpoint for adding a position
app.post('/api/advancesalary', (req, res) => {
  const { employeeId, paymentType, month, amount, date, description, paymentModeName } = req.body;

  const sql = 'INSERT INTO salarydetails (employeeId,paymentType,month,amount,date,description,paymentModeName) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [employeeId, paymentType, month, amount, date, description, paymentModeName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading Position data:', err);
      return res.status(500).send(err);
    }
    console.log('Position data uploaded:', result);
    res.send('Position data uploaded');
  });
});

// PAyment Mode 

app.post('/addPaymentMode', (req, res) => {
  const { accountName, accountNumber, bankName, branch, ifscCode, paymentModeName, paymentType, username } = req.body;

  const sql = 'INSERT INTO paymentmode_details (accountName ,accountNumber ,bankName ,branch ,ifscCode ,paymentModeName, paymentType,username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [accountName, accountNumber, bankName, branch, ifscCode, paymentModeName, paymentType, username];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading payment data:', err);
      return res.status(500).send(err);
    }
    console.log('Payment data uploaded:', result);
    res.send('Payment data uploaded');
  });
});


// get details 
app.get('/addPaymentModes', (req, res) => {
  const sql = 'SELECT * FROM paymentmode_details';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching addPaymentMode:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


// Add Loan 
app.post('/addLoan', (req, res) => {
  const {
    departmentId,
    departmentName,
    employeeId,
    employeeName,
    employeeCode,
    loanAmount,
    loanApprovedById,
    loanApprovedByName,
    loanDate,
    loanDescription,
    loanFor,
    loanRepayType,
    loanRepaymentDate,
    otherLoanForReason,
    remark,
    loanNumber,
    principalAmount,
    interestAmount,
    username
  } = req.body;

  const sql = `
    INSERT INTO loandetails (
      departmentId, 
      departmentName, 
      employeeId, 
      employeeName, 
      employeeCode,
      loanAmount, 
      loanApprovedById, 
      loanApprovedByName, 
      loanDate, 
      loanDescription, 
      loanFor, 
      loanRepayType, 
      loanRepaymentDate, 
      otherLoanForReason, 
      remark, 
      loanNumber,
      principalAmount,
      interestAmount,
      username
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?,?,?)
  `;

  const values = [
    departmentId,
    departmentName,
    employeeId,
    employeeName,
    employeeCode,
    loanAmount,
    loanApprovedById,
    loanApprovedByName,
    loanDate,
    loanDescription,
    loanFor,
    loanRepayType,
    loanRepaymentDate,
    otherLoanForReason,
    remark,
    loanNumber,
    principalAmount,
    interestAmount,
    username
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading loan data:', err);
      return res.status(500).send('Error uploading loan data');
    }
    console.log('Loan data uploaded:', result);
    res.send('Loan data uploaded');
  });
});
//  Get loan for the templotyee 
app.get('/api/loandetails/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM loandetails WHERE employeeId = ? ORDER BY id DESC';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching loandetails records:', err);
      res.status(500).json({ error: 'Error fetching Loan_details records' });
      return;
    }
    res.json(results);
  });
});

// Get Laon Repayemtn API 
app.get('/api/repaymentdetails/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM loanrepayments WHERE employeeId = ? ORDER BY id DESC';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching loanrepayments records:', err);
      res.status(500).json({ error: 'Error fetching Loan_details records' });
      return;
    }
    res.json(results);
  });
});

// Taking the loan and the empoloyee details 
// GET route to fetch loan details grouped by employee
app.get('/loanDetails', (req, res) => {
  const query = `
    SELECT employeeId, employeeName, COUNT(*) as loanCount
    FROM loandetails
    GROUP BY employeeId, employeeName
    ORDER BY employeeId;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching loan details:', err);
      res.status(500).json({ message: 'Error fetching loan details' });
      return;
    }
    res.json(results);
  });
});


// Loan Repayment Details 
app.post('/addLoanRepayment', (req, res) => {
  const {
    employeeId,
    id,  // Assuming this is the loanId
    departmentId,
    departmentName,
    employeeName,
    loanNumber,
    loanAmount,
    loanDate,
    repaymentAmount,
    repaymentDate,
    repaymentMode,
    repaymentdescription  // Ensure this matches the database column name
  } = req.body;

  const sql = `
    INSERT INTO loanrepayments (
      employeeId,
      loanId,
      departmentId,
      departmentName,
      employeeName,
      loanNumber,
      loanAmount,
      loanDate,
      repaymentAmount,
      repaymentDate,
      repaymentMode,
      
      repaymentDescription
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    employeeId,
    id,  // Assuming this is the loanId
    departmentId,
    departmentName,
    employeeName,
    loanNumber,
    loanAmount,
    loanDate,
    repaymentAmount,
    repaymentDate,
    repaymentMode,
    repaymentdescription
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading loan data:', err);
      return res.status(500).send('Error uploading loan data');
    }
    console.log('Loan data uploaded:', result);
    res.send('Loan data uploaded');
  });
});

app.get('/api/repaymentdetailsHistory/:loanId', (req, res) => {
  const { loanId } = req.params;

  const query = 'SELECT * FROM loanrepayments WHERE loanId = ? ORDER BY id DESC';
  db.query(query, [loanId], (err, results) => {
    if (err) {
      console.error('Error fetching loanrepayments records:', err);
      res.status(500).json({ error: 'Error fetching Loan_details records' });
      return;
    }
    res.json(results);
  });
});
// last loan id  api/loandetails
app.get('/lastloanId', (req, res) => {
  const sql = 'SELECT * FROM loandetails ORDER BY id DESC LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching last loan ID:', err);
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      res.json(results[0].id);
    } else {
      res.status(404).send('No loan details found');
    }
  });
});


// Change Salary
app.post('/changesalary', (req, res) => {
  const { specialallowances, dearnessallowances, conveyanceallowances, houserentallowances, basicSalary, employeeId, employeeName, epfEmployee, epfEmployer, epfesicApplicable, esicApplicable, esicEmployee, esicEmployer, grossSalary, tdsApplicable, totalEmployeeDeduction, totalEmployerContribution, totalInHandSalary, totalPayableSalary, totalTdsDeduction, vda, date } = req.body;

  const sql = `INSERT INTO changesalary ( specialallowances,dearnessallowances,conveyanceallowances,houserentallowances,basicSalary,employeeId,employeeName,epfEmployee,epfEmployer,epfesicApplicable,esicApplicable,esicEmployee,esicEmployer,grossSalary,tdsApplicable,totalEmployeeDeduction,totalEmployerContribution,totalInHandSalary,totalPayableSalary,totalTdsDeduction,vda,date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [specialallowances, dearnessallowances, conveyanceallowances, houserentallowances, basicSalary, employeeId, employeeName, epfEmployee, epfEmployer, epfesicApplicable, esicApplicable, esicEmployee, esicEmployer, grossSalary, tdsApplicable, totalEmployeeDeduction, totalEmployerContribution, totalInHandSalary, totalPayableSalary, totalTdsDeduction, vda, date];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error logging salary change:', err);
      return res.status(500).send('Error logging salary change');
    }
    console.log('Salary change logged:', result);
    res.send('Salary change logged');
  });
});

// Update employee salary details
app.put('/updatesalary/:id', (req, res) => {
  const id = req.params.id;
  const {
    specialallowances, dearnessallowances, conveyanceallowances, houserentallowances,
    basicSalary,
    epfEmployee,
    epfEmployer,
    epfesicApplicable,
    esicApplicable,
    esicEmployee,
    esicEmployer,
    grossSalary,
    tdsApplicable,
    totalEmployeeDeduction,
    totalEmployerContribution,
    totalInHandSalary,
    totalPayableSalary,
    totalTdsDeduction,
    vda
  } = req.body;

  const sql = `UPDATE employee_details SET 
    specialallowances = ?,dearnessallowances = ?,conveyanceallowances = ?,houserentallowances = ?,basicSalary = ?,epfEmployee = ?,epfEmployer = ?,epfesicApplicable = ?,esicApplicable = ?,esicEmployee = ?,esicEmployer = ?,grossSalary = ?,tdsApplicable = ?,totalEmployeeDeduction = ?,totalEmployerContribution = ?,totalInHandSalary = ?,totalPayableSalary = ?,totalTdsDeduction = ?,vda = ?
    WHERE id = ?`;

  const values = [
    specialallowances, dearnessallowances, conveyanceallowances, houserentallowances,
    basicSalary,
    epfEmployee,
    epfEmployer,
    epfesicApplicable,
    esicApplicable,
    esicEmployee,
    esicEmployer,
    grossSalary,
    tdsApplicable,
    totalEmployeeDeduction,
    totalEmployerContribution,
    totalInHandSalary,
    totalPayableSalary,
    totalTdsDeduction,
    vda,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating employee salary details:', err);
      return res.status(500).send('Error updating employee salary details');
    }
    console.log('Employee salary details updated:', result);
    res.send('Employee salary details updated');
  });
});



// Get Laon Repayemtn API 
app.get('/api/salaryHistory/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM changesalary WHERE employeeId = ? ORDER BY id DESC';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching changesalary records:', err);
      res.status(500).json({ error: 'Error fetching Loan_details records' });
      return;
    }
    res.json(results);
  });
});

// Route to handle POST request for adding Bonus/Incentive
app.post('/addBonusIncentive', (req, res) => {
  const { amount, departmentId, departmentName, employeeId, employeeName, fromDate, toDate, declarationDate, paymentType, reason, remark, employeeCode, username } = req.body;

  const sql = `
    INSERT INTO bonusincentive (
      amount, departmentId, departmentName, employeeId, employeeName,
      fromDate, toDate, declarationDate,
      paymentType, reason, remark,employeeCode, username
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    amount, departmentId, departmentName, employeeId, employeeName,
    fromDate, toDate, declarationDate,
    paymentType, reason, remark, employeeCode, username
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading bonusincentive data:', err);
      return res.status(500).send('Error uploading bonusincentive data');
    }
    console.log('Bonus/Incentive data uploaded:', result);
    res.send('Bonus/Incentive data uploaded');
  });
});
// BonusIncentive get details 
// Get BonusIncentive
app.get('/bonousinsentivehistory/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM bonusincentive WHERE employeeId = ? ORDER BY id DESC';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching bonusincentive records:', err);
      res.status(500).json({ error: 'Error fetching Loan_details records' });
      return;
    }
    res.json(results);
  });
});
// BonouseInsentive Payment  api/repaymentdetails /api/loandetails/
// Route to handle POST request for adding Bonus/Incentive
app.post('/submitbonousinsentivePayment', (req, res) => {
  const {
    id,
    departmentId,
    amount,
    departmentName,
    employeeCode,
    employeeId,
    employeeName,
    paymentAmount,
    paymentDate,
    bonousinsentivepaymentModeName,
    bonousinsentivepaymentModeId,
    paymentType
  } = req.body;

  const sql = `
    INSERT INTO payment_bonus_incentive (
    bonousinsentiveId,
      departmentId,
      bonousinsentiveamount,
      departmentName,
      employeeCode,
      employeeId,
      employeeName,
      paymentAmount,
      paymentDate,
      paymentMode,
      paymentModeId,
      paymentType
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
    id,
    departmentId,
    amount,
    departmentName,
    employeeCode,
    employeeId,
    employeeName,
    paymentAmount,
    paymentDate,
    bonousinsentivepaymentModeName,
    bonousinsentivepaymentModeId,
    paymentType
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading Payment bonus/incentive data:', err);
      return res.status(500).send('Error uploading Payment bonus/incentive data');
    }
    console.log('Payment Bonus/Incentive data uploaded:', result);
    res.send('Payment Bonus/Incentive data uploaded');
  });
});

app.get('/bonousinsentive/paymenthistory/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM payment_bonus_incentive WHERE employeeId = ?';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching payment_bonus_incentive records:', err);
      res.status(500).json({ error: 'Error fetching Loan_details records' });
      return;
    }
    res.json(results);
  });
});

app.get('/bonousinsentive/viewbonous/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM payment_bonus_incentive WHERE bonousinsentiveId = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching payment_bonus_incentive records:', err);
      res.status(500).json({ error: 'Error fetching Loan_details records' });
      return;
    }
    res.json(results);
  });
});

// Bonous List 
// Route for fetching list of bonousinsentivelist 
app.get('/bonousinsentivelist', (req, res) => {
  const sql = 'SELECT * FROM bonusincentive';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching bonousinsentivelist:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route for fetching list of paymentbonousinsentivelist 
app.get('/paymentbonousinsentivelist', (req, res) => {
  const sql = 'SELECT * FROM payment_bonus_incentive';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching paymentbonousinsentivelist:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Salary Slip 
// Route to handle POST request for adding Salary Slip data

app.post('/payroll', (req, res) => {
  const {
    employeeId, employeeCode, month, year, VDAmonth, additionalAllowance, allowanceDescription, allowancesMonth, conveyanceAllowancesMonth,
    houseRentallowancesMonth,
    dearnessallowancesMonth,
    specialallowancesMonth,
    hr_id,
    hrManagerName, totalAttencance,
    basicSalaryMonth, deductionDescription, epfEmployeeMonth, epfEmployerMonth, epfesicApplicableMonth,
    esicEmployeeMonth, esicEmployerMonth, grossSalaryMonth, halfDayMonth, netSalaryPayableMonth,
    overtimeMonth, salaryDeduction, tdsApplicableMonth, totalAbsent, totalAdvanceAmount,
    totalAdvanceAmountMonth, totalEmployeeDeductionMonth, totalEmployerContributionMonth,
    totalHalfDay, totalInHandSalaryMonth, totalNetSalaryPayableMonth, totalOvertime, totalPaidAmount,
    totalPaidLeave, totalPayableSalaryMonth, totalPresent, totalSalaryAmount, totalTdsDeductionMonth,
    totalUnpaidLeave, totalWeeklyOff, selectedDepartment, selectedEmployee, showAllowanceDescription,
    showDeductionDescription, date, employeeName, departmentName, grossPayableSalaryMonth, grossInHandSalaryMonth, advanceDeduction, tdsDeductionPercentage,
    salaryAfterDeduction,
    salaryWithContribution,
    totalsalary
  } = req.body;

  const sql = `INSERT INTO payroll 
      (employeeId,employeeCode, month, year, VDAmonth, additionalAllowance, allowanceDescription, allowancesMonth,
                conveyanceallowances,
                houserentallowances,
                dearnessallowances,
                specialallowances,                
                hr_id,
                hrManagerName,totalAttencance, 
      basicSalaryMonth, deductionDescription, epfEmployeeMonth, epfEmployerMonth, epfesicApplicableMonth, 
      esicEmployeeMonth, esicEmployerMonth, grossSalaryMonth, halfDayMonth, netSalaryPayableMonth, 
      overtimeMonth, salaryDeduction, tdsApplicableMonth, totalAbsent, totalAdvanceAmount, 
      totalAdvanceAmountMonth, totalEmployeeDeductionMonth, totalEmployerContributionMonth, 
      totalHalfDay, totalInHandSalaryMonth, totalNetSalaryPayableMonth, totalOvertime, totalPaidAmount, 
      totalPaidLeave, totalPayableSalaryMonth, totalPresent, totalSalaryAmount, totalTdsDeductionMonth, 
      totalUnpaidLeave, totalWeeklyOff, selectedDepartment, selectedEmployee, showAllowanceDescription, 
      showDeductionDescription,date,employeeName,departmentName,grossPayableSalaryMonth,grossInHandSalaryMonth,advanceDeduction ,tdsDeductionPercentage,
                salaryAfterDeduction,
                salaryWithContribution,
                totalsalary) VALUES 
      (?,? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ? ,?, ?, ?, ?,?, ?, ?,?)`;

  db.query(sql, [
    employeeId, employeeCode, month, year, VDAmonth, additionalAllowance, allowanceDescription, allowancesMonth, conveyanceAllowancesMonth,
    houseRentallowancesMonth,
    dearnessallowancesMonth,
    specialallowancesMonth,
    hr_id,
    hrManagerName, totalAttencance,
    basicSalaryMonth, deductionDescription, epfEmployeeMonth, epfEmployerMonth, epfesicApplicableMonth,
    esicEmployeeMonth, esicEmployerMonth, grossSalaryMonth, halfDayMonth, netSalaryPayableMonth,
    overtimeMonth, salaryDeduction, tdsApplicableMonth, totalAbsent, totalAdvanceAmount,
    totalAdvanceAmountMonth, totalEmployeeDeductionMonth, totalEmployerContributionMonth,
    totalHalfDay, totalInHandSalaryMonth, totalNetSalaryPayableMonth, totalOvertime, totalPaidAmount,
    totalPaidLeave, totalPayableSalaryMonth, totalPresent, totalSalaryAmount, totalTdsDeductionMonth,
    totalUnpaidLeave, totalWeeklyOff, selectedDepartment, selectedEmployee, showAllowanceDescription,
    showDeductionDescription, date, employeeName, departmentName, grossPayableSalaryMonth, grossInHandSalaryMonth, advanceDeduction, tdsDeductionPercentage,
    salaryAfterDeduction,
    salaryWithContribution,
    totalsalary], (err, result) => {
      if (err) throw err;
      res.send('Payroll record added...');
    });
});

// Alter Table payrollId
// add  tdsDeductionPercentage decimal(10,2),
// add  salaryAfterDeduction decimal(10,2),
// add  salaryWithContribution decimal(10,2),
// add  totalsalary decimal(10,2),

// 20-7-24 Advance Payment and Repayments addLoan /api/salary/ /employees /officeData /api/advance-payment

// Endpoint to add an advance payment
app.post('/api/advance-payment', (req, res) => {
  const { amount, date, departmentId, departmentName, description, employee_id, employeeName, employeeCode, paymentMode, paymentType, username } = req.body;
  const query = 'INSERT INTO advance_payments ( amount, date, departmentId, departmentName, description, employee_id, employeeName,employeeCode, paymentModeName , paymentType, username  ) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)';
  db.query(query, [amount, date, departmentId, departmentName, description, employee_id, employeeName, employeeCode, paymentMode, paymentType, username], (err, result) => {
    if (err) throw err;
    recalculateBalances(employee_id);
    res.send('Advance payment added');
  });
});

// Endpoint to add a repayment
app.post('/api/repayment', (req, res) => {
  const { accountNumber, advancePaymentId, amount, bankName, branchName, date, employee_id, ifscCode, receivingMode, username } = req.body;
  const query = 'INSERT INTO repayments ( accountNumber,advancePaymentId,amount,bankName,branchName,date,employee_id,ifscCode,receivingMode,username ) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?)';
  db.query(query, [accountNumber, advancePaymentId, amount, bankName, branchName, date, employee_id, ifscCode, receivingMode, username], (err, result) => {
    if (err) throw err;
    recalculateBalances(employee_id);
    res.send('Repayment added');
  });
});


// Endpoint to add a repayment
app.post('/api/salary/repayment', (req, res) => {
  const { employee_id, employeeCode, amount, date, receivingMode } = req.body;
  const query = 'INSERT INTO repayments (employee_id, employeeCode, amount, date, receivingMode) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [employee_id, employeeCode, amount, date, receivingMode], (err, result) => {
    if (err) {
      console.error('Error inserting repayment:', err);
      return res.status(500).send('Error inserting repayment');
    }
    recalculateBalances(employee_id, employeeCode); // Pass employeeCode to the function
    res.send('Repayment added');
  });
});

// Function to recalculate balances
const recalculateBalances = (employee_id, employeeCode) => { // Accept employeeCode as a parameter
  const query = `
      SELECT 
          DATE_FORMAT(date, '%Y-%m-01') AS month,
          SUM(amount) AS total_advance
      FROM advance_payments
      WHERE employee_id = ?
      GROUP BY DATE_FORMAT(date, '%Y-%m-01')
  `;
  db.query(query, [employee_id], (err, advanceResults) => {
    if (err) {
      console.error('Error fetching advance payments:', err);
      throw err;
    }

    const repaymentQuery = `
          SELECT 
              DATE_FORMAT(date, '%Y-%m-01') AS month,
              SUM(amount) AS total_repayment
          FROM repayments
          WHERE employee_id = ?
          GROUP BY DATE_FORMAT(date, '%Y-%m-01')
      `;
    db.query(repaymentQuery, [employee_id], (err, repaymentResults) => {
      if (err) {
        console.error('Error fetching repayments:', err);
        throw err;
      }

      let previousBalance = 0;
      const balances = {};

      advanceResults.forEach(row => {
        balances[row.month] = (balances[row.month] || 0) + row.total_advance;
      });

      repaymentResults.forEach(row => {
        balances[row.month] = (balances[row.month] || 0) - row.total_repayment;
      });

      const months = Object.keys(balances).sort();
      months.forEach(month => {
        balances[month] += previousBalance;
        previousBalance = balances[month];
      });

      const deleteQuery = 'DELETE FROM balances WHERE employee_id = ?';
      db.query(deleteQuery, [employee_id], (err, result) => {
        if (err) {
          console.error('Error deleting old balances:', err);
          throw err;
        }

        const insertQuery = 'INSERT INTO balances (employee_id, employeeCode, month, balance) VALUES ?';
        const values = months.map(month => [employee_id, employeeCode, month, balances[month]]);

        // Print the values to ensure they are formatted correctly
        console.log('Insert values:', values);

        db.query(insertQuery, [values], (err, result) => {
          if (err) {
            console.error('Error inserting new balances:', err);
            throw err;
          }
        });
      });
    });
  });
};




// get api for the employee Details 
app.get('/api/advancepayment/:employee_id', (req, res) => {
  const { employee_id } = req.params;

  const query = 'SELECT * FROM advance_payments WHERE employee_id = ? ORDER BY id DESC';
  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error('Error fetching advance_payments records:', err);
      res.status(500).json({ error: 'Error fetching advance_payments records' });
      return;
    }
    res.json(results);
  });
});

// get api for the employee Details 
app.get('/api/advancerepayments/:employee_id', (req, res) => {
  const { employee_id } = req.params;

  const query = 'SELECT * FROM repayments WHERE employee_id = ? ORDER BY id DESC';
  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error('Error fetching repayments records:', err);
      res.status(500).json({ error: 'Error fetching repayments records' });
      return;
    }
    res.json(results);
  });
});

// get api for the employee Details 
app.get('/api/advancebalance/:employee_id', (req, res) => {
  const { employee_id } = req.params;

  const query = 'SELECT * FROM balances WHERE employee_id = ? ORDER BY id DESC';
  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error('Error fetching balances records:', err);
      res.status(500).json({ error: 'Error fetching balances records' });
      return;
    }
    res.json(results);
  });
});

// get api for the employee Details Pay Roll  
app.get('/api/payroll/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM payroll WHERE employeeId = ? ';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching payroll records:', err);
      res.status(500).json({ error: 'Error fetching balances records' });
      return;
    }
    res.json(results);
  });
});


app.get('/api/payroll/department/:departmentId', (req, res) => {
  const { departmentId } = req.params;

  const query = 'SELECT * FROM payroll WHERE selectedDepartment = ? ';
  db.query(query, [departmentId], (err, results) => {
    if (err) {
      console.error('Error fetching payroll records:', err);
      res.status(500).json({ error: 'Error fetching balances records' });
      return;
    }
    res.json(results);
  });
});
app.get('/api/payroll/employee/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM payroll WHERE employeeId = ? ';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching payroll records:', err);
      res.status(500).json({ error: 'Error fetching balances records' });
      return;
    }
    res.json(results);
  });
});

// Edit Salary Slip 
// Update company details
app.put('/api/salary/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const {
    VDAmonth,
    tdsDeductionPercentage,
    salaryAfterDeduction,
    salaryWithContribution,
    totalsalary,
    additionalAllowance,
    allowanceDescription,
    allowancesMonth,
    basicSalaryMonth,
    deductionDescription,
    epfEmployeeMonth,
    epfEmployerMonth,
    epfesicApplicableMonth,
    esicEmployeeMonth,
    esicEmployerMonth,
    grossInHandSalaryMonth,
    grossPayableSalaryMonth,
    grossSalaryMonth,
    halfDayMonth,
    netSalaryPayableMonth,
    overtimeMonth,
    salaryDeduction,
    tdsApplicableMonth,
    totalEmployeeDeductionMonth,
    totalEmployerContributionMonth,
    totalInHandSalaryMonth,
    totalPayableSalaryMonth,
    totalTdsDeductionMonth
  } = req.body;

  const sql = `UPDATE payroll SET 
    VDAmonth = ?, 
    tdsDeductionPercentage = ?,
    salaryAfterDeduction = ?,
    salaryWithContribution = ?,
    totalsalary = ?, 
    additionalAllowance = ?, 
    allowanceDescription = ?, 
    allowancesMonth = ?, 
    basicSalaryMonth = ?, 
    deductionDescription = ?, 
    epfEmployeeMonth = ?, 
    epfEmployerMonth = ?, 
    epfesicApplicableMonth = ?, 
    esicEmployeeMonth = ?, 
    esicEmployerMonth = ?, 
    grossInHandSalaryMonth = ?, 
    grossPayableSalaryMonth = ?, 
    grossSalaryMonth = ?, 
    halfDayMonth = ?, 
    netSalaryPayableMonth = ?, 
    overtimeMonth = ?, 
    salaryDeduction = ?, 
    tdsApplicableMonth = ?, 
    totalEmployeeDeductionMonth = ?, 
    totalEmployerContributionMonth = ?, 
    totalInHandSalaryMonth = ?, 
    totalPayableSalaryMonth = ?, 
    totalTdsDeductionMonth = ?
    WHERE id = ?`;

  db.query(sql, [
    VDAmonth,
    tdsDeductionPercentage,
    salaryAfterDeduction,
    salaryWithContribution,
    totalsalary,
    additionalAllowance,
    allowanceDescription,
    allowancesMonth,
    basicSalaryMonth,
    deductionDescription,
    epfEmployeeMonth,
    epfEmployerMonth,
    epfesicApplicableMonth,
    esicEmployeeMonth,
    esicEmployerMonth,
    grossInHandSalaryMonth,
    grossPayableSalaryMonth,
    grossSalaryMonth,
    halfDayMonth,
    netSalaryPayableMonth,
    overtimeMonth,
    salaryDeduction,
    tdsApplicableMonth,
    totalEmployeeDeductionMonth,
    totalEmployerContributionMonth,
    totalInHandSalaryMonth,
    totalPayableSalaryMonth,
    totalTdsDeductionMonth,
    id
  ], (err, result) => {
    if (err) {
      console.error('Error updating salary details:', err);
      return res.status(500).send(err);
    }
    console.log('Salary details updated:', result);
    res.send('Salary details updated');
  });
});




// Payment Form Details 
app.post('/submitPayment', (req, res) => {
  const { amountPaid, amountDate, paymentModeId, paymentDescription, id, employeeName, departmentName, employeeId, year, month, netSalaryPayableMonth, paymentModeName } = req.body;

  const sql = `INSERT INTO paymentformdetails (    amountPaid ,amountDate ,paymentModeId ,paymentDescription ,payrollId ,employeeName  ,departmentName  ,employeeId ,year ,month ,netSalaryPayableMonth ,paymentModeName  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [amountPaid, amountDate, paymentModeId, paymentDescription, id, employeeName, departmentName, employeeId, year, month, netSalaryPayableMonth, paymentModeName], (err, result) => {
    if (err) throw err;
    res.send('Payment Details record added...');
  });
});

//  get 
app.get('/api/paymentform/:payrollId', (req, res) => {
  const { payrollId } = req.params;

  const query = 'SELECT * FROM paymentformdetails WHERE payrollId = ? ';
  db.query(query, [payrollId], (err, results) => {
    if (err) {
      console.error('Error fetching paymentformdetails records:', err);
      res.status(500).json({ error: 'Error fetching balances records' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/salarypaymenthistory/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = 'SELECT * FROM paymentformdetails WHERE employeeId = ? ';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching paymentformdetails records:', err);
      res.status(500).json({ error: 'Error fetching balances records' });
      return;
    }
    res.json(results);
  });
});

// Payment Form Details 


// Add Hr Manager 

app.post('/addHRManager', async (req, res) => {
  const {
    departmentId,
    departmentName,
    employeeId,
    employeeName,
    employeeCode,
    appointDate,
    description,
    username
  } = req.body;

  // Begin transaction
  db.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    try {
      // Update the relieving date of the previous HR manager
      await new Promise((resolve, reject) => {
        db.query(
          'UPDATE hr_managers SET relievingDate = DATE_SUB(?, INTERVAL 1 DAY) WHERE relievingDate IS NULL',
          [appointDate],
          (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          }
        );
      });

      // Insert new HR manager record
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO hr_managers (departmentId, departmentName, employeeId, employeeName, employeeCode, appointDate, description, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [departmentId, departmentName, employeeId, employeeName, employeeCode, appointDate, description, username],
          (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          }
        );
      });

      // Commit transaction
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Commit error' });
          });
        }
        res.status(200).json({ message: 'HR Manager added successfully' });
      });
    } catch (error) {
      // Rollback transaction in case of error
      db.rollback(() => {
        res.status(500).json({ error: 'Transaction failed', details: error });
      });
    }
  });
});

// Get the HrManager TimeLine  active_inactive activeinactive activeinactive approved
app.get('/timelines', (req, res) => {
  const sql = 'SELECT * FROM hr_managers ORDER BY id DESC'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching timelines:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});

app.get('/hrmanager', (req, res) => {
  const sql = 'SELECT * FROM hr_managers ORDER BY id DESC LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching hr manager:', err);
      return res.status(500).send('An error occurred while fetching the HR manager.');
    }
    res.json(results[0]); // Since we're fetching only one record, return the first (and only) item
  });
});



// Add Hr Manager 


// Add Payment Mode 
app.get('/paymentmodes', (req, res) => {
  const sql = 'SELECT * FROM paymentmode_details'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching paymentmodes:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});

app.delete('/paymentmodes/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM paymentmode_details WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).send(err);
    }
    console.log('Employee deleted:', result);
    res.send('Employee deleted');
  });
});

// Delete Details addCompany officeData projectData timelines
app.post('/delete_details', (req, res) => {
  try {
    const { paymentModeName, projectName, officeName, companyName, reason } = req.body;

    const sql = 'INSERT INTO delete_details ( paymentModeName,projectName,officeName,companyName, reason ) VALUES (?, ?, ?, ?, ?)';
    const values = [paymentModeName, projectName, officeName, companyName, reason];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error saving deleted details:', err);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
      }
      console.log('Deleted details saved successfully');
      res.status(200).json({ success: true, message: 'Deleted details saved successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// Dashboard takes the salary details /api/attendance/ /login

app.get('/api/paymentforms', (req, res) => {
  const sql = 'SELECT * FROM paymentformdetails'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching paymentformdetails:', err);
      return res.status(500).send('An error occurred while fetching paymentformdetails.');
    }
    res.json(results);
  });
});

// Add Payment Mode activeinactive activeinactive approved /approved/reject transferHistory
app.get('/api/payrolls', (req, res) => {
  const sql = 'SELECT * FROM payroll'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching payrolls:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});

//Fetch Leave data 
app.get('/api/leavereport', (req, res) => {
  // Update the SQL query to fetch only records where the status is 'leave'
  const sql = 'SELECT * FROM active_inactive WHERE status = ?';
  const status = 'leave'; // Define the status you are filtering for

  db.query(sql, [status], (err, results) => {
    if (err) {
      console.error('Error fetching active_inactives:', err);
      return res.status(500).send('An error occurred while fetching leave reports.');
    }
    res.json(results);
  });
});


// For Report Loan Details 
app.get('/api/loanreport', (req, res) => {
  const sql = 'SELECT * FROM loandetails'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching loandetails:', err);
      return res.status(500).send('An error occurred while fetching Loan Details .');
    }
    res.json(results);
  });
});

// For Report Bonous  Details 
app.get('/api/bonusincentive', (req, res) => {
  const sql = 'SELECT * FROM bonusincentive'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching bonusincentive:', err);
      return res.status(500).send('An error occurred while fetching Bonous  Details .');
    }
    res.json(results);
  });
});

// Add Payment Mode activeinactive activeinactive approved /approved/reject transferHistory
app.get('/api/AdvancePayment', (req, res) => {
  const sql = 'SELECT * FROM advance_payments'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching advance_paymentss:', err);
      return res.status(500).send('An error occurred while fetching .');
    }
    res.json(results);
  });
});




// Active inactive Details and approved details 
// Approved details update
app.put('/approved/extension/early/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { toDate } = req.body;

  const sql = `UPDATE approve_details SET toDate = ? WHERE activeInactiveDetails_id = ?`;

  db.query(sql, [toDate, id], (err, result) => {
    if (err) {
      console.error('Error updating approve details:', err);
      return res.status(500).send(err);
    }
    console.log('Approve details updated:', result);
    res.send('Approve details updated');
  });
});

// Active Inactive details update
app.put('/active_inactive/extension/early/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { toDate } = req.body;

  const sql = `UPDATE active_inactive SET toDate = ? WHERE id = ?`;

  db.query(sql, [toDate, id], (err, result) => {
    if (err) {
      console.error('Error updating active_inactive details:', err);
      return res.status(500).send(err);
    }
    console.log('Active Inactive details updated:', result);
    res.send('Active Inactive details updated');
  });
});

app.get('/latest-employee-data/:employeeId', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
  const { employeeId } = req.params;

  const query = `
  SELECT t1.*
  FROM approve_details t1
  INNER JOIN (
      SELECT employeeId, MAX(updatedAt) as maxDate
      FROM approve_details
      WHERE employeeId = ?
      GROUP BY employeeId
  ) t2 ON t1.employeeId = t2.employeeId AND t1.updatedAt = t2.maxDate
  WHERE t1.fromDate <= ? AND t1.toDate >= ?
`;
  db.query(query, [employeeId, currentDate, currentDate], (err, results) => {
    if (err) {
      console.error('Error fetching payroll records:', err);
      res.status(500).json({ error: 'Error fetching balances records' });
      return;
    }
    res.json(results);
  });
});

// Leave ,Request , Active 
// for checking  
app.put('/api/activeinactive_status/leave/:id', (req, res) => {
  const employeeId = req.params.id;
  const { status } = req.body;

  // SQL query to get the last occurrence of= the employee based on the highest id
  const selectSql = 'SELECT id FROM active_inactive WHERE employeeId = ? ORDER BY id DESC LIMIT 1';

  db.query(selectSql, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching the last occurrence of the employee:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).send('Employee not found');
    }

    const lastOccurrenceId = results[0].id;

    // SQL query to update the status of the last occurrence
    const updateSql = 'UPDATE active_inactive SET status = ? WHERE id = ?';
    const params = [status, lastOccurrenceId];

    db.query(updateSql, params, (err, updateResults) => {
      if (err) {
        console.error('Error updating active_inactive details:', err);
        return res.status(500).send(err);
      }

      res.status(200).send('Active/inactive details updated successfully');
    });
  });
});


// approve details  
app.post('/api/approved/leave', (req, res) => {
  const {
    employeeId,
    employeeName, employeeCode, activeInactiveDetails_id,
    fromDate,
    toDate,
    status,
    description
  } = req.body;

  // SQL query to insert data into employee_status_updates table
  const sql = `
    INSERT INTO approve_details 
      (employeeId, employeeName,employeeCode,activeInactiveDetails_id,fromDate, toDate, status, description) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(sql, [employeeId, employeeName, employeeCode, activeInactiveDetails_id, fromDate, toDate, status, description], (err, result) => {
    if (err) {
      console.error('Error uploading approve_details data:', err);
      return res.status(500).send(err);
    }
    console.log('approve_details data uploaded:', result);
    res.send('approve_details data uploaded');
  });
});

// Fetch the latest leave status for each employee 
app.get('/activeinactive/currentleave', async (req, res) => {
  try {
    // SQL query to get the latest entry for each employee by employeeId, filtering those with status 'leave'
    const query = `SELECT t1.* FROM active_inactive t1 INNER JOIN (SELECT employeeId, MAX(createdAt) as latestEntry FROM active_inactive GROUP BY employeeId ) t2 ON t1.employeeId = t2.employeeId AND t1.createdAt = t2.latestEntry WHERE t1.status = 'leave';`;

    // Execute the query
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'An error occurred while fetching data' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Endpoint to fetch approved details that are still active (toDate not exceeded)
app.get('/approved/list/tilldate', (req, res) => {
  // SQL query to select records where the toDate is not past today's date
  const sql = `SELECT * FROM approve_details WHERE toDate >= CURDATE()`;
  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching approved details:', err);
      return res.status(500).send(err);
    }
    // Send the filtered results back to the frontend
    res.json(results);
  });
});

// API endpoint to fetch the latest entry for each employee
app.get('/api/activeinactive_status/latest/:id', (req, res) => {
  const employeeId = req.params.id;
  const sql = 'SELECT * FROM active_inactive WHERE employeeId = ? ORDER BY id DESC LIMIT 1';

  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching active_inactive:', err);
      return res.status(500).send({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).send({ message: 'No records found for this employee' });
    }
    res.json(results[0]);
  });
});





















// // after date 
// // // check the date update the data mannuallly 
// const updateStatus = (record) => {
//   const { employeeId, employeeName, toDate } = record;
//   const status = 'active';
//   const reason = 'Rejoin';
//   const description = 'Auto-updated to active status after leave';
//   // const fromDate = new Date().toISOString().split('T')[0]; // Today's date
//   const fromDate = new Date().toISOString().split('T')[0];; // Today's date

//   // Check if an active record already exists after the toDate of the leave
//   const checkActiveSql = `
//     SELECT * FROM active_inactive 
//     WHERE employeeId = ? AND fromDate >= ? AND status = 'active'
//   `;
//   db.query(checkActiveSql, [employeeId, toDate], (err, activeResults) => {
//     if (err) {
//       console.error('Error checking for existing active records:', err);
//       return;
//     }
//     if (activeResults.length > 0) {
//       console.log(`Active status already exists for employeeId: ${employeeId}, employeeName: ${employeeName} after toDate: ${toDate}`);
//     } else {
//       console.log(`Adding new active status for employeeId: ${employeeId}, employeeName: ${employeeName}`);
//       // Insert a new record with 'active' status in the active_inactive table
//       const insertActiveInactiveSql = `
//         INSERT INTO active_inactive (employeeId, employeeName, status, reason, fromDate, toDate, description)
//         VALUES (?, ?, ?, ?, ?, NULL, ?)
//       `;
//       db.query(insertActiveInactiveSql, [employeeId, employeeName, status, reason, fromDate, description], (err, result) => {
//         if (err) {
//           console.error('Error inserting new status in active_inactive table:', err);
//           return;
//         }
//         console.log('Inserted new active status in active_inactive table:', result);
//       });

//       // Update status in employee table
//       const updateEmployeeSql = `UPDATE employee_details SET status = ? WHERE id = ?`;
//       db.query(updateEmployeeSql, [status, employeeId], (err, result) => {
//         if (err) {
//           console.error('Error updating status in employee table:', err);
//           return;
//         }
//         console.log('Updated status in employee table:', result);
//       });
//     }
//   });
// };
// // Scheduled job to check for exceeded toDate
// cron.schedule('* * * * *', () => { // Runs every minute
//   console.log('Cron job started at:', new Date());

//   const today = new Date().toISOString().split('T')[0];;
//   console.log('Today\'s date:', today);

//   // Select records where toDate is before today and status is 'leave'
//   const selectSql = `SELECT * FROM active_inactive WHERE toDate < ? AND status = 'leave'`;
//   db.query(selectSql, [today], (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       return;
//     }

//     console.log('Records fetched for processing:', results);

//     if (results.length === 0) {
//       console.log('No records found with toDate before today and status is leave.');
//     } else {
//       results.forEach((record) => {
//         console.log('Processing record:', record);
//         updateStatus(record);
//       });
//     }
//   });
// });

// console.log('Scheduled job to check for exceeded toDate set up.');

// Deparmtent Attendnac new 





// Fetch all departments
app.get('/api/departments/report', (req, res) => {
  const query = 'SELECT * FROM  department_details';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching departments' });
    }
    res.json(results);
  });
});

// Fetch employees by department
app.get('/api/employees/report', (req, res) => {
  const departmentId = req.query.departmentId;
  const query = 'SELECT * FROM employee_details WHERE departmentId = ?';
  db.query(query, [departmentId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching employees' });
    }
    res.json(results);
  });
});

// Fetch attendance records by department
app.get('/attendance/report', (req, res) => {
  console.log("run")
  const departmentId = req.query.departmentId;

  // SQL query to fetch attendance records filtered by departmentId
  const query = `
SELECT a.id, a.employee_id, a.date, a.status, e.employeeName
FROM attendance a
JOIN employee_details e ON a.employee_id = e.id
WHERE e.departmentId = ?;
  `;

  db.query(query, [departmentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching attendance data' });
    }
    console.log('SQL Query:', query);
    console.log('Query Parameters:', [departmentId]);
    console.log('Attendance Data:', results);
    res.json(results);
  });
});

// check Employee Code /api/attendance /departments /paymentmodes /addPaymentMode /paymentmodes /delete_details /departments  /api/attendance /payroll /api/salary/repayment /api/advance-payment /addLoan /activeinactive /api/approved/leave /api/advance-payment salary_details /employees/ loanDetails

// Edit Office Details 
app.put('/officeData/:id', officeUpload.single('picture'), (req, res) => {
  const {
    officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks
  } = req.body;

  const picture = req.file ? req.file.filename : null;
  const officeId = req.params.id;

  // Build the SQL query dynamically, including the picture field only if a new picture is provided
  const sql = `
    UPDATE offices 
    SET 
      officeName = ?, 
      employee_id = ?, 
      employeeName = ?, 
      address = ?, 
      city = ?, 
      state = ?, 
      pincode = ?, 
      email1 = ?, 
      email2 = ?, 
      mobile1 = ?, 
      mobile2 = ?, 
      mobile3 = ?, 
      remarks = ?
      ${picture ? ', picture = ?' : ''}
    WHERE id = ?
  `;

  const params = [
    officeName,
    employee_id,
    employeeName,
    address,
    city,
    state,
    pincode,
    email1,
    email2,
    mobile1,
    mobile2,
    mobile3,
    remarks
  ];

  // If a picture is uploaded, add it to the query parameters
  if (picture) {
    params.push(picture);
  }

  // Add the officeId for the WHERE clause
  params.push(officeId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Error updating data' });
      return;
    }

    res.json({ message: 'Data updated successfully' });
  });
});

// Project Edit 
app.put('/projectData/:id', projectUpload.single('document'), (req, res) => {
  const {
    projectName,
    companyName,
    projectType,
    principalEmployeeName,
    principalEmployeeProjectAddress,
    employeerstate,
    employeercity,
    employeerpincode,
    projectAddress,
    projectstate,
    projectcity,
    projectpincode,
    projectManagerName,
    projectDescription,
    username,
    company_id,
    employee_id
  } = req.body;

  const document = req.file ? req.file.filename : null;
  const officeId = req.params.id;

  // Build the SQL query dynamically
  let sql = `
    UPDATE project_details
    SET 
      projectName = ?, 
      companyName = ?, 
      projectType = ?, 
      EmployeeName = ?, 
      EmployeeProjectAddress = ?, 
      employeerstate = ?, 
      employeercity = ?, 
      employeerpincode = ?, 
      projectAddress = ?, 
      projectstate = ?, 
      projectcity = ?, 
      projectpincode = ?, 
      projectManagerName = ?, 
      projectDescription = ?, 
      username = ?, 
      company_id = ?, 
      employee_id = ?
  `;

  // If a document is uploaded, include it in the SQL query
  const params = [
    projectName,
    companyName,
    projectType,
    principalEmployeeName,
    principalEmployeeProjectAddress,
    employeerstate,
    employeercity,
    employeerpincode,
    projectAddress,
    projectstate,
    projectcity,
    projectpincode,
    projectManagerName,
    projectDescription,
    username,
    company_id,
    employee_id
  ];

  if (document) {
    sql += `, document = ? `;
    params.push(document);
  }

  // Add the WHERE clause to target the specific office by ID
  sql += ` WHERE id = ?`;
  params.push(officeId);

  // Execute the query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ error: 'Error updating data' });
    }

    res.json({ message: 'Data updated successfully' });
  });
});

// Department Edit  
app.put('/departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;

  const sql = `UPDATE department_details SET name = ?, description = ? WHERE id = ?`;

  db.query(sql, [name, description, id], (err, result) => {
    if (err) {
      console.error('Error updating department_details:', err);
      return res.status(500).send(err);
    }
    console.log('Department details updated:', result);
    res.send('Department details updated');
  });
});


// Edit Payment  
app.put('/EditPayment/:id', (req, res) => {
  const id = req.params.id;
  const {
    accountName,
    accountNumber,
    bankName,
    branch,
    ifscCode,
    paymentModeName,
    paymentType,
    username
  } = req.body;

  const sql = `UPDATE paymentmode_details SET 
    accountName = ?, 
    accountNumber = ?, 
    bankName = ?, 
    branch = ?, 
    ifscCode = ?, 
    paymentModeName = ?, 
    paymentType = ?, 
    username = ? 
    WHERE id = ?`;

  const values = [
    accountName,
    accountNumber,
    bankName,
    branch,
    ifscCode,
    paymentModeName,
    paymentType,
    username,
    id // include the id at the end
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating employee salary details:', err);
      return res.status(500).send('Error updating employee salary details');
    }
    console.log('Employee salary details updated:', result);
    res.send('Employee salary details updated');
  });
});

// Edit Advance Payment 
app.put('/editadvance/:id', (req, res) => {
  const id = req.params.id;
  const { amount, date } = req.body;

  // Corrected SQL query
  const sql = `UPDATE advance_payments SET 
    amount = ?, 
    date = ? 
    WHERE id = ?`;

  const values = [amount, date, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating advance payment details:', err);
      return res.status(500).send('Error updating advance payment details');
    }
    console.log('Advance payment details updated:', result);
    res.send('Advance payment details updated');
  });
});

//  Edit Loan Details 
app.put('/addLoan/:id', (req, res) => {
  const id = req.params.id;
  const {
    departmentId,
    departmentName,
    employeeId,
    employeeName,
    employeeCode,
    loanAmount,
    loanApprovedById,
    loanApprovedByName,
    loanDate,
    loanDescription,
    loanFor,
    loanRepayType,
    loanRepaymentDate,
    otherLoanForReason,
    remark,
    loanNumber,
    principalAmount,
    interestAmount,
    username
  } = req.body;

  // Corrected SQL query with proper assignment for each column
  const sql = `
    UPDATE loandetails SET 
      departmentId = ?, 
      departmentName = ?, 
      employeeId = ?, 
      employeeName = ?, 
      employeeCode = ?, 
      loanAmount = ?, 
      loanApprovedById = ?, 
      loanApprovedByName = ?, 
      loanDate = ?, 
      loanDescription = ?, 
      loanFor = ?, 
      loanRepayType = ?, 
      loanRepaymentDate = ?, 
      otherLoanForReason = ?, 
      remark = ?, 
      loanNumber = ?, 
      principalAmount = ?, 
      interestAmount = ?, 
      username = ?
    WHERE id = ?`;

  const values = [
    departmentId,
    departmentName,
    employeeId,
    employeeName,
    employeeCode,
    loanAmount,
    loanApprovedById,
    loanApprovedByName,
    loanDate,
    loanDescription,
    loanFor,
    loanRepayType,
    loanRepaymentDate,
    otherLoanForReason,
    remark,
    loanNumber,
    principalAmount,
    interestAmount,
    username,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating loan details:', err);
      return res.status(500).send('Error updating loan details');
    }
    console.log('Loan details updated:', result);
    res.send('Loan details updated successfully');
  });
});

//  Edit Loan Details 

// Advance Payment  
app.delete('/api/advance-payment/:id', (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  const sql = 'DELETE FROM advance_payments WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting  advance_payments:', err);
      return res.status(500).send(err);
    }
    console.log(' advance_payments deleted:', result);
    res.send(' advance_payments deleted');
  });
});
// Advance Payment  
app.delete('/api/advance-payment/:id', (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  const sql = 'DELETE FROM advance_payments WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting  advance_payments:', err);
      return res.status(500).send(err);
    }
    console.log(' advance_payments deleted:', result);
    res.send(' advance_payments deleted');
  });
});
// Loan List Delete 
app.delete('/api/loanlist/:id', (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  const sql = 'DELETE FROM loandetails WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting  loandetails:', err);
      return res.status(500).send(err);
    }
    console.log(' loandetails deleted:', result);
    res.send(' loandetails deleted');
  });
});

// Bonous List Delete 
app.delete('/api/bonousinsentive/:id', (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  const sql = 'DELETE FROM bonusincentive WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting bonusincentive:', err);
      return res.status(500).send(err);
    }
    console.log(' bonusincentive deleted:', result);
    res.send(' bonusincentive deleted');
  });
});

// Salary List Delete 
app.delete('/api/salary/:id', (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  const sql = 'DELETE FROM payroll WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting payroll:', err);
      return res.status(500).send(err);
    }
    console.log(' payroll deleted:', result);
    res.send(' payroll deleted');
  });
});


// Get Loan Details    
app.get('/employeeloan/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'SELECT * FROM employee_details WHERE id = ?'; // Query to fetch loan details for the given employee ID

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching loan details:', err);
      return res.status(500).send('Error fetching loan details');
    }
    if (result.length === 0) {
      return res.status(404).send('No loan details found for this employee');
    }
    console.log('Loan details fetched:', result);
    res.json(result); // Send the result as JSON
  });
});

//  Edit Loan Details 
app.put('/addBonusIncentive/:id', (req, res) => {
  const id = req.params.id;
  const {
    amount, departmentId, departmentName, employeeId, employeeName, fromDate, toDate, declarationDate, paymentType, reason, remark, employeeCode, username
  } = req.body;

  // Corrected SQL query with proper assignment for each column
  const sql = `
    UPDATE bonusincentive 
    SET 
      amount = ?, 
      departmentId = ?, 
      departmentName = ?, 
      employeeId = ?, 
      employeeName = ?, 
      fromDate = ?, 
      toDate = ?, 
      declarationDate = ?, 
      paymentType = ?, 
      reason = ?, 
      remark = ?, 
      employeeCode = ?, 
      username = ? 
    WHERE id = ?`;

  const values = [
    amount, departmentId, departmentName, employeeId, employeeName, fromDate, toDate, declarationDate, paymentType, reason, remark, employeeCode, username, id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating bonus/incentive details:', err);
      return res.status(500).send('Error updating bonus/incentive details');
    }
    console.log('Bonus/Incentive details updated:', result);
    res.send('Bonus/Incentive details updated successfully');
  });
});

// // leave request  

// // // Call the manual test function for immediate execution

// console.log('Scheduled job to check for exceeded toDate set up.');
// const updateEmployeeStatus = (record) => {
//   const { employeeId, employeeName, status, fromDate, toDate } = record;

//   // Convert fromDate and toDate to IST and format them as 'YYYY-MM-DD'
//   const fromDateIST = new Date(fromDate).toLocaleDateString('en-CA', {
//     timeZone: 'Asia/Kolkata',
//   });
//   const toDateIST = new Date(toDate).toLocaleDateString('en-CA', {
//     timeZone: 'Asia/Kolkata',
//   });

//   // Get today's date
//   const today = new Date().toISOString().split('T')[0];

//   console.log(`Checking record for employee: ${employeeName} (ID: ${employeeId})`);
//   console.log(`Status: ${status}, Starts on: ${fromDateIST}, Ends on: ${toDateIST}`);
//   console.log(`Today's date: ${today}`);

//   // Check if today's date is within the leave period
//   if (today >= fromDateIST && today <= toDateIST) {
//     if (status === 'leave') {
//       console.log(`Match found! Updating status to 'leave' for employee: ${employeeName} (ID: ${employeeId})`);

//       // Update employee's status to 'leave'
//       const updateEmployeeSql = `UPDATE employee_details SET status = ? WHERE id = ?`;
//       db.query(updateEmployeeSql, ['leave', employeeId], (err, result) => {
//         if (err) {
//           console.error('Error updating employee status to leave:', err);
//           return;
//         }
//         console.log(`Success: Employee status updated to 'leave' for employee: ${employeeName} (ID: ${employeeId})`);
//       });
//     } else if (status === 'resign_terminate') {
//       console.log(`Match found! Updating status to 'resign_terminate' for employee: ${employeeName} (ID: ${employeeId})`);

//       // Update employee's status to 'resign_terminate'
//       const updateEmployeeSql = `UPDATE employee_details SET status = ? WHERE id = ?`;
//       db.query(updateEmployeeSql, ['resign_terminate', employeeId], (err, result) => {
//         if (err) {
//           console.error('Error updating employee status to resign_terminate:', err);
//           return;
//         }
//         console.log(`Success: Employee status updated to 'resign_terminate' for employee: ${employeeName} (ID: ${employeeId})`);
//       });
//     } else {
//       console.log(`No update needed for employee: ${employeeName} (ID: ${employeeId}). Status is not 'leave' or 'resign_terminate'.`);
//     }
//   } else {
//     console.log(`No update needed for employee: ${employeeName} (ID: ${employeeId}). Today's date is outside the leave period.`);
//   }
// };

// // Schedule job to run every minute for testing
// cron.schedule('* * * * *', () => {
//   console.log('Manual test started at:', new Date());

//   // Use today's date
//   const testDate = new Date().toISOString().split('T')[0];
//   console.log('Testing with date:', testDate);

//   // Select records where fromDate is less than or equal to today and toDate is greater than or equal to today
//   const selectSql = `
//     SELECT * FROM active_inactive AS ai
//     WHERE ai.fromDate <= ? AND ai.toDate >= ? AND (ai.status = 'leave' OR ai.status = 'resign_terminate')
//     AND ai.id = (
//       SELECT MAX(inner_ai.id)
//       FROM active_inactive AS inner_ai
//       WHERE inner_ai.employeeId = ai.employeeId
//     )
//   `;

//   db.query(selectSql, [testDate, testDate], (err, results) => {
//     if (err) {
//       console.error('Error fetching records:', err);
//       return;
//     }

//     console.log(`Fetched ${results.length} record(s) for status starting on or within the range of: ${testDate}`);

//     if (results.length === 0) {
//       console.log('No records starting on or within the range of the test date.');
//     } else {
//       results.forEach((record) => {
//         updateEmployeeStatus(record);
//       });
//     }
//   });
// });

// console.log('Scheduled job to check for status updates is set up.');









// Petty Cash Manager 



app.post('/empdata', employeeUpload.single('picture'), (req, res) => {
  let picturePath = null; // Initialize brandLogoFileName as null

  const {
    employeeName,
    employeeCode,
    employeeEmail,
    employeePhone,
    fatherName,
    employeePanAddhar,
    departmentName,
    designationName,
    designationId,
    username,
    department,
  } = req.body;

  if (req.file) {
    picturePath = req.file.filename;
  }

  // Insert query for employee details
  const sql = `
    INSERT INTO employee_details (
      employeeName,
      employeeCode,
      employeeEmail,
      employeePhone,
      fatherName,
      employeePanAddhar,
      departmentName,
      designationName,
      designationId,
      picture,
      username,
      department
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    employeeName,
    employeeCode,
    employeeEmail,
    employeePhone,
    fatherName,
    employeePanAddhar,
    departmentName,
    designationName,
    designationId,
    picturePath,
    username,
    department
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading employee data:', err);
      return res.status(500).send(err);
    }
    console.log('Employee data uploaded:', result);
    res.send('Employee data uploaded successfully');
  });
});

app.post('/projectData', projectUpload.single('picture'), (req, res) => {
  console.log(req.body);

  const {
    projectName,
    projectCode,
    employeerName,
    projectType,
    projectAddress,
    projectstate,
    projectcity,
    projectpincode,
    username
  } = req.body;

  // Check if a file is uploaded, and get the file path
  const picturePath = req.file ? req.file.path : null;

  // SQL query to insert project data
  const sql = `
    INSERT INTO project_details (
      projectName, projectCode, employeerName, projectType, projectAddress,
      projectstate, projectcity, projectpincode, username, picture
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(
    sql,
    [
      projectName, projectCode, employeerName, projectType, projectAddress,
      projectstate, projectcity, projectpincode, username, picturePath
    ],
    (err, result) => {
      if (err) {
        console.error('Error uploading project data:', err);
        return res.status(500).send('Failed to add project');
      }
      console.log('Project data uploaded:', result);
      res.send('Project data uploaded successfully');
    }
  );
});

// add Cash  delete
app.post('/addCashPayment', (req, res) => {
  const { amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, username } = req.body;

  // SQL query to insert data into cash_details table
  const sql = `
    INSERT INTO cash_details
      (amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, username)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(
    sql,
    [
      amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, username
    ],
    (err, result) => {
      if (err) {
        console.error('Error uploading cash_details data:', err);
        return res.status(500).send(err);
      }
      console.log('cash_details data uploaded:', result);
      res.send('cash_details data uploaded');
    }
  );
});
// Cash Ledger 
app.get('/ledger_entries', (req, res) => {
  const sql = 'SELECT * FROM cash_details'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching cash_details:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});

// add Head
app.post('/addHead', (req, res) => {
  const { description, headName, username } = req.body;

  // SQL query to insert data into addhead table
  const sql = `
    INSERT INTO addhead
      (description,headName,username)
    VALUES (?, ?, ?)
  `;

  // Execute the query
  db.query(
    sql,
    [description, headName, username],
    (err, result) => {
      if (err) {
        console.error('Error uploading addhead data:', err);
        return res.status(500).send(err);
      }
      console.log('addhead data uploaded:', result);
      res.send('addhead data uploaded');
    }
  );
});

// Get Head Details 
app.get('/heads', (req, res) => {
  const sql = 'SELECT * FROM addhead'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching addhead:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});

// user Side 
app.get('/api/project/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM cash_details WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching cash_details records:', err);
      res.status(500).json({ error: 'Error fetching cash_details records' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/cash/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM cash_details WHERE 	projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching cash_details records:', err);
      res.status(500).json({ error: 'Error fetching cash_details records' });
      return;
    }
    res.json(results);
  });
});
app.get('/api/project/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM project_details WHERE 	id = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching project_details records:', err);
      res.status(500).json({ error: 'Error fetching project_details records' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/supervisor/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM supervisor WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching supervisor records:', err);
      res.status(500).json({ error: 'Error fetching supervisor records' });
      return;
    }
    res.json(results);
  });
});

// Make Entry  
app.post('/makeEntry', makeEntryUpload.single('picture'), (req, res) => {
  let picturePath = null; // Initialize picturePath as null
  const { date, headId, description, amount, headName, projectId, projectName, supervisorId, supervisorName } = req.body;

  if (req.file) {
    picturePath = req.file.filename; // Assign the filename if the file was uploaded
  }

  // Insert query for employee details
  const sql = `
    INSERT INTO makeentry (date, headId, description, amount, picture, headName, projectId, projectName, supervisorId, supervisorName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [date, headId, description, amount, picturePath, headName, projectId, projectName, supervisorId, supervisorName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading Make Entry data:', err);
      return res.status(500).send(err);
    }
    console.log('Make Entry data uploaded:', result);
    res.send('Make Entry data uploaded successfully');
  });
});

// Get Entry Ledger 
app.get('/viewledger/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM makeentry WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching makeentry records:', err);
      res.status(500).json({ error: 'Error fetching makeentry records' });
      return;
    }
    res.json(results);
  });
});
// user Dashboard 

app.get('/api/cash/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM cash_details WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching cash_details records:', err);
      res.status(500).json({ error: 'Error fetching cash_details records' });
      return;
    }

    // Calculate the total amount for the selected project
    const totalAmount = results.reduce((sum, record) => sum + parseFloat(record.amount), 0);

    // Send both the results and total amount
    res.json({ records: results, totalAmount });
  });
});

app.get('/api/cashspend/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM makeentry WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching makeentry records:', err);
      res.status(500).json({ error: 'Error fetching makeentry records' });
      return;
    }

    // Calculate the total amount for the selected project
    const totalAmount = results.reduce((sum, record) => sum + parseFloat(record.amount), 0);

    // Send both the results and total amount
    res.json({ records: results, totalAmount });
  });
});

// Cash Ledger 
app.get('/expensesledger', (req, res) => {
  const sql = 'SELECT * FROM makeentry'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching makeentry:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});

// Project Ledger 

// Define API endpoint to fetch transactions
app.get('/api/transactions/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = `
    SELECT id, date, description, 
           IFNULL(SUM(CASE WHEN type = 'admin' THEN amount END), 0) AS credit,
           IFNULL(SUM(CASE WHEN type = 'supervisor' THEN amount END), 0) AS debit,
           (SELECT IFNULL(SUM(amount), 0) FROM cash_details WHERE projectId = ?) AS balance
    FROM (
      SELECT 'admin' as type, id, date, description, amount 
      FROM cash_details 
      WHERE projectId = ?
      
      UNION ALL
      
      SELECT 'supervisor' as type, id, date, description, amount 
      FROM makeentry
      WHERE projectId = ?
    ) AS transactions
    GROUP BY id, date, description
    ORDER BY date ASC;
  `;

  // Fetch the result from the database
  db.query(query, [projectId, projectId, projectId], (error, rows) => {
    if (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Calculate the running balance
    let runningBalance = 0;
    const result = rows.map(row => {
      runningBalance += (row.credit || 0) - (row.debit || 0);
      return {
        ...row,
        balance: runningBalance
      };
    });

    // Send only the calculated rows as the response
    res.json(result);
  });
});

// supervisor 
// Add Suupervisior
// app.post('/assignSupervisor', (req, res) => {
//   const {appointmentDate,departmentName,designationId,designationName,employeeCode,employeeEmail,employeeName,employeePanAddhar,employeePhone,employeePicture,employeerName,fatherName,projectAddress,projectCode,projectId,projectName,projectPicture,projectType,projectcity,projectpincode,projectstate,supervisorId,username} = req.body;

//   // Step 1: Check if the project ID already exists
//   const checkProjectSql = `SELECT * FROM supervisor WHERE projectId = ?`;
  
//   db.query(checkProjectSql, [projectId], (err, results) => {
//     if (err) {
//       console.error('Error checking project ID:', err);
//       return res.status(500).send(err);
//     }
    
//     // Step 2: If project ID exists, update the leaveDate
//     // Step 2: If project ID exists, update the leaveDate
//     if (results.length > 0) {
//       const updateLeaveDateSql = `UPDATE supervisor SET leavedate = ? WHERE projectId = ?`;
//       const updateDeleteDateSql = `DELETE FROM temp_signup WHERE projectId = ?`;
      
//       db.query(updateLeaveDateSql, [appointmentDate, projectId], (updateErr, updateResult) => {
//         if (updateErr) {
//           console.error('Error updating leave date:', updateErr);
//           return res.status(500).send('Error updating leave date');
//         }
//         console.log('Leave date updated:', updateResult);
//       });

//       // Execute the delete query
//       db.query(updateDeleteDateSql, [projectId], (deleteErr, deleteResult) => {
//         if (deleteErr) {
//           console.error('Error deleting from temp_signup:', deleteErr);
//           return res.status(500).send('Error deleting from temp_signup');
//         }
//         console.log('Deleted from temp_signup:', deleteResult);
//       });
//     }

//     // Step 3: Insert new supervisor data
//     const insertSql = `
//     INSERT INTO supervisor
//       (appointmentDate, departmentName, designationId, designationName, employeeCode, employeeEmail, employeeName, employeePanAddhar, employeePhone, employeePicture, employeerName, fatherName, projectAddress, projectCode, projectId, projectName, projectPicture, projectType, projectcity, projectpincode, projectstate, supervisorId, username)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;
    
//     // Execute the insert query
//     db.query(
//       insertSql,
//       [ appointmentDate, departmentName, designationId, designationName, employeeCode, employeeEmail, employeeName, employeePanAddhar, employeePhone, employeePicture, employeerName, fatherName, projectAddress, projectCode, projectId, projectName, projectPicture, projectType,projectcity,projectpincode,projectstate, supervisorId, username],
//       (insertErr, insertResult) => {
//         if (insertErr) {
//           console.error('Error uploading supervisor data:', insertErr);
//           return res.status(500).send(insertErr);
//         }
//         console.log('Supervisor data uploaded:', insertResult);
//         res.send('Supervisor data uploaded');
//       }
//     );
//   });
// });

app.post('/assignSupervisor', (req, res) => {
  const { appointmentDate,departmentName,designationId,designationName,employeeCode,employeeEmail,employeeName,employeePanAddhar,employeePhone,employeePicture,employeerName,fatherName,projectAddress,projectCode,projectId,projectName,projectPicture,projectType,projectcity,projectpincode,projectstate,supervisorId,username
 } = req.body;
  // SQL query to insert data into supervisor table
  const sql = `
    INSERT INTO supervisor ( appointmentDate, departmentName, designationId, designationName, employeeCode, employeeEmail, employeeName, employeePanAddhar, employeePhone, employeePicture, employeerName, fatherName, projectAddress, projectCode, projectId, projectName, projectPicture, projectType, projectcity, projectpincode, projectstate, supervisorId, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // Execute the query
  db.query(
    sql,
    [ appointmentDate, departmentName, designationId, designationName, employeeCode, employeeEmail, employeeName, employeePanAddhar, employeePhone, employeePicture, employeerName, fatherName, projectAddress, projectCode, projectId, projectName, projectPicture, projectType,projectcity,projectpincode,projectstate, supervisorId, username],
    (err, result) => {
      if (err) {
        console.error('Error uploading supervisor data:', err);
        return res.status(500).send(err);
      }
      console.log('supervisor data uploaded:', result);
      res.send('supervisor data uploaded');
    }
  );
});
// Get supervisor 
app.get('/supervisors', (req, res) => {
  const sql = 'SELECT * FROM supervisor'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching supervisor:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});
// Get supervisors where leaveDate is NULL or greater than today's date
app.get('/api/supervisors', (req, res) => {
  const sql = `
    SELECT * FROM supervisor
    WHERE leavedate IS NULL`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching supervisors:', err);
      return res.status(500).send('An error occurred while fetching supervisors.');
    }
    res.json(results);
  });
});
// for adding the supervisor 
app.get('/api/add/supervisors', (req, res) => {
  const sql = `
    SELECT * FROM supervisor s
    INNER JOIN (
      SELECT projectId, MAX(appointmentDate) AS latestAppointment
      FROM supervisor
      GROUP BY projectId
    ) latestSupervisors ON s.projectId = latestSupervisors.projectId AND s.appointmentDate = latestSupervisors.latestAppointment
    WHERE s.leavedate IS NULL;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching supervisors:', err);
      return res.status(500).send('An error occurred while fetching supervisors.');
    }
    res.json(results);
  });
});

// Archived Supervisor 
app.get('/archived/supervisors', (req, res) => {
  const sql = 'SELECT * FROM supervisor WHERE leavedate IS NOT NULL ORDER BY id DESC'; // Fetching only records with non-null leavedate and ordering by id
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching supervisors:', err);
      return res.status(500).send('An error occurred while fetching supervisors.');
    }
    res.json(results);
  });
});


// Relif Supervisor 
app.put('/updateSupervisor/:id', (req, res) => {
  const id = req.params.id;
  const { leavedate, relifDescription } = req.body;

  // SQL query to update the supervisor's leave date and relief description
  const sql = `
    UPDATE supervisor 
    SET leavedate = ?, relifDescription = ? 
    WHERE id = ?`;

  const values = [leavedate, relifDescription, id];

  // Execute the query to update the supervisor's data
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating supervisor details:', err);
      return res.status(500).send('Error updating supervisor details');
    }
    
    // Log and send success response
    console.log('Supervisor details updated:', result);
    res.send('Supervisor details updated successfully');
  });
});

// delete Company Details  
app.delete('/projectsignup/:id', (req, res) => {
  const id = req.params.id;

  // Check if the project exists
  const checkSql = 'SELECT * FROM temp_signup WHERE projectId = ?';
  db.query(checkSql, [id], (err, result) => {
    if (err) {
      console.error('Error checking project existence:', err);
      return res.status(500).send(err);
    }
    
    // If project doesn't exist
    if (result.length === 0) {
      return res.status(404).send('Project not found');
    }

    // If project exists, proceed to delete
    const deleteSql = 'DELETE FROM temp_signup WHERE projectId = ?';
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        console.error('Error deleting project:', err);
        return res.status(500).send(err);
      }
      console.log('Project deleted:', deleteResult);
      res.send('Project deleted');
    });
  });
});


// supervisor 
// Add Fund  
app.post('/addFundRequest', (req, res) => {
  const {  projectId,projectName,supervisorId,supervisorName,date,requestAmount,description
 } = req.body;
  // SQL query to insert data into addfund table
  const sql = `
    INSERT INTO addfund
      ( projectId,projectName,supervisorId,supervisorName,date,requestAmount,description
)
    VALUES (?, ?, ?,?, ?, ?,?)
  `;
  // Execute the query
  db.query(
    sql,
    [ projectId,projectName,supervisorId,supervisorName,date,requestAmount,description
],
    (err, result) => {
      if (err) {
        console.error('Error uploading addfund data:', err);
        return res.status(500).send(err);
      }
      console.log('addfund data uploaded:', result);
      res.send('addfund data uploaded');
    }
  );
});

app.get('/fundrequest', (req, res) => {
  const sql = 'SELECT * FROM addfund'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching addfund:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});
app.put('/updatefund/:id', (req, res) => {
  const fundId = parseInt(req.params.id); // Extracting the fund ID from the URL
  const { status } = req.body; // Extracting the status from the request body
  
  if (!status || isNaN(fundId)) {
    return res.status(400).send("Invalid data provided"); // Validation for status and fundId
  }

  const sql = 'UPDATE addfund SET status = ? WHERE id = ?'; // SQL query to update status

  db.query(sql, [status, fundId], (err, result) => { // Passing status and fundId to query
    if (err) {
      console.error('Error updating fund data:', err);
      return res.status(500).send('Error updating fund data');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Fund not found'); // Handling case where no fund was updated
    }

    console.log('Fund data updated successfully:', result);
    res.send('Fund data updated successfully'); // Sending a success message
  });
});


app.post('/approvereject', (req, res) => {
  const {  date,description,projectId,projectName,requestAmount,amount,status,supervisorId,supervisorName
 } = req.body;
  // SQL query to insert data into approvereject table
  const sql = `
    INSERT INTO approvereject
      ( date,description,projectId,projectName,requestAmount,amount,status,supervisorId,supervisorName
)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // Execute the query
  db.query(
    sql,
    [ date,description,projectId,projectName,requestAmount,amount,status,supervisorId,supervisorName
],
    (err, result) => {
      if (err) {
        console.error('Error uploading approvereject data:', err);
        return res.status(500).send(err);
      }
      console.log('approvereject data uploaded:', result);
      res.send('approvereject data uploaded');
    }
  );
});


// Add Fund  

// Total Credit /expenses
app.get('/totalcredit', (req, res) => {
  const sql = 'SELECT * FROM cash_details'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching cash_details:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});
app.get('/totalexpenses', (req, res) => {
  const sql = 'SELECT * FROM makeentry'; // Assuming you want to order by the 'id' field in descending order
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching makeentry:', err);
      return res.status(500).send('An error occurred while fetching timelines.');
    }
    res.json(results);
  });
});
// Total Credit






// check /empdata /officeData /projectData  /api/employee/ /ledger_entries /assignSupervisor /supervisors /api/supervisors /api/supervisors /api/project/



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

















