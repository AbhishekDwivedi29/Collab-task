const Task = require('../models/Task');
const Column = require('../models/Column');
const { userSockets } = require('../socket');

exports.createTask = async (req, res) => {
  try {
    const { boardId, columnId, title, description, assignedTo } = req.body;
  
     const io = req.io;

    const task = await Task.create({ boardId, columnId, title, description, assignedTo });

    await Column.findByIdAndUpdate(columnId, { $push: { tasks: task._id } });

    io.to(boardId).emit('taskcreated', { task  });

    res.status(201).json(task);
  } catch (err) {
    // console.error("Task creation error:", err.message);
    res.status(500).json({ message: "Task creation failed", error: err.message });
  }
};


exports.moveTask = async (req, res) => {
  try {
    const { taskId, newColumnId } = req.body;
    
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const boardId =task.boardId; 
  
    const oldColumnId = task.columnId;

    task.columnId = newColumnId;
    await task.save();


    await Column.findByIdAndUpdate(oldColumnId, { $pull: { tasks: task._id } });
  
    await Column.findByIdAndUpdate(newColumnId, { $push: { tasks: task._id } });

    res.status(200).json({ message: "Task moved", task });
  } catch (err) {
    // console.error("Error moving task:", err);
    res.status(500).json({ message: "Task move failed", error: err.message });
  }
};



exports.addComment = async (req, res) => {
  try {
    
    const { taskId } = req.params;
    const { message ,user } = req.body;
  
    const comment = {
      user: { name:user},
      message,
      timestamp: new Date()
    };

    const task = await Task.findByIdAndUpdate(  taskId,
  { $push: { comments: comment } },
  { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task.comments);
  } catch (err) {
    // console.error("Error adding comment:", err);
    res.status(500).json({ message: "Add comment failed", error: err.message });
  }
};










