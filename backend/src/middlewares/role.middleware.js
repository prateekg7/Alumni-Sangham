export const roleGuard = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  return next();
};
