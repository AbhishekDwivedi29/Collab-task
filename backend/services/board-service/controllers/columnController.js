const Column = require('../models/Column');
const Board = require('../models/Board');
const { userSockets } = require('../socket');

exports.createColumn = async (req, res) => {
  try {
    const { boardId, title, order } = req.body;
    const io = req.io;

    const column = await Column.create({ boardId, title, order });

    await Board.findByIdAndUpdate(boardId, { $push: { columns: column._id } });

    io.to(boardId).emit('columncreated', column);
    res.status(201).json(column);
  } catch (err) {
    // console.error("Column creation error:", err.message);
    res.status(500).json({ message: "Column creation failed", error: err.message });
  }
};


exports.getColumns = async (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = await Column.find({ boardId }).sort({ order: 1 }).populate('tasks');
    
    res.json(columns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch columns", error: err.message });
  }
};