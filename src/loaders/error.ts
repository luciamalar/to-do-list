import express, { NextFunction, Request, Response } from "express";
import logging from "../utils/logging";
import ApiError from "../error/apiError";

const loadErrorHandler = async (app: express.Application) => {

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        logging.error("error", error.message, error);

        if (error instanceof ApiError) {
            res.status(error.code).json({
                error: error.message
            });
            return;
        }

        res.status(500).json({
            error: "Something went wrong"
        });
    });
    
}

export default loadErrorHandler;