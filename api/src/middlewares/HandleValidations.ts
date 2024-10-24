import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const HandleValidations = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const extractedErrors: any = [];
    errors.array().map(err => extractedErrors.push(err.msg));
    res.status(400).json({ errors: extractedErrors });
};

export default HandleValidations;