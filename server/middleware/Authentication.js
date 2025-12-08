import jwt from "jsonwebtoken"


export const verifyToken = (req, res, next) => {
    const token = req.cookies?.uid;
    const secret = process.env.secret;
    try {
        const userToken = jwt.verify(token, secret);
        req.user = userToken;
        // console.log("Token from cookies:", req.user); // Debugging line
    } catch (error) {
        req.user = null;
    }
    return next();
}




