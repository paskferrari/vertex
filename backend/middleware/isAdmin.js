/**
 * Admin middleware to check if user has admin role
 * Requires authMiddleware to be applied first to set req.user
 */
const isAdmin = (req, res, next) => {
  // Check if user exists (should be set by authMiddleware)
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied'
    });
  }

  // User is admin, proceed to next middleware/route
  next();
};

module.exports = isAdmin;