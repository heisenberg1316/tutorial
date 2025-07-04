const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const adminMiddleware = (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // Expected format: "Bearer <token>"
        token = token.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // You can check if the user is truly an admin here using your Admin DB
        // For now, we assume token payload includes an `isAdmin` flag or similar
        if (!decoded.username) {
            return res.status(403).json({ message: "Access denied: Not an admin" });
        }

        next(); // Proceed to next middleware/route
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = adminMiddleware;
