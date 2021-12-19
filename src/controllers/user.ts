import { NextFunction, Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import userService from "../services/userService";
import ApiError from "../error/apiError";

const NAMESPACE = "User";

////////////////////////////////////////////////////////////////////////////////
// Register new user and store him to the database
////////////////////////////////////////////////////////////////////////////////
const register = async (req: Request, res: Response, next: NextFunction) => {

    const { username, password } = await req.body;

    // Hash users password
    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            throw ApiError.internalServerError(hashError.message);
        }
        // Create new user with hashed password
        userService.createUser(username, hash).then((user) => {
            if (user) {
                return res.json({
                    message: "User registered"
                })
            }
        }).catch((err) => {
            next(err);
        })
    })
};

/////////////////////////////////////////////////////////////////
// Login existed user and get token
/////////////////////////////////////////////////////////////////
const login = async (req: Request, res: Response) => {
    const { username, password } = await req.body;

    await userService.loginUser(username, password).then((token) => {
        return res.json({
            message: "User logged in",
            token: token
        })
    }).catch((err) => {
        throw err;
    })
};

export default { register, login };
