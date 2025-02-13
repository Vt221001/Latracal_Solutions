import { ApiResponse } from "../utils/responseHandler.js";

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      // return res.status(403).json({ message: 'Access denied' });
      //   return next(new ApiError(403, "Access Denied"));
      return next(new ApiResponse(403, null, "Access Denied"));
    }
    next();
  };
}

export { authorizeRoles };
