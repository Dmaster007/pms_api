const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default:false,
    }
}, { collection: 'users' });  // Explicitly set the collection name

const User = mongoose.model('User', UserSchema);
module.exports = User;
