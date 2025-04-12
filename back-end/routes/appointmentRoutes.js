const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

router.get('/', AppointmentController.getAllAppointments);
// router.get('/:id', AppointmentController.getAppointmentById);
// router.post('/save', AppointmentController.saveAppointment);
// router.get('/by-user', AppointmentController.getAppointmentsByUser);
// router.put('/status', AppointmentController.updateAppointmentStatus);
// router.delete('/delete/:id', AppointmentController.deleteAppointment);

module.exports = router;