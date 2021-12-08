import { NextFunction, Request, Response } from "express";
import logging from '../utils/logging';
import bcryptjs from 'bcryptjs';
import userService from "../services/userService";
import ApiError from "../error/apiError";

const NAMESPACE = "User";

//register new user and store him to the database
const register = async (req: Request, res: Response, next: NextFunction) => {

    let { username, password } = await req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            next(ApiError.internalServerError(hashError));
            return;
        }
        userService.createUser(username, hash).then((user) => {
            if (user) {
                logging.info(NAMESPACE, "User registered", user);
                return res.json({
                    message: "User registered",
                    user: user
                })
            }
        }).catch((err) => {
            next(err);
            return;
        });
    })
};

//login existed user and get the token
const login = async (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = await req.body;

    await userService.loginUser(username, password).then((token) => {
        return res.json({
            message: "User logged in",
            token: token
        })
    }).catch((err) => {
        next(err);
        return;
    });
};

//get each user from the database and not show their passwords
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    userService.getAllUsers().then((users) => {
        logging.info(NAMESPACE, "Users found", users);
        return res.json({
            message: "Users found",
            users: users
        })
    }).catch((err) => {
        next(err);
    });
};

export default { register, login, getAllUsers };
