import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../../config/config";
import ApiError from "../error/apiError";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = <string>req.headers["auth"];
    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.server.token.secret);
        //req.locals.jwtPayload = jwtPayload;
        req.body = { ...req.body, username: jwtPayload.username };
        next();
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        throw ApiError.unauthorized(error.message);
    }
};