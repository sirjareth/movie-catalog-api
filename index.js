const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();


const app = express( );
app.use(cors());
app.use(express.json());

// Import Routes
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');

// DB Connection
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => {
  console.log('Now connected to MongoDB Atlas')
});

// Use Routes
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

// Server
if(require.main == module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${process.env.PORT || 3000}`);
  })
}

module.exports = { app, mongoose };