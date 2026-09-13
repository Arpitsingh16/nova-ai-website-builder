import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token

        // For deployed frontend/backend setups, also accept
        // the JWT from the Authorization header.
        if (!token) {
            const authHeader = req.headers.authorization

            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1]
            }
        }

        if (!token) {
            return res.status(401).json({
                message: "token not found"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                message: "user not found"
            })
        }

        req.user = user

        next()
    } catch (error) {
        return res.status(401).json({
            message: "invalid token"
        })
    }
}

export default isAuth