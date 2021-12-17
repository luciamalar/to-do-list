import { NextFunction, Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import userService from "../services/userService";
import ApiError from "../error/apiError";

const NAMESPACE = "User";

//register new user and store him to the database
const register = async (req: Request, res: Response, next: NextFunction) => {

    let { username, password } = await req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            throw ApiError.internalServerError(hashError.message);
        }
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

//login existed user and get the token
const login = async (req: Request, res: Response) => {
    let { username, password } = await req.body;

    await userService.loginUser(username, password).then((token) => {
        return res.json({
            message: "User logged in",
            token: token
        })
    }).catch((err) => {
        throw err;
    })
};

//get each user from the database and not show their passwords
const getAllUsers = async (req: Request, res: Response) => {
    await userService.getAllUsers().then((users) => {
        return res.json({
            message: "Users found",
            users: users
        })
    }).catch((err) => {
        throw err;
    })
};

export default { register, login, getAllUsers };
