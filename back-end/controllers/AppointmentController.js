const Appointment = require('../schemas/Appointment');
const User = require('../schemas/User');
const Event = require('../schemas/Event');
const Healthcheck = require('../schemas/Healthcheck');
const ApiResponse = require('../utils/ApiResponse'); // Assuming you have a utility for API responses

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('event user healthcheck');
    res.status(200).json(new ApiResponse(200, 'Success', appointments));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching appointments', error.message));
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate('event user healthcheck');
    if (!appointment) {
      return res.status(404).json(new ApiResponse(404, 'Appointment not found'));
    }
    res.status(200).json(new ApiResponse(200, 'Success', appointment));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching appointment', error.message));
  }
};

// Save a new appointment
exports.saveAppointment = async (req, res) => {
  try {
    const { username, eventId } = req.body;
    const healthMetrics = req.body.healthMetrics;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, 'User not found'));
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json(new ApiResponse(404, 'Event not found'));
    }

    const healthcheck = await Healthcheck.create({ healthMetrics });

    const appointment = new Appointment({
      user: user._id,
      event: event._id,
      healthcheck: healthcheck._id,
      appointmentDateTime: new Date(),
      status: 'PENDING',
    });

    await appointment.save();

    res.status(201).json(new ApiResponse(201, 'Appointment saved successfully', appointment));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error saving appointment', error.message));
  }
};

// Get appointments by user
exports.getAppointmentsByUser = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, 'User not found'));
    }

    const appointments = await Appointment.find({ user: user._id }).populate('event healthcheck');
    res.status(200).json(new ApiResponse(200, 'Success', appointments));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching user appointments', error.message));
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json(new ApiResponse(404, 'Appointment not found'));
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(new ApiResponse(200, 'Appointment status updated successfully', appointment));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error updating appointment status', error.message));
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json(new ApiResponse(404, 'Appointment not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Appointment deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error deleting appointment', error.message));
  }
};