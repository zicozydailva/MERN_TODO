import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
  showStats,
  getCategories,
  allTodos,
} from "../controllers/todosController.js";



router.route("/").post(createTodo).get(authenticateUser, getAllTodos);
router.route("/category").get(getCategories);
// admin
router.route("/allTodos").get(allTodos);
// remember about :id
router.route("/stats").get(showStats);
router.route("/:id").delete(deleteTodo).patch(updateTodo);

export default router;
