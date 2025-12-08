import User from "../models/user.js";
import { setUser } from "../service/auth.js";
import { decryptPassword, encryptPassword } from "../utils/HashPassword.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const handleUserSignIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
        return next(new AppError("User not found", 404));
    }

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
    return next(new AppError("User is not Authenticated", 401));
});

export const handleUserSignUp = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    const createdUser = new User({
        username,
        email,
        password
    });

    if (!createdUser) {
        return next(new AppError("Failed to create user", 400));
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
    });
});

export const handleUserInfo = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError("Unauthorized access", 401));
    }
    const userData = await User.findById(userId).select('-password');
    // console.log("Fetched user data for userId", userId, ":", userData); // Debugging line
    return res.status(200).json({
        message: "User data fetched successfully",
        user: userData
    });
});

export const handleUpdatePassword = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
        return next(new AppError("Unauthorized", 401));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const isMatch = await decryptPassword(oldPassword, user.password);
    if (!isMatch) {
        return next(new AppError("Incorrect old password", 400));
    }

    const hashedPassword = await encryptPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
});

export const handleDeleteUser = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError("Unauthorized", 401));
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie("uid");
    return res.status(200).json({ message: "User account deleted successfully" });
});

export const handleUpdateProfilePhoto = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
        return next(new AppError("Unauthorized", 401));
    }

    if (!req.file) {
        return next(new AppError("No file uploaded", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    user.profilePhoto = req.file.path; // Cloudinary URL
    await user.save();

    return res.status(200).json({
        message: "Profile photo updated successfully",
        profilePhoto: user.profilePhoto
    });
});
