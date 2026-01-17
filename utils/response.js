/* =========================================================
   SEJ AYURVEDA – RESPONSE UTILS
   Standard API response helpers
========================================================= */

/**
 * Success response
 * @param {object} res - Express response
 * @param {string} message - success message
 * @param {any} data - optional data
 * @param {number} statusCode - HTTP status
 */
export function successResponse(
  res,
  message = "Success",
  data = null,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Error response
 * @param {object} res - Express response
 * @param {string} message - error message
 * @param {number} statusCode - HTTP status
 * @param {any} error - optional error info (for logging)
 */
export function errorResponse(
  res,
  message = "Something went wrong",
  statusCode = 500,
  error = null
) {
  if (error) {
    console.error("❌ API Error:", error.message || error);
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
}
