const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'Full name must be at least 3 characters long'],
        },
        lastName: {
            type: String,
            minlength: [3, 'Full name must be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        select: false,
    },

    socketId: {
        type: String,
        default: null,
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Vehicle color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Vehicle plate must be at least 3 characters long'],
        },

        capacity: {
            type: Number,
            required: true,
            min: [1, 'Vehicle capacity must be at least 1'],
        },

        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
        }
    },

    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
});


captainSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken.sign({ _id: this._id, role: 'captain' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return token;
}

captainSchema.methods.generateRefreshToken = function () {
    const refreshToken = jsonwebtoken.sign({ _id: this._id, role: 'captain' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
    return refreshToken;
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('Captain', captainSchema);

module.exports = captainModel;
