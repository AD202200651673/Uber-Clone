const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');

module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;
    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCordinates = await mapService.getAddressCoordinate(pickup);
        const captainsRadius = await mapService.getCaptainInTheRadius(pickupCordinates.ltd, pickupCordinates.lng, 50);
        console.log(`[Ride] Found ${captainsRadius.length} captain(s) nearby`);
        ride.otp = "";

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        if (captainsRadius && captainsRadius.length > 0) {
            captainsRadius.forEach(captain => {
                if (captain.socketId) {
                    console.log(`[Socket] Emitting new-ride to captain socketId: ${captain.socketId}`);
                    sendMessageToSocketId(captain.socketId, {
                        event: 'new-ride',
                        data: rideWithUser || ride
                    });
                }
            });
        }

    } catch (error) {
        console.error('Error creating ride:', error.message || error);
        if (!res.headersSent) {
            return res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }
}

module.exports.getFare = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;
    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (error) {
        console.error('Error getting fare:', error.message || error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

module.exports.confirmRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (error) {
        console.error('Error accepting ride:', error.message || error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}


module.exports.startRide = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, captain: req.captain, otp });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })
        return res.status(200).json(ride);
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


module.exports.endRide = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { rideId } = req.body;
    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        return res.status(200).json(ride);
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
} 