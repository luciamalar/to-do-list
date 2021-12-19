import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcryptjs from 'bcryptjs'
import signJWT from "../utils/signJWT";
import ApiError from "../error/apiError";

const NAMESPACE = "User";

///////////////////////////////////////////////////////////////////////////////////////
// Service to create new user
//////////////////////////////////////////////////////////////////////////////////////
const createUser = async (username: string, password: string) => {
    const userRepo = getRepository(User);

    // Check if user already exists
    const userExists = await getUser(username);

    if (userExists) {
        throw ApiError.badRequest("User already exists");
    } else {

        // Create new user with given username and hashed password
        let user = userRepo.create({ username, password });
        await userRepo.save(user).then((user1) => user = user1).catch((err) => {
            throw ApiError.internalServerError(err.message);
        });
        return user;
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// Service to login user
//////////////////////////////////////////////////////////////////////////////////////
const loginUser = async (username: string, password: string) => {
    const userRepo = getRepository(User);
    let user: User;
    let token;

    // Find user by given username
    await userRepo
        .findOne({ where: { username } })
        .then((user1) => {
            if (!user1) {
                throw ApiError.badRequest("User have to be registered to log in");
            } else {
                user = user1;
            }
        })
        .catch((err) => {
            throw err;
        });

    // Compare password from db with provided password
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

///////////////////////////////////////////////////////////////////////////////////////
// Service to get user id from username
//////////////////////////////////////////////////////////////////////////////////////
const getUserId = async (username: string) => {
    const userRepo = getRepository(User);
    try {
        const user = getUser(username);
        return (await user).id;
    } catch (err) {
        throw ApiError.notFound("User not found");
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// Service to get user by username
//////////////////////////////////////////////////////////////////////////////////////
const getUser = async (username: string) => {
    const userRepo = getRepository(User);
    try {
        const user = await userRepo.findOne({ where: { username } });
        return user;
    } catch (err) {
        throw ApiError.notFound("User not found");
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// Service to get user by id
//////////////////////////////////////////////////////////////////////////////////////
const getUserById = async (userId: number) => {
    const userRepo = getRepository(User);
    try {
        const user = await userRepo.findOne({ where: { id: userId } });
        return user;
    } catch (err) {
        throw ApiError.notFound("User not found");
    };
}

const userService = {
    createUser,
    loginUser,
    getUserId,
    getUser,
    getUserById
}

export default userService;

