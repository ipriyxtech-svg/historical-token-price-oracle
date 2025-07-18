const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  token: String,
  network: String,
  date: Date,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model('TokenPrice', priceSchema);