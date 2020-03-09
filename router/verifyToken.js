const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{

    const token = req.cookies.jsonwebtoken;
    console.log(token);
if(token) {
    //decode token
    jwt.verify(token, "secretkey")
    console.log("unser info", user);

    req = user;

    next();
}


    //res.cookies.jsonwebtoken
    // kollar om användaren har cookies
    //jwt verifierings metod för att kolla om det är en valid cookies
    // valideringsdata till server
    // next()
}