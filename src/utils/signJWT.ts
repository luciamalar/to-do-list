import jwt from 'jsonwebtoken';
import config from '../../config/config';
import logging from './logging';
import IUser from '../interfaces/user';
import ApiError from '../error/apiError';

const NAMESPACE = "Auth";

const signJWT = async (user: IUser): Promise<String> => {
    var timeSinchEpoch = new Date().getTime();
    var expirationTime = timeSinchEpoch + Number(config.server.token.expireTime) * 100000;
    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    logging.info(NAMESPACE, `Attempting to assign token for ${user.username}`);

    try {
        return jwt.sign(
            {
                username: user.username
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds
            })

    } catch (error) {
        throw ApiError.internalServerError(error.message);
    }
}

export default signJWT;