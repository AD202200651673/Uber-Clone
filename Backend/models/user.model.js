const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters long']
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
});


userSchema.methods.generateAuthToken = function () {
    const token = jsonwebtoken.sign({ _id: this._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return token;
}

userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jsonwebtoken.sign({ _id: this._id, role: 'user' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
    return refreshToken;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;