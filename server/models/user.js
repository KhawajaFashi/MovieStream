import mongoose from "mongoose";
import { encryptPassword } from "../utils/HashPassword.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures no two users have the same username
        trim: true, // Removes leading/trailing whitespace
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address'] // Pattern matching
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Limits the role to specific values
        default: 'user'
    },
    profilePhoto: {
        type: String,
        default: ''
    }
}, { timestamps: true });




userSchema.pre('save', async function () {
    const user = this;
    if (!user.isModified("password"))
        return;

    const hashedPassword = await encryptPassword(user.password);

    user.password = hashedPassword;
})


const User = mongoose.model('User', userSchema);
export default User;