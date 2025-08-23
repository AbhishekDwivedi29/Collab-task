const Board = require('../models/Board');
const mongoose = require('mongoose');
const axios = require('axios');

exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let userData;
    try {
      const response = await axios.get(`${process.env.UserAPI_URL}/api/auth/getUser`, {
        params: { userId: userId },
        headers: { "x-internal-key": process.env.secret }
      });
      userData = response.data;
    } catch (error) {
      // console.error("Error fetching user data:", error.message);
      return res.status(500).json({ message: "Failed to fetch user info" });
    }

    const embeddedUser = {
      _id: new mongoose.Types.ObjectId(userId),
      name: userData.name,
      email: userData.email
    };

    const board = await Board.create({
      title,
      createdBy: embeddedUser,
      members: [{ user: embeddedUser, role: "Owner" }]
    });

    try {
      await axios.post(`${process.env.UserAPI_URL}/api/auth/add-board`, {
        userId,
        boardId: board._id
      }, {
        headers: { "x-internal-key": process.env.secret }
      });
    } catch (error) {
      // console.error("Error updating user boardIds:", error.message);
    }
    res.status(201).json(board);
  } catch (err) {
    // console.error("Board creation error:", err.message);
    res.status(500).json({ message: "Board creation failed", error: err.message });
  }
};




exports.inviteUserToBoard = async (req, res) => {

  try {
    const { boardId } = req.params;
    const { userIdToInvite, role } = req.body;
    const userId = req.userId;

    const userServiceURL = `${process.env.UserAPI_URL}/api/auth/getUser`;

    let userInfo;
    try {
      const { data } = await axios.get(userServiceURL, {
        params: {email: userIdToInvite },
        headers: { "x-internal-key": process.env.secret },
      });
      userInfo = data;
    } catch (err) {
      return res.status(404).json({ message: "User not found in User Service" });
    }

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isOwner = board.members.find(
      (m) => m.user._id.toString() === userId.toString() && m.role === "Owner"
    );
    if (!isOwner) return res.status(403).json({ message: "Only owner can invite users" });

    const alreadyAdded = board.members.find(
      (m) => m.user._id.toString() === userIdToInvite.toString()
    );
    if (alreadyAdded) return res.status(400).json({ message: "User already a member" });

    if (board.members.length >= 5) {
      return res.status(400).json({ message: "Board member limit reached" });
    }

    const embeddedUser = {
      user: {
        _id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
      },
      role: role || "Viewer",
    };

    board.members.push(embeddedUser);
    await board.save();
      try {
       await axios.post(`${process.env.UserAPI_URL}/api/auth/add-board`, {
        email: userIdToInvite,
        boardId: boardId
      }, {
        headers: { "x-internal-key": process.env.secret }
      });
    } catch (error) {
      // console.error("Error updating user boardIds:", error.message);
    }
    res.status(200).json({ message: "User invited successfully", board });
  } catch (err) {
    // console.error("Invite error:", err.message);
    res.status(500).json({ message: "Failed to invite user", error: err.message });
  }
};



exports.getMyBoards = async (req, res) => {
  try {
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const boards = await Board.find({ "members.user._id": new mongoose.Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .lean();
    
    res.status(200).json( boards );
  } catch (err) {
    // console.error("Board fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch boards", error: err.message });
  }
};



exports.getBoardMembers = async (req, res) => {
  try {
    const { boardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(boardId).lean();
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

  const members = board.members.map(m => {
  const user = m.user || {};
  return {
    _id: user._id || m._id, 
    name: user.name || 'Unknown',
    email: user.email || 'N/A',
    role: m.role
  };
});

    res.status(200).json( members );
  } catch (err) {
    // console.error("Failed to fetch board members:", err.message);
    res.status(500).json({ message: "Error fetching members", error: err.message });
  }
};


