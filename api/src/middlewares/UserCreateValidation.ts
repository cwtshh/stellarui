import { body } from 'express-validator';

const UserCreateValidations = () => {
    return [
        body('name')
            .isString()
            .withMessage('O nome é obrigatório!'),
        body('email')
            .isString()
            .withMessage('O e-mail é obrigatório!')
            .isEmail()
            .withMessage('O e-mail deve ser válido!'),
        body('password')
            .isString()
            .withMessage('A senha é obrigatória!')
            .isLength({ min: 6 })
            .withMessage('A senha deve ter no mínimo 6 caracteres!'),
        body('role')
            .isString()
            .withMessage('O papel é obrigatório!')
            .isIn(['admin', 'user'])
            .withMessage('O papel deve ser admin ou user!')
    ]
}

export default UserCreateValidations;