const adminMiddleware = (req, res, next) => {
  const query = req.query.admin;

  if (query === undefined) {
    return res.status(400).json("only admin");
  }

  if(String(query).toLowerCase() !== 'true'){
    return res.status(400).json("403 - only admin");
  }

  next();
};

module.exports = adminMiddleware;
