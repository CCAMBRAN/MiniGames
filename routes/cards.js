const express = require('express');
const router = express.Router();
const Card = require('../Models/Card');
const auth = require('../Middleware/middlewareauth');

router.get('/', async (req, res) => {
  try {
    const { rarity, type, search } = req.query;
    let query = {};

    if (rarity) query.rarity = rarity;
    
    if (type) query.type = type;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const cards = await Card.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cards.length,
      cards
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
    const card = await Card.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: 'Card not found' 
      });
    }

    res.json({
      success: true,
      card
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
    const card = new Card({
      ...req.body,
      createdBy: req.userId
    });

    await card.save();
    await card.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      card
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
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: 'Card not found' 
      });
    }

    if (card.createdBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this card' 
      });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Card updated successfully',
      card: updatedCard
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
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: 'Card not found' 
      });
    }

    if (card.createdBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this card' 
      });
    }

    await Card.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Card deleted successfully'
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
