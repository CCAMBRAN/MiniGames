const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,   
        minlenghth: 3,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,   
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    experience: {
        type: Number,
        default: 0,
    }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
        this.password = await bcrypt.hash(this.password, 10);
        next(); 
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);