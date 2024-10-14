import { MessageType, UserType } from '../utils/@types/UserType';
import User from '../model/User';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Chat from '../model/Chat';
import { query } from 'express-validator';
import Message from '../model/Message';
import send_message_to_ai from './MessageController';

const SECRET = process.env.SECRET_KEY || 'secret';

if(!SECRET) {
    console.error('SECRET VARIABLE is not defined.');
    process.exit(1);
}

const register_user = async(req: Request, res: Response) => {
    const { name, email, password, role }: UserType = req.body;
    if(await User.findOne({ email })) {
        res.status(400).json({ errors: ['Usuario já existente.'] });
        return;
    }

    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(password, salt);

    const user = User.create({
        name,
        email,
        password: hashed_password,
        role
    });

    if(!user) {
        res.status(400).json({ errors: ['Erro ao criar usuário.'] });
        return;
    }

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
};

const login_user = async(req: Request, res: Response) => {
    const { email, password }: UserType = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        res.status(400).json({ errors: ['Usuário não encontrado.'] });
        return;
    }

    if(!await bcrypt.compare(password, user.password)) {
        res.status(400).json({ errors: ['Senha inválida.'] });
        return;
    }

    const token = await jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });

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
            role: user.role
        }
    })
};

const logout_user = async(req: Request, res: Response) => {
    res.clearCookie('token').json({ message: 'Usuário deslogado com sucesso.' });
};

const create_chat = async(req: Request, res: Response) => {
    const { user_id } = req.body;
    const user = await User.findById(user_id);
    if(!user) {
        res.status(400).json({ errors: ['Usuário não encontrado.'] });
        return;
    }
    const chat = await Chat.create({
        user: user_id
    });
    if(!chat) {
        res.status(400).json({ errors: ['Erro ao criar chat.'] });
        return;
    }
    res.status(201).json({ message: 'Chat criado com sucesso.', chat_id: chat._id });
};

const get_all_user_chats = async(req: Request, res: Response) => {
    const { id: user_id } = req.params;

    const chats = await Chat.find({ user: user_id }).populate('messages');
    
    // TODO POPULAR MENSAGENS
    if(!chats) {
        res.status(400).json({ errors: ['Usuario não possui chats.'] });
        return;
    }

    res.status(200).json(chats);
}

interface MessageBody {
    role: string,
    content: string,
}

const send_message = async(req: Request, res: Response) => {
    const { chat_id, user_id, message } = req.body;
    const chat = await Chat.findById(chat_id).populate({
        path: 'messages',
        model: 'Message'
    });
    if(!chat) {
        res.status(400).json({ errors: ['Chat não encontrado.'] });
        return;
    }
    const new_message = await Message.create({
        content: message,
        chat: chat_id,
        sent_by: 'user',
        user_id: user_id
    });
    if(!new_message) {
        res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
        return;
    }
    
    chat.messages.push(new_message._id);
    let chat_history: MessageBody[] = chat.messages.map((message: any) => {
        if (message.sent_by === 'user') {
            const message_conv: MessageBody = {
                role: 'user',
                content: message.content
            }
            return message_conv;
        }
        if(message.sent_by === 'assistant') {
            const message_conv: MessageBody = {
                role: 'assistant',
                content: message.content
            }
            return message_conv;
        }
        return undefined;
    }).filter((message): message is MessageBody => message !== undefined);

    // messages.forEach((message: any) => {
    //     if (message.sent_by === 'user') {
    //         const message_conv: MessageBody = {
    //             role: 'user',
    //             content: message.content
    //         }
    //         chat_history.push(message_conv);
    //     }
    //     if(message.sent_by === 'assistant') {
    //         const message_conv: MessageBody = {
    //             role: 'assistant',
    //             content: message.content
    //         }
    //         chat_history.push(message_conv);
    //     }
    // });
    const ai_message = await send_message_to_ai('gemma2', chat_history, message);
    if(!ai_message) {
        res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
        return;
    }
    const ai_response = await Message.create({
        content: ai_message,
        chat: chat_id,
        sent_by: 'assistant',
        user_id: user_id
    });
    if(!ai_response) {
        res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
        return;
    }
    chat.messages.push(ai_response._id);
    await chat.save();
    res.status(201).json({ message: 'Mensagem enviada com sucesso.' });
    return;
};

const get_chat = async(req: Request, res: Response) => {
    const { chat_id } = req.params;
    const chat = await Chat.findById(chat_id).populate('messages');
    if(!chat) {
        res.status(400).json({ errors: ['Chat não encontrado.'] });
        return;
    }
    res.status(200).json(chat);
};

const delete_chat = async(req: Request, res: Response) => {
    const { chat_id } = req.params;
    const chat = await Chat.findByIdAndDelete(chat_id);
    if(!chat) {
        res.status(400).json({ errors: ['Chat não encontrado.'] });
        return;
    }
    res.status(200).json({ message: 'Chat deletado com sucesso.' });
}


export { register_user, login_user, logout_user, create_chat, get_all_user_chats, send_message, get_chat, delete_chat };
