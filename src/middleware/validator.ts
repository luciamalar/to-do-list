import { Request, Response } from 'express'
import { check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'
import ApiError from '../error/apiError';

export const registerValidator = async (req: Request, res: Response) => {

	const validations = getRegisterValidations;

	//await Promise.all(getRegisterValidations.map((validation) => validation.run(req)))

	check('id').isEmpty();
	// password must be at least 3 chars long
	check('username').isString().withMessage('username is not valid');
	check('password').isLength({ min: 3 }).withMessage('password must have at least 3 characters');
	(req: Request, res: Response) => {
		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw ApiError.badRequest(errors.array());
		}
	}
}

const getRegisterValidations = () => {
	return [
		check('id').isEmpty(),
		check('title').isString().withMessage('title is not valid'),
		check('description').isString().withMessage('descritpiton is not valid'),
		check('deadline').isDate().withMessage('date is not valid'),
		check('author').isString().withMessage('author is required'),
		check('status').isString().withMessage('status is required')
	]
}


export const listValidator = (): ValidationChain[] => [
	check('id').isEmpty(),
	check('title').isString().withMessage('title is not valid'),
	check('description').isString().withMessage('descritpiton is not valid'),
	check('deadline').isDate().withMessage('date is not valid'),
	check('author').isString().withMessage('author is required'),
	check('status').isString().withMessage('status is required')
]
