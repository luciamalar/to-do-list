import { NextFunction, Request, Response } from 'express'
import { body, check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'
import ApiError from "../error/apiError";

export const expressValidator = (req: Request, res: Response, next: NextFunction) => {
	const errors: Result<ValidationError> = validationResult(req)

	if (!errors.isEmpty()) {
		throw ApiError.badRequest(errors.array());
	}
	next();
}

export const registerValidator = [
	body('id').isEmpty(),
	body('username').notEmpty().isString().withMessage('username is not valid'),
	body('password').notEmpty().isLength({ min: 3 }).withMessage('password must have at least 3 characters')
]

export const loginValidator = [
	body('id').isEmpty(),
	body('username').isString().withMessage('username is not valid'),
	body('password').isLength({ min: 3 }).withMessage('password must have at least 3 characters'),
]

export const createListValidator = [
	body('id').isEmpty(),
	body('title').notEmpty().isString().withMessage('title is not valid'),
]

export const createItemValidator = [
	body('listId').notEmpty().isNumeric(),
	body('title').notEmpty().isString().withMessage('title is not valid'),
	body('description').notEmpty().isString().withMessage('description is not valid'),
	body('deadline').notEmpty().isDate().withMessage('deadline is not valid'),
	body('status').notEmpty().isString().withMessage('status is not valid'),
]

export const flagItemValidator = [
	check('id').notEmpty().isNumeric().withMessage('id is not valid'),
]

export const showListValidator = [
	check('id').notEmpty().withMessage('id is not valid'),
]

export const shareListValidator = [
	check('id').notEmpty().withMessage('id is not valid'),
	body('userId').notEmpty().withMessage('userId is not valid'),
]








