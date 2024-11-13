import { Request, Response } from 'express';
import User from '../model/User';

const auto_auth_solar = async(req: Request, res: Response) => {
    const { nome, email } = req.body;

    if(!nome || !email) {
        res.status(400).send({message: 'Nome e email não recebidos.'});
    }

    const user = await User.findOne({ email });
    if(user) {
        res.send({ user: user });
        return;
    }

    const newUser = await User.create({
        name: nome,
        email: email,
        role: 'solar',
        password: 'user-solar-autoRegister',

    });

    if(!newUser) {
        res.status(500).send({message: 'Erro ao cadastrar usuário.'});
        return;
    }




    res.status(201).send({ user: newUser });

}   



export {
    auto_auth_solar
}