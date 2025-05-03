const mongoose = require('mongoose');

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
}, { timestamps: true });  // Optional: Adds createdAt and updatedAt fields

module.exports = mongoose.model('Owner', ownerSchema);
