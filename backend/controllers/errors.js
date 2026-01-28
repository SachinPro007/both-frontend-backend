const pageNotFound = (req, res, next) => {
  res.status(404).json({message: "404 Page Not Found"})
}

module.exports = pageNotFound