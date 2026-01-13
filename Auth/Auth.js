const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        console.log("token: ",token);
        
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticate };
