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
      const token = jwt.sign(
        { email: user.email, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
      );


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

// // Fetch login details by email
// Backend: Check if projectId exists in temp_signup
app.get('/signupdetails/:projectId', (req, res) => {
  const { projectId } = req.params;
  const query = 'SELECT * FROM temp_signup WHERE projectId = ?';

  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching temp_signup records:', err);
      res.status(500).json({ error: 'Error fetching records' });
      return;
    }

    // Check if projectId exists
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
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
// employee code end 

// Office Code  start
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


app.post('/projectData',projectUpload.single('picture'), (req, res) => {
  let picturePath = null; // Initialize picturePath as null
  const { projectName,projectShortName,
      projectCode,
      companyName,
      company_id,
      employeerName,
      projectType,
      projectAddress,
      projectstate,
      projectcity,
      projectpincode,
      username} = req.body;

  if (req.file) {
    picturePath = req.file.filename; // Assign the filename if the file was uploaded
  }

  // Insert query for employee details
  const sql = `
    INSERT INTO project_details (
    projectName,projectShortName, projectCode, companyName,
  company_id, employeerName, projectType, projectAddress,
    projectstate, projectcity, projectpincode, username, picture
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)`;

  const values = [ projectName,projectShortName, projectCode, companyName,
      company_id, employeerName, projectType, projectAddress,
      projectstate, projectcity, projectpincode, username, picturePath];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading Make Entry data:', err);
      return res.status(500).send(err);
    }
    console.log('Make Entry data uploaded:', result);
    res.send('Make Entry data uploaded successfully');
  });
});




app.post('/addCashPayment', (req, res) => {
  const { amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, projectShortName, username } = req.body;

  // SQL query to insert data into cash_details table
  const sql = `
    INSERT INTO cash_details
      (amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, projectShortName, username)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // Execute the query
  db.query(
    sql,
    [
      amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, projectShortName, username
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

app.get('/api/supervisor/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM supervisor WHERE projectId = ? AND leavedate IS NULL';
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
  console.log(req.body);
  const { date, headId, description, amount, headName, projectId, projectName,projectShortName, supervisorId, supervisorName } = req.body;

  if (req.file) {
    picturePath = req.file.filename; // Assign the filename if the file was uploaded
  }

  // Insert query for employee details
  const sql = `
    INSERT INTO makeentry (date, headId, description, amount, picture, headName, projectId, projectName,projectShortName, supervisorId, supervisorName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [date, headId, description, amount, picturePath, headName, projectId, projectName,projectShortName, supervisorId, supervisorName];

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

  const query = 'SELECT *, TIMESTAMPDIFF(HOUR, createdAt, NOW()) AS hoursPassed FROM makeentry  WHERE projectId = ? ORDER BY createdAt DESC';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching makeentry records:', err);
      res.status(500).json({ error: 'Error fetching makeentry records' });
      return;
    }

    // Add an 'isEditable' field based on the time difference
    const modifiedResults = results.map(entry => {
      entry.isEditable = entry.hoursPassed <= 24; // Set to true if less than or equal to 24 hours
      return entry;
    });

    res.json(modifiedResults);
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

app.get('/api/project/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM project_details WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching project_details records:', err);
      res.status(500).json({ error: 'Error fetching project_details records' });
      return;
    }
    res.json(results);
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
app.post('/assignSupervisor', (req, res) => {
  const { appointmentDate, departmentName, designationId, designationName, employeeCode, employeeEmail, employeeName, employeePanAddhar, employeePhone, employeePicture, employeerName, fatherName, projectAddress, projectCode, projectId, projectName,projectShortName, projectPicture, projectType, projectcity, projectpincode, projectstate, supervisorId, username
  } = req.body;
  // SQL query to insert data into supervisor table
  const sql = `
    INSERT INTO supervisor ( appointmentDate, departmentName, designationId, designationName, employeeCode, employeeEmail, employeeName, employeePanAddhar, employeePhone, employeePicture, employeerName, fatherName, projectAddress, projectCode, projectId, projectName,projectShortName, projectPicture, projectType, projectcity, projectpincode, projectstate, supervisorId, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // Execute the query
  db.query(
    sql,
    [appointmentDate, departmentName, designationId, designationName, employeeCode, employeeEmail, employeeName, employeePanAddhar, employeePhone, employeePicture, employeerName, fatherName, projectAddress, projectCode, projectId, projectName,projectShortName, projectPicture, projectType, projectcity, projectpincode, projectstate, supervisorId, username],
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
  const { projectId, projectName, supervisorId, supervisorName, requestdate, requestAmount, requestdescription, status
  } = req.body;
  // SQL query to insert data into addfund table
  const sql = `
    INSERT INTO addfund
      ( projectId,projectName,supervisorId,supervisorName,requestdate,requestAmount,requestdescription,status
)
    VALUES (?, ?, ?,?, ?, ?,?,?)
  `;
  // Execute the query
  db.query(
    sql,
    [projectId, projectName, supervisorId, supervisorName, requestdate, requestAmount, requestdescription, status],
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
// Total Credit /expenses
// Update fund request status

app.put('/approvereject/:id', (req, res) => {
  const fundId = parseInt(req.params.id); // Extracting the fund ID from the URL
  const { status, reason, paidAmount, paymentDate } = req.body; // Extracting the fields from the request body

  if (!status || !reason || !paidAmount || !paymentDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const updateQuery = `
      UPDATE addfund
      SET 
          status = ?, 
          reason = ?, 
          paidAmount = ?, 
          paymentDate = ? 
      WHERE id = ?`;

  db.query(updateQuery, [status, reason, paidAmount, paymentDate, fundId], (err, result) => {
    if (err) {
      console.error('Error updating fund request:', err);
      return res.status(500).json({ message: 'Error updating fund request' });
    }

    res.status(200).json({ message: 'Fund request updated successfully' });
  });
});






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


app.put('/changeentries/:id', makeEntryUpload.single('picture'), (req, res) => {
  const id = req.params.id;
  const { date, headId, description, amount, headName, projectId, projectName,projectShortName, supervisorId, supervisorName } = req.body;

  // Log request body for debugging
  console.log("data", req.body);

  // Use the file's filename if a file was uploaded, otherwise keep the existing filename
  const picture = req.file ? req.file.filename : null; // Store the filename in the database

  // First, fetch the existing entry from the database to retain the picture if not updated
  const sqlSelect = `SELECT picture FROM makeentry WHERE id = ?`;
  db.query(sqlSelect, [id], (err, results) => {
    if (err) {
      console.error('Error fetching existing entry:', err);
      return res.status(500).send('Database error');
    }

    // If there's no existing entry, handle it appropriately
    if (results.length === 0) {
      return res.status(404).send('Entry not found');
    }

    // Get the existing picture if no new file was uploaded
    const existingPicture = results[0].picture;

    // Update the SQL query and values to keep the existing picture if no new file is provided
    const sqlUpdate = `UPDATE makeentry SET 
      date = ?, 
      headId = ?, 
      description = ?, 
      amount = ?, 
      picture = ?, 
      headName = ?, 
      projectId = ?, 
      projectName = ?, 
      projectShortName = ?, 
      supervisorId = ?, 
      supervisorName = ? 
      WHERE id = ?`;

    const values = [
      date,
      headId,
      description,
      amount,
      picture || existingPicture, // Use existing picture if no new file uploaded
      headName,
      projectId,
      projectName,
      projectShortName,
      supervisorId,
      supervisorName,
      id,
    ];

    db.query(sqlUpdate, values, (err, result) => {
      if (err) {
        console.error('Error updating entry:', err);
        return res.status(500).send('Database error');
      }

      res.send({ message: 'Entry updated successfully' });
    });
  });
});


// User FundRequest List
app.get('/userfundrequest/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM addfund WHERE projectId = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching addfund records:', err);
      res.status(500).json({ error: 'Error fetching addfund records' });
      return;
    }
    res.json(results);
  });
});

// Edit cash Details 

app.put('/approvereject/:id', (req, res) => {
  const fundId = parseInt(req.params.id); // Extracting the fund ID from the URL
  const { status, reason, paidAmount, paymentDate } = req.body; // Extracting the fields from the request body

  if (!status || !reason || !paidAmount || !paymentDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const updateQuery = `
      UPDATE addfund
      SET 
          status = ?, 
          reason = ?, 
          paidAmount = ?, 
          paymentDate = ? 
      WHERE id = ?`;

  db.query(updateQuery, [status, reason, paidAmount, paymentDate, fundId], (err, result) => {
    if (err) {
      console.error('Error updating fund request:', err);
      return res.status(500).json({ message: 'Error updating fund request' });
    }

    res.status(200).json({ message: 'Fund request updated successfully' });
  });
});

// app.put('/addCashPayment/:id', (req, res) => {
//   const cashId = parseInt(req.params.id); // Extracting the cash ID from the URL

//   const { amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName,projectShortName } = req.body;

//   // SQL query to update data in cash_details table
//   const sql = `
//     UPDATE cash_details
//     SET 
//       amount = ?, 
//       date = ?, 
//       description = ?, 
//       paidTo = ?, 
//       paymentMode = ?, 
//       paymentModeId = ?, 
//       projectId = ?, 
//       projectName = ?
//       projectShortName = ?
//     WHERE id = ?`;

//   // Execute the query
//   db.query(
//     sql,
//     [
//       amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, projectShortName, cashId
//     ],
//     (err, result) => {
//       if (err) {
//         console.error('Error updating cash_details data:', err);
//         return res.status(500).send(err);
//       }
//       console.log('cash_details data updated:', result);
//       res.send('cash_details data updated successfully');
//     }
//   );
// });

app.put('/addCashPayment/:id', (req, res) => {
  const cashId = parseInt(req.params.id); // Extracting the cash ID from the URL
  const { amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, projectShortName } = req.body;

  // SQL query to update data in cash_details table
  const sql = `
    UPDATE cash_details
    SET 
      amount = ?, 
      date = ?, 
      description = ?, 
      paidTo = ?, 
      paymentMode = ?, 
      paymentModeId = ?, 
      projectId = ?, 
      projectName = ?, 
      projectShortName = ?
    WHERE id = ?`;

  // Execute the query
  db.query(
    sql,
    [
      amount, date, description, paidTo, paymentMode, paymentModeId, projectId, projectName, projectShortName, cashId
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating cash_details data:', err);
        return res.status(500).send(err);
      }
      console.log('cash_details data updated:', result);
      res.send('cash_details data updated successfully');
    }
  );
});


app.put('/empdata/:id', employeeUpload.single('picture'), (req, res) => {
  const id = req.params.id;
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

  // Log request body for debugging
  console.log("data", req.body);

  // Use the file's filename if a new file was uploaded, otherwise we'll keep the existing picture
  const newPicture = req.file ? req.file.filename : null;

  // First, fetch the existing entry from the database to retain the existing picture if not updated
  const sqlSelect = `SELECT picture FROM employee_details WHERE id = ?`;
  db.query(sqlSelect, [id], (err, results) => {
    if (err) {
      console.error('Error fetching existing entry:', err);
      return res.status(500).send('Database error');
    }

    // If the entry does not exist, handle it appropriately
    if (results.length === 0) {
      return res.status(404).send('Entry not found');
    }

    // Get the existing picture from the database
    const existingPicture = results[0].picture;

    // Update the SQL query to include the new picture if provided, or keep the existing one
    const sqlUpdate = `
      UPDATE employee_details SET 
        employeeName = ?, 
        employeeCode = ?, 
        employeeEmail = ?, 
        employeePhone = ?, 
        fatherName = ?, 
        employeePanAddhar = ?, 
        departmentName = ?, 
        designationName = ?, 
        designationId = ?, 
        picture = ?, 
        username = ?, 
        department = ? 
      WHERE id = ?
    `;

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
      newPicture || existingPicture, // Use new picture if uploaded, otherwise retain the existing one
      username,
      department,
      id,
    ];

    // Execute the update query
    db.query(sqlUpdate, values, (err, result) => {
      if (err) {
        console.error('Error updating entry:', err);
        return res.status(500).send('Database error');
      }
      res.send({ message: 'Entry updated successfully' });
    });
  });
});


// head 
app.put('/editHead/:id', (req, res) => {
  const headId = parseInt(req.params.id); // Extracting the head ID from the URL

  const { description, headName } = req.body;

  // SQL query to update data in addhead table
  const sql = `
    UPDATE addhead
    SET 
      description = ?, 
      headName = ?
    WHERE id = ?`;

  // Execute the query
  db.query(
    sql,
    [description, headName, headId], // Including headId for WHERE clause
    (err, result) => {
      if (err) {
        console.error('Error updating addhead data:', err);
        return res.status(500).send(err);
      }
      console.log('addhead data updated:', result);
      res.send('addhead data updated successfully');
    }
  );
});

// head 

// project edit  
app.put('/projectData/:id', projectUpload.single('picture'), (req, res) => {
  const {
    projectName,
    projectShortName,
    projectCode,
    companyName,
    company_id,
    employeerName,
    projectType,
    projectAddress,
    projectstate,
    projectcity,
    projectpincode,
    username
  } = req.body;

  const picture = req.file ? req.file.filename : null;
  const officeId = req.params.id;

  // Build the base SQL query
  let sql = `
    UPDATE project_details
    SET 
      projectName = ?, 
      projectShortName = ?, 
      projectCode = ?, 
      companyName = ?,
      company_id = ?,
      employeerName = ?, 
      projectType = ?, 
      projectAddress = ?, 
      projectstate = ?, 
      projectcity = ?, 
      projectpincode = ?, 
      username = ?
  `;

  // Parameters to bind with the query
  const params = [
    projectName,
    projectShortName,
    projectCode,
    companyName,
    company_id,
    employeerName,
    projectType,
    projectAddress,
    projectstate,
    projectcity,
    projectpincode,
    username
  ];

  // If a picture is uploaded, include it in the query and parameters
  if (picture) {
    sql += `, picture = ? `;
    params.push(picture);
  }

  // Add the WHERE clause to update the specific office by ID
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
// project edit  

// supervisor Edit  
app.put('/assignSupervisor/:id', (req, res) => {
  const supervisorId = parseInt(req.params.id); // Extracting the head ID from the URL
  const { appointmentDate } = req.body;
  // SQL query to update data in supervisor table
  const sql = `UPDATE supervisor SET appointmentDate = ? WHERE id = ?`;
  // Execute the query
  db.query(
    sql,
    [appointmentDate, supervisorId], // Including supervisorId for WHERE clause
    (err, result) => {
      if (err) {
        console.error('Error updating supervisor data:', err);
        return res.status(500).send(err);
      }
      console.log('supervisor data updated:', result);
      res.send('supervisor data updated successfully');
    }
  );
});
// supervisor Edit  


// Delete Details  
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
// Delete Details  


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


// delete Cash Ledger Details  
app.delete('/deletecashledger/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM cash_details WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting cash_details:', err);
      return res.status(500).send(err);
    }
    console.log('cash_details deleted:', result);
    res.send('cash_details deleted');
  });
});
// delete Expenses Ledger Details  
app.delete('/deleteexpensesledger/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM makeentry WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting makeentry:', err);
      return res.status(500).send(err);
    }
    console.log('makeentry deleted:', result);
    res.send('makeentry deleted');
  });
});
// delete head Details  
app.delete('/deletehead/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM addhead WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting addhead:', err);
      return res.status(500).send(err);
    }
    console.log('addhead deleted:', result);
    res.send('addhead deleted');
  });
});

// Cash recived user 
app.get('/totalrecived/:projectId', (req, res) => {
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

// Cash recived user 
// Payment Mode 
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

// get details 
// Updated API to fetch both cash_details and makeentry for the project
app.get('/projectcreditdebit/:projectId', (req, res) => {
  const { projectId } = req.params;

  const query = `
    (SELECT id, amount, date, description, 'Credit' AS type FROM cash_details WHERE projectId = ?)
    UNION ALL
    (SELECT id, amount, date, description, 'Debit' AS type FROM makeentry WHERE projectId = ?);
  `;

  db.query(query, [projectId, projectId], (err, results) => {
      if (err) {
          console.error('Error fetching credit/debit records:', err);
          res.status(500).json({ error: 'Error fetching credit/debit records' });
          return;
      }
      res.json(results);
  });
});

// Labour Add  
app.get('/s/lastId', (req, res) => {
  const sql = 'SELECT MAX(id) AS id FROM labour';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching last Labour ID:', err);
      return res.status(500).send(err);
    }
    const lastId = results[0].id || 0; // Default to 0 if no assets exist
    res.json({ lastId });
  });
});

app.post('/addLabour', (req, res) => {
  const { projectId,projectName,projectShortName,labourId,labourName,fatherName,mobileNo,gender,dayShift,nightShift,overtimeHrs,username} = req.body;

  const sql = 'INSERT INTO labour (projectId,projectName,projectShortName,labourId,labourName,fatherName,mobileNo,gender,dayShift,nightShift,overtimeHrs,username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [projectId,projectName,projectShortName,labourId,labourName,fatherName,mobileNo,gender,dayShift,nightShift,overtimeHrs,username];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error uploading Labour data:', err);
      return res.status(500).send(err);
    }
    console.log('Labour data uploaded:', result);
    res.send('Labour data uploaded');
  });
});

app.get('/labours', (req, res) => {
  const sql = 'SELECT * FROM  labour';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching Labour:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.delete('/deletelabour/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM labour WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting labour:', err);
      return res.status(500).send(err);
    }
    console.log('labour deleted:', result);
    res.send('labour deleted');
  });
});

// Update Labour details
app.put('/editLabour/:id', (req, res) => {
  const Id = parseInt(req.params.id);

  const { projectId,projectName,projectShortName,labourId,labourName,fatherName,mobileNo,gender,dayShift,nightShift,overtimeHrs } = req.body;

  const sql = 'UPDATE labour SET projectId = ? ,projectName = ? ,projectShortName = ? ,labourId = ? ,labourName = ? ,fatherName = ? ,mobileNo = ? ,gender = ? ,dayShift = ? ,nightShift = ? ,overtimeHrs = ? WHERE id=?';

  db.query(sql, [projectId,projectName,projectShortName,labourId,labourName,fatherName,mobileNo,gender,dayShift,nightShift,overtimeHrs, Id], (err, result) => {
    if (err) {
      console.error('Error updating Labour data:', err);
      return res.status(500).send(err);
    }
    console.log('Labour data updated:', result);
    res.send('Labour data updated');
  });
});

// user 
app.get('/labours/:projectId', (req, res) => {
  const { projectId } = req.params;

  // Adjust the query to match projectId in the labours table
  const query = 'SELECT * FROM labour WHERE projectId = ?';

  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching labour records:', err);
      res.status(500).json({ error: 'Error fetching labour records' });
      return;
    }
    res.json(results);
  });
});

// Labour Add  


// check /makeEntry /projectData }/api/supervisor/  /expensesledger /api/transactions/ /projectData /projectData /api/supervisor/ /ledger_entries /expensesledger /addCashPayment /changeentries/








app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
















