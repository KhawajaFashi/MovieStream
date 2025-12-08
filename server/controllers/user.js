import User from "../models/user.js";
import { setUser } from "../service/auth.js";
import { decryptPassword, encryptPassword } from "../utils/HashPassword.js";

export const handleUserSignIn = async (req, res) => {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
        return res.status(404).json({
            message: "User not found",
            found: false
        });
    }

    // console.log("User Data:", userData); // Debugging line

    const hashedPassword = userData.password;

    const isPasswordMatch = await decryptPassword(password, hashedPassword);

    if (isPasswordMatch) {
        const token = setUser(userData);
        res.cookie("uid", token, {
            httpOnly: true,
            samesite: 'Lax',
            secure: true
        });
        return res.status(200).json({
            message: "User is Authenticated",
            found: true
        });
    }
    return res.status(404).json({
        message: "User is not Authenticated",
        found: false
    })

}
export const handleUserSignUp = async (req, res) => {
    const { username, email, password } = req.body;

    const createdUser = new User({
        username,
        email,
        password
    });

    // console.log("Created User:", createdUser); // Debugging line

    if (!createdUser) {
        return res.status(400).json({
            message: "Failed to create user"
        });
    }

    await createdUser.save();

    const token = setUser(createdUser);

    res.cookie("uid", token, {
        httpOnly: true,
        samesite: 'Lax',
        secure: true
    });
    return res.status(200).json({
        message: "User is has been successfully created",
        User: createdUser
    })
}


export const handleUserInfo = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized access",
            user: null
        });
    }
    const userData = await User.findById(userId).select('-password');
    // console.log("Fetched user data for userId", userId, ":", userData); // Debugging line
    return res.status(200).json({
        message: "User data fetched successfully",
        user: userData
    });
}

export const handleUpdatePassword = async (req, res) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await decryptPassword(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await encryptPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const handleDeleteUser = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        await User.findByIdAndDelete(userId);
        res.clearCookie("uid");
        return res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}