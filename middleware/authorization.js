exports.authorization = (roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new Error("You are not authorized to perform this operation");
      }
      next();
    } catch (error) {
      res.send(401, { success: false, message: error.message });
    }
  };
};
