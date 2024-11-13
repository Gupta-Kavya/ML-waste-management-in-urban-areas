const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect to MongoDB
mongoose.connect('mongodb+srv://kavyaguptajpr2410:Kavya%40123@kavyacluster.ux8ms.mongodb.net/?retryWrites=true&w=majority&appName=kavyacluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define User schema and model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Define Wallet schema and model
const walletSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, default: 0 },  // Default amount is 0
});

const Wallet = mongoose.model('Wallet', walletSchema);

// Define Photo schema and model
const photoSchema = new mongoose.Schema({
  photoId: String,
  filePath: String,
  email: String,
  lat: Number,
  long: Number,
});
const Photo = mongoose.model('Photo', photoSchema);

// Define Trader schema and model
const traderSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Trader = mongoose.model('Trader', traderSchema);

const traderOrderSchema = new mongoose.Schema({
  traderName: { type: String, required: true },
  traderEmail: { type: String, required: true },
  userEmail: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  orderStatus: { type: String, default: 'open' },
  orderPrice: { type: Number, required: true }, // New field for order price
  photoUrl: { type: String, required: true },
  lng: { type: Number, required: true },
  lat: { type: Number, required: true },
});

const TraderOrder = mongoose.model('TraderOrder', traderOrderSchema);


// Configure multer for file storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(8).toString('hex'); // Generate a random name
    const extension = path.extname(file.originalname);
    cb(null, randomName + extension);
  },
});
const upload = multer({ storage: storage });

// Make the uploads folder publicly accessible
app.use('/uploads', express.static('uploads'));

// Photo upload route
app.post('/upload', upload.single('photo'), async (req, res) => {
  const { email, latitude, longitude } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const photoId = req.file.filename;
  const filePath = `/uploads/${photoId}`;

  try {
    // Save photo details to MongoDB with latitude and longitude as numbers
    const photo = new Photo({
      photoId,
      filePath,
      email,
      lat: parseFloat(latitude),
      long: parseFloat(longitude),
    });
    await photo.save();
    console.log('Photo saved successfully');

    res.status(200).json({ message: 'Photo uploaded successfully', photoId });
  } catch (error) {
    console.error('Error saving photo to database:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trader data submission route
app.post('/trader', async (req, res) => {
  try {
    const { companyName, email, phone, pricePerKg, latitude, longitude } = req.body;

    // Check if a trader with the same email already exists
    const existingTrader = await Trader.findOne({ email });
    if (existingTrader) {
      return res.status(400).json({ message: 'Trader with this email already exists' });
    }

    // Create and save a new trader
    const trader = new Trader({
      companyName,
      email,
      phone,
      pricePerKg,
      latitude,
      longitude,
    });
    await trader.save();

    res.status(201).json({ message: 'Trader details saved successfully!' });
  } catch (error) {
    console.error('Error saving trader details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch trader details route
app.get('/traders', async (req, res) => {
  try {
    const traders = await Trader.find(); // Retrieve all traders from the database
    res.status(200).json(traders); // Send the data back as JSON
  } catch (error) {
    console.error('Error fetching trader details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Updated route for choosing a trader and creating an order with orderPrice
app.post('/choose-trader', async (req, res) => {
  try {
    const { traderName, traderEmail, userEmail, orderPrice, photoUrl, lng , lat } = req.body;

    // Check if the trader exists
    const trader = await Trader.findOne({ email: traderEmail });
    if (!trader) {
      return res.status(400).json({ message: 'Trader not found' });
    }

    // Create a new order entry in TraderOrder collection
    const traderOrder = new TraderOrder({
      traderName,
      traderEmail,
      userEmail,
      orderPrice,
      photoUrl,
      lng,
      lat
    });
    await traderOrder.save();

    res.status(201).json({ message: 'Trader order created successfully!' });
  } catch (error) {
    console.error('Error creating trader order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// API to fetch wallet amount by email
app.get('/wallet/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find the wallet by email
    const wallet = await Wallet.findOne({ email });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for this email' });
    }

    // Return the wallet amount
    res.status(200).json({ email: wallet.email, amount: wallet.amount });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// API to update wallet amount
app.post('/update-wallet', async (req, res) => {
  try {
    const { email, amount } = req.body;

    // Validate input
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Find wallet by email
    let wallet = await Wallet.findOne({ email });

    if (!wallet) {
      // If wallet does not exist, create a new wallet with the initial amount
      wallet = new Wallet({ email, amount });
      await wallet.save();
      return res.status(201).json({ message: 'Wallet created successfully', wallet });
    }

    // If wallet exists, update the amount
    wallet.amount += amount;
    await wallet.save();

    res.status(200).json({ message: 'Wallet updated successfully', wallet });
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// API to fetch trade orders by user email
app.get('/trade-orders/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find all trade orders associated with the user email
    const orders = await TraderOrder.find({ traderEmail: email });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No trade orders found for this email' });
    }

    // Return the trade orders
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching trade orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get('/history/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find all trade orders associated with the user email
    const orders = await TraderOrder.find({ userEmail: email });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No trade orders found for this email' });
    }

    // Return the trade orders
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching trade orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/close-order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Update the order status to "closed"
    const updatedOrder = await TraderOrder.findByIdAndUpdate(
      orderId,
      { orderStatus: 'closed' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order closed successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error closing order:', error);
    res.status(500).json({ message: 'Failed to close order' });
  }
});



app.post('/confirm-order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Update the order status to "confirmed"
    const updatedOrder = await TraderOrder.findByIdAndUpdate(
      orderId,
      { orderStatus: 'confirmed' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order confirmed successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ message: 'Failed to confirm order' });
  }
});




// Fetch photo by photoId
app.get('/photo/:photoId', async (req, res) => {
  const { photoId } = req.params;

  try {
    // Find photo by photoId
    const photo = await Photo.findOne({ photoId });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Respond with photo details
    res.json({ imageUrl: `http://localhost:8000${photo.filePath}` });
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Start the server
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
