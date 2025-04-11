var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require("cors");

const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const newsRoutes = require('./routes/newsRoutes');
const faqRoutes = require('./routes/faqRoutes');
const eventRoutes = require('./routes/eventRoutes');
const donationUnitRoutes = require('./routes/donationUnitRoutes');
const bloodInventoryRoutes = require('./routes/bloodInventoryRoutes');
const healthCheckRoutes = require('./routes/healthCheckRoutes');

var app = express();

mongoose.connect('mongodb://localhost:27017/DemoHM');
mongoose.connection.on('connected',()=>{
  console.log('connected');
})

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/appointments', appointmentRoutes);
app.use('/users', usersRouter);
app.use('/api/users', userRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donation-units', donationUnitRoutes);
app.use('/api/blood-inventories', bloodInventoryRoutes);
app.use('/api/health-checks', healthCheckRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
module.exports = app;
