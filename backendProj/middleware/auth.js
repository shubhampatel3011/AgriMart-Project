const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    try{
        const token = req.headers.authorization;

        if(!token){
            return res.status(401).json({error: "Access denied. No token."});
        }

const actualToken = token.split(" ")[1];

const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

req.user = decoded; //attach user data
next();
    }

    catch(error){
        res.status(401).json({error: "invalid token"});
    }
};