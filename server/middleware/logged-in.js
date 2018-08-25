module.exports = function loggedIn (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next('You must be logged in to view this page.')
  }
}
