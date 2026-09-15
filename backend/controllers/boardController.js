import Board from "../models/Board.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { notifyUser } from "../socket/socketHandler.js";
import { sendTaskAssignedEmail } from "../utils/mailer.js";

const MEMBER_FIELDS = "name email avatarColor";
const TASK_POPULATE = [
  { path: "members", select: MEMBER_FIELDS },
  { path: "owner", select: MEMBER_FIELDS },
  { path: "tasks.assignee", select: MEMBER_FIELDS },
];

export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Board name is required" });
    const board = await Board.create({ name, owner: req.user._id, members: [req.user._id] });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user._id }).sort({ updatedAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, members: req.user._id }).populate(TASK_POPULATE);
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const board = await Board.findOne({ _id: req.params.id, members: req.user._id });
    if (!board) return res.status(404).json({ message: "Board not found" });

    const invitee = await User.findOne({ email: email.toLowerCase().trim() });
    if (!invitee) {
      return res.status(404).json({ message: "No FlowBoard account found with that email" });
    }
    if (board.members.some((m) => m.toString() === invitee._id.toString())) {
      return res.status(409).json({ message: "This person is already on the board" });
    }

    board.members.push(invitee._id);
    await board.save();
    const populated = await board.populate(TASK_POPULATE);

    const io = req.app.get("io");
    io.to(board._id.toString()).emit("board:updated", populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
    if (!board) return res.status(404).json({ message: "Board not found, or you're not the owner" });

    const { userId } = req.params;
    if (userId === board.owner.toString()) {
      return res.status(400).json({ message: "The board owner can't be removed" });
    }

    board.members = board.members.filter((m) => m.toString() !== userId);
    await board.save();
    const populated = await board.populate(TASK_POPULATE);

    const io = req.app.get("io");
    io.to(board._id.toString()).emit("board:updated", populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const populateBoard = (board) => board.populate(TASK_POPULATE);

export const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });
    const board = await Board.findOne({ _id: req.params.id, members: req.user._id });
    if (!board) return res.status(404).json({ message: "Board not found" });

    board.tasks.push({ title, description, createdBy: req.user._id, order: board.tasks.length });
    await board.save();
    const populated = await populateBoard(board);

    const io = req.app.get("io");
    io.to(board._id.toString()).emit("board:updated", populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, order, title, description, assigneeId } = req.body;
    const board = await Board.findOne({ _id: req.params.id, members: req.user._id });
    if (!board) return res.status(404).json({ message: "Board not found" });

    const task = board.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (status) task.status = status;
    if (order !== undefined) task.order = order;
    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ message: "Task title can't be empty" });
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description;

    let newlyAssignedTo = null;
    if (assigneeId !== undefined) {
      if (!assigneeId) {
        task.assignee = null;
      } else {
        if (!board.members.some((m) => m.toString() === assigneeId)) {
          return res.status(400).json({ message: "Assignee must be a board member" });
        }
        const previousAssignee = task.assignee?.toString();
        task.assignee = assigneeId;
        if (assigneeId !== previousAssignee && assigneeId !== req.user._id.toString()) {
          newlyAssignedTo = assigneeId;
        }
      }
    }

    await board.save();
    const populated = await populateBoard(board);

    const io = req.app.get("io");
    io.to(board._id.toString()).emit("board:updated", populated);

    if (newlyAssignedTo) {
      const assignee = await User.findById(newlyAssignedTo);
      if (assignee) {
        const notification = await Notification.create({
          recipient: assignee._id,
          type: "task_assigned",
          message: `${req.user.name} assigned you "${task.title}" on ${board.name}`,
          board: board._id,
          taskId: task._id,
        });
        notifyUser(io, assignee._id.toString(), notification);
        sendTaskAssignedEmail({
          to: assignee.email,
          assigneeName: assignee.name,
          taskTitle: task.title,
          boardName: board.name,
          boardId: board._id.toString(),
        });
      }
    }

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const board = await Board.findOne({ _id: req.params.id, members: req.user._id });
    if (!board) return res.status(404).json({ message: "Board not found" });

    board.tasks.id(taskId)?.deleteOne();
    await board.save();
    const populated = await populateBoard(board);

    const io = req.app.get("io");
    io.to(board._id.toString()).emit("board:updated", populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
