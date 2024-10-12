import express from 'express';
import { create_chat, get_all_user_chats, get_chat, login_user, logout_user, register_user, send_message } from '../controller/UserController';
import UserCreateValidations from '../middlewares/UserCreateValidation';
import HandleValidations from '../middlewares/HandleValidations';
import UserLoginValidations from '../middlewares/UserLoginValidation';


const UserRouter = express();

// registro, login, logout
UserRouter.post('/create', UserCreateValidations(), HandleValidations, register_user);
UserRouter.post('/login', UserLoginValidations(), HandleValidations, login_user);
UserRouter.post('/logout', logout_user);


// chat
UserRouter.post('/chat/create', create_chat);
UserRouter.get('/chat/all/:id', get_all_user_chats);
UserRouter.post('/chat/send', send_message);
UserRouter.get('/chat/:chat_id', get_chat);

export default UserRouter;