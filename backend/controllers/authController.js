import User from "../models/User.js";
import jwt from "jsonwebtoken";

//generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h"});
}

//Register User
export const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body || {}; // Provide a default empty object if req.body is undefined

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" }); // Added return to prevent further execution
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        fullName,
        email,
        password,
        profileImageUrl,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

//Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

//GetUser User
export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
        });
    } catch (error) {
        res.status(500).json({ message: "Error getting user info", error: error.message });
    }

    // const { _id, fullName, email } = req.user;
    // res.status(200).json({
    //     _id,
    //     fullName,
    //     email,
    //     profileImageUrl,
    // });
};