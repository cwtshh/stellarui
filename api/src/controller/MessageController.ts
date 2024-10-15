import { Request, Response } from "express";
import { AI_ENDPOINT } from "../utils/constansts";
import axios from "axios";

const endpoint = 'https://4d22-131-72-222-133.ngrok-free.app'

interface MessageBody {
    role: string,
    content: string,
}

interface RequestBody {
    model: string,
    messages:  MessageBody[],
    prompt: string,
    message: string,
    stream: boolean,
    
}


const send_message_to_ai = async(model: string, messages: MessageBody[], message: string) => {
    const requestbody: RequestBody = {
        model,
        messages,
        message,
        prompt: message,
        stream: false,
    }
    console.log(AI_ENDPOINT)
    try {
        const response = await axios.post(`${endpoint}/api/generate`, requestbody);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export {send_message_to_ai};