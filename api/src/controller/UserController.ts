import { MessageType, UserType } from '../utils/@types/UserType';
import User from '../model/User';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Chat from '../model/Chat';
import { query } from 'express-validator';
import Message from '../model/Message';
import { send_message_to_ai } from './MessageController';
import { FlowiseClient } from 'flowise-sdk';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

let url = "https://flowise.aidadpdf.cloud/api/v1/prediction/70873bc0-fd4d-4d77-9781-18178d0d38a6";



const send_message_file = async(req: Request, res: Response) => {
    const { chat_id, user_id } = req.body;
    const file = req.file;

    const upload_directory = path.join(__dirname, '..', '..', 'uploads');
    console.log(upload_directory);
    if(!fs.existsSync(upload_directory)) {
        fs.mkdirSync(upload_directory);
    }

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, upload_directory);
        },
        filename: function(req, file, cb) {
            cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
        }
    });

    const client = new FlowiseClient({
        baseUrl: 'https://flowise.aidadpdf.cloud',
    })

    const upload = multer({storage: storage}).single('file');
    upload(req, res, async(err) => {
        const { message } = req.body;
        if(err) {
            res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
            return;
        }
        const file_ = req.file;

        if (!file_) {
            res.status(400).json({ errors: ['Arquivo não encontrado.'] });
            return;
        }

        const fileData = fs.readFileSync(path.join(upload_directory, file_.filename)).toString('base64');
        const file_object = {
            type: 'file',
                    name: file_.originalname,
                    data: `data:${file_.mimetype};base64,${fileData}`,
                    mime: file_.mimetype
        }
        console.log(message);
        try {
            const prediction = await client.createPrediction({
                chatflowId: "6ac71f88-8509-4230-89f9-111e84669633",
                question: message,
                uploads: [{
                    type: 'file',
                    name: file_.originalname,
                    data: `data:${file_.mimetype};base64,${fileData}`,
                    mime: file_.mimetype,
                    
                }],
            })
            
            

            console.log(prediction);
            res.status(201).json({ message: 'Arquivo enviado com sucesso.', ai_message: prediction.text });
            return;
        } catch (error) {
            console.error(error);
            res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
            return;
        }


        // res.status(201).json({ message: 'Arquivo enviado com sucesso.', });
    })
};

const send_message = async(req: Request, res: Response) => {

    const { message, chat_id, user_id } = req.body;

    const chat = await Chat.findById(chat_id).populate({
        path: 'messages',
        model: 'Message'
    });
    if(!chat) {
        res.status(400).json({ errors: ['Chat não encontrado.'] });
        return;
    }
    
    const client = new FlowiseClient({
        baseUrl: 'https://flowise.aidadpdf.cloud',
        apiKey: '4QyRe4cw5wKaxvIgNS6aWYQzoQeWv4j9OsYu4iGiwbY',
    });

    try {
        if(chat.chat_sessionid === '') {
            console.log('sem chat session id');
            const prediction = await client.createPrediction({
                chatflowId: "70873bc0-fd4d-4d77-9781-18178d0d38a6",
                question: message,
            });
            chat.chat_sessionid = prediction.sessionId;
            await chat.save();

            if(!prediction) {
                res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
                return;
            }

            console.log(prediction);

            const new_message = await Message.create({
                content: message,
                chat: chat_id,
                sent_by: 'user',
                user_id: user_id,
            });

            if(!new_message) {
                res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
                return;
            }

            const new_ai_message = await Message.create({
                content: prediction.text || 'Erro ao enviar mensagem.',
                chat: chat_id,
                sent_by: 'assistant',
                user_id: user_id,
            });

            if(!new_ai_message) {
                res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
                return;
            }
            chat.messages.push(new_message._id);
            chat.messages.push(new_ai_message._id);
            await chat.save();
            res.status(201).json({ message: 'Mensagem enviada com sucesso.', ai_message: prediction.text || 'Erro ao enviar mensagem.' });
            return;
        }
        if(chat.chat_sessionid !== '') {
            console.log('tem session id');
            const prediction = await client.createPrediction({
                chatflowId: "70873bc0-fd4d-4d77-9781-18178d0d38a6",
                question: message,
                sessionId: chat.chat_sessionid
            });

            console.log(prediction);

            if(!prediction) {
                res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
                return;
            }

            const new_message = await Message.create({
                content: message,
                chat: chat_id,
                sent_by: 'user',
                user_id: user_id,
            });

            if(!new_message) {
                res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
                return;
            }

            const new_ai_message = await Message.create({
                content: prediction.text || 'Erro ao enviar mensagem.',
                chat: chat_id,
                sent_by: 'assistant',
                user_id: user_id,
            });

            if(!new_ai_message) {
                res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
                return;
            }
            chat.messages.push(new_message._id);
            chat.messages.push(new_ai_message._id);
            await chat.save();
            res.status(201).json({ message: 'Mensagem enviada com sucesso.', ai_message: prediction.text || 'Erro ao enviar mensagem.' });
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
        return;
    }

    // const prediction = await client.createPrediction({
    //     chatflowId: "70873bc0-fd4d-4d77-9781-18178d0d38a6",
    //     question: message,
    // });

    // if(chat.chat_sessionid === '') {
    //     chat.chat_sessionid = prediction.sessionId;
    //     await chat.save();
    // }

    // if(!prediction) {
    //     res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
    //     return;
    // }

    // const new_message = await Message.create({
    //     content: message,
    //     chat: chat_id,
    //     sent_by: 'user',
    //     user_id: user_id,
    // });
    // if(!new_message) {
    //     res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
    //     return;
    // }
    // const new_ai_message = await Message.create({
    //     content: prediction.text || 'Erro ao enviar mensagem.',
    //     chat: chat_id,
    //     sent_by: 'assistant',
    //     user_id: user_id,
    // });
    // if(!new_ai_message) {
    //     res.status(400).json({ errors: ['Erro ao enviar mensagem.'] });
    //     return;
    // }

    // chat.messages.push(new_message._id);
    // chat.messages.push(new_ai_message._id);

    // await chat.save();

    // console.log(prediction);

    // res.status(201).json({ message: 'Mensagem enviada com sucesso.', ai_message: prediction.text });
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


export { register_user, login_user, logout_user, create_chat, get_all_user_chats, send_message, get_chat, delete_chat, send_message_file };
