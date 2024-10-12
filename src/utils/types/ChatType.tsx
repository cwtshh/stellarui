export interface MessageType {
    _id: string;
    user_id: string,
    chat: string,
    content: string,
    sent_by: string,
    created_at: string,
}

export interface ChatType {
    _id: string;
    user: string;
    messages: MessageType[];
    created_at: string,
}