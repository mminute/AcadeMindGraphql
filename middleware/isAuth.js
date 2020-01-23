const jwt = require('jsonwebtoken');

module.exports = (req, resp, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1]; // { Authorization: Bearer tokenValueajksflkqewjkrn }

  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    // TODO: put a more secure hash string in nodemon.json
    decodedToken = jwt.verify(token, 'somesupresecretkey');
  } catch (err) {
    throw err;
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};