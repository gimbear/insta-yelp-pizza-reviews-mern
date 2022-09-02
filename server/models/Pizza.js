const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const pizzaSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pizzaTitle: {
    type: String,
    required: [true, 'Give your pizza report a cheesy name'],
  },
  body: {
    type: String,
    required: [true, 'Please write more about your pizza experience'],
  },
  images: {
    type: [Object],
  },
  rating: {
    type: Number,
    required: [true, 'Please rate your pizza experience'],
  },
  cost: {
    type: Number,
  },
  location: {
    type: Object,
  },
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;
