import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const UserUpdateValidation = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Extracting id from URL parameters
    const { name, email, password, role } = req.body;

    // Check if the ID is provided
    if (!id) {
        res.status(400).json({ errors: ['ID não fornecido.'] });
        return;
    }

    // Check if at least one field is provided for update
    if (!name && !email && !password && !role) {
        res.status(400).json({ errors: ['Nenhum dado fornecido para atualização.'] });
        return;
    }

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ errors: ['ID inválido.'] });
        return;
    }
    
    next(); // Proceed to the next middleware or route handler
};

export default UserUpdateValidation;