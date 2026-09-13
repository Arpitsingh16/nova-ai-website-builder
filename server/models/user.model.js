import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            unique: true,
            required: true,
        },

        avatar: {
            type: String,
        },

        credits: {
            type: Number,
            default: 200,
            min: 0,
        },

        plan: {
            type: String,
            enum: ["free", "pro", "enterprise"],
            default: "free",
        },

        freeAccessExpiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;