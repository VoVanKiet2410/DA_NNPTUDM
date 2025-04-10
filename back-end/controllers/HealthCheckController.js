const Healthcheck = require('../schemas/Healthcheck');
const ApiResponse = require('../utils/ApiResponse');

// Add a health check
exports.addHealthCheck = async (req, res) => {
  try {
    const healthCheckData = req.body;
    const healthCheck = new Healthcheck(healthCheckData);
    await healthCheck.save();
    res.status(201).json(new ApiResponse(201, 'Health check added successfully', healthCheck));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error adding health check', error.message));
  }
};

// Get all health checks
exports.getAllHealthChecks = async (req, res) => {
  try {
    const healthChecks = await Healthcheck.find();
    res.status(200).json(new ApiResponse(200, 'Success', healthChecks));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching health checks', error.message));
  }
};