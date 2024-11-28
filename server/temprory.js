// const dotenv = require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql');
// const jwt = require('jsonwebtoken');
// const path = require('path');
// const multer = require('multer');
// const bcrypt = require('bcrypt');
// const expressSession = require('express-session');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const cron = require('node-cron');


// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));
// app.use(bodyParser.json());

// app.use(expressSession({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//   },
// }));

// // MySQL database connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL database:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// // Authentication Details  


// // Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   if (req.session && req.session.user) {
//     next();
//   } else {
//     res.status(401).json({ error: 'Unauthorized access' });
//   }
// };

// // Function to generate a random token
// const generateResetToken = () => {
//   return crypto.randomBytes(20).toString('hex');
// };

// // Function to send password reset email
// const sendPasswordResetEmail = (email, resetToken) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     auth: {
//       user: 'prospecteduindia@gmail.com',
//       pass: 'iddq enra wnqv temk'
//     }
//   });

//   const mailOptions = {
//     from: 'prospecteduindia@gmail.com',
//     to: email,
//     subject: 'Password Reset',
//     // text: `http://localhost:3000/reset-password/${resetToken}`,
//     text: `https://demo2.prospectdigital.in/reset-password/${resetToken}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };

// // Signup Route
// // app.post('/signup', async (req, res) => {
// //   const { username, email, password } = req.body;

// //   try {
// //     // Hash the password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // Check if the user already exists in the database
// //     db.query('SELECT * FROM temp_signup WHERE email = ?', [email], async (error, results) => {
// //       if (error) {
// //         console.error('MySQL query error:', error);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }

// //       if (results.length > 0) {
// //         return res.status(400).json({ error: 'User already exists' });
// //       }

// //       // Insert the new user into the database
// //       db.query('INSERT INTO temp_signup (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (error, results) => {
// //         if (error) {
// //           console.error('MySQL query error:', error);
// //           return res.status(500).json({ error: 'Internal server error' });
// //         }

// //         res.status(201).json({ message: 'User created successfully' });
// //       });
// //     });
// //   } catch (error) {
// //     console.error('Error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });
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

// // Forgot Password Route
// app.post('/forgotpassword', async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find the user by email
//     db.query('SELECT * FROM temp_signup WHERE email = ?', [email], async (error, results) => {
//       if (error) {
//         console.error('MySQL query error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const user = results[0];

//       // Generate password reset token and save it to the user document
//       const resetToken = generateResetToken();

//       // Update the user record in the database with the reset token and expiration time
//       db.query('UPDATE temp_signup SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?', [resetToken, Date.now() + 3600000, user.id], async (updateError, updateResults) => {
//         if (updateError) {
//           console.error('MySQL query error:', updateError);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         // Send email to user with the reset token
//         sendPasswordResetEmail(user.email, resetToken);

//         res.status(200).json({ message: 'Password reset instructions sent to your email' });
//       });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Route for handling password reset
// app.post('/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     // Find the user by reset token and ensure it's not expired
//     db.query('SELECT * FROM temp_signup WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [token, Date.now()], async (error, results) => {
//       if (error) {
//         console.error('MySQL query error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       if (results.length === 0) {
//         return res.status(400).json({ error: 'Invalid or expired token' });
//       }

//       const user = results[0];

//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       // Update user's password and clear reset token fields
//       db.query('UPDATE temp_signup SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?', [hashedPassword, user.id], async (updateError, updateResults) => {
//         if (updateError) {
//           console.error('MySQL query error:', updateError);
//           return res.status(500).json({ error: 'Internal server error' });
//         }

//         res.status(200).json({ message: 'Password reset successful' });
//       });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login route
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if the user exists in the database
//     db.query('SELECT * FROM temp_signup WHERE email = ?', [email], async (error, results) => {
//       if (error) {
//         console.error('MySQL query error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       // Check if the user exists
//       if (results.length === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       // Validate password
//       const user = results[0];
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid password' });
//       }

//       // Store user session information
//       req.session.user = { email: user.email, id: user.id };

//       // User authenticated successfully, generate JWT token
//       const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, {
//         expiresIn: '1h' // Token expires in 1 hour
//       });

//       // Send the token and username in response body
//       res.status(200).json({ message: 'Login successful', token, username: user.username });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Route for checking authentication status
// app.get('/check-auth', isAuthenticated, (req, res) => {
//   res.status(200).json({ authenticated: true });
// });

// // Example protected route
// app.get('/protected', isAuthenticated, (req, res) => {
//   res.status(200).json({ message: 'Authenticated access' });
// });



// // Fetch login details by email
// // login details 
// app.get('/logindetails/:email', (req, res) => {
//   const { email } = req.params;

//   const query = 'SELECT * FROM temp_signup WHERE email = ?';
//   db.query(query, [email], (err, results) => {
//       if (err) {
//           console.error('Error fetching temp_signup records:', err);
//           res.status(500).json({ error: 'Error fetching records' });
//           return;
//       }
//       res.json(results);
//   });
// });

// // Authentication Details End /activeinactive delete











// // Multer configuration for handling file uploads for employees
// const employeeStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'employees'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const employeeUpload = multer({ storage: employeeStorage });



// // Multer configuration for handling file uploads for assets
// const clientStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'clients'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const clientUpload = multer({ storage: clientStorage });

// // Multer configuration for handling file uploads for assets
// const vendorStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'vendor'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const vendorUpload = multer({ storage: vendorStorage });

// // Multer configuration for handling file uploads for settings
// const settingsStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'settings'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const settingsUpload = multer({ storage: settingsStorage });
// // Multer configuration for handling file uploads for settings
// const profileStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'profile'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }

// });
// const profileUpload = multer({ storage: profileStorage });



// // Multer configuration for handling file uploads for offices
// const officeStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'office'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const officeUpload = multer({ storage: officeStorage });


// // Multer configuration for handling file uploads for offices
// const projectStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'project'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const projectUpload = multer({ storage: projectStorage });
// // Multer configuration for handling file uploads for outward
// const outwardStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join('public', 'uploads', 'outward'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const outwardUpload = multer({ storage: outwardStorage });
// // rough company_details







// app.post('/profile/upload', profileUpload.single('picture'), async (req, res) => {
//   // Extract form data and uploaded file from request
//   const formData = req.body;
//   const { id, fullName, designation, email, phone, address, departmentName, employeeCode, state, city, pincode } = formData;
//   let picture = null; // Initialize picture variable

//   // Check if file was uploaded
//   if (req.file) {
//     picture = req.file.filename; // Get the filename of the uploaded profile picture
//   }

//   try {
//     // Check if data already exists in the database
//     const existingData = await checkExistingData();

//     if (existingData) {
//       // Data exists, update it
//       await updateData(id);
//     } else {
//       // Data doesn't exist, insert new data
//       await insertData();
//     }

//     res.status(200).json({ message: 'Data saved successfully' });
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).json({ message: 'Failed to save data' });
//   }

//   // Function to check if data already exists in the database
//   async function checkExistingData() {
//     return new Promise((resolve, reject) => {
//       const checkSql = 'SELECT * FROM profiles WHERE id = ?';
//       db.query(checkSql, [id], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result.length ? result[0] : null);
//         }
//       });
//     });
//   }

//   // Function to insert new data into the database
//   async function insertData() {
//     return new Promise((resolve, reject) => {
//       const insertSql = 'INSERT INTO profiles (fullName, designation, email, phone, address ,departmentName,employeeCode,state,city,pincode, picture) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)';
//       const values = [fullName, designation, email, phone, address, departmentName, employeeCode, state, city, pincode, , picture];
//       db.query(insertSql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }

//   // Function to update existing data in the database
//   async function updateData(id) {
//     return new Promise((resolve, reject) => {
//       const updateSql = 'UPDATE profiles SET fullName = ?, designation = ?, email = ?, phone = ?, address = ?,departmentName= ?,employeeCode= ?,state= ?,city= ?,pincode = ?' +
//         (picture ? ', picture = ?' : '') +
//         ' WHERE id = ?';
//       let values = [fullName, designation, email, phone, address, departmentName, employeeCode, state, city, pincode,];

//       // Add picture to the values array if it is not null
//       if (picture) values.push(picture);

//       // Add the id to the end of the values array
//       values.push(id);

//       db.query(updateSql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }
// });

// // Get the data of the Company Data for the last ID
// app.get('/profile/data', (req, res) => {
//   const sql = 'SELECT * FROM profiles ORDER BY id DESC LIMIT 1';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching Company data:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results[0]); // Send the first (and only) result
//   });
// });




// app.post('/settings/upload', settingsUpload.fields([
//   { name: 'favicon', maxCount: 1 },
//   { name: 'landingPageLogo', maxCount: 1 },
//   { name: 'dashboardLogo', maxCount: 1 }
// ]), async (req, res) => {
//   // Extract form data and uploaded files from request
//   const formData = req.body;
//   const { id, title, address, email, phone, assetTagPrefix, description } = formData;
//   const files = req.files;

//   // Process the uploaded files
//   let favicon = null;
//   let landingPageLogo = null;
//   let dashboardLogo = null;

//   // Check if files are uploaded and update the corresponding variables
//   if (files['favicon']) {
//     favicon = files['favicon'][0].filename;
//   }
//   if (files['landingPageLogo']) {
//     landingPageLogo = files['landingPageLogo'][0].filename;
//   }
//   if (files['dashboardLogo']) {
//     dashboardLogo = files['dashboardLogo'][0].filename;
//   }

//   try {
//     // Check if data already exists in the database
//     const existingData = await checkExistingData();

//     if (existingData) {
//       // Data exists, update it
//       await updateData(id);
//     } else {
//       // Data doesn't exist, insert new data
//       await insertData();
//     }

//     res.status(200).json({ message: 'Data saved successfully' });
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).json({ message: 'Failed to save data' });
//   }

//   // Function to check if data already exists in the database
//   async function checkExistingData() {
//     return new Promise((resolve, reject) => {
//       const checkSql = 'SELECT * FROM company_details WHERE id = ?';
//       db.query(checkSql, [id], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result.length ? result[0] : null);
//         }
//       });
//     });
//   }

//   // Function to insert new data into the database
//   async function insertData() {
//     return new Promise((resolve, reject) => {
//       const insertSql = 'INSERT INTO company_details (title, address, email, phone, assetTagPrefix,description, favicon, landingPageLogo, dashboardLogo) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
//       const values = [title, address, email, phone, assetTagPrefix, description, favicon, landingPageLogo, dashboardLogo];
//       db.query(insertSql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }

//   // Function to update existing data in the database
//   async function updateData(id) {
//     return new Promise((resolve, reject) => {
//       const updateSql = 'UPDATE company_details SET title = ?, address = ?, email = ?, phone = ?, assetTagPrefix = ?,description = ?' +
//         (favicon ? ', favicon = ?' : '') +
//         (landingPageLogo ? ', landingPageLogo = ?' : '') +
//         (dashboardLogo ? ', dashboardLogo = ?' : '') +
//         ' WHERE id = ?';
//       let values = [title, address, email, phone, assetTagPrefix, description];

//       // Add values to the array only if they are not null
//       if (favicon) values.push(favicon);
//       if (landingPageLogo) values.push(landingPageLogo);
//       if (dashboardLogo) values.push(dashboardLogo);

//       // Add the id to the end of the values array
//       values.push(id);

//       db.query(updateSql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }
// });


// app.post('/settings/upload', settingsUpload.fields([
//   { name: 'favicon', maxCount: 1 },
//   { name: 'landingPageLogo', maxCount: 1 },
//   { name: 'dashboardLogo', maxCount: 1 }
// ]), async (req, res) => {
//   // Extract form data and uploaded files from request
//   const formData = req.body;
//   const { id, title, address, email, phone, assetTagPrefix, description } = formData;
//   const files = req.files;

//   // Process the uploaded files
//   let favicon = null;
//   let landingPageLogo = null;
//   let dashboardLogo = null;

//   // Check if files are uploaded and update the corresponding variables
//   if (files['favicon']) {
//     favicon = files['favicon'][0].filename;
//   }
//   if (files['landingPageLogo']) {
//     landingPageLogo = files['landingPageLogo'][0].filename;
//   }
//   if (files['dashboardLogo']) {
//     dashboardLogo = files['dashboardLogo'][0].filename;
//   }

//   try {
//     // Check if data already exists in the database
//     const existingData = await checkExistingData();

//     if (existingData) {
//       // Data exists, update it
//       await updateData(id);
//     } else {
//       // Data doesn't exist, insert new data
//       await insertData();
//     }

//     res.status(200).json({ message: 'Data saved successfully' });
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).json({ message: 'Failed to save data' });
//   }

//   // Function to check if data already exists in the database
//   async function checkExistingData() {
//     return new Promise((resolve, reject) => {
//       const checkSql = 'SELECT * FROM company_details WHERE id = ?';
//       db.query(checkSql, [id], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result.length ? result[0] : null);
//         }
//       });
//     });
//   }

//   // Function to insert new data into the database
//   async function insertData() {
//     return new Promise((resolve, reject) => {
//       const insertSql = 'INSERT INTO company_details (title, address, email, phone, assetTagPrefix,description, favicon, landingPageLogo, dashboardLogo) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
//       const values = [title, address, email, phone, assetTagPrefix, description, favicon, landingPageLogo, dashboardLogo];
//       db.query(insertSql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }

//   // Function to update existing data in the database
//   async function updateData(id) {
//     return new Promise((resolve, reject) => {
//       const updateSql = 'UPDATE company_details SET title = ?, address = ?, email = ?, phone = ?, assetTagPrefix = ?,description = ?' +
//         (favicon ? ', favicon = ?' : '') +
//         (landingPageLogo ? ', landingPageLogo = ?' : '') +
//         (dashboardLogo ? ', dashboardLogo = ?' : '') +
//         ' WHERE id = ?';
//       let values = [title, address, email, phone, assetTagPrefix, description];

//       // Add values to the array only if they are not null
//       if (favicon) values.push(favicon);
//       if (landingPageLogo) values.push(landingPageLogo);
//       if (dashboardLogo) values.push(dashboardLogo);

//       // Add the id to the end of the values array
//       values.push(id);

//       db.query(updateSql, values, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }
// });


// // states fetching  
// // States fetching 
// app.get('/states', (req, res) => {
//   const sql = 'SELECT * FROM  states';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching States:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });
// // states fetching 

// // active inactive
// app.post('/activeinactive', (req, res) => {
//   const {
//     employeeId,
//     employeeName,
//     status,
//     reason,
//     fromDate,
//     toDate,
//     description
//   } = req.body;

//   // SQL query to insert data into employee_status_updates table
//   const sql = `
//     INSERT INTO active_inactive 
//       (employeeId, employeeName, status, reason, fromDate, toDate, description) 
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   // Execute the query
//   db.query(sql, [employeeId, employeeName, status, reason, fromDate, toDate, description], (err, result) => {
//     if (err) {
//       console.error('Error uploading active_inactive data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Active/Inactive data uploaded:', result);
//     res.send('Active/Inactive data uploaded');
//   });
// });

// app.get('/activeinactive', (req, res) => {
//   const sql = `
//     SELECT *
//     FROM active_inactive
//     WHERE status IN ('request_leave')
//     AND (employeeId, updatedAt) IN (
//         SELECT employeeId, MAX(updatedAt)
//         FROM active_inactive
//         WHERE status IN ('request_leave')
//         GROUP BY employeeId
//     );
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching active_inactive:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// app.get('/activeinactive/leave', (req, res) => {
//   const sql = `
//     SELECT *
//     FROM active_inactive
//     WHERE status = 'request_leave'
//     AND (employeeId, updatedAt) IN (
//         SELECT employeeId, MAX(updatedAt)
//         FROM active_inactive
//         WHERE status = 'request_leave'
//         GROUP BY employeeId
//     );
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching active_inactive:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// app.get('/activeinactive/resignterminate', (req, res) => {
//   const sql = `
//     SELECT ai.*
//     FROM active_inactive ai
//     INNER JOIN (
//       SELECT employeeId, MAX(id) AS maxId
//       FROM active_inactive
//       GROUP BY employeeId
//     ) latest
//     ON ai.employeeId = latest.employeeId
//     AND ai.id = latest.maxId
//     WHERE ai.status = 'resign_terminate';
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching active_inactive:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });




// app.put('/activeinactive_status/:id', (req, res) => {
//   const employeeId = req.params.id;
//   const { status } = req.body;

//   // SQL query to get the last occurrence of the employee based on the highest id
//   const selectSql = 'SELECT id FROM active_inactive WHERE employeeId = ? ORDER BY id DESC LIMIT 1';

//   db.query(selectSql, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching the last occurrence of the employee:', err);
//       return res.status(500).send(err);
//     }

//     if (results.length === 0) {
//       return res.status(404).send('Employee not found');
//     }

//     const lastOccurrenceId = results[0].id;

//     // SQL query to update the status of the last occurrence
//     const updateSql = 'UPDATE active_inactive SET status = ? WHERE id = ?';
//     const params = [status, lastOccurrenceId];

//     db.query(updateSql, params, (err, updateResults) => {
//       if (err) {
//         console.error('Error updating active_inactive details:', err);
//         return res.status(500).send(err);
//       }

//       res.status(200).send('Active/inactive details updated successfully');
//     });
//   });
// });

// app.get('/activeinactive_employee/:id', (req, res) => {
//   const employeeId = req.params.id; // Correct parameter name to match route
//   console.log(employeeId); // Check if you're getting the correct employeeId

//   const sql = 'SELECT * FROM active_inactive WHERE employeeId = ?';
//   db.query(sql, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching active_inactive history:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// app.get('/activeinactive/allleave', (req, res) => {
//   const sql = 'SELECT * FROM active_inactive WHERE status = ?';
//   db.query(sql, ['leave'], (err, results) => {
//     if (err) {
//       console.error('Error fetching active_inactive data:', err);
//       return res.status(500).send('Error fetching data');
//     }
//     // Send the results back to the client
//     res.status(200).json(results);
//   });
// });


// // active inactive 

// // approve details  
// app.post('/approved', (req, res) => {
//   const {
//     employeeId,
//     employeeName, activeInactiveDetails_id,
//     fromDate,
//     toDate,
//     status,
//     description
//   } = req.body;

//   // SQL query to insert data into employee_status_updates table
//   const sql = `
//     INSERT INTO approve_details 
//       (employeeId, employeeName,activeInactiveDetails_id,fromDate, toDate, status, description) 
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   // Execute the query
//   db.query(sql, [employeeId, employeeName, activeInactiveDetails_id, fromDate, toDate, status, description], (err, result) => {
//     if (err) {
//       console.error('Error uploading approve_details data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('approve_details data uploaded:', result);
//     res.send('approve_details data uploaded');
//   });
// });

// app.get('/approved', (req, res) => {
//   const sql = `
//     SELECT ad.*
//     FROM approve_details ad
//     JOIN (
//         SELECT employeeId, MAX(id) AS maxId
//         FROM approve_details
//         WHERE status = 'approved'
//         GROUP BY employeeId
//     ) AS latest ON ad.employeeId = latest.employeeId AND ad.id = latest.maxId
//     WHERE ad.status = 'approved'
//     ORDER BY ad.employeeId;`;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching latest approved approve_details:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });


// // for reject 
// // app.get('/approved/reject', (req, res) => {
// //   const sql = `
// //     SELECT ad.*
// //     FROM approve_details ad
// //     JOIN (
// //         SELECT employeeId, MAX(id) AS maxId
// //         FROM approve_details
// //         GROUP BY employeeId
// //     ) AS latest ON ad.employeeId = latest.employeeId AND ad.id = latest.maxId
// //     ORDER BY ad.employeeId;`;

// //   db.query(sql, (err, results) => {
// //     if (err) {
// //       console.error('Error fetching latest approve_details:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// app.get('/approved/reject', (req, res) => {
//   const sql = 'SELECT * FROM approve_details WHERE status = ?';
//   db.query(sql, ['reject'], (err, results) => {
//     if (err) {
//       console.error('Error fetching approve_details data:', err);
//       return res.status(500).send('Error fetching data');
//     }
//     // Send the results back to the client
//     res.status(200).json(results);
//   });
// });




// // approve details  

// // Get the data of the Company Data for the last ID
// app.get('/settings', (req, res) => {
//   const sql = 'SELECT * FROM company_details ORDER BY id DESC LIMIT 1';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching Company data:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results[0]); // Send the first (and only) result
//   });
// });

// // Route for handling form submission and file upload for employees
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
//     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
//     username, employeeCode, childrenAges, wifeName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, status
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
//       fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
//       panCardPhoto, aadharCardPhoto, passportSizePhoto, marksheet10thPhoto, marksheet12thPhoto, graductionMarksheet, postGraductionMarksheet, professionalDegree,
//       offerLetter, joiningLetter, appointmentLetter, employeementletter, experienceLetter,passbook_check, drivingLicense, passport, resumePhoto, otherPhoto, username, employeeCode, childrenAges, wifeName,
//       employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, status, createdAt, updatedAt
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?)
//   `;

//   const values = [
//     employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
//     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
//     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
//     department, position, interncontractual, joiningDate, medical, travel, insurance,
//     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
//     panCardPhoto, aadharCardPhoto, passportSizePhoto, marksheet10thPhoto, marksheet12thPhoto, graductionMarksheet, postGraductionMarksheet, professionalDegree,
//     offerLetter, joiningLetter, appointmentLetter, employeementletter, experienceLetter, passbook_check, drivingLicense, passport, resumePhoto, otherPhoto, username, employeeCode, childrenAges, wifeName,
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

// app.put('/updateDocumentation/:id', employeeUpload.fields([
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
//   { name: 'experienceletter', maxCount: 1 }
// ]), (req, res) => {
//   const employeeId = req.params.id;

//   const fileFields = [
//     'panCardPhoto', 'aadharCardPhoto', 'passportSizePhoto', 'marksheet10thPhoto',
//     'marksheet12thPhoto', 'graductionmarksheet', 'postGraductionmarksheet', 'professionaldegree',
//     'offerletter', 'joiningletter', 'appointmentletter', 'employeementletter',
//     'experienceletter', 'drivinglicense', 'passport', 'resumePhoto', 'otherPhoto'
//   ];

//   const values = fileFields.map(field => req.files[field] ? req.files[field][0].filename : null);
//   values.push(employeeId); // Add employeeId as the last parameter

//   const sql = `
//       UPDATE employee_details SET
//       panCardPhoto = COALESCE(?, panCardPhoto), aadharCardPhoto = COALESCE(?, aadharCardPhoto), passportSizePhoto = COALESCE(?, passportSizePhoto), marksheet10thPhoto = COALESCE(?, marksheet10thPhoto), marksheet12thPhoto = COALESCE(?, marksheet12thPhoto), graductionMarksheet = COALESCE(?, graductionMarksheet), postGraductionMarksheet = COALESCE(?, postGraductionMarksheet), professionalDegree = COALESCE(?, professionalDegree),
//       offerLetter = COALESCE(?, offerLetter), joiningLetter = COALESCE(?, joiningLetter), appointmentLetter = COALESCE(?, appointmentLetter), employeementletter = COALESCE(?, employeementletter), experienceLetter = COALESCE(?, experienceLetter), drivingLicense = COALESCE(?, drivingLicense), passport = COALESCE(?, passport), resumePhoto = COALESCE(?, resumePhoto), otherPhoto = COALESCE(?, otherPhoto)
//       WHERE id = ?
//   `;

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error updating employee data:', err);
//       return res.status(500).send('Error updating employee data');
//     }
//     console.log('Employee data updated:', result);
//     res.send('Employee data updated');
//   });
// });

// // Function to get employee by ID
// const getEmployeeById = (id) => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM employee_details WHERE id = ?', [id], (err, results) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(results[0]);
//     });
//   });
// };

// // Function to update employee documentation
// const updateEmployeeDocumentation = (id, additionalDocumentation) => {
//   return new Promise((resolve, reject) => {
//     db.query('UPDATE employee_details SET additionalDocumentation = ? WHERE id = ?', [JSON.stringify(additionalDocumentation), id], (err, results) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(results);
//     });
//   });
// };

// // Route to add documentation
// app.post('/addDocumentation/:id', employeeUpload.single('documentFile'), async (req, res) => {
//   const employeeId = req.params.id;
//   const { documentName } = req.body;
//   const documentFile = req.file ? req.file.filename : null;

//   console.log("Uploaded file:", documentFile);

//   try {
//     // Fetch the current employee details from your database
//     const employee = await getEmployeeById(employeeId);

//     if (!employee) {
//       return res.status(404).send('Employee not found.');
//     }

//     let additionalDocumentation = employee.additionalDocumentation ? JSON.parse(employee.additionalDocumentation) : [];

//     // Add new documentation
//     additionalDocumentation.push({ [documentName]: documentFile });

//     // Update the employee documentation in the database
//     await updateEmployeeDocumentation(employeeId, additionalDocumentation);
//     console.log("Documentation updated:", additionalDocumentation);

//     res.send('Documentation updated successfully.');
//   } catch (error) {
//     console.error('Error updating documentation:', error);
//     res.status(500).send('Error updating documentation.');
//   }
// });

// // Route for updating employee details by ID /employees projectData changesalary
// // app.put('/employees/:id', (req, res) => {
// //   console.log(req.body)
// //   const {
// //     employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
// //     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
// //     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
// //     department, position, interncontractual, joiningDate, medical, travel, insurance,
// //     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
// //      employeeCode, childrenAges, wifeName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany
// //   } = req.body;

// //   const sql = `
// //     UPDATE employee_details SET 
// //       employeeName = ?, departmentName = ?, positionName = ?, employeeEmail = ?, employeePhone = ?, employeeAltPhone = ?, employeeDOB = ?, employeeGender = ?, employeeMaritalStatus = ?, 
// //       employeePan = ?, employeeAadhar = ?, employeeAddress1 = ?, employeeCity1 = ?, employeeState1 = ?, employeePincode1 = ?, employeeAddress2 = ?, employeeCity2 = ?, employeeState2 = ?, employeePincode2 = ?, employeeType = ?, 
// //       accountHolderName = ?, accountNumber = ?, bankName = ?, ifscCode = ?, branchName = ?, grossSalary = ?, 
// //       departmentId = ?, positionId = ?, interncontractual = ?, joiningDate = ?, medical = ?, travel = ?, insurance = ?, 
// //       fatherName = ?, motherName = ?, emergencyContactNumber1 = ?, emergencyContactNumber2 = ?, emergencyContactPerson1 = ?, emergencyContactPerson2 = ?,  employeeCode = ?, childrenAges = ?, wifeName = ?, employeeBloodGroup = ?, office_id = ?, company_id = ?, joiningOffice = ?, joiningCompany = ?, 
// //       updatedAt = ?
// //     WHERE id = ?
// //   `;

// //   const values = [
// //     employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
// //     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
// //     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
// //     department, position, interncontractual, joiningDate, medical, travel, insurance,
// //     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
// //      employeeCode, childrenAges, wifeName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, new Date(),
// //     req.params.id
// //   ];

// //   db.query(sql, values, (err, result) => {
// //     if (err) {
// //       console.error('Error updating employee data:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Employee data updated:', result);
// //     res.send('Employee data updated');
// //   });
// // });

// // Route for updating employee details by ID /employees projectData changesalary
// // app.put('/employees/:id', employeeUpload.fields([
// //   { name: 'passbook_check', maxCount: 1 },
// // ]), (req, res) => {
// //   console.log(req.body)
// //   const {
// //     employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
// //     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
// //     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
// //     department, position, interncontractual, joiningDate, medical, travel, insurance,
// //     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
// //     employeeCode, childrenAges, wifeName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany
// //   } = req.body;

// //   const passbook_check = req.files.passbook_check ? req.files.passbook_check[0].filename : null;

// //   const sql = `
// //     UPDATE employee_details SET 
// //       passbook_check = COALESCE(?, passbook_check),employeeName = ?, departmentName = ?, positionName = ?, employeeEmail = ?, employeePhone = ?, employeeAltPhone = ?, employeeDOB = ?, employeeGender = ?, employeeMaritalStatus = ?, 
// //       employeePan = ?, employeeAadhar = ?, employeeAddress1 = ?, employeeCity1 = ?, employeeState1 = ?, employeePincode1 = ?, employeeAddress2 = ?, employeeCity2 = ?, employeeState2 = ?, employeePincode2 = ?, employeeType = ?, 
// //       accountHolderName = ?, accountNumber = ?, bankName = ?, ifscCode = ?, branchName = ?, grossSalary = ?, 
// //       departmentId = ?, positionId = ?, interncontractual = ?, joiningDate = ?, medical = ?, travel = ?, insurance = ?, 
// //       fatherName = ?, motherName = ?, emergencyContactNumber1 = ?, emergencyContactNumber2 = ?, emergencyContactPerson1 = ?, emergencyContactPerson2 = ?,  employeeCode = ?, childrenAges = ?, wifeName = ?, employeeBloodGroup = ?, office_id = ?, company_id = ?, joiningOffice = ?, joiningCompany = ?, 
// //       updatedAt = ?
// //     WHERE id = ?
// //   `;

// //   const values = [passbook_check, employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
// //     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
// //     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
// //     department, position, interncontractual, joiningDate, medical, travel, insurance,
// //     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
// //     employeeCode, childrenAges, wifeName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, new Date(),
// //     req.params.id
// //   ];

// //   db.query(sql, values, (err, result) => {
// //     if (err) {
// //       console.error('Error updating employee data:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Employee data updated:', result);
// //     res.send('Employee data updated');
// //   });
// // });

// app.put('/employees/:id', employeeUpload.fields([
//   { name: 'passbook_check', maxCount: 1 },
// ]), (req, res) => {
//   const {
//     employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
//     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
//     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
//     department, position, interncontractual, joiningDate, medical, travel, insurance,
//     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
//     employeeCode, childrenAges, wifeName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany
//   } = req.body;

//   const passbook_check = req.files.passbook_check ? req.files.passbook_check[0].filename : null;

//   const sql = `
//       UPDATE employee_details SET 
//           passbook_check = COALESCE(?, passbook_check), employeeName = ?, departmentName = ?, positionName = ?, employeeEmail = ?, employeePhone = ?, employeeAltPhone = ?, employeeDOB = ?, employeeGender = ?, employeeMaritalStatus = ?, 
//           employeePan = ?, employeeAadhar = ?, employeeAddress1 = ?, employeeCity1 = ?, employeeState1 = ?, employeePincode1 = ?, employeeAddress2 = ?, employeeCity2 = ?, employeeState2 = ?, employeePincode2 = ?, employeeType = ?, 
//           accountHolderName = ?, accountNumber = ?, bankName = ?, ifscCode = ?, branchName = ?, grossSalary = ?, 
//           departmentId = COALESCE(?, departmentId), positionId = COALESCE(?, positionId), interncontractual = ?, joiningDate = ?, medical = ?, travel = ?, insurance = ?, 
//           fatherName = ?, motherName = ?, emergencyContactNumber1 = ?, emergencyContactNumber2 = ?, emergencyContactPerson1 = ?, emergencyContactPerson2 = ?, 
//           employeeCode = ?, childrenAges = ?, wifeName = ?, employeeBloodGroup = ?, office_id = ?, company_id = ?, joiningOffice = ?, joiningCompany = ?
//       WHERE id = ?
//   `;

//   db.query(sql, [passbook_check, employeeName, departmentName, positionName, employeeEmail, employeePhone, employeeAltPhone, employeeDOB, employeeGender, employeeMaritalStatus,
//     employeePan, employeeAadhar, employeeAddress1, employeeCity1, employeeState1, employeePincode1, employeeAddress2, employeeCity2, employeeState2, employeePincode2, employeeType,
//     accountHolderName, accountNumber, bankName, ifscCode, branchName, grossSalary,
//     department, position, interncontractual, joiningDate, medical, travel, insurance,
//     fatherName, motherName, emergencyContactNumber1, emergencyContactNumber2, emergencyContactPerson1, emergencyContactPerson2,
//     employeeCode, childrenAges, wifeName, employeeBloodGroup, office_id, company_id, joiningOffice, joiningCompany, req.params.id], (err, result) => {
//       if (err) {
//         console.error('Error updating data:', err);
//         res.status(500).json({ error: 'Error updating data' });
//         return;
//       }

//       res.json({ message: 'Data updated successfully' });
//     });
// });






// app.put('/employee_status/:id', (req, res) => {
//   const employeeId = req.params.id;
//   const { status } = req.body;

//   // SQL query to update the employee's status
//   const sql = 'UPDATE employee_details SET status = ? WHERE id= ?';
//   const params = [status, employeeId];

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       console.error('Error updating employee details:', err);
//       return res.status(500).send(err);
//     }
//     // Check if any rows were affected (i.e., the employee was found and updated)
//     if (results.affectedRows === 0) {
//       return res.status(404).send('Employee not found');
//     }
//     res.status(200).send('Employee details updated successfully');
//   });
// });

// // Route for fetching list of employees 
// app.get('/employees', (req, res) => {
//   const sql = 'SELECT * FROM employee_details';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching employees:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// // employee Last ID 
// // Get Laon Repayemtn API 
// app.get('/employee/lastId', (req, res) => {
//   const query = 'SELECT id FROM employee_details ORDER BY id DESC LIMIT 1';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching employee_details records:', err);
//       res.status(500).json({ error: 'Error fetching employee_details records' });
//       return;
//     }
//     if (results.length > 0) {
//       res.json(results[0].id);
//     } else {
//       res.json(0); // Assuming you want to return 0 if there are no records
//     }
//   });
// });

// // Route for deleting an employee by its ID
// app.delete('/employees/:id', (req, res) => {
//   const employeeId = req.params.id;
//   const sql = 'DELETE FROM employee_details WHERE id = ?';
//   db.query(sql, [employeeId], (err, result) => {
//     if (err) {
//       console.error('Error deleting employee:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Employee deleted:', result);
//     res.send('Employee deleted');
//   });
// });


// // Endpoint to handle file downloads
// app.get('/download/:filename', (req, res) => {
//   const fileName = req.params.filename;
//   console.log(fileName)
//   const filePath = path.join('public', 'uploads', 'employees', fileName);

//   res.download(filePath, (err) => {
//     if (err) {
//       console.error('Error downloading file:', err);
//       res.status(500).send('Error downloading file');
//     }
//   });
// });

// // transfer history 
// app.put('/employees_update/:id', (req, res) => {
//   const employeeId = req.params.id;
//   const { transferTo, transferToId } = req.body;

//   // Validate inputs
//   if (!employeeId || !transferTo || !transferToId) {
//     return res.status(400).send('Invalid request');
//   }

//   // SQL query to update the employee's status
//   const sql = 'UPDATE employee_details SET joiningOffice = ?, office_id = ? WHERE id = ?';
//   const params = [transferTo, transferToId, employeeId];

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       console.error('Error updating employee details:', err);
//       return res.status(500).send('Error updating employee details');
//     }
//     // Check if any rows were affected (i.e., the employee was found and updated)
//     if (results.affectedRows === 0) {
//       return res.status(404).send('Employee not found');
//     }
//     res.status(200).send('Employee details updated successfully');
//   });
// });
// app.post('/transferHistory', (req, res) => {
//   console.log(req.body);
//   const { employeeId, employeeName, transferDate, transferFrom, transferFromId, transferTo, transferToId, description } = req.body;

//   const sql = 'INSERT INTO transfer_history (employee_id, employee_name, transfer_date, transfer_from, transfer_from_id, transfer_to, transfer_to_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//   const values = [employeeId, employeeName, transferDate, transferFrom, transferFromId, transferTo, transferToId, description];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading transfer_history data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Transfer history data uploaded:', result);
//     res.send('Transfer history data uploaded');
//   });
// });

// // Route for fetching list of transfer history 
// app.get('/transferHistory/:id', (req, res) => {
//   const employeeId = req.params.id; // Correct parameter name to match route
//   console.log(employeeId); // Check if you're getting the correct employeeId

//   const sql = 'SELECT * FROM transfer_history WHERE employee_id = ?';
//   db.query(sql, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching transfer_history history:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// // transfer history end  





// // employee code end 

// // Office Code  start
// // Endpoint to handle form submission
// // Endpoint to handle form submission
// app.post('/officeData', officeUpload.single('picture'), (req, res) => {
//   console.log(req.body);

//   const { officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks } = req.body;

//   // Prepare the SQL query and values based on whether a file is uploaded
//   let sql;
//   let values;

//   if (req.file) {
//     // File is uploaded
//     const picturePath = req.file.originalname;
//     sql = `INSERT INTO offices (officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     values = [officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks, picturePath];
//   } else {
//     // No file is uploaded
//     sql = `INSERT INTO offices (officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     values = [officeName, employee_id, employeeName, address, city, state, pincode, email1, email2, mobile1, mobile2, mobile3, remarks];
//   }

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading office data:', err);
//       return res.status(500).send('Failed to add office');
//     }
//     console.log('Office data uploaded:', result);
//     res.send('Office data uploaded');
//   });
// });

// // Route for fetching list of offices
// app.get('/offices', (req, res) => {
//   const sql = 'SELECT * FROM  offices';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching offices:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// app.delete('/offices/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = 'DELETE FROM offices WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting offices:', err);
//       return res.status(500).send(err);
//     }
//     console.log('offices deleted:', result);
//     res.send('offices deleted');
//   });
// });

// // office Code End  
// // Project Code Start 
// // POST endpoint to handle project data submission
// app.post('/projectData', projectUpload.single('document'), (req, res) => {
//   console.log(req.body);

//   const {
//     projectName,
//     companyName,
//     projectType,
//     principalEmployeeName,
//     principalEmployeeProjectAddress,
//     employeerstate,
//     employeercity,
//     employeerpincode,
//     projectAddress,
//     projectstate,
//     projectcity,
//     projectpincode,
//     projectManagerName,
//     projectDescription,
//     username,
//     company_id,
//     employee_id
//   } = req.body;

//   const documentPath = req.file ? req.file.path : null; // Path of the uploaded document

//   const sql = `INSERT INTO project_details (projectName, companyName, projectType, EmployeeName, EmployeeProjectAddress, employeerstate, employeercity, employeerpincode,projectAddress,projectstate,projectcity,projectpincode, projectManagerName, projectDescription, document, username, company_id, employee_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   db.query(
//     sql,
//     [
//       projectName,
//       companyName,
//       projectType,
//       principalEmployeeName,
//       principalEmployeeProjectAddress,
//       employeerstate,
//       employeercity,
//       employeerpincode,
//       projectAddress,
//       projectstate,
//       projectcity,
//       projectpincode,
//       projectManagerName,
//       projectDescription,
//       documentPath, // Use documentPath instead of req.file.originalname if you store the file path in the database
//       username,
//       company_id,
//       employee_id
//     ],
//     (err, result) => {
//       if (err) {
//         console.error('Error uploading project data:', err);
//         return res.status(500).send('Failed to add project');
//       }
//       console.log('Project data uploaded:', result);
//       res.send('Project data uploaded');
//     }
//   );
// });

// // get the data 
// app.get('/projects', (req, res) => {
//   const sql = 'SELECT * FROM  project_details';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching projects:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });


// app.delete('/projects/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = 'DELETE FROM project_details WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting project_details:', err);
//       return res.status(500).send(err);
//     }
//     console.log('project_details deleted:', result);
//     res.send('project_details deleted');
//   });
// });

// // Companies code Start 
// // Comapny Details  
// app.post('/addCompany', (req, res) => {
//   console.log(req.body)
//   const { companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData } = req.body;

//   const sql = 'INSERT INTO companies (companyName,username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData) VALUES (?,?, ?, ?, ?, ?, ?, ?)';

//   db.query(sql, [companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData], (err, result) => {
//     if (err) {
//       console.error('Error uploading company data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Company data uploaded:', result);
//     res.send('Company data uploaded');
//   });
// });

// app.get('/companies', (req, res) => {
//   const sql = 'SELECT * FROM  companies';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching companies:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// // delete Company Details  
// app.delete('/companies/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = 'DELETE FROM companies WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting companies:', err);
//       return res.status(500).send(err);
//     }
//     console.log('companies deleted:', result);
//     res.send('companies deleted');
//   });
// });

// // Update company details
// app.put('/updateCompany/:id', (req, res) => {
//   const companyId = parseInt(req.params.id);
//   const updatedCompany = req.body;

//   const { companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData } = req.body;

//   const sql = 'UPDATE companies SET companyName=?, username=?, companyAddress=?, companyEmail=?, companyPhone=?, companyPAN=?, companyGST=?, qrCodeData=? WHERE id=?';

//   db.query(sql, [companyName, username, companyAddress, companyEmail, companyPhone, companyPAN, companyGST, qrCodeData, companyId], (err, result) => {
//     if (err) {
//       console.error('Error updating company data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Company data updated:', result);
//     res.send('Company data updated');
//   });
// });

// // companies code end

// // Department and Position start 
// app.post('/departments', (req, res) => {
//   console.log(req.body)
//   const { name, description } = req.body;

//   const sql = 'INSERT INTO department_details  (name,description) VALUES (?,?)';

//   db.query(sql, [name, description], (err, result) => {
//     if (err) {
//       console.error('Error uploading Department data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Department data uploaded:', result);
//     res.send('Department data uploaded');
//   });
// });

// // get details 
// app.get('/departments', (req, res) => {
//   const sql = 'SELECT * FROM department_details';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching departments:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });


// // POST endpoint for adding a position
// app.post('/positions', (req, res) => {
//   const { departmentId, departmentName, description, name } = req.body;

//   const sql = 'INSERT INTO position_details (department_id, departmentName, description, positionName) VALUES (?, ?, ?, ?)';
//   const values = [departmentId, departmentName, description, name];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading Position data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Position data uploaded:', result);
//     res.send('Position data uploaded');
//   });
// });

// // get details 
// app.get('/positions', (req, res) => {
//   const sql = 'SELECT * FROM position_details';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching position_details:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// app.get('/department_positions/:id', (req, res) => {
//   const departmentId = req.params.id; // Correct parameter name to match route
//   console.log(departmentId); // Check if you're getting the correct departmentId

//   const sql = 'SELECT * FROM position_details WHERE department_id = ?';
//   db.query(sql, [departmentId], (err, results) => {
//     if (err) {
//       console.error('Error fetching position_details history:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// app.get('/employee_department/:id', (req, res) => {
//   const departmentId = req.params.id; // Correct parameter name to match route
//   console.log(departmentId); // Check if you're getting the correct departmentId

//   const sql = 'SELECT * FROM employee_details WHERE departmentId = ?';
//   db.query(sql, [departmentId], (err, results) => {
//     if (err) {
//       console.error('Error fetching position_details history:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });
// // department end 

// // Attendence  start 
// // Endpoint to handle attendance record creation or update
// app.post('/api/attendance', (req, res) => {

//   const { employeeId, date, status } = req.body;

//   console.log(employeeId, date, status);

//   try {
//     // Check if attendance record exists for given employeeId and date
//     const checkExistingQuery = 'SELECT * FROM attendance WHERE employee_id = ? AND date = ?';
//     db.query(checkExistingQuery, [employeeId, date], (error, results) => {
//       if (error) {
//         console.error('Error checking existing attendance record:', error);
//         return res.status(500).send('Error checking existing attendance record');
//       }

//       if (results.length > 0) {
//         // If record exists, update it
//         const updateQuery = 'UPDATE attendance SET status = ? WHERE employee_id = ? AND date = ?';
//         db.query(updateQuery, [status, employeeId, date], (updateError, updateResults) => {
//           if (updateError) {
//             console.error('Error updating attendance record:', updateError);
//             return res.status(500).send('Error updating attendance record');
//           }
//           console.log('Attendance record updated successfully');
//           res.status(200).send('Attendance record updated successfully');
//         });
//       } else {
//         // If record doesn't exist, insert new record
//         const insertQuery = 'INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)';
//         db.query(insertQuery, [employeeId, date, status], (insertError, insertResults) => {
//           if (insertError) {
//             console.error('Error inserting new attendance record:', insertError);
//             return res.status(500).send('Error inserting new attendance record');
//           }
//           console.log('Attendance record created successfully');
//           res.status(201).send('Attendance record created successfully');
//         });
//       }
//     });
//   } catch (error) {
//     console.error('Error saving attendance:', error);
//     res.status(500).send('Failed to save attendance record');
//   }
// });



// app.get('/api/attendance/:employeeId', (req, res) => {
//   const { employeeId } = req.params;
//   console.log(employeeId);

//   const query = 'SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching attendance records:', err);
//       res.status(500).json({ error: 'Error fetching attendance records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// app.get('/api/employee/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM employee_details WHERE id = ?';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching employee_details records:', err);
//       res.status(500).json({ error: 'Error fetching employee_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// app.get('/attendance', (req, res) => {
//   const sql = 'SELECT * FROM attendance';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching attendance:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// // Salary Details 

// // POST endpoint for adding a position
// app.post('/api/advancesalary', (req, res) => {
//   const { employeeId, paymentType, month, amount, date, description, paymentModeName } = req.body;

//   const sql = 'INSERT INTO salary_details (employeeId,paymentType,month,amount,date,description,paymentModeName) VALUES (?, ?, ?, ?, ?, ?, ?)';
//   const values = [employeeId, paymentType, month, amount, date, description, paymentModeName];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading Position data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Position data uploaded:', result);
//     res.send('Position data uploaded');
//   });
// });

// // PAyment Mode 

// app.post('/addPaymentMode', (req, res) => {
//   const { accountName, accountNumber, bankName, branch, ifscCode, paymentModeName, paymentType, username } = req.body;

//   const sql = 'INSERT INTO paymentmode_details (accountName ,accountNumber ,bankName ,branch ,ifscCode ,paymentModeName, paymentType,username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//   const values = [accountName, accountNumber, bankName, branch, ifscCode, paymentModeName, paymentType, username];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading payment data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Payment data uploaded:', result);
//     res.send('Payment data uploaded');
//   });
// });
// // get details 
// app.get('/addPaymentModes', (req, res) => {
//   const sql = 'SELECT * FROM paymentmode_details';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching addPaymentMode:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });


// // Add Loan 
// app.post('/addLoan', (req, res) => {
//   const {
//     departmentId,
//     departmentName,
//     employeeId,
//     employeeName,
//     loanAmount,
//     loanApprovedById,
//     loanApprovedByName,
//     loanDate,
//     loanDescription,
//     loanFor,
//     loanRepayType,
//     loanRepaymentDate,
//     otherLoanForReason,
//     remark,
//     loanNumber,
//     principalAmount,
//     interestAmount,
//     username
//   } = req.body;

//   const sql = `
//     INSERT INTO loandetails (
//       departmentId, 
//       departmentName, 
//       employeeId, 
//       employeeName, 
//       loanAmount, 
//       loanApprovedById, 
//       loanApprovedByName, 
//       loanDate, 
//       loanDescription, 
//       loanFor, 
//       loanRepayType, 
//       loanRepaymentDate, 
//       otherLoanForReason, 
//       remark, 
//       loanNumber,
//       principalAmount,
//       interestAmount,
//       username
//     ) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?,?)
//   `;

//   const values = [
//     departmentId,
//     departmentName,
//     employeeId,
//     employeeName,
//     loanAmount,
//     loanApprovedById,
//     loanApprovedByName,
//     loanDate,
//     loanDescription,
//     loanFor,
//     loanRepayType,
//     loanRepaymentDate,
//     otherLoanForReason,
//     remark,
//     loanNumber,
//     principalAmount,
//     interestAmount,
//     username
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading loan data:', err);
//       return res.status(500).send('Error uploading loan data');
//     }
//     console.log('Loan data uploaded:', result);
//     res.send('Loan data uploaded');
//   });
// });
// //  Get loan for the templotyee 
// app.get('/api/loandetails/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM loandetails WHERE employeeId = ? ORDER BY id DESC';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching loandetails records:', err);
//       res.status(500).json({ error: 'Error fetching Loan_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });
// // Get Laon Repayemtn API 
// app.get('/api/repaymentdetails/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM loanrepayments WHERE employeeId = ? ORDER BY id DESC';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching loanrepayments records:', err);
//       res.status(500).json({ error: 'Error fetching Loan_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Taking the loan and the empoloyee details 
// // GET route to fetch loan details grouped by employee
// app.get('/loanDetails', (req, res) => {
//   const query = `
//     SELECT employeeId, employeeName, COUNT(*) as loanCount
//     FROM loandetails
//     GROUP BY employeeId, employeeName
//     ORDER BY employeeId;
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching loan details:', err);
//       res.status(500).json({ message: 'Error fetching loan details' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Loan Repayment Details 
// app.post('/addLoanRepayment', (req, res) => {
//   const {
//     employeeId,
//     id,  // Assuming this is the loanId
//     departmentId,
//     departmentName,
//     employeeName,
//     loanNumber,
//     loanAmount,
//     loanDate,
//     repaymentAmount,
//     repaymentDate,
//     repaymentMode,
//     repaymentdescription  // Ensure this matches the database column name
//   } = req.body;

//   const sql = `
//     INSERT INTO loanrepayments (
//       employeeId,
//       loanId,
//       departmentId,
//       departmentName,
//       employeeName,
//       loanNumber,
//       loanAmount,
//       loanDate,
//       repaymentAmount,
//       repaymentDate,
//       repaymentMode,
      
//       repaymentDescription
//     ) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     employeeId,
//     id,  // Assuming this is the loanId
//     departmentId,
//     departmentName,
//     employeeName,
//     loanNumber,
//     loanAmount,
//     loanDate,
//     repaymentAmount,
//     repaymentDate,
//     repaymentMode,
//     repaymentdescription
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading loan data:', err);
//       return res.status(500).send('Error uploading loan data');
//     }
//     console.log('Loan data uploaded:', result);
//     res.send('Loan data uploaded');
//   });
// });

// app.get('/api/repaymentdetailsHistory/:loanId', (req, res) => {
//   const { loanId } = req.params;

//   const query = 'SELECT * FROM loanrepayments WHERE loanId = ? ORDER BY id DESC';
//   db.query(query, [loanId], (err, results) => {
//     if (err) {
//       console.error('Error fetching loanrepayments records:', err);
//       res.status(500).json({ error: 'Error fetching Loan_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });
// // last loan id  api/loandetails
// app.get('/lastloanId', (req, res) => {
//   const sql = 'SELECT * FROM loandetails ORDER BY id DESC LIMIT 1';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching last loan ID:', err);
//       return res.status(500).send(err);
//     }
//     if (results.length > 0) {
//       res.json(results[0].id);
//     } else {
//       res.status(404).send('No loan details found');
//     }
//   });
// });


// // Change Salary
// app.post('/changesalary', (req, res) => {
//   const { specialallowances, dearnessallowances, conveyanceallowances, houserentallowances, basicSalary, employeeId, employeeName, epfEmployee, epfEmployer, epfesicApplicable, esicApplicable, esicEmployee, esicEmployer, grossSalary, tdsApplicable, totalEmployeeDeduction, totalEmployerContribution, totalInHandSalary, totalPayableSalary, totalTdsDeduction, vda, date } = req.body;

//   const sql = `INSERT INTO changesalary ( specialallowances,dearnessallowances,conveyanceallowances,houserentallowances,basicSalary,employeeId,employeeName,epfEmployee,epfEmployer,epfesicApplicable,esicApplicable,esicEmployee,esicEmployer,grossSalary,tdsApplicable,totalEmployeeDeduction,totalEmployerContribution,totalInHandSalary,totalPayableSalary,totalTdsDeduction,vda,date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   const values = [specialallowances, dearnessallowances, conveyanceallowances, houserentallowances, basicSalary, employeeId, employeeName, epfEmployee, epfEmployer, epfesicApplicable, esicApplicable, esicEmployee, esicEmployer, grossSalary, tdsApplicable, totalEmployeeDeduction, totalEmployerContribution, totalInHandSalary, totalPayableSalary, totalTdsDeduction, vda, date];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error logging salary change:', err);
//       return res.status(500).send('Error logging salary change');
//     }
//     console.log('Salary change logged:', result);
//     res.send('Salary change logged');
//   });
// });

// // Update employee salary details
// app.put('/updatesalary/:id', (req, res) => {
//   const id = req.params.id;
//   const {
//     specialallowances, dearnessallowances, conveyanceallowances, houserentallowances,
//     basicSalary,
//     epfEmployee,
//     epfEmployer,
//     epfesicApplicable,
//     esicApplicable,
//     esicEmployee,
//     esicEmployer,
//     grossSalary,
//     tdsApplicable,
//     totalEmployeeDeduction,
//     totalEmployerContribution,
//     totalInHandSalary,
//     totalPayableSalary,
//     totalTdsDeduction,
//     vda
//   } = req.body;

//   const sql = `UPDATE employee_details SET 
//     specialallowances = ?,dearnessallowances = ?,conveyanceallowances = ?,houserentallowances = ?,basicSalary = ?,epfEmployee = ?,epfEmployer = ?,epfesicApplicable = ?,esicApplicable = ?,esicEmployee = ?,esicEmployer = ?,grossSalary = ?,tdsApplicable = ?,totalEmployeeDeduction = ?,totalEmployerContribution = ?,totalInHandSalary = ?,totalPayableSalary = ?,totalTdsDeduction = ?,vda = ?
//     WHERE id = ?`;

//   const values = [
//     specialallowances, dearnessallowances, conveyanceallowances, houserentallowances,
//     basicSalary,
//     epfEmployee,
//     epfEmployer,
//     epfesicApplicable,
//     esicApplicable,
//     esicEmployee,
//     esicEmployer,
//     grossSalary,
//     tdsApplicable,
//     totalEmployeeDeduction,
//     totalEmployerContribution,
//     totalInHandSalary,
//     totalPayableSalary,
//     totalTdsDeduction,
//     vda,
//     id
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error updating employee salary details:', err);
//       return res.status(500).send('Error updating employee salary details');
//     }
//     console.log('Employee salary details updated:', result);
//     res.send('Employee salary details updated');
//   });
// });



// // Get Laon Repayemtn API 
// app.get('/api/salaryHistory/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM changesalary WHERE employeeId = ? ORDER BY id DESC';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching changesalary records:', err);
//       res.status(500).json({ error: 'Error fetching Loan_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Route to handle POST request for adding Bonus/Incentive
// app.post('/addBonusIncentive', (req, res) => {
//   const { amount, departmentId, departmentName, employeeId, employeeName, fromDate, toDate, paymentDate, paymentMode, paymentModeId, paymentType, reason, remark, employeeCode, username } = req.body;

//   const sql = `
//     INSERT INTO bonusincentive (
//       amount, departmentId, departmentName, employeeId, employeeName,
//       fromDate, toDate, paymentDate, paymentMode, paymentModeId,
//       paymentType, reason, remark,employeeCode, username
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
//   `;

//   const values = [
//     amount, departmentId, departmentName, employeeId, employeeName,
//     fromDate, toDate, paymentDate, paymentMode, paymentModeId,
//     paymentType, reason, remark, employeeCode, username
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading bonusincentive data:', err);
//       return res.status(500).send('Error uploading bonusincentive data');
//     }
//     console.log('Bonus/Incentive data uploaded:', result);
//     res.send('Bonus/Incentive data uploaded');
//   });
// });
// // BonusIncentive get details 
// // Get BonusIncentive
// app.get('/bonousinsentivehistory/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM bonusincentive WHERE employeeId = ? ORDER BY id DESC';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching bonusincentive records:', err);
//       res.status(500).json({ error: 'Error fetching Loan_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });
// // BonouseInsentive Payment  api/repaymentdetails
// // Route to handle POST request for adding Bonus/Incentive
// app.post('/submitbonousinsentivePayment', (req, res) => {
//   const {
//     id,
//     departmentId,
//     amount,
//     departmentName,
//     employeeCode,
//     employeeId,
//     employeeName,
//     paymentAmount,
//     paymentDate,
//     bonousinsentivepaymentModeName,
//     bonousinsentivepaymentModeId,
//     paymentType
//   } = req.body;

//   const sql = `
//     INSERT INTO payment_bonus_incentive (
//     bonousinsentiveId,
//       departmentId,
//       bonousinsentiveamount,
//       departmentName,
//       employeeCode,
//       employeeId,
//       employeeName,
//       paymentAmount,
//       paymentDate,
//       paymentMode,
//       paymentModeId,
//       paymentType
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
//   `;

//   const values = [
//     id,
//     departmentId,
//     amount,
//     departmentName,
//     employeeCode,
//     employeeId,
//     employeeName,
//     paymentAmount,
//     paymentDate,
//     bonousinsentivepaymentModeName,
//     bonousinsentivepaymentModeId,
//     paymentType
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error uploading Payment bonus/incentive data:', err);
//       return res.status(500).send('Error uploading Payment bonus/incentive data');
//     }
//     console.log('Payment Bonus/Incentive data uploaded:', result);
//     res.send('Payment Bonus/Incentive data uploaded');
//   });
// });

// app.get('/bonousinsentive/paymenthistory/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM payment_bonus_incentive WHERE employeeId = ?';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching payment_bonus_incentive records:', err);
//       res.status(500).json({ error: 'Error fetching Loan_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// app.get('/bonousinsentive/viewbonous/:id', (req, res) => {
//   const { id } = req.params;

//   const query = 'SELECT * FROM payment_bonus_incentive WHERE bonousinsentiveId = ?';
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error('Error fetching payment_bonus_incentive records:', err);
//       res.status(500).json({ error: 'Error fetching Loan_details records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Bonous List 
// // Route for fetching list of bonousinsentivelist 
// app.get('/bonousinsentivelist', (req, res) => {
//   const sql = 'SELECT * FROM bonusincentive';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching bonousinsentivelist:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// // Route for fetching list of paymentbonousinsentivelist 
// app.get('/paymentbonousinsentivelist', (req, res) => {
//   const sql = 'SELECT * FROM payment_bonus_incentive';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching paymentbonousinsentivelist:', err);
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });

// // Salary Slip 
// // Route to handle POST request for adding Salary Slip data

// app.post('/payroll', (req, res) => {
//   const {
//     employeeId, month, year, VDAmonth, additionalAllowance, allowanceDescription, allowancesMonth, conveyanceAllowancesMonth,
//     houseRentallowancesMonth,
//     dearnessallowancesMonth,
//     specialallowancesMonth,
//     hr_id,
//     hrManagerName, totalAttencance,
//     basicSalaryMonth, deductionDescription, epfEmployeeMonth, epfEmployerMonth, epfesicApplicableMonth,
//     esicEmployeeMonth, esicEmployerMonth, grossSalaryMonth, halfDayMonth, netSalaryPayableMonth,
//     overtimeMonth, salaryDeduction, tdsApplicableMonth, totalAbsent, totalAdvanceAmount,
//     totalAdvanceAmountMonth, totalEmployeeDeductionMonth, totalEmployerContributionMonth,
//     totalHalfDay, totalInHandSalaryMonth, totalNetSalaryPayableMonth, totalOvertime, totalPaidAmount,
//     totalPaidLeave, totalPayableSalaryMonth, totalPresent, totalSalaryAmount, totalTdsDeductionMonth,
//     totalUnpaidLeave, totalWeeklyOff, selectedDepartment, selectedEmployee, showAllowanceDescription,
//     showDeductionDescription, date, employeeName, departmentName, grossPayableSalaryMonth, grossInHandSalaryMonth, advanceDeduction
//   } = req.body;

//   const sql = `INSERT INTO payroll 
//       (employeeId, month, year, VDAmonth, additionalAllowance, allowanceDescription, allowancesMonth,
//                 conveyanceallowances,
//                 houserentallowances,
//                 dearnessallowances,
//                 specialallowances,                
//                 hr_id,
//                 hrManagerName,totalAttencance, 
//       basicSalaryMonth, deductionDescription, epfEmployeeMonth, epfEmployerMonth, epfesicApplicableMonth, 
//       esicEmployeeMonth, esicEmployerMonth, grossSalaryMonth, halfDayMonth, netSalaryPayableMonth, 
//       overtimeMonth, salaryDeduction, tdsApplicableMonth, totalAbsent, totalAdvanceAmount, 
//       totalAdvanceAmountMonth, totalEmployeeDeductionMonth, totalEmployerContributionMonth, 
//       totalHalfDay, totalInHandSalaryMonth, totalNetSalaryPayableMonth, totalOvertime, totalPaidAmount, 
//       totalPaidLeave, totalPayableSalaryMonth, totalPresent, totalSalaryAmount, totalTdsDeductionMonth, 
//       totalUnpaidLeave, totalWeeklyOff, selectedDepartment, selectedEmployee, showAllowanceDescription, 
//       showDeductionDescription,date,employeeName,departmentName,grossPayableSalaryMonth,grossInHandSalaryMonth,advanceDeduction) VALUES 
//       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ? ,?, ?, ?, ?)`;

//   db.query(sql, [
//     employeeId, month, year, VDAmonth, additionalAllowance, allowanceDescription, allowancesMonth, conveyanceAllowancesMonth,
//     houseRentallowancesMonth,
//     dearnessallowancesMonth,
//     specialallowancesMonth,
//     hr_id,
//     hrManagerName, totalAttencance,
//     basicSalaryMonth, deductionDescription, epfEmployeeMonth, epfEmployerMonth, epfesicApplicableMonth,
//     esicEmployeeMonth, esicEmployerMonth, grossSalaryMonth, halfDayMonth, netSalaryPayableMonth,
//     overtimeMonth, salaryDeduction, tdsApplicableMonth, totalAbsent, totalAdvanceAmount,
//     totalAdvanceAmountMonth, totalEmployeeDeductionMonth, totalEmployerContributionMonth,
//     totalHalfDay, totalInHandSalaryMonth, totalNetSalaryPayableMonth, totalOvertime, totalPaidAmount,
//     totalPaidLeave, totalPayableSalaryMonth, totalPresent, totalSalaryAmount, totalTdsDeductionMonth,
//     totalUnpaidLeave, totalWeeklyOff, selectedDepartment, selectedEmployee, showAllowanceDescription,
//     showDeductionDescription, date, employeeName, departmentName, grossPayableSalaryMonth, grossInHandSalaryMonth, advanceDeduction], (err, result) => {
//       if (err) throw err;
//       res.send('Payroll record added...');
//     });
// });

// // 20-7-24 Advance Payment and Repayments /api/salary/

// // Endpoint to add an advance payment
// app.post('/api/advance-payment', (req, res) => {
//   const { employee_id, paymentType, amount, date, description, paymentModeName } = req.body;
//   const query = 'INSERT INTO advance_payments (employee_id,paymentType, amount, date, description, paymentModeName) VALUES (?, ?, ?, ?, ?, ?)';
//   db.query(query, [employee_id, paymentType, amount, date, description, paymentModeName], (err, result) => {
//     if (err) throw err;
//     recalculateBalances(employee_id);
//     res.send('Advance payment added');
//   });
// });

// // Endpoint to add a repayment
// app.post('/api/repayment', (req, res) => {
//   const { accountNumber, advancePaymentId, amount, bankName, branchName, date, employee_id, ifscCode, receivingMode, username } = req.body;
//   const query = 'INSERT INTO repayments ( accountNumber,advancePaymentId,amount,bankName,branchName,date,employee_id,ifscCode,receivingMode,username ) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?)';
//   db.query(query, [accountNumber, advancePaymentId, amount, bankName, branchName, date, employee_id, ifscCode, receivingMode, username], (err, result) => {
//     if (err) throw err;
//     recalculateBalances(employee_id);
//     res.send('Repayment added');
//   });
// });

// // Endpoint to add a repayment Salary /api/salary/
// app.post('/api/salary/repayment', (req, res) => {
//   const { employee_id, amount, date, receivingMode } = req.body;
//   const query = 'INSERT INTO repayments (employee_id, amount, date, receivingMode ) VALUES (?, ?, ?,?)';
//   db.query(query, [employee_id, amount, date, receivingMode], (err, result) => {
//     if (err) throw err;
//     recalculateBalances(employee_id);
//     res.send('Repayment added');
//   });
// });

// // Function to recalculate balances
// const recalculateBalances = (employee_id) => {
//   const query = `
//       SELECT 
//           DATE_FORMAT(date, '%Y-%m-01') AS month,
//           SUM(amount) AS total_advance
//       FROM advance_payments
//       WHERE employee_id = ?
//       GROUP BY DATE_FORMAT(date, '%Y-%m-01')
//   `;
//   db.query(query, [employee_id], (err, advanceResults) => {
//     if (err) {
//       console.error('Error fetching advance payments:', err);
//       throw err;
//     }

//     const repaymentQuery = `
//           SELECT 
//               DATE_FORMAT(date, '%Y-%m-01') AS month,
//               SUM(amount) AS total_repayment
//           FROM repayments
//           WHERE employee_id = ?
//           GROUP BY DATE_FORMAT(date, '%Y-%m-01')
//       `;
//     db.query(repaymentQuery, [employee_id], (err, repaymentResults) => {
//       if (err) {
//         console.error('Error fetching repayments:', err);
//         throw err;
//       }

//       let previousBalance = 0;
//       const balances = {};

//       advanceResults.forEach(row => {
//         balances[row.month] = (balances[row.month] || 0) + row.total_advance;
//       });

//       repaymentResults.forEach(row => {
//         balances[row.month] = (balances[row.month] || 0) - row.total_repayment;
//       });

//       const months = Object.keys(balances).sort();
//       months.forEach(month => {
//         balances[month] += previousBalance;
//         previousBalance = balances[month];
//       });

//       const deleteQuery = 'DELETE FROM balances WHERE employee_id = ?';
//       db.query(deleteQuery, [employee_id], (err, result) => {
//         if (err) {
//           console.error('Error deleting old balances:', err);
//           throw err;
//         }

//         const insertQuery = 'INSERT INTO balances (employee_id, month, balance) VALUES ?';
//         const values = months.map(month => [employee_id, month, balances[month]]);

//         // Print the values to ensure they are formatted correctly
//         console.log('Insert values:', values);

//         db.query(insertQuery, [values], (err, result) => {
//           if (err) {
//             console.error('Error inserting new balances:', err);
//             throw err;
//           }
//         });
//       });
//     });
//   });
// };



// // get api for the employee Details 
// app.get('/api/advancepayment/:employee_id', (req, res) => {
//   const { employee_id } = req.params;

//   const query = 'SELECT * FROM advance_payments WHERE employee_id = ? ORDER BY id DESC';
//   db.query(query, [employee_id], (err, results) => {
//     if (err) {
//       console.error('Error fetching advance_payments records:', err);
//       res.status(500).json({ error: 'Error fetching advance_payments records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // get api for the employee Details 
// app.get('/api/advancerepayments/:employee_id', (req, res) => {
//   const { employee_id } = req.params;

//   const query = 'SELECT * FROM repayments WHERE employee_id = ? ORDER BY id DESC';
//   db.query(query, [employee_id], (err, results) => {
//     if (err) {
//       console.error('Error fetching repayments records:', err);
//       res.status(500).json({ error: 'Error fetching repayments records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // get api for the employee Details 
// app.get('/api/advancebalance/:employee_id', (req, res) => {
//   const { employee_id } = req.params;

//   const query = 'SELECT * FROM balances WHERE employee_id = ? ORDER BY id DESC';
//   db.query(query, [employee_id], (err, results) => {
//     if (err) {
//       console.error('Error fetching balances records:', err);
//       res.status(500).json({ error: 'Error fetching balances records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // get api for the employee Details Pay Roll  
// app.get('/api/payroll/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM payroll WHERE employeeId = ? ';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching payroll records:', err);
//       res.status(500).json({ error: 'Error fetching balances records' });
//       return;
//     }
//     res.json(results);
//   });
// });


// app.get('/api/payroll/department/:departmentId', (req, res) => {
//   const { departmentId } = req.params;

//   const query = 'SELECT * FROM payroll WHERE selectedDepartment = ? ';
//   db.query(query, [departmentId], (err, results) => {
//     if (err) {
//       console.error('Error fetching payroll records:', err);
//       res.status(500).json({ error: 'Error fetching balances records' });
//       return;
//     }
//     res.json(results);
//   });
// });
// app.get('/api/payroll/employee/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM payroll WHERE employeeId = ? ';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching payroll records:', err);
//       res.status(500).json({ error: 'Error fetching balances records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Edit Salary Slip 
// // Update company details
// app.put('/api/salary/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const {
//     VDAmonth,
//     additionalAllowance,
//     allowanceDescription,
//     allowancesMonth,
//     basicSalaryMonth,
//     deductionDescription,
//     epfEmployeeMonth,
//     epfEmployerMonth,
//     epfesicApplicableMonth,
//     esicEmployeeMonth,
//     esicEmployerMonth,
//     grossInHandSalaryMonth,
//     grossPayableSalaryMonth,
//     grossSalaryMonth,
//     halfDayMonth,
//     netSalaryPayableMonth,
//     overtimeMonth,
//     salaryDeduction,
//     tdsApplicableMonth,
//     totalEmployeeDeductionMonth,
//     totalEmployerContributionMonth,
//     totalInHandSalaryMonth,
//     totalPayableSalaryMonth,
//     totalTdsDeductionMonth
//   } = req.body;

//   const sql = `UPDATE payroll SET 
//     VDAmonth = ?, 
//     additionalAllowance = ?, 
//     allowanceDescription = ?, 
//     allowancesMonth = ?, 
//     basicSalaryMonth = ?, 
//     deductionDescription = ?, 
//     epfEmployeeMonth = ?, 
//     epfEmployerMonth = ?, 
//     epfesicApplicableMonth = ?, 
//     esicEmployeeMonth = ?, 
//     esicEmployerMonth = ?, 
//     grossInHandSalaryMonth = ?, 
//     grossPayableSalaryMonth = ?, 
//     grossSalaryMonth = ?, 
//     halfDayMonth = ?, 
//     netSalaryPayableMonth = ?, 
//     overtimeMonth = ?, 
//     salaryDeduction = ?, 
//     tdsApplicableMonth = ?, 
//     totalEmployeeDeductionMonth = ?, 
//     totalEmployerContributionMonth = ?, 
//     totalInHandSalaryMonth = ?, 
//     totalPayableSalaryMonth = ?, 
//     totalTdsDeductionMonth = ?
//     WHERE id = ?`;

//   db.query(sql, [
//     VDAmonth,
//     additionalAllowance,
//     allowanceDescription,
//     allowancesMonth,
//     basicSalaryMonth,
//     deductionDescription,
//     epfEmployeeMonth,
//     epfEmployerMonth,
//     epfesicApplicableMonth,
//     esicEmployeeMonth,
//     esicEmployerMonth,
//     grossInHandSalaryMonth,
//     grossPayableSalaryMonth,
//     grossSalaryMonth,
//     halfDayMonth,
//     netSalaryPayableMonth,
//     overtimeMonth,
//     salaryDeduction,
//     tdsApplicableMonth,
//     totalEmployeeDeductionMonth,
//     totalEmployerContributionMonth,
//     totalInHandSalaryMonth,
//     totalPayableSalaryMonth,
//     totalTdsDeductionMonth,
//     id
//   ], (err, result) => {
//     if (err) {
//       console.error('Error updating salary details:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Salary details updated:', result);
//     res.send('Salary details updated');
//   });
// });




// // Payment Form Details 
// app.post('/submitPayment', (req, res) => {
//   const { amountPaid, amountDate, paymentModeId, paymentDescription, id, employeeName, departmentName, employeeId, year, month, netSalaryPayableMonth, paymentModeName } = req.body;

//   const sql = `INSERT INTO paymentformdetails (    amountPaid ,amountDate ,paymentModeId ,paymentDescription ,payrollId ,employeeName  ,departmentName  ,employeeId ,year ,month ,netSalaryPayableMonth ,paymentModeName  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//   db.query(sql, [amountPaid, amountDate, paymentModeId, paymentDescription, id, employeeName, departmentName, employeeId, year, month, netSalaryPayableMonth, paymentModeName], (err, result) => {
//     if (err) throw err;
//     res.send('Payment Details record added...');
//   });
// });

// //  get 
// app.get('/api/paymentform/:payrollId', (req, res) => {
//   const { payrollId } = req.params;

//   const query = 'SELECT * FROM paymentformdetails WHERE payrollId = ? ';
//   db.query(query, [payrollId], (err, results) => {
//     if (err) {
//       console.error('Error fetching paymentformdetails records:', err);
//       res.status(500).json({ error: 'Error fetching balances records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// app.get('/api/salarypaymenthistory/:employeeId', (req, res) => {
//   const { employeeId } = req.params;

//   const query = 'SELECT * FROM paymentformdetails WHERE employeeId = ? ';
//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching paymentformdetails records:', err);
//       res.status(500).json({ error: 'Error fetching balances records' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Payment Form Details 


// // Add Hr Manager 

// app.post('/addHRManager', async (req, res) => {
//   const {
//     departmentId,
//     departmentName,
//     employeeId,
//     employeeName,
//     employeeCode,
//     appointDate,
//     description,
//     username
//   } = req.body;

//   // Begin transaction
//   db.beginTransaction(async (err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Transaction error' });
//     }

//     try {
//       // Update the relieving date of the previous HR manager
//       await new Promise((resolve, reject) => {
//         db.query(
//           'UPDATE hr_managers SET relievingDate = DATE_SUB(?, INTERVAL 1 DAY) WHERE relievingDate IS NULL',
//           [appointDate],
//           (err, results) => {
//             if (err) {
//               return reject(err);
//             }
//             resolve(results);
//           }
//         );
//       });

//       // Insert new HR manager record
//       await new Promise((resolve, reject) => {
//         db.query(
//           'INSERT INTO hr_managers (departmentId, departmentName, employeeId, employeeName, employeeCode, appointDate, description, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//           [departmentId, departmentName, employeeId, employeeName, employeeCode, appointDate, description, username],
//           (err, results) => {
//             if (err) {
//               return reject(err);
//             }
//             resolve(results);
//           }
//         );
//       });

//       // Commit transaction
//       db.commit((err) => {
//         if (err) {
//           return db.rollback(() => {
//             res.status(500).json({ error: 'Commit error' });
//           });
//         }
//         res.status(200).json({ message: 'HR Manager added successfully' });
//       });
//     } catch (error) {
//       // Rollback transaction in case of error
//       db.rollback(() => {
//         res.status(500).json({ error: 'Transaction failed', details: error });
//       });
//     }
//   });
// });

// // Get the HrManager TimeLine  active_inactive activeinactive activeinactive approved
// app.get('/timelines', (req, res) => {
//   const sql = 'SELECT * FROM hr_managers ORDER BY id DESC'; // Assuming you want to order by the 'id' field in descending order
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching timelines:', err);
//       return res.status(500).send('An error occurred while fetching timelines.');
//     }
//     res.json(results);
//   });
// });

// app.get('/hrmanager', (req, res) => {
//   const sql = 'SELECT * FROM hr_managers ORDER BY id DESC LIMIT 1';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching hr manager:', err);
//       return res.status(500).send('An error occurred while fetching the HR manager.');
//     }
//     res.json(results[0]); // Since we're fetching only one record, return the first (and only) item
//   });
// });



// // Add Hr Manager 


// // Add Payment Mode 
// app.get('/paymentmodes', (req, res) => {
//   const sql = 'SELECT * FROM paymentmode_details'; // Assuming you want to order by the 'id' field in descending order
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching paymentmodes:', err);
//       return res.status(500).send('An error occurred while fetching timelines.');
//     }
//     res.json(results);
//   });
// });

// app.delete('/paymentmodes/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = 'DELETE FROM paymentmode_details WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting employee:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Employee deleted:', result);
//     res.send('Employee deleted');
//   });
// });

// // Delete Details addCompany officeData projectData timelines
// app.post('/delete_details', (req, res) => {
//   try {
//     const { paymentModeName, projectName, officeName, companyName, reason } = req.body;

//     const sql = 'INSERT INTO delete_details ( paymentModeName,projectName,officeName,companyName, reason ) VALUES (?, ?, ?, ?, ?)';
//     const values = [paymentModeName, projectName, officeName, companyName, reason];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error('Error saving deleted details:', err);
//         return res.status(500).json({ error: true, message: 'Internal Server Error' });
//       }
//       console.log('Deleted details saved successfully');
//       res.status(200).json({ success: true, message: 'Deleted details saved successfully' });
//     });
//   } catch (err) {
//     console.error('Error handling request:', err);
//     res.status(500).json({ error: true, message: 'Internal Server Error' });
//   }
// });

// // Dashboard takes the salary details /api/attendance/ /login

// app.get('/api/paymentforms', (req, res) => {
//   const sql = 'SELECT * FROM paymentformdetails'; // Assuming you want to order by the 'id' field in descending order
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching paymentformdetails:', err);
//       return res.status(500).send('An error occurred while fetching paymentformdetails.');
//     }
//     res.json(results);
//   });
// });

// // Add Payment Mode activeinactive activeinactive approved /approved/reject transferHistory
// app.get('/api/payrolls', (req, res) => {
//   const sql = 'SELECT * FROM payroll'; // Assuming you want to order by the 'id' field in descending order
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching payrolls:', err);
//       return res.status(500).send('An error occurred while fetching timelines.');
//     }
//     res.json(results);
//   });
// });



// // Active inactive Details and approved details 
// // Approved details update
// app.put('/approved/extension/early/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { toDate } = req.body;

//   const sql = `UPDATE approve_details SET toDate = ? WHERE activeInactiveDetails_id = ?`;

//   db.query(sql, [toDate, id], (err, result) => {
//     if (err) {
//       console.error('Error updating approve details:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Approve details updated:', result);
//     res.send('Approve details updated');
//   });
// });

// // Active Inactive details update
// app.put('/active_inactive/extension/early/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { toDate } = req.body;

//   const sql = `UPDATE active_inactive SET toDate = ? WHERE id = ?`;

//   db.query(sql, [toDate, id], (err, result) => {
//     if (err) {
//       console.error('Error updating active_inactive details:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Active Inactive details updated:', result);
//     res.send('Active Inactive details updated');
//   });
// });

// const updateStatus = (record) => {
//   const { employeeId, employeeName, toDate } = record;
//   const status = 'active';
//   const reason = 'Rejoin';
//   const description = 'Auto-updated to active status after leave';
//   const fromDate = new Date().toISOString().split('T')[0]; // Today's date

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

//       // Update status in approved table
//       const updateApprovedSql = `UPDATE approve_details SET status = ? WHERE employeeId = ?`;
//       db.query(updateApprovedSql, [status, employeeId], (err, result) => {
//         if (err) {
//           console.error('Error updating status in approved table:', err);
//           return;
//         }
//         console.log('Updated status in approved table:', result);
//       });
//     }
//   });
// };

// // Scheduled job to check for exceeded toDate
// cron.schedule('* * * * *', () => { // Runs every minute
//   console.log('Cron job started at:', new Date());

//   const today = new Date().toISOString().split('T')[0];
//   console.log('Today\'s date:', today);

//   // Select records where toDate is before today and status is 'leave'
//   const selectSql = `SELECT * FROM active_inactive WHERE toDate < ? AND status = 'leave'`;
//   console.log(selectSql);
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



// app.get('/latestdata/:employeeId', (req, res) => {
//   const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
//   const employeeId = req.params.employeeId;

//   if (!employeeId) {
//     return res.status(400).json({ error: 'Employee ID is required' });
//   }
//   const query = `
//     SELECT t1.*
//     FROM approve_details t1
//     INNER JOIN (
//         SELECT employeeId, MAX(updatedAt) AS maxDate
//         FROM approve_details
//         WHERE employeeId = ?
//         GROUP BY employeeId
//     ) t2 ON t1.employeeId = t2.employeeId AND t1.updatedAt = t2.maxDate
//     WHERE t1.fromDate <= ? AND t1.toDate >= ?
//   `;

//   db.query(query, [employeeId, currentDate, currentDate], (err, results) => {
//     if (err) {
//       console.error('Error fetching employee data:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'No records found for the given employee ID' });
//     }

//     res.json(results);
//   });
// });




// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


















