import { Request, Response } from 'express';
import User from '../model/User';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET_KEY || 'secret';

const auto_auth_solar = async(req: Request, res: Response) => {
    const { nome, email } = req.body;
    if(!nome || !email) {
        res.status(400).send({message: 'Nome e email não recebidos.'});
    }
    const user = await User.findOne({ email });
    if(user) {
        if(user.role !== 'solar') {
            res.status(401).json({message: 'Usuário não autorizado.'});
            return;
        }
        const token = await jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });
        console.log(token);
        res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // Expira em 1 dia
            sameSite: true
        }).json({
            message: 'Usuário logado com sucesso.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
        return;
    }
    const newUser = await User.create({
        name: nome,
        email: email,
        role: 'solar',
        password: 'user-solar-autoRegister',

    });
    if(!newUser) {
        res.status(500).json({message: 'Erro ao cadastrar usuário.'});
        return;
    }

    if(newUser.role !== 'solar') {
        res.status(401).json({message: 'Usuário não autorizado.'});
        return;
    }

    const token = await jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1d' });
    res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // Expira em 1 dia
        sameSite: true
    }).json({
        message: 'Usuário logado com sucesso.',
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        }
    })
}   



export {
    auto_auth_solar
}