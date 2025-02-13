import { Review } from "../model/review.Model.js";
import { asyncHandler } from "../utils/wrapAsync.js";
import { ApiResponse } from "../utils/responseHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { review, rating, bookId } = req.body;
  const userId = req.user._id;

  if (!review || !rating || !bookId) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Please provide all required fields (review, rating, bookId)"
        )
      );
  }

  const reviewExists = await Review.findOne({
    bookId,
    userId,
  });

  if (reviewExists) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Review already exists"));
  }

  const newReview = await Review.create({
    reviewText: review,
    rating,
    bookId,
    userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newReview, "Review created successfully"));
});

export const getReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const reviews = await Review.find({ bookId }).populate(
    "userId",
    "name email"
  );

  if (!reviews) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Reviews not found"));
  }

  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched"));
});
