import express from 'express';
import { create_chat, delete_chat, download_file, export_user_chats, get_all_user_chats, get_chat, login_user, logout_user, register_user, send_message, send_message_file, send_message_pdf, update_user, delete_all_user_chats, archive_chats, get_archived_chats } from '../controller/UserController';
import UserCreateValidations from '../middlewares/UserCreateValidation';
import UserUpdateValidation from '../middlewares/UserUpdateValidation';
import UserLoginValidations from '../middlewares/UserLoginValidation';
import HandleValidations from '../middlewares/HandleValidations';

const UserRouter = express.Router(); // Certifique-se de que é `express.Router()`

// Registro, Login, Logout
UserRouter.post('/create', UserCreateValidations(), HandleValidations, register_user);
UserRouter.post('/login', UserLoginValidations(), HandleValidations, login_user);
UserRouter.post('/logout', logout_user);
UserRouter.put('/update/:id', UserUpdateValidation, HandleValidations, update_user);

// Chat
UserRouter.post('/chat/create', create_chat);
UserRouter.get('/chat/all/:id', get_all_user_chats);
UserRouter.delete('/chat/delete/all/:id', delete_all_user_chats);
UserRouter.post('/chat/send', send_message);
UserRouter.get('/chat/:chat_id', get_chat);
UserRouter.delete('/chat/:chat_id', delete_chat);
UserRouter.post('/chat/sendfile', send_message_file);
UserRouter.post('/chat/send/pdf', send_message_pdf);
UserRouter.get('/chat/findfile/:file_name', download_file);
UserRouter.get('/chat/export/:user_id', export_user_chats);
UserRouter.post('/chat/archive/:user_id', archive_chats);
UserRouter.get('/chat/get/archived/:user_id', get_archived_chats);

export default UserRouter;
