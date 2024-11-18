import { MessageType, UserType } from '../utils/@types/UserType';
import User from '../model/User';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import Chat from '../model/Chat';
import { query } from 'express-validator';
import Message from '../model/Message';
import { send_message_to_ai } from './MessageController';
import { FlowiseClient } from 'flowise-sdk';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import pdf from 'pdf-parse'

const SECRET = process.env.SECRET_KEY || 'secret';
const FLOWISE_URL_ = process.env.FLOWISE_URL;
const FLOWISE_CHATFLOWID_ = process.env.FLOWISE_CHATFLOWID;



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
            role: user.role,
        }
    })
};

const logout_user = async(req: Request, res: Response) => {
    res.clearCookie('token').json({ message: 'Usuário deslogado com sucesso.' });
};

const update_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params; 
        console.log(`Updating user with ID: ${id}`);
        const { name, email, password } = req.body; 
        const user = await User.findById(id); 
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (name) user.name = name;
        const updated_user = await user.save();
        res.status(200).json({
            message: 'Usuário atualizado com sucesso.',
            user: {
                _id: updated_user._id,
                name: updated_user.name,
                email: updated_user.email,
            },
        });
    } catch (error: unknown) {
        console.error(error);
        res.status(400).json({
            errors: ['Erro ao atualizar usuário.'],
            error: (error as Error).message || 'Erro desconhecido.',
        });
    }
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

const get_all_user_chats = async (req: Request, res: Response) => {
    const { id: user_id } = req.params;

    try {
        const chats = await Chat.find({ user: user_id, is_archived: false }).populate('messages');

        if (!chats) {
            res.status(400).json({ errors: ['Usuário não possui chats ativos.'] });
            return;
        }

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ errors: ['Erro ao buscar os chats do usuário.'] });
    }
};


interface MessageBody {
    role: string,
    content: string,
}

let url = "https://flowise.aidadpdf.cloud/api/v1/prediction/70873bc0-fd4d-4d77-9781-18178d0d38a6";


const send_message_pdf = async(req: Request, res: Response) => {
    const upload_directory = path.join(__dirname, '..', '..', 'uploads');
    if(!fs.existsSync(upload_directory)) {
        fs.mkdirSync(upload_directory);
    }

    let file_name: string;

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, upload_directory);
        },
        filename: function(req, file, cb) {
            file_name = `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`;
            cb(null, file_name);
        }
    })

    const upload = multer({ storage: storage }).single('file');
    upload(req, res, async(err) => {
        const { chat_id, user_id, message } = req.body;
        const file = req.file;
        const chat = await Chat.findOne({ _id: chat_id, is_archived: false });
        if(!chat) {
            res.status(400).json({ errors: ['Chat não encontrado ou está arquivado.'] });
            return;
        }
        if(!file) {
            res.status(400).json({ errors: ['Arquivo não encontrado.'] });
            return;
        }

        const local_file = await fs.readFileSync(path.join(upload_directory, file.filename));
        let data: any;
        try {
            data = await pdf(local_file);
            console.log(data.text);
        } catch (error) {
            console.error(error);
        }


        if(!local_file) {
            res.status(400).json({ errors: ['Erro ao ler arquivo.'] });
            return;
        }

        const client = new FlowiseClient({
            baseUrl: FLOWISE_URL_ || '',
        });

        if(chat.chat_sessionid === '') {
            const prediction = await client.createPrediction({
                chatflowId: FLOWISE_CHATFLOWID_ || '',
                question: `Este é o conteudo do arquivo: ${data?.text}, esta é a pergunta: ${message}`,
                history: [
                    {
                        role: 'userMessage',
                        content: `Este é o conteudo do arquivo: ${data?.text}`,
                        message: `Este é o conteudo do arquivo: ${data?.text}`,
                        type: 'userMessage'
                    }
                ],
                overrideConfig: {
                    history: [
                        {
                            role: 'userMessage',
                            content: `Este é o conteudo do arquivo: ${data?.text}`,
                            
                        }
                    ],
                }
            });

            if(!prediction) {
                res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
                return;
            }

            const file_originalname = file.filename;

            const new_message = await Message.create({
                content: message,
                chat: chat_id,
                sent_by: 'user',
                user_id: user_id,
                file_attachment: {
                    file_name: file_name,
                    file_path: path.join(upload_directory, file_name),
                    original_filename: file_originalname
                }
            });

            if(!new_message) {
                res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
                return;
            }

            const new_ai_message = await Message.create({
                content: prediction.text || 'Erro ao enviar arquivo.',
                chat: chat_id,
                sent_by: 'assistant',
                user_id: user_id,
            });

            if(!new_ai_message) {
                res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
                return;
            }

            chat.messages.push(new_message._id);
            chat.messages.push(new_ai_message._id);
            chat.chat_sessionid = prediction.sessionId;
            await chat.save();

            res.status(201).json({ message: 'Arquivo enviado com sucesso.', ai_message: prediction.text });
            return;
        }
        if(chat.chat_sessionid !== '') {
            const prediction = await client.createPrediction({
                chatflowId: FLOWISE_CHATFLOWID_ || '',
                question: `Este é o conteudo do arquivo: ${data?.text}, esta é a pergunta: ${message}`,
                chatId: chat.chat_sessionid,
                uploads: [
                    {
                        "type": "file",
                        "name": file.filename,
                        "data": `data:application/pdf;base64,${local_file.toString('base64')}`,
                        "mime": "application/pdf"
                    }
                ],
                history: [
                    {
                        role: 'userMessage',
                        content: `Este é o conteudo do arquivo: ${data?.text}`,
                        message: `Este é o conteudo do arquivo: ${data?.text}`,
                        type: 'userMessage'
                    }
                ],
                overrideConfig: {
                    sessionId: chat.chat_sessionid,
                    history: [
                        {
                            role: 'userMessage',
                            content: `Este é o conteudo do arquivo: ${data}`,
                            
                        }
                    ],
                }
            });

            if(!prediction) {
                res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
                return;
            }

            const file_originalname = file.filename;

            const new_message = await Message.create({
                content: message,
                chat: chat_id,
                sent_by: 'user',
                user_id: user_id,
                file_attachment: {
                    file_name: file_name,
                    file_path: path.join(upload_directory, file.filename),
                    original_filename: file_originalname
                }
            });

            if(!new_message) {
                res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
                return;
            }

            const new_ai_message = await Message.create({
                content: prediction.text || 'Erro ao enviar arquivo.',
                chat: chat_id,
                sent_by: 'assistant',
                user_id: user_id,
            });

            if(!new_ai_message) {
                res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
                return;
            }

            chat.messages.push(new_message._id);
            chat.messages.push(new_ai_message._id);
            await chat.save();

            res.status(201).json({ message: 'Arquivo enviado com sucesso.', ai_message: prediction.text });
            return;
        }
    });
}

const send_message_file = async(req: Request, res: Response) => {
    const file = req.file;

    const upload_directory = path.join(__dirname, '..', '..', 'uploads');
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

    const upload = multer({storage: storage}).single('file');
    upload(req, res, async(err) => {
        const { chat_id, user_id, message, sessionId } = req.body;
        const file = req.file;
        const chat = await Chat.findOne({ _id: chat_id, is_archived: false });
        if(!chat) {
            res.status(400).json({ errors: ['Chat não encontrado ou está arquivado.'] });
            return;
        }
        if (!file) {
            res.status(400).json({ errors: ['Arquivo não encontrado.'] });
            return;
        }

        const formData = new FormData();
        const fileBuffer = await fs.promises.readFile(path.join(upload_directory, file.filename));
        const blob = new Blob([fileBuffer]);
        formData.append('files', blob, file.filename);
        formData.append('returnSourceDocuments', 'true');
        formData.append('chatId', sessionId);


        try {
            const upsert_file: any = await axios.post(`https://flowise.aidadpdf.cloud/api/v1/vector/upsert/84820c3e-7fb4-472c-a803-10f14e81a97a`, formData);            

            const prediction = await axios.post(`https://flowise.aidadpdf.cloud/api/v1/prediction/84820c3e-7fb4-472c-a803-10f14e81a97a`, {
                question: message,
                chatId: sessionId,
                uploads: [
                    {
                        "type": "file",
                        "name": file.filename,
                        "data": `data:application/pdf;base64,${fileBuffer.toString('base64')}`,
                        "mime": "application/pdf"
                    }
                ]
            });

            res.status(201).json({ message: 'Arquivo enviado com sucesso.', ai_message: (prediction.data as { text: string }).text });
            return;
        } catch (error) {
            console.error(error);
            res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
            return;
        }


        // const formData = new FormData();
        // const blob = new Blob([local_file], { type: 'application/octet-stream' });
        // formData.append('files', blob, req.file.filename);
        // formData.append('question', 'O QUE TEM NESTE ARQUIVO?');

        // try {

        //     const upsert_file = await axios.post(`${FLOWISE_URL_}/api/v1/vector/upsert/9ae4a666-0135-41bd-bf8a-eecb1e61cfcd`, formData);
        //     console.log(upsert_file);

        //     if(!upsert_file) {
        //         res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
        //         return;
        //     }

        //     const response: any = await axios.post(`${FLOWISE_URL_}/api/v1/prediction/9ae4a666-0135-41bd-bf8a-eecb1e61cfcd`, {
        //         question: message,
        //         uploads: [
        //             {
        //                 "type": "file",
        //                 "name": req.file.filename,
        //                 "data": `data:application/pdf;base64,${local_file.toString('base64')}`,
        //                 "mime": "application/pdf"
        //             }
        //         ]
        //     })
        //     console.log(response);
        //     res.status(201).json({ message: 'Arquivo enviado com sucesso.', ai_message: response.data.text });
        //     return;
        // } catch (error) {
        //     console.error(error);
        //     res.status(400).json({ errors: ['Erro ao enviar arquivo.'] });
        //     return;
        // }
    })
};

const send_message = async(req: Request, res: Response) => {
    const { message, chat_id, user_id } = req.body;
 
    const chat = await Chat.findOne({ _id: chat_id, is_archived: false }).populate({
        path: 'messages',
        model: 'Message'
    });
    if(!chat) {
        res.status(400).json({ errors: ['Chat não encontrado ou está arquivado.'] });
        return;
    }
    
    const client = new FlowiseClient({
        baseUrl: FLOWISE_URL_ || '',
        // apiKey: '4QyRe4cw5wKaxvIgNS6aWYQzoQeWv4j9OsYu4iGiwbY',
    });

    try {
        if(chat.chat_sessionid === '') {
            const prediction = await client.createPrediction({
                chatflowId: FLOWISE_CHATFLOWID_ || '',
                question: message,
            });
            chat.chat_sessionid = prediction.sessionId;
            await chat.save();

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
        if(chat.chat_sessionid !== '') {
            const prediction = await client.createPrediction({
                chatflowId: "70873bc0-fd4d-4d77-9781-18178d0d38a6",
                question: message,
                overrideConfig: {
                    sessionId: chat.chat_sessionid
                }
            });

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

const get_chat = async (req: Request, res: Response) => {
    const { chat_id } = req.params;

    try {
        const chat = await Chat.findOne({ _id: chat_id, is_archived: false }).populate('messages');

        if (!chat) {
            res.status(400).json({ errors: ['Chat não encontrado ou está arquivado.'] });
            return;
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ errors: ['Erro ao buscar o chat.'] });
    }
};

const delete_chat = async (req: Request, res: Response) => {
    const { chat_id } = req.params;

    const chat = await Chat.findOneAndDelete({ _id: chat_id });

    if (!chat) {
        res.status(400).json({ errors: ['Chat não encontrado.'] });
        return;
    }

    if (chat.is_archived) {
        res.status(200).json({ message: 'Chat arquivado deletado com sucesso.' });
        return;
    }

    res.status(200).json({ message: 'Chat deletado com sucesso.' });
};


const delete_all_user_chats: RequestHandler = async (req, res) => {
    const { id: user_id } = req.params;

    try {
        const result = await Chat.deleteMany({ user: user_id, is_archived: false });
        if (result.deletedCount === 0) {
            res.status(400).json({ errors: ['Usuário não possui chats ativos para deletar.'] });
        } else {
            res.status(200).json({ message: 'Todos os chats ativos foram deletados com sucesso.' });
        }
    } catch (error) {
        res.status(500).json({ errors: ['Erro ao deletar os chats.'] });
    }
};

const download_file = (req: Request, res: Response) => {
    const { file_name } = req.params;
    const file_path = path.join(__dirname, '..', '..', 'uploads', file_name);
    if(!fs.existsSync(file_path)) {
        res.status(400).json({ errors: ['Arquivo não encontrado.'] });
        return;
    }
    res.download(file_path);
};

const export_user_chats = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    if (!user_id) {
        res.status(400).json({ errors: ['ID de usuário não fornecido.'] });
        return;
    }

    const user = await User.findById(user_id);
    if (!user) {
        res.status(400).json({ errors: ['Usuário não encontrado.'] });
        return;
    }

    const chats = await Chat.find({ user: user_id, is_archived: false }).populate('messages');
    if (!chats || chats.length === 0) {
        res.status(400).json({ errors: ['Usuário não possui chats ativos.'] });
        return;
    }

    res.status(200).json({
        message: ['Chats exportados com sucesso.'],
        chats,
        user: {
            name: user.name
        }
    });
};

const archive_chats = async (req: Request, res: Response): Promise<void> => {
    const { chats_ids } = req.body;
    const { user_id } = req.params;

    try {
        if (!chats_ids || chats_ids.length === 0) {
            res.status(400).json({ errors: ['Nenhum ID de chat fornecido.'] });
            return;
        }

        if (!user_id || !Array.isArray(chats_ids)) {
            res.status(400).json({ errors: ['ID de usuário ou lista de chats inválidos.'] });
            return;
        }

        const result = await Chat.updateMany(
            { _id: { $in: chats_ids }, user: user_id, is_archived: false },
            { $set: { is_archived: true } }
        );


        if (result.modifiedCount === 0) {
            res.status(400).json({ errors: ['Nenhum chat foi arquivado. Verifique se os chats já estão arquivados ou os IDs são inválidos.'] });
            return;
        }

        res.status(200).json({ message: 'Chats arquivados com sucesso.' });
        return;
    } catch (error) {
        console.error('Erro no backend:', error);
        res.status(500).json({ errors: ['Erro ao arquivar os chats.'] });
        return;
    }
};

const get_archived_chats = async (req: Request, res: Response): Promise<void> => {
    const { id: user_id } = req.params;

    try {
      const chats = await Chat.find({ user: user_id, is_archived: true }).populate('messages');
  
      if (!chats || chats.length === 0) {
        res.status(400).json({ errors: ['Usuário não possui chats arquivados.'] });
        return;
      }
  
      res.status(200).json(chats);
    } catch (error) {
      console.error("Erro ao buscar chats arquivados: ", error);
      res.status(500).json({ errors: ['Erro ao buscar os chats do usuário.'] });
    }
};

const unarchive_chats = async (req: Request, res: Response): Promise<void> => {
    const { chat_id, user_id } = req.body; 

    try {
        const chat = await Chat.findById(chat_id);
        if (!chat) {
            res.status(404).json({ errors: ['Chat não encontrado.'] });
            return 
        }

        if (chat.user.toString() !== user_id) {
            res.status(403).json({ errors: ['Chat não pertence a este usuário.'] });
            return 
        }

        chat.is_archived = false;
        await chat.save();

        res.status(200).json({ message: 'Chat retirado do arquivado.' });
    } catch (error) {
        console.error('Erro ao retirar chat do arquivado:', error);
        res.status(500).json({ errors: ['Erro ao retirar chat do arquivado.'] });
    }
};

const get_all_users = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .populate({
                path: 'chats', 
                populate: { path: 'messages' }
            });

        if (!users || users.length === 0) {
            res.status(400).json({ errors: ['Nenhum usuário encontrado.'] });
            return;
        }

        const filter_users = users.map(user => ({
            _id: user._id,
            name: user.name,
            role: user.role
        }));

        res.status(200).json(filter_users);
    } catch (error) {
        console.error("Erro ao buscar usuários: ", error);
        res.status(500).json({ errors: ['Erro ao buscar os usuários.'] });
    }
};



  
export { 
    register_user, 
    login_user, 
    logout_user, 
    update_user,
    create_chat, 
    get_chat, 
    get_all_user_chats, 
    send_message, 
    send_message_file, 
    send_message_pdf,
    download_file,
    export_user_chats,
    delete_chat, 
    delete_all_user_chats,
    archive_chats,
    get_archived_chats,
    unarchive_chats,
    get_all_users,
};