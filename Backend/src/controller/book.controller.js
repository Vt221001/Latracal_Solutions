import { Book } from "../model/book.Model.js";
import { asyncHandler } from "../utils/wrapAsync.js";
import { ApiResponse } from "../utils/responseHandler.js";

export const createBook = asyncHandler(async (req, res) => {
  const { title, author, description } = req.body;

  if (!title || !author || !description) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Please provide all required fields (title, author, description)"
        )
      );
  }

  const book = await Book.create({
    title,
    author,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, book, "Book created successfully"));
});

export const getBooks = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalBooks = await Book.countDocuments();
  const books = await Book.find()
    .skip((page - 1) * limit)
    .limit(limit);
    
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        books,
        totalBooks,
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
      },
      "Books fetched successfully"
    )
  );
});

export const getBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json(new ApiResponse(404, null, "Book not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book fetched successfully"));
});
