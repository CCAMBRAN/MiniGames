const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cards: [{
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
      max: 4
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Deck', deckSchema);