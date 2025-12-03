const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection   
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,   
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
});

// Import routes
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const deckRoutes = require('./routes/decks');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/decks', deckRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Game Card API! 🎴' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});