// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import expressSession from 'express-session';
// import { createPool } from 'mysql';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { createConnection } from 'mysql';
// import multer from 'multer';
// import path from 'path';

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

// const pool = createPool({
//   connectionLimit: 10,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error connecting to MySQL database:', err);
//     return;
//   }
//   console.log('MySQL database connected successfully');
//   connection.release();
// });

// // Multer configuration for handling file uploads for employees
// const employeeStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join('public', 'uploads', 'employees'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// const employeeUpload = multer({ storage: employeeStorage });

// // Multer configuration for handling file uploads for assets
// const assetStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join('public', 'uploads', 'assets'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// const assetUpload = multer({ storage: assetStorage });

// // MySQL database connection
// const db = createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to MySQL database:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });


// // Sign up
// app.post("/signup", async (req, res) => {
//   const { userId, email, password, role } = req.body; // Add 'role' to the destructuring

//   try {
//     if (!userId || !email || !password || !role) { // Ensure 'role' is provided
//       return res.status(400).json({ error: true, message: "userId, email, password, and role are required" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     pool.query("SELECT * FROM signup_details WHERE email = ?", [email], async (err, results) => {
//       if (err) {
//         console.error("Error checking existing user:", err);
//         return res.status(500).json({ error: true, message: "Internal Server Error" });
//       }

//       if (results.length > 0) {
//         return res.status(400).json({ error: true, message: "User with this email already exists" });
//       }

//       pool.query("INSERT INTO signup_details SET ?", { userId, email, password: hashedPassword, role }, async (err, results) => { // Include 'role' in the INSERT query
//         if (err) {
//           console.error("Error creating new user:", err);
//           return res.status(500).json({ error: true, message: "Internal Server Error" });
//         }

//         res.status(201).json({ error: false, message: "User created successfully", user: { userId, email } });
//       });
//     });
//   } catch (error) {
//     console.error("Error in signup route:", error);
//     res.status(500).json({ error: true, message: "Internal Server Error" });
//   }
// });
// // Sign in
// app.post('/api/auth/signin', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     pool.query("SELECT * FROM signup_details WHERE email = ?", [email], async (err, results) => {
//       if (err) {
//         console.error("Error finding user:", err);
//         return res.status(500).json({ error: true, message: "Internal Server Error" });
//       }

//       if (results.length === 0) {
//         console.log("Invalid ");
//         return res.status(401).json({ message: 'Invalid email or' });
//       }

//       const user = results[0];
//       const validPassword = await bcrypt.compare(password, user.password);
//       if (!validPassword) {
//         console.log("Invalid Email or password");
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const tokenPayload = {
//         userId: user.userId,
//         role: user.role // Include the user role in the JWT payload
//       };

//       const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

//       res.status(200).json({ token });
//     });
//   } catch (error) {
//     console.error("Error in signin route:", error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // // Route for handling form submission and file upload for vendors
// // app.post('/vendordata', (req, res) => {
// //   const { vendor_id ,vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail } = req.body;

// //   const sql = 'INSERT INTO vendor_details (vendor_id ,vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
// //   db.query(sql, [vendor_id ,vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail], (err, result) => {
// //       if (err) {
// //           console.error('Error uploading vendor data:', err);
// //           return res.status(500).send(err);
// //       }
// //       console.log('Vendor data uploaded:', result);
// //       res.send('Vendor data uploaded');
// //   });
// // });
// // Route for handling form submission and file upload for vendors
// app.post('/vendordata', (req, res) => {
//   const { vendor_id, vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail } = req.body;

//   const sql = 'INSERT INTO vendor_details (vendor_id, vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
//   // Ensure that db.query is referencing the correct database connection
//   db.query(sql, [vendor_id, vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail], (err, result) => {
//     if (err) {
//       console.error('Error uploading vendor data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Vendor data uploaded:', result);
//     res.send('Vendor data uploaded');
//   });
// });


// // Route for handling form submission and file upload for employees
// app.post('/empdata', employeeUpload.single('employeePicture'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   const { employeeName, employeeCode, employeeDesignation, employeeLocation } = req.body;
//   const sql = 'INSERT INTO employee_details (ename, ecode, edesignation, elocation, epicture) VALUES (?, ?, ?, ?, ?)';
//   db.query(sql, [employeeName, employeeCode, employeeDesignation, employeeLocation, req.file.originalname], (err, result) => {
//     if (err) {
//       console.error('Error uploading employee data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Employee data uploaded:', result);
//     res.send('Employee data uploaded');
//   });
// });

// // Route for handling form submission and file upload for assets
// app.post('/assetdata', assetUpload.single('picture'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   const { name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus } = req.body;
//   const sql = 'INSERT INTO asset_details (name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//   db.query(sql, [name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus, req.file.originalname], (err, result) => {
//     if (err) {
//       console.error('Error uploading asset data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Asset data uploaded:', result);
//     res.send('Asset data uploaded');
//   });
// });

// // Route for fetching list of employees
// app.get('/employees', (req, res) => {
//   const sql = 'SELECT * FROM employee_details';
//   db.query(sql, (err, results) => {
//       if (err) {
//           console.error('Error fetching employees:', err);
//           return res.status(500).send(err);
//       }
//       res.json(results);
//   });
// });

// // Route for fetching list of assets
// app.get('/assets', (req, res) => {
//   const sql = 'SELECT * FROM asset_details';
//   db.query(sql, (err, results) => {
//       if (err) {
//           console.error('Error fetching assets:', err);
//           return res.status(500).send(err);
//       }
//       res.json(results);
//   });
// });

// // Route for deleting an asset by its ID
// app.delete('/assets/:id', (req, res) => {
//   const assetId = req.params.id;
//   const sql = 'DELETE FROM asset_details WHERE id = ?';
//   db.query(sql, [assetId], (err, result) => {
//       if (err) {
//           console.error('Error deleting asset:', err);
//           return res.status(500).send(err);
//       }
//       console.log('Asset deleted:', result);
//       res.send('Asset deleted');
//   });
// });



// // Route for fetching list of vendors
// app.get('/vendors', (req, res) => {
//   const sql = 'SELECT * FROM vendor_details';
//   db.query(sql, (err, results) => {
//       if (err) {
//           console.error('Error fetching vendors:', err);
//           return res.status(500).send(err);
//       }
//       res.json(results);
//   });
// });

// // Import necessary modules and setup

// // Route for fetching check-in and check-out history for a specific asset
// app.get('/assets/:assetId/history', (req, res) => {
//   const assetId = req.params.assetId;
//   const sql = 'SELECT * FROM checkin_checkout_history WHERE asset_id = ?';
//   db.query(sql, [assetId], (err, results) => {
//       if (err) {
//           console.error('Error fetching check-in and check-out history:', err);
//           return res.status(500).send(err);
//       }
//       res.json(results);
//   });
// });

// // Route for fetching check-in/check-out history for a specific asset ID
// app.get('/api/checkincheckout/history/:id', (req, res) => {
//   const assetId = req.params.id;

//   // Query the database to fetch the history for the specified asset ID along with asset details
//   const sql = `
//     SELECT c.*, a.name AS asset_name, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, a.picture AS asset_picture, a.currentStatus
//     FROM checkin_checkout_history c
//     JOIN asset_details a ON c.asset_id = a.id
//     WHERE c.asset_id = ?`;
  
//   db.query(sql, [assetId], (err, results) => {
//     if (err) {
//       console.error('Error fetching check-in/check-out history:', err);
//       return res.status(500).json({ error: true, message: 'Internal Server Error' });
//     }
    
//     res.json(results); // Send the fetched history with asset details as JSON response
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


// // Route for deleting a vendor by its ID
// app.delete('/vendors/:id', (req, res) => {
//   const vendorId = req.params.id;
//   const sql = 'DELETE FROM vendor_details WHERE id = ?';
//   db.query(sql, [vendorId], (err, result) => {
//     if (err) {
//       console.error('Error deleting Vendor:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Vendor deleted:', result);
//     res.json({ message: 'Vendor deleted successfully' });
//   });
// });


// // Route for updating vendor details
// app.put('/vendors/:id', (req, res) => {
//   const vendorId = req.params.id;
//   const { vendor_id ,vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail } = req.body;

//   const sql = 'UPDATE vendor_details SET vendor_id = ? ,vendorCompanyName = ?, vendorAddress = ?, companyGSTNo = ?, contactPersonName = ?, contactPersonDesignation = ?, contactPersonMobile = ?, contactPersonEmail = ? WHERE id = ?';
//   db.query(sql, [vendor_id ,vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail, vendorId], (err, result) => {
//     if (err) {
//       console.error('Error updating vendor data:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Vendor data updated:', result);
//     res.send('Vendor data updated');
//   });
// });

// // Route for updating Asset details
// app.put('/assets/:id', (req, res) => {
//   const assetsId = req.params.id;
//   const { name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus } = req.body;

//   // Assuming you have a table named 'asset_details' to update the asset
//   const sql = 'UPDATE asset_details SET name=?, assettag=?, vendorcompanyname=?, location=?, brand=?, serial=?, assetType=?, cost=?, purchaseDate=?, description=?, currentStatus=? WHERE id=?';
  
//   db.query(sql, [name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus, assetsId], (err, result) => {
//     if (err) {
//       console.error('Error updating asset:', err);
//       return res.status(500).json({ message: 'Error updating asset' });
//     }

//     console.log('Asset data updated:', result);
//     res.send('Asset data updated');
//   });
// });


// // Route for updating employee details by ID
// app.put('/employees/:id', employeeUpload.single('epicture'), (req, res) => {
//   const employeeId = req.params.id;
//   const { ename, ecode, edesignation, elocation } = req.body;
//   let epicture = null;

//   // Check if a new picture is uploaded
//   if (req.file) {
//     epicture = req.file.originalname;
//   }

//   let sql = 'UPDATE employee_details SET ename = ?, ecode = ?, edesignation = ?, elocation = ?';
//   const params = [ename, ecode, edesignation, elocation];

//   // Add the picture field to the update query only if a new picture is uploaded
//   if (epicture) {
//     sql += ', epicture = ?';
//     params.push(epicture);
//   }

//   sql += ' WHERE id = ?';
//   params.push(employeeId);

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       console.error('Error updating employee details:', err);
//       return res.status(500).send(err);
//     }
//     // Assuming the update was successful
//     res.status(200).send('Employee details updated successfully');
//   });
// });


// // // Route for checking in an asset
// // app.put('/assets/checkin/:id', (req, res) => {
// //   const assetId = req.params.id;
// //   const { user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id } = req.body; // Assuming user_id and checkin_by are provided in the request body
// //   const eventType = 'check_in';
// //   const sql = 'INSERT INTO CheckIn_CheckOut_History (asset_id, event_type, user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
// //   db.query(sql, [assetId, eventType, user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id], (err, result) => {
// //     if (err) {
// //       console.error('Error checking in asset:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Asset checked in:', result);
// //     res.send('Asset checked in successfully')
// //   });
// // });


// // // Route for checking out an asset
// // app.put('/assets/checkout/:id', (req, res) => {
// //   const assetId = req.params.id;
// //   const { user_id, checkout_to, checkout_date} = req.body; // Assuming user_id and checkout_to are provided in the request body
// //   const eventType = 'check_out';
// //   const sql = 'INSERT INTO CheckIn_CheckOut_History (asset_id, event_type, user_id, checkout_to,checkout_date) VALUES (?, ?, ?, ?,?)';
// //   db.query(sql, [assetId, eventType, user_id, checkout_to, checkout_date], (err, result) => {
// //     if (err) {
// //       console.error('Error checking out asset:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Asset checked out:', result);
// //     res.send('Asset checked out successfully');
// //   });
// // });

// // Route for checking in an asset
// app.put('/assets/checkin/:id', (req, res) => {
//   const assetId = req.params.id;
//   const { user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id } = req.body; // Get checkin_date from request body
//   const eventType = 'check_in';
//   const sql = `
//     INSERT INTO checkin_checkout_history 
//       (asset_id, event_type, timestamp, user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id) 
//     VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?)`;
//   db.query(sql, [assetId, eventType, user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id], (err, result) => {
//     if (err) {
//       console.error('Error checking in asset:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Asset checked in:', result);
//     res.send('Asset checked in successfully');
//   });
// });
// // Route for checking out an asset
// app.put('/assets/checkout/:id', (req, res) => {
//   const assetId = req.params.id;
//   const { user_id, checkout_to, checkout_date, description, checkin_by_id, employee_id, site_id, vendor_id } = req.body; // Include checkout_date from the request body
//   const eventType = 'check_out';
//   const sql = `
//     INSERT INTO checkin_checkout_history 
//       (asset_id, event_type, timestamp, user_id, checkout_to, checkout_date, description, checkin_by_id, employee_id, site_id, vendor_id) 
//     VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?)`;
//   db.query(sql, [assetId, eventType, user_id, checkout_to, checkout_date, description, checkin_by_id, employee_id, site_id, vendor_id], (err, result) => {
//     if (err) {
//       console.error('Error checking out asset:', err);
//       return res.status(500).send(err);
//     }
//     console.log('Asset checked out:', result);
//     res.send('Asset checked out successfully');
//   });
// });



// // // Route for fetching check-in/check-out history for a specific employee ID
// // app.get('/api/checkincheckout/history/employee/:id', (req, res) => {
// //   const employeeId = req.params.id;

// //   // Query the database to fetch the history for the specified employee ID
// //   const sql = 'SELECT * FROM checkin_checkout_history WHERE employee_id = ?';
// //   db.query(sql, [employeeId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching check-in/check-out history:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }
    
// //     res.json(results); // Send the fetched history as JSON response
// //   });
// // });

// // Route for fetching check-in/check-out history along with asset details for a specific employee ID
// app.get('/api/checkincheckout/history/employee/:id', (req, res) => {
//   const employeeId = req.params.id;

//   // Query the database to fetch the history for the specified employee ID along with asset details
//   const sql = `
//     SELECT c.*, a.name AS asset_name, a.assettag AS asset_tag, a.location AS asset_location, a.brand AS asset_brand, 
//            a.serial AS asset_serial, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, 
//            a.picture AS asset_picture, a.currentStatus
//     FROM checkin_checkout_history c
//     JOIN asset_details a ON c.asset_id = a.id
//     WHERE c.employee_id = ?`;
  
//   db.query(sql, [employeeId], (err, results) => {
//     if (err) {
//       console.error('Error fetching check-in/check-out history:', err);
//       return res.status(500).json({ error: true, message: 'Internal Server Error' });
//     }
    
//     res.json(results); // Send the fetched history along with asset details as JSON response
//   });
// });


// // Route for fetching check-in/check-out history along with asset details for a specific Vendor ID
// app.get('/api/checkincheckout/history/vendor/:id', (req, res) => {
//   const vendorId = req.params.id;

//   // Query the database to fetch the history for the specified vendor ID
//   const sql = `
//     SELECT c.*, a.name AS asset_name, a.assettag AS asset_tag, a.location AS asset_location, a.brand AS asset_brand, 
//            a.serial AS asset_serial, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, 
//            a.picture AS asset_picture, a.currentStatus
//     FROM checkin_checkout_history c
//     JOIN asset_details a ON c.asset_id = a.id
//     WHERE c.site_id = ?`;
  
//   db.query(sql, [vendorId], (err, results) => {
//     if (err) {
//       console.error('Error fetching check-in/check-out history:', err);
//       return res.status(500).json({ error: true, message: 'Internal Server Error' });
//     }
    
//     res.json(results); // Send the fetched history along with asset details as JSON response
//   });
// });









// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });




























// // // Route for handling form submission and file upload for employees 
// // app.post('/empdata', employeeUpload.single('employeePicture'), (req, res) => {
// //   if (!req.file) {
// //     return res.status(400).send('No file uploaded.');
// //   }
// //   const { employeeName, employeeCode, employeeDesignation, employeeLocation } = req.body;
// //   const sql = 'INSERT INTO employee_details (ename, ecode, edesignation, elocation, epicture) VALUES (?, ?, ?, ?, ?)';
// //   db.query(sql, [employeeName, employeeCode, employeeDesignation, employeeLocation, req.file.originalname], (err, result) => {
// //     if (err) {
// //       console.error('Error uploading employee data:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Employee data uploaded:', result);
// //     res.send('Employee data uploaded');
// //   });
// // });



// // // Route for handling form submission and file upload for assets
// // app.post('/assetdata', assetUpload.single('picture'), (req, res) => {
// //   if (!req.file) {
// //     return res.status(400).send('No file uploaded.');
// //   }
// //   const { name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus, vendor_id } = req.body;
// //   const sql = 'INSERT INTO asset_details (name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus, vendor_id, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
// //   db.query(sql, [name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus, vendor_id, req.file.originalname], (err, result) => {
// //     if (err) {
// //       console.error('Error uploading asset data:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Asset data uploaded:', result);
// //     res.send('Asset data uploaded');
// //   });
// // });


// // app.get('/', (req, res) => {
// //   res.send('Hello World!');
// // });

// // app.get('/assets', (req, res) => {
// //   const sql = 'SELECT * FROM asset_details';
// //   db.query(sql, (err, results) => {
// //     if (err) {
// //       console.error('Error fetching assets:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// // // Route for fetching list of employees 
// // app.get('/employees', (req, res) => {
// //   const sql = 'SELECT * FROM employee_details';
// //   db.query(sql, (err, results) => {
// //     if (err) {
// //       console.error('Error fetching employees:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// // // Route for handling form submission and file upload for vendors 
// // app.post('/vendordata', (req, res) => {
// //   const {  vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail } = req.body;

// //   const sql = 'INSERT INTO vendor_details ( vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail) VALUES ( ?, ?, ?, ?, ?, ?, ?)';

// //   // Ensure that db.query is referencing the correct database connection
// //   db.query(sql, [ vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail], (err, result) => {
// //     if (err) {
// //       console.error('Error uploading vendor data:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Vendor data uploaded:', result);
// //     res.send('Vendor data uploaded');
// //   });
// // });


// // // Route for fetching list of vendors 
// // app.get('/vendors', (req, res) => {
// //   const sql = 'SELECT * FROM vendor_details';
// //   db.query(sql, (err, results) => {
// //     if (err) {
// //       console.error('Error fetching vendors:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// // // checking the code 

// // // Route for deleting an asset by its ID
// // app.delete('/assets/:id', (req, res) => {
// //   const assetId = req.params.id;
// //   const sql = 'DELETE FROM asset_details WHERE id = ?';
// //   db.query(sql, [assetId], (err, result) => {
// //     if (err) {
// //       console.error('Error deleting asset:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Asset deleted:', result);
// //     res.send('Asset deleted');
// //   });
// // });


// // // Route for fetching check-in and check-out history for a specific asset
// // app.get('/assets/:assetId/history', (req, res) => {
// //   const assetId = req.params.assetId;
// //   const sql = 'SELECT * FROM checkin_checkout_history WHERE asset_id = ?';
// //   db.query(sql, [assetId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching check-in and check-out history:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// // // Route for fetching check-in/check-out history for a specific asset ID
// // app.get('/api/checkincheckout/history/:id', (req, res) => {
// //   const assetId = req.params.id;

// //   // Query the database to fetch the history for the specified asset ID along with asset details
// //   const sql = `
// //     SELECT c.*, a.name AS asset_name, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, a.picture AS asset_picture, a.currentStatus
// //     FROM checkin_checkout_history c
// //     JOIN asset_details a ON c.asset_id = a.id
// //     WHERE c.asset_id = ?`;

// //   db.query(sql, [assetId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching check-in/check-out history:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     res.json(results); // Send the fetched history with asset details as JSON response
// //   });
// // });




// // // Route for deleting an employee by its ID
// // app.delete('/employees/:id', (req, res) => {
// //   const employeeId = req.params.id;
// //   const sql = 'DELETE FROM employee_details WHERE id = ?';
// //   db.query(sql, [employeeId], (err, result) => {
// //     if (err) {
// //       console.error('Error deleting employee:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Employee deleted:', result);
// //     res.send('Employee deleted');
// //   });
// // });

// // // Route for handling form submission and file upload for vendors 
// // app.post('/vendordata', (req, res) => {
// //   const {  vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail } = req.body;

// //   const sql = 'INSERT INTO vendor_details ( vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail) VALUES ( ?, ?, ?, ?, ?, ?, ?)';

// //   // Ensure that db.query is referencing the correct database connection
// //   db.query(sql, [ vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail], (err, result) => {
// //     if (err) {
// //       console.error('Error uploading vendor data:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Vendor data uploaded:', result);
// //     res.send('Vendor data uploaded');
// //   });
// // });

// // // Route for fetching list of vendors 
// // app.get('/vendors', (req, res) => {
// //   const sql = 'SELECT * FROM vendor_details';
// //   db.query(sql, (err, results) => {
// //     if (err) {
// //       console.error('Error fetching vendors:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// // // Route for deleting a vendor by its ID 
// // app.delete('/vendors/:id', (req, res) => {
// //   const vendorId = req.params.id;
// //   const sql = 'DELETE FROM vendor_details WHERE id = ?';
// //   db.query(sql, [vendorId], (err, result) => {
// //     if (err) {
// //       console.error('Error deleting Vendor:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Vendor deleted:', result);
// //     res.json({ message: 'Vendor deleted successfully' });
// //   });
// // });


// // // Route for updating vendor details 
// // app.put('/vendors/:id', (req, res) => {
// //   const vendorId = req.params.id;
// //   const { vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail } = req.body;

// //   const sql = 'UPDATE vendor_details SET vendorCompanyName = ?, vendorAddress = ?, companyGSTNo = ?, contactPersonName = ?, contactPersonDesignation = ?, contactPersonMobile = ?, contactPersonEmail = ? WHERE id = ?';
// //   db.query(sql, [vendorCompanyName, vendorAddress, companyGSTNo, contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail, vendorId], (err, result) => {
// //     if (err) {
// //       console.error('Error updating vendor data:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Vendor data updated:', result);
// //     res.send('Vendor data updated');
// //   });
// // });


// // // Route for updating Asset details
// // app.put('/assets/:id', (req, res) => {
// //   const assetsId = req.params.id;
// //   const { name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus } = req.body;

// //   // Assuming you have a table named 'asset_details' to update the asset
// //   const sql = 'UPDATE asset_details SET name=?, assettag=?, vendorcompanyname=?, location=?, brand=?, serial=?, assetType=?, cost=?, purchaseDate=?, description=?, currentStatus=? WHERE id=?';

// //   db.query(sql, [name, assettag, vendorcompanyname, location, brand, serial, assetType, cost, purchaseDate, description, currentStatus, assetsId], (err, result) => {
// //     if (err) {
// //       console.error('Error updating asset:', err);
// //       return res.status(500).json({ message: 'Error updating asset' });
// //     }

// //     console.log('Asset data updated:', result);
// //     res.send('Asset data updated');
// //   });
// // });


// // // Route for updating employee details by ID
// // app.put('/employees/:id', employeeUpload.single('epicture'), (req, res) => {
// //   const employeeId = req.params.id;
// //   const { ename, ecode, edesignation, elocation } = req.body;
// //   let epicture = null;

// //   // Check if a new picture is uploaded
// //   if (req.file) {
// //     epicture = req.file.originalname;
// //   }
// //   let sql = 'UPDATE employee_details SET ename = ?, ecode = ?, edesignation = ?, elocation = ?';
// //   const params = [ename, ecode, edesignation, elocation];
// //   // Add the picture field to the update query only if a new picture is uploaded
// //   if (epicture) {
// //     sql += ', epicture = ?';
// //     params.push(epicture);
// //   }
// //   sql += ' WHERE id = ?';
// //   params.push(employeeId);

// //   db.query(sql, params, (err, results) => {
// //     if (err) {
// //       console.error('Error updating employee details:', err);
// //       return res.status(500).send(err);
// //     }
// //     // Assuming the update was successful
// //     res.status(200).send('Employee details updated successfully');
// //   });
// // });

// // // Route for deleting a client 
// // app.delete('/clients/:clientId', (req, res) => {
// //   const clientId = req.params.clientId;
// //   const sql = 'DELETE FROM client_details WHERE id = ?';
// //   db.query(sql, [clientId], (error, results) => {
// //     if (error) {
// //       console.error('Error deleting client:', error);
// //       res.status(500).json({ error: 'Error deleting client' });
// //     } else {
// //       console.log('Client deleted successfully');
// //       res.status(200).json({ message: 'Client deleted successfully' });
// //     }
// //   });
// // });

// // // Route for fetching list of assets 
// // app.get('/clients', (req, res) => {
// //   const sql = 'SELECT * FROM client_details';
// //   db.query(sql, (err, results) => {
// //     if (err) {
// //       console.error('Error fetching Clients:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// // // Route for adding a new client 
// // app.post('/clientdata', (req, res) => {
// //   const {
// //     clientName, clientAddress, clientMobile, clientEmail, representativeName, designation, gstNo, bankName, accountNo, ifscCode, bankAddress } = req.body;

// //   const sql = 'INSERT INTO client_details (clientName, clientAddress, clientMobile, clientEmail, representativeName, designation, gstNo, bankName, accountNo, ifscCode, bankAddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

// //   db.query(sql,[clientName, clientAddress, clientMobile, clientEmail, representativeName, designation, gstNo, bankName, accountNo, ifscCode, bankAddress],
// //     (error, results) => {
// //       if (error) {
// //         console.error('Error adding client:', error);
// //         res.status(500).json({ error: 'Error adding client' });
// //       } else {
// //         console.log('Client added successfully');
// //         res.status(201).json({ message: 'Client added successfully' });
// //       }
// //     }
// //   );
// // });

// // // Route for updating client details 
// // app.put('/clients/:id', (req, res) => {
// //   const clientId = req.params.id;
// //   const {
// //     clientName, clientAddress, clientMobile, clientEmail, representativeName, designation, gstNo, bankName, accountNo, ifscCode, bankAddress
// //   } = req.body;

// //   const sql = `
// //     UPDATE client_details  SET clientName = ?, clientAddress = ?, clientMobile = ?, clientEmail = ?, 
// //         representativeName = ?, designation = ?, gstNo = ?, bankName = ?, 
// //         accountNo = ?, ifscCode = ?, bankAddress = ? 
// //     WHERE id = ?`;

// //   db.query(sql, [
// //     clientName, clientAddress, clientMobile, clientEmail, representativeName,
// //     designation, gstNo, bankName, accountNo, ifscCode, bankAddress, clientId
// //   ],
// //     (error, results) => {
// //       if (error) {
// //         console.error('Error updating client:', error);
// //         res.status(500).json({ error: 'Error updating client' });
// //       } else {
// //         console.log('Client updated successfully');
// //         res.status(200).json({ message: 'Client updated successfully' });
// //       }
// //     }
// //   );
// // });

// // // Route for deleting a site
// // app.delete('/sites/:siteId', (req, res) => {
// //   const siteId = req.params.siteId;
// //   const sql = 'DELETE FROM site_details WHERE id = ?';
// //   db.query(sql, [siteId], (error, results) => {
// //     if (error) {
// //       console.error('Error deleting site:', error);
// //       res.status(500).json({ error: 'Error deleting site' });
// //     } else {
// //       console.log('Site deleted successfully');
// //       res.status(200).json({ message: 'Site deleted successfully' });
// //     }
// //   });
// // });

// // // Route for fetching list of sites
// // app.get('/sites', (req, res) => {
// //   const sql = 'SELECT * FROM site_details';
// //   db.query(sql, (err, results) => {
// //     if (err) {
// //       console.error('Error fetching sites:', err);
// //       return res.status(500).send(err);
// //     }
// //     res.json(results);
// //   });
// // });

// // // Route for adding a new site
// // app.post('/sites', (req, res) => {
// //   const {
// //     siteName, siteLocation, siteManager, contactNo
// //   } = req.body;

// //   const sql = 'INSERT INTO site_details (siteName, siteLocation, siteManager, contactNo) VALUES (?, ?, ?, ?)';

// //   db.query(sql,[siteName, siteLocation, siteManager, contactNo],
// //     (error, results) => {
// //       if (error) {
// //         console.error('Error adding site:', error);
// //         res.status(500).json({ error: 'Error adding site' });
// //       } else {
// //         console.log('Site added successfully');
// //         res.status(201).json({ message: 'Site added successfully' });
// //       }
// //     }
// //   );
// // });

// // // Route for updating site details
// // app.put('/sites/:id', (req, res) => {
// //   const siteId = req.params.id;
// //   const {
// //     siteName, siteLocation, siteManager, contactNo
// //   } = req.body;

// //   const sql = `
// //     UPDATE site_details SET siteName = ?, siteLocation = ?, siteManager = ?, contactNo = ?
// //     WHERE id = ?`;

// //   db.query(sql, [
// //     siteName, siteLocation, siteManager, contactNo, siteId
// //   ],
// //     (error, results) => {
// //       if (error) {
// //         console.error('Error updating site:', error);
// //         res.status(500).json({ error: 'Error updating site' });
// //       } else {
// //         console.log('Site updated successfully');
// //         res.status(200).json({ message: 'Site updated successfully' });
// //       }
// //     }
// //   );
// // });


// // // Route for checking in an asset
// // app.put('/assets/checkin/:id', (req, res) => {
// //   const assetId = req.params.id;
// //   const { user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id, client_id } = req.body; // Get checkin_date from request body
// //   const eventType = 'check_in';
// //   const sql = `
// //     INSERT INTO checkin_checkout_history 
// //       (asset_id, event_type, timestamp, user_id, checkin_by, checkin_date, description, checkin_by_id, employee_id, site_id, vendor_id, client_id) 
// //     VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
// //   // Check if employee_id is provided and valid, otherwise set it to null
// //   const employeeIdValue = employee_id || null;

// //   db.query(sql, [assetId, eventType, user_id, checkin_by, checkin_date, description, checkin_by_id, employeeIdValue, site_id, vendor_id, client_id], (err, result) => {
// //     if (err) {
// //       console.error('Error checking in asset:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Asset checked in:', result);
// //     res.send('Asset checked in successfully');
// //   });
// // });

// // // Route for checking out an asset
// // app.put('/assets/checkout/:id', (req, res) => {
// //   const assetId = req.params.id;
// //   const { user_id, checkout_to, checkout_date, description, checkin_by_id, employee_id, site_id, vendor_id, client_id } = req.body; // Include checkout_date from the request body
// //   const eventType = 'check_out';
// //   const sql = `
// //     INSERT INTO checkin_checkout_history 
// //       (asset_id, event_type, timestamp, user_id, checkout_to, checkout_date, description, checkin_by_id, employee_id, site_id, vendor_id, client_id ) 
// //     VALUES (?, ?, CURRENT_TIMESTAMP(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
// //   db.query(sql, [assetId, eventType, user_id, checkout_to, checkout_date, description, checkin_by_id, employee_id, site_id, vendor_id, client_id], (err, result) => {
// //     if (err) {
// //       console.error('Error checking out asset:', err);
// //       return res.status(500).send(err);
// //     }
// //     console.log('Asset checked out:', result);
// //     res.send('Asset checked out successfully');
// //   });
// // });

// // // Route for fetching check-in/check-out history along with asset details for a specific employee ID
// // app.get('/api/checkincheckout/history/employee/:id', (req, res) => {
// //   const employeeId = req.params.id;

// //   // Query the database to fetch the history for the specified employee ID along with asset details
// //   const sql = `
// //     SELECT c.*, a.name AS asset_name, a.assettag AS asset_tag, a.location AS asset_location, a.brand AS asset_brand, 
// //            a.serial AS asset_serial, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, 
// //            a.picture AS asset_picture, a.currentStatus
// //     FROM checkin_checkout_history c
// //     JOIN asset_details a ON c.asset_id = a.id
// //     WHERE c.employee_id = ?`;

// //   db.query(sql, [employeeId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching check-in/check-out history:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     res.json(results); // Send the fetched history along with asset details as JSON response
// //   });
// // });


// // // Route for fetching check-in/check-out history along with asset details for a specific Vendor ID
// // app.get('/api/checkincheckout/history/vendor/:id', (req, res) => {
// //   const vendorId = req.params.id;

// //   // Query the database to fetch the history for the specified vendor ID
// //   const sql = `
// //     SELECT c.*, a.name AS asset_name, a.assettag AS asset_tag, a.location AS asset_location, a.brand AS asset_brand, 
// //            a.serial AS asset_serial, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, 
// //            a.picture AS asset_picture, a.currentStatus
// //     FROM checkin_checkout_history c
// //     JOIN asset_details a ON c.asset_id = a.id
// //     WHERE c.site_id = ?`;

// //   db.query(sql, [vendorId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching check-in/check-out history:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     res.json(results); // Send the fetched history along with asset details as JSON response
// //   });
// // });


// // // Route for fetching check-in/check-out history along with asset details for a specific Client ID
// // app.get('/api/checkincheckout/history/client/:id', (req, res) => {
// //   const clientId = req.params.id;

// //   // Query the database to fetch the history for the specified client ID
// //   const sql = `
// //     SELECT c.*, a.name AS asset_name, a.assettag AS asset_tag, a.location AS asset_location, a.brand AS asset_brand, 
// //            a.serial AS asset_serial, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, 
// //            a.picture AS asset_picture, a.currentStatus
// //     FROM checkin_checkout_history c
// //     JOIN asset_details a ON c.asset_id = a.id
// //     WHERE c.client_id = ?`;

// //   db.query(sql, [clientId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching check-in/check-out history:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     res.json(results); // Send the fetched history along with asset details as JSON response
// //   });
// // });


// // // Route for fetching check-in/check-out history along with asset details for a specific Site ID
// // app.get('/api/checkincheckout/history/site/:id', (req, res) => {
// //   const siteId = req.params.id;

// //   // Query the database to fetch the history for the specified site ID
// //   const sql = `
// //     SELECT c.*, a.name AS asset_name, a.assettag AS asset_tag, a.location AS asset_location, a.brand AS asset_brand, 
// //            a.serial AS asset_serial, a.assetType, a.cost, a.purchaseDate, a.description AS asset_description, 
// //            a.picture AS asset_picture, a.currentStatus
// //     FROM checkin_checkout_history c
// //     JOIN asset_details a ON c.asset_id = a.id
// //     WHERE c.site_id = ?`;

// //   db.query(sql, [siteId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching check-in/check-out history:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     res.json(results); // Send the fetched history along with asset details as JSON response
// //   });
// // });


// // // Route for fetching asset data filtered by vendor_id
// // app.get('/assetdata_vendor', (req, res) => {
// //   const vendorId = req.query.vendor_id;

// //   // Construct the SQL query to fetch asset data filtered by vendor_id
// //   const sql = 'SELECT * FROM asset_details WHERE vendor_id = ?';

// //   // Execute the query with the provided vendor_id parameter
// //   db.query(sql, [vendorId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching asset data:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }
    
// //     // Send the fetched asset data as JSON response
// //     res.json(results);
// //   });
// // });

// // // for showing the popup 

// // // Route for fetching particular site details by ID
// // app.get('/particular_sites/:id', (req, res) => {
// //   const siteId = req.params.id;

// //   // Query the database to fetch the details for the specified site ID
// //   const sql = 'SELECT * FROM site_details WHERE id = ?';

// //   db.query(sql, [siteId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching site details:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     // Check if any site details were found
// //     if (results.length === 0) {
// //       return res.status(404).json({ error: true, message: 'Site not found' });
// //     }

// //     res.json(results[0]); // Send the fetched site details as JSON response
// //   });
// // });

// // // Route for fetching particular Employee details by ID
// // app.get('/particular_employee/:id', (req, res) => {
// //   const employeeId = req.params.id;

// //   // Query the database to fetch the details for the specified employee ID
// //   const sql = 'SELECT * FROM employee_details WHERE id = ?';

// //   db.query(sql, [employeeId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching employee details:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     // Check if any employee details were found
// //     if (results.length === 0) {
// //       return res.status(404).json({ error: true, message: 'Employee not found' });
// //     }

// //     res.json(results[0]); // Send the fetched employee details as JSON response
// //   });
// // });

// // // Route for fetching particular Client details by ID
// // app.get('/particular_client/:id', (req, res) => {
// //   const clientId = req.params.id;

// //   // Query the database to fetch the details for the specified client ID
// //   const sql = 'SELECT * FROM client_details WHERE id = ?';

// //   db.query(sql, [clientId], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching client details:', err);
// //       return res.status(500).json({ error: true, message: 'Internal Server Error' });
// //     }

// //     // Check if any client details were found
// //     if (results.length === 0) {
// //       return res.status(404).json({ error: true, message: 'Client not found' });
// //     }

// //     res.json(results[0]); // Send the fetched client details as JSON response
// //   });
// // });

// // // check the code 

// // app.post('/', (req, res) => {
// //   const data = req.body;
// //   res.json(data);
// // });

// // app.listen(port, () => {
// //   console.log(`Server is listening at http://localhost:${port}`);
// // });
