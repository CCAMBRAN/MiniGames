const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x400',
    },
    rarity: {
        type: String,
        enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
        default: 'common',
    },
    type: {
        type: String,
        enum: ['creature', 'spell', 'artifact', 'enchantment'],
        required: true,
    },
    attack: {
        type: Number,
        default: 0,
        min: 0,
    },
    defense: {
        type: Number,
        default: 0,
        min: 0,
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
    },
    abilities: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);