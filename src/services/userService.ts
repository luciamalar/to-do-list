import { Request, Response, NextFunction } from "express";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity/User";
import bcryptjs from 'bcryptjs'
import signJWT from "../utils/signJWT";
import ApiError from "../error/apiError";

const NAMESPACE = "User";

const createUser = async (username: string, password: string) => {

    const userRepo = getRepository(User);
    let user = userRepo.create({ username, password });
    await userRepo.save(user).then((user1) => user = user1).catch((err) => {
        throw ApiError.internalServerError(err.message);
    });
    return user;
}

const loginUser = async (username: string, password: string) => {
    const userRepo = getRepository(User);
    let user: User;
    let token;
    await userRepo
        .findOne({ where: { username } })
        .then((user1) => {
            user = user1;
        })
        .catch((err) => {
            throw ApiError.badRequest(err.message);
        });

    await bcryptjs.compare(password, user.password).then((result) => {
        if (result) {
            signJWT(user).then((token1) => {
                if (token1) {
                    token = token1;
                }
            });
        } else {
            throw ApiError.badRequest("Incorrect password");
        }
    }).catch((err) => {
        throw err;
    });

    return token;
}

const getUserId = async (username: string) => {
    const userRepo = getRepository(User);
    try {
        const user = getUser(username);
        return (await user).id;
    } catch (err) {
        throw ApiError.notFound("User not found");
    }
}

const getUser = async (username: string) => {
    const userRepo = getRepository(User);
    try {
        const user = await userRepo.findOne({ where: { username } });
        return user;
    } catch (err) {
        throw ApiError.notFound("User not found");
    }
}

const getUserById = async (userId: number) => {
    const userRepo = getRepository(User);
    try {
        const user = await userRepo.findOne({ where: { id: userId } });
        return user;
    } catch (err) {
        throw ApiError.notFound("User not found");
    };
}

const getAllUsers = async () => {
    const userRepo = getRepository(User);
    try {
        const users = await userRepo.findAndCount();
        return users;
    } catch (err) {
        throw ApiError.notFound("No users found");
    }
}

const userService = {
    createUser,
    loginUser,
    getUserId,
    getAllUsers,
    getUser,
    getUserById
}

export default userService;

