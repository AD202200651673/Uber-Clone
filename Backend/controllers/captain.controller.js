const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require("../models/blacklistToken.model.js");
const jwt = require('jsonwebtoken');

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
});

const getAccessCookieOptions = () => ({
    ...getCookieOptions(),
    maxAge: 15 * 60 * 1000, // 15 minutes
});

const getRefreshCookieOptions = () => ({
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
    });

    const token = captain.generateAuthToken();
    const refreshToken = captain.generateRefreshToken();

    res.cookie("token", token, getAccessCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    res.status(201).json({
        message: "Captain registered successfully",
        token,
        refreshToken,
        captain,
    });
};

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();
    const refreshToken = captain.generateRefreshToken();

    res.cookie('token', token, getAccessCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    res.status(200).json({ token, refreshToken, captain });
};

module.exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        const isBlacklisted = await blacklistTokenModel.findOne({ token: refreshToken });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Refresh token is blacklisted" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        if (decoded.role && decoded.role !== "captain") {
            return res.status(401).json({ message: "Unauthorized: Invalid role" });
        }

        const captain = await captainModel.findById(decoded._id);
        if (!captain) {
            return res.status(401).json({ message: "Captain not found" });
        }

        const token = captain.generateAuthToken();

        res.cookie("token", token, getAccessCookieOptions());
        res.status(200).json({ token, captain });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
    const accessToken = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    try {
        if (accessToken) {
            await blacklistTokenModel.updateOne(
                { token: accessToken },
                { token: accessToken },
                { upsert: true }
            );
        }
        if (refreshToken) {
            await blacklistTokenModel.updateOne(
                { token: refreshToken },
                { token: refreshToken },
                { upsert: true }
            );
        }
    } catch (error) {
        // Blacklist operation fallback
    }

    res.clearCookie("token", getAccessCookieOptions());
    res.clearCookie("refreshToken", getRefreshCookieOptions());

    res.status(200).json({ message: "Captain logged out successfully" });
};