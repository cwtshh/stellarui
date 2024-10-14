import axios from "axios";
import { Request, Response } from "express";
import { AI_ENDPOINT } from "../utils/constansts";

const endpoint = 'https://25a5-2804-14c-65d6-419e-6b6a-4c29-76a3-1605.ngrok-free.app/'

interface MessageBody {
    role: string,
    content: string,
}

interface RequestBody {
    model: string,
    messages:  MessageBody[],
    message: string,
    stream: boolean,
    
}


const send_message_to_ai = async(model: string, messages: MessageBody[], message: string) => {
    const requestbody: RequestBody = {
        model,
        messages,
        message,
        stream: false,
    }
    console.log(AI_ENDPOINT)
    try {
        const response = await axios.post(`${endpoint}/api/chat`, requestbody);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default send_message_to_ai;