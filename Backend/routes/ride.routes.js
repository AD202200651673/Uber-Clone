const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');

// POST /api/rides/create
router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().withMessage('Pickup location is required'),
    body('destination').isString().withMessage('Destination is required'),
    body('vehicleType').isString().isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),
    rideController.createRide
);

module.exports = router;