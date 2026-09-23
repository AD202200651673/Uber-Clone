const userModel = require("../models/user.model.js");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model.js");
const jwt = require("jsonwebtoken");

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

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashedPassword,
    });

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    res.cookie("token", token, getAccessCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    res.status(201).json({
        message: "User registered successfully",
        user,
        token,
        refreshToken,
    });
};

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    res.cookie("token", token, getAccessCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

    res.status(200).json({ token, refreshToken, user });
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

        if (decoded.role && decoded.role !== "user") {
            return res.status(401).json({ message: "Unauthorized: Invalid role" });
        }

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const token = user.generateAuthToken();

        res.cookie("token", token, getAccessCookieOptions());
        res.status(200).json({ token, user });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res, next) => {
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

    res.status(200).json({ message: "User logged out successfully" });
};