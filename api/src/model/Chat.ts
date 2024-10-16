import mongoose from "mongoose";
import { Schema } from "mongoose";

const ChatSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    chat_sessionid: {
        type: String,
        default: ''
    }
});

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;