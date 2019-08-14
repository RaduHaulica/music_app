const mongoose = require('mongoose');

// JSON schemas
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

// exported API