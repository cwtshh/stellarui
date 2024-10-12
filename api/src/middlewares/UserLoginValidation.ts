import { body } from 'express-validator';

const UserLoginValidations = () => {
    return [
        body('email')
            .isString().withMessage('Email inválido.'),
        body('password')
            .isString().withMessage('Senha inválida.')
    ]
}

export default UserLoginValidations;    