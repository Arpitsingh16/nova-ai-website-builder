import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "email is required",
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar,
                credits: 200,
                plan: "free",
                freeAccessExpiresAt: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                ),
            });
        } else {
            // Migrate old free accounts from the previous credit system.
            if (user.plan === "free" && user.credits > 200) {
                user.credits = 200;
                user.freeAccessExpiresAt = new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                );

                await user.save();
            }
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // Keep the cookie authentication working.
        res.cookie("token", token, cookieOptions);

        // Also return the token so the deployed frontend
        // can explicitly authenticate API requests.
        return res.status(200).json({
            user,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: `google auth error ${error}`,
        });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        return res.status(200).json({
            message: "log out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: `log out error ${error}`,
        });
    }
};