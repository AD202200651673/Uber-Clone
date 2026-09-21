const rideModel = require("../models/ride.model");
const mapService = require("../services/maps.service");
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        motorcycle: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        motorcycle: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        motorcycle: 1.5
    };

    const distanceInMeters = distanceTime.distance.value;
    const durationInSeconds = distanceTime.duration.value;

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceInMeters / 1000) * perKmRate.auto) + ((durationInSeconds / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceInMeters / 1000) * perKmRate.car) + ((durationInSeconds / 60) * perMinuteRate.car)),
        motorcycle: Math.round(baseFare.motorcycle + ((distanceInMeters / 1000) * perKmRate.motorcycle) + ((durationInSeconds / 60) * perMinuteRate.motorcycle))
    };

    return fare;
}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => { 
    if(!user || !pickup || !destination || !vehicleType){
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(4),
        fare: fare[vehicleType]
    });
    
    return ride;
};
