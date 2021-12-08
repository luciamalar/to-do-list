import { Request, Response, NextFunction } from 'express';
import logging from '../utils/logging';
import jwt from 'jsonwebtoken'
import config from '../../config/config';
import ApiError from '../error/apiError';

const NAMESPACE = "Auth";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Validating token");

    //split "bearer token" by space and take the second part
    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    message: error.message,
                    error
                });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        throw ApiError.unauthorized("Invalid token");
    }
}

export default extractJWT;