import { create } from "domain";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sent_by: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;