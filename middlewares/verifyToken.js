const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).send({ status: false, message: "Unauthorized - Missing Authorization Header" });
        return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.SECRET_KEY;

    try {
        const decoded = jwt.verify(token, secret);

        req.user = decoded; // Attach the decoded user object to the request for later use

        // Check if the user is an admin (assuming you have a role field in your JWT payload)
        if (decoded.role === 1) {
            next(); // Move to the next middleware or route handler
        } else {
            console.log(decoded.role);
            res.status(403).send({ status: false, message: "Forbidden - Not an Admin" });
        }
    } catch (err) {
        console.error("Error verifying token:", err);
        res.status(401).send({ status: false, message: "Unauthorized - Invalid Token" });
    }
};

module.exports = verifyToken;
