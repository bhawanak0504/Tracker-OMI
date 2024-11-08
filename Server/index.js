const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("./models/User");
const axios = require("axios"); // Import axios for OpenAI API requests
require('dotenv').config(); // To load environment variables
const stripe = require('stripe')('sk_test_51QBYZfKdN6zW91jA4fPTWK3iiVj4IEukmhEcEzAPdje0LwMhEl4oYy2ZmJtshlyfglW2TjB8MYYUZYOyYXzRJ0pC00ugXLYETU');
const socketIo = require('socket.io');
const http = require('http'); // Import the http module
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: ["http://localhost:5173"], // Ensure this is the correct frontend port
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Middleware to parse cookies
app.use(cookieParser());

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb+srv://bhumijain:test123@cluster0.kzxid0j.mongodb.net/node-tuts?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware to verify user
const varifyUser = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookies
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  jwt.verify(token, "jwt-secret-key", (err, decode) => {
    if (err) {
      return res.status(403).json({ message: "Error with token" });
    }
    req.user = decode; // Store user information in the request object
    next(); // Call the next middleware or route handler
  });
};

// Existing dashboard route
app.get('/dashboard', varifyUser, async (req, res) => {
  const user = await UserModel.findOne({ email: req.user.email });
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "Success", username: user.name }); // Send back username
});

// Route for user registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email or name already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hash });
    res.json({ status: "OK" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign(
          { email: user.email },
          "jwt-secret-key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token, { httpOnly: true });
        return res.json({ status: "Success" });
      } else {
        return res.status(401).json("The password is incorrect");
      }
    } else {
      return res.status(404).json("No record existed");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
      const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd', // or your desired currency
      });
      res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});


app.post('/api/create-checkout-session', async (req, res) => {
  const { amount } = req.body;

  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  price_data: {
                      currency: 'usd',
                      product_data: {
                          name: 'Your Product Name',
                      },
                      unit_amount: amount,
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          success_url: 'http://localhost:3001/success', // Your success URL
          cancel_url: 'http://localhost:3001/cancel',   // Your cancel URL
      });

      res.json({ id: session.id });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});




// Email sending function
const sendEmail = (doctorEmail, userName, meetingLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jj4813406@gmail.com', // Your email
      pass: 'ettt kwuw mvqk eiox',   // Your app password
    },
  });

  const mailOptions = {
    from: 'jj4813406@gmail.com',
    to: doctorEmail,
    subject: 'New Appointment Scheduled',
    text: `You have a new appointment scheduled with ${userName}. Meeting link: ${meetingLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred:', error.message); // This will print the error details
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// API endpoint to schedule appointment
app.post('/schedule', async (req, res) => {
  const { userName, doctorEmail, meetingLink } = req.body;

  try {
    await sendEmail(doctorEmail, userName, meetingLink);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send email.');
  }
});



const server = http.createServer(app);
const io = require('socket.io')(3002, {
  cors: {
    origin: 'http://localhost:5173', // Allow frontend to access
    methods: ['GET', 'POST'],
  },
});

// Listen for incoming connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for incoming messages from the client
  socket.on('sendMessage', (messageData) => {
    // Broadcast the message to the doctor's room
    io.emit('receiveMessage', messageData);
  });

  // Listen for doctor's response
  socket.on('doctorResponse', (responseData) => {
    // Broadcast the doctor's response to all clients
    io.emit('receiveDoctorResponse', responseData);
  });

  // Handle when a client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


io.on('connection', (socket) => {
  socket.on('videoCallSignal', (data) => {
    socket.to(data.doctorEmail).emit('videoCallSignal', {
      signal: data.signal,
      doctorEmail: data.doctorEmail,
    });
  });

  socket.on('videoCallSignalResponse', (data) => {
    socket.to(data.doctorEmail).emit('videoCallSignal', {
      signal: data.signal,
      doctorEmail: data.doctorEmail,
    });
  });
});



app.post('/api/check-eligibility', (req, res) => {
  const { age, alreadyInsured } = req.body;
  // Logic to determine eligibility
  // Example condition (modify as needed)
  if (age >= 18) {
      res.json({ message: 'You are eligible for maternity insurance.' });
  } else {
      res.json({ message: 'You are not eligible for maternity insurance.' });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Store file with a timestamp to prevent overwrites
  },
});

// Initialize multer
const upload = multer({ storage: storage });

// Middleware to serve static files (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to upload documents
app.post('/api/upload-documents', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  res.json({ message: `File uploaded successfully: ${req.file.filename}` });
});






app.post('/api/create-payment-intent', async (req, res) => {
  const { policyNumber } = req.body;

  console.log('Received policy number:', policyNumber); // Log the policy number

  let amount;
  switch (policyNumber) {
      case '1001':
          amount = 20000; // $200
          break;
      case '1002':
          amount = 30000; // $300
          break;
      case '1003':
          amount = 50000; // $500
          break;
      default:
          return res.status(400).send({ error: 'Invalid policy number' });
  }

  try {
      const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
      });

      res.send({ id: paymentIntent.id });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});



app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const text = req.body.text;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // If the file is uploaded successfully, send back the file path and post text
  res.json({
    filePath: `/uploads/${file.filename}`,
    text: text
  });
});





// Backend: server.js (Node.js/Express)
app.post('/api/creates-checkout-session', async (req, res) => {
  const { amount } = req.body;

  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  price_data: {
                      currency: 'usd',
                      product_data: {
                          name: 'Total Order Payment',
                      },
                      unit_amount: amount,
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          success_url: 'http://localhost:3001/success',  // Adjust this URL
          cancel_url: 'http://localhost:3001/cancel',    // Adjust this URL
      });

      res.json({ sessionId: session.id });
  } catch (error) {
      res.status(500).json({ error: 'Failed to create checkout session' });
  }
});





// API endpoint to fetch diet data
app.get('/api/diet', (req, res) => {
  res.json(dietData);
});




//resources
app.get('/resources', (req, res) => {
  res.json(resources);
});







// Start the server
app.listen(3001, '0.0.0.0', () => {
  console.log("Server is Running on port 3001");
});
