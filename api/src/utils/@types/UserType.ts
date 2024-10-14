export interface UserType {
    name: string,
    email: string,
    password: string,
    role: string
}

export interface MessageType {
    content: string,
    user_id: string,
    chat: string,
    sent_by: string,
    created_at: Date
}