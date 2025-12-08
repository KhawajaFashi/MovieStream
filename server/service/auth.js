import jwt from "jsonwebtoken";

export function setUser(user) {
    const scret = process.env.secret;
    return jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
    }, scret);
}

export function getUser(token) {
    const scret = process.env.secret;
    return jwt.verify(token, scret);
}