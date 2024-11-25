
import jwt from "jsonwebtoken";

export const validateToken = (req, res) => {
    const secret = process.env.ACCESS_TOKEN_SECRET; // Ensure to set this in your environment variables
    const token = req.body;
    try {
        const decoded = jwt.verify(token, secret); // Validate the token
        console.log("a")
        return res.status(200); // If valid, return the decoded token
    } catch (error) {
        return res.status(210);
    }
};
