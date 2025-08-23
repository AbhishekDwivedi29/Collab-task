const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
  title: { type: String, required: true },
  description: String,
  assignedTo: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String
  },
  comments: [commentSchema],
  history: [String]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);