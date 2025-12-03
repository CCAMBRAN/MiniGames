const express = require('express');
const router = express.Router();
const Deck = require('../Models/Deck');
const auth = require('../Middleware/middlewareauth');

router.get('/', async (req, res) => {
  try {
    const decks = await Deck.find({ isPublic: true })
      .populate('owner', 'username')
      .populate('cards.card')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: decks.length,
      decks
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.get('/my-decks', auth, async (req, res) => {
  try {
    const decks = await Deck.find({ owner: req.userId })
      .populate('cards.card')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: decks.length,
      decks
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)
      .populate('owner', 'username')
      .populate('cards.card');

    if (!deck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Deck not found' 
      });
    }

    res.json({
      success: true,
      deck
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const deck = new Deck({
      ...req.body,
      owner: req.userId
    });

    await deck.save();
    await deck.populate('cards.card');

    res.status(201).json({
      success: true,
      message: 'Deck created successfully',
      deck
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.post('/:id/cards', auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Deck not found' 
      });
    }

    if (deck.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to modify this deck' 
      });
    }

    const { cardId, quantity = 1 } = req.body;

    const existingCard = deck.cards.find(
      c => c.card.toString() === cardId
    );

    if (existingCard) {
      existingCard.quantity = Math.min(existingCard.quantity + quantity, 4);
    } else {
      deck.cards.push({ card: cardId, quantity });
    }

    await deck.save();
    await deck.populate('cards.card');

    res.json({
      success: true,
      message: 'Card added to deck',
      deck
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.delete('/:id/cards/:cardId', auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Deck not found' 
      });
    }

    if (deck.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to modify this deck' 
      });
    }

    deck.cards = deck.cards.filter(
      c => c.card.toString() !== req.params.cardId
    );

    await deck.save();
    await deck.populate('cards.card');

    res.json({
      success: true,
      message: 'Card removed from deck',
      deck
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Deck not found' 
      });
    }

    if (deck.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this deck' 
      });
    }

    const updatedDeck = await Deck.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('cards.card');

    res.json({
      success: true,
      message: 'Deck updated successfully',
      deck: updatedDeck
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ 
        success: false, 
        message: 'Deck not found' 
      });
    }

    if (deck.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this deck' 
      });
    }

    await Deck.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Deck deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
