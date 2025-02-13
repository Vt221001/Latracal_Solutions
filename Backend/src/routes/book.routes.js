import express from "express";
import {
  createBook,
  getBook,
  getBooks,
} from "../controller/book.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.post(
  "/book-register",
  authenticateToken,
  authorizeRoles("admin"),
  createBook
);
router.get("/get-all-books", authenticateToken, getBooks);
router.get("/get-book/:bookId", authenticateToken, getBook);

export { router as bookRouter };
