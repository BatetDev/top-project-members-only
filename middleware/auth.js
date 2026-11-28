// Lets the request through only if the user is logged in
exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // logged in: continue to the route handler
  }
  res.redirect('/log-in'); // not logged in: send them to log in
};

// Lets the request through only if the user is an admin
exports.ensureAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    return next();
  }
  res.status(403).send('Forbidden');
};
