import express from "express";
import { createReview, getReviews } from "../controller/review.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/book-review", authenticateToken, createReview);
router.get("/get-book-reviews/:bookId", getReviews);

export { router as reviewRouter };
