import { Schema } from "mongoose";
import mongoose from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        chats: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Chat'
            }
        ]
    }
);

const User = mongoose.model('User', UserSchema);

export default User;