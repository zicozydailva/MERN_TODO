import Todo from "../models/Todo.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

// CREATE A TODO
const createTodo = async (req, res) => {
  const { title, message, category } = req.body;

  if (!title || !message || !category) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdBy = req.user.userId;
  const todo = await Todo.create(req.body);
  res.status(StatusCodes.CREATED).json({ todo });
};

// GET ALL TODOS
const getAllTodos = async (req, res) => {
  const { status, category, search, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  // add stuff based on condition
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (category && category !== "all") {
    queryObject.category = category;
  }

  if (search) {
    queryObject.title = { $regex: search, $options: 'i' };
  }

  
  let result = Todo.find(queryObject);

  // chain sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("title");
  }

  if (sort === "z-a") {
    result = result.sort("-title");
  }

  const limit = Number(req.query.limit) || 100
  result = result.limit(limit)

  const todos = await result;

  const totalTodos = await Todo.countDocuments(queryObject);
  res.status(StatusCodes.OK).json({ todos, totalTodos });

  // checkPermissions(req.user, todo.createdBy)
  // const todos = await Todo.find({createdBy: req.user.userId}).sort('-createdAt')
};

const allTodos = async (req, res) => {
  const todos = await Todo.find({}).sort("-createdAt");
  const user = await User.findOne({ _id: req.user.userId });
  console.log(user.role);
  res.status(StatusCodes.OK).json({ todos });
};

const getCategories = async (req, res) => {
  const todos = await Todo.find({ createdBy: req.user.userId });
  const categories = todos.map((todo) => todo.category);
  res.status(StatusCodes.OK).json({ categories });
};

const updateTodo = async (req, res) => {
  const { id: todoId } = req.params;
  const { title, message, category } = req.body;

  if (!message || !title || !category) {
    throw new BadRequestError("Please provide all values");
  }
  const todo = await Todo.findOne({ _id: todoId });

  if (!todo) {
    throw new NotFoundError(`No Todo with id :${todoId}`);
  }
  // check permissions

  checkPermissions(req.user, todo.createdBy);

  const updatedTodo = await Todo.findOneAndUpdate({ _id: todoId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedTodo });
};

const deleteTodo = async (req, res) => {
  const { id: todoId } = req.params;

  const todo = await Todo.findOne({ _id: todoId });

  if (!todo) {
    throw new NotFoundError(`No todo with id :${todoId}`);
  }

  checkPermissions(req.user, todo.createdBy);

  await todo.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Todo removed" });
};

const showStats = async (req, res) => {
  let stats = await Todo.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    scheduled: stats.scheduled || 0,
    done: stats.done || 0,
  };

  let monthlyApplications = await Todo.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
  showStats,
  getCategories,
  allTodos,
};
