const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    _id: mongoose.Schema.Types.ObjectId, 
    name: String,
    email: String
  },
  role: {
    type: String,
    enum: ['Owner', 'Editor', 'Viewer'],
    default: 'Viewer'
  }
});

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String
  },
  members: [memberSchema],
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }]
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);