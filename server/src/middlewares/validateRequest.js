const { validationResult } = require("express-validator");

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};


// exports.handleValidationError = (res, error, customMessage) => {
//   if (error.name === "ValidationError") {
//     const errors = Object.values(error.errors).map(err => err.message);
//     return res.status(400).json({ success: false, message: customMessage || "Validation error", errors });
//   }
//   res.status(500).json({ success: false, message: customMessage || "Server error", error: error.message });
// };