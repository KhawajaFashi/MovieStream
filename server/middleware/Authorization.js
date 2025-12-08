export async function restrictAccessUser(req, res, next) {
    const role = req.user?.role;

    if (!req.user)
        return res.status(401).json({
            message: "You need to be an admin to access this route",
            routeAccess: false
        });

    if (role === "user")
        return res.status(401).json({
            message: "User does not have access to this route",
            routeAccess: false
        });
    return next();
}

export async function restrictAccessAdmin(req, res, next) {
    const role = req.user?.role;

    if (!req.user)
        return res.status(401).json({
            message: "You need to be a user to access this route",
            routeAccess: false
        });

    if (role === "admin")
        return res.status(401).json({
            message: "Admin does not have access to this route",
            routeAccess: false
        });
    return next();
}


export async function restrictAccessLoggedInUser(req, res, next) {
    const user = req.user;

    if (!user)
        return res.status(401).json({
            message: "You need to be logged in to access this route",
            routeAccess: false
        })
    return next();
}