const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jsonwebtoken;
  console.log(token);
  if (token) {
    //decode token & user info
    const user = jwt.verify(token, 'secretkey');
    console.log('user info', user);

    req.user = user;

    next();
  } else {
    res.send('You are not authorised');
  }
};
