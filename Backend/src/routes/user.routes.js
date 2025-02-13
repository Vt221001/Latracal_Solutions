import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  userLogin,
} from "../controller/user.Controllers.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.post("/user-register", createUser);
router.get(
  "/get-all-user",
  authenticateToken,
  authorizeRoles("admin"),
  getUsers
);
router.get(
  "/get-user/:userId",
  authenticateToken,
  authorizeRoles("admin"),
  getUser
);
router.put(
  "/update-user/:userId",
  authenticateToken,
  authorizeRoles("admin"),
  updateUser
);
router.post("/user-login", userLogin);

export { router as userRouter };
