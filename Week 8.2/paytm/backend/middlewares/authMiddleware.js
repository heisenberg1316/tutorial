require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message : "Bearer should present or token is not valid",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next(); 
    } catch (e) {
        return res.status(403).json({
            message : "Invalid token",
            error : e
        });
    }
}

module.exports = authMiddleware