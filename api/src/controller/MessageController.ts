import { Request, Response } from "express";
import { AI_ENDPOINT } from "../utils/constansts";
import axios from "axios";

const endpoint = 'https://9d88-131-72-222-133.ngrok-free.app'

interface MessageBody {
    role: string,
    content: string,
}

interface RequestBody {
    model: string,
    messages:  MessageBody[],
    stream: boolean,   
}

export interface ResponseType {
    model: string,
    message: MessageBody,
}


const send_message_to_ai = async(model: string, messages: MessageBody[], message: string) => {
    const requestbody: RequestBody = {
        model: model,
        messages: messages,
        stream: false,
    }
    // console.log(AI_ENDPOINT)
    try {
        const response = await axios.post<ResponseType>(`${endpoint}/api/chat`, requestbody);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export {send_message_to_ai};