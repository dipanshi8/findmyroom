const mongoose = require('mongoose');
const Owner = require('../models/Owner');
const path = require('path');

const ownerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Make sure you have a User model
        required: true
    },
    fullName: String,
    dob: Date,
    gender: String,
    email: String,
    mobile: String,
    profilePic: String,
    govtIdProof: String,
    property: {
        propertyName: String,
        propertyAddress: String,
        city: String,
        state: String,
        pinCode: String,
        propertyImages: [String]
    },
    bankDetails: {
        accountHolderName: String,
        bankName: String,
        accountNumber: String,
        ifsc: String
    }
});

const newOwner = new Owner({
    user: req.user._id,  // 👈 This links the owner to the logged-in user
    fullName,
    dob,
    gender,
    email,
    mobile,
    profilePic: profilePicPath,
    govtIdProof: govtIdPath,
    property: {
        propertyName,
        propertyAddress,
        city,
        state,
        pinCode,
        propertyImages: propertyImagePaths
    },
    bankDetails: {
        accountHolderName,
        bankName,
        accountNumber,
        ifsc
    }
});


module.exports = mongoose.model('Owner', ownerSchema);
