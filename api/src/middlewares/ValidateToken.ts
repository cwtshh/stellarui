import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/constansts';


export const validate_token = (token: string): void => {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined');
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            throw new Error('Invalid token');
        }
        return decoded;
    });
}